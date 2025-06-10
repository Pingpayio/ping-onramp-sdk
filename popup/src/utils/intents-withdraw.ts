import type {
  AggregatedQuote,
  AggregatedQuoteParams,
  QuoteResult,
} from "@defuse-protocol/defuse-sdk/dist/services/quoteService";
import {
  queryQuote,
  queryQuoteExactOut,
} from "@defuse-protocol/defuse-sdk/dist/services/quoteService";

import type { IntentsUserId } from "@defuse-protocol/defuse-sdk/dist/core/formatters";

import type { Output as Nep141StorageOutput } from "@defuse-protocol/defuse-sdk/dist/services/nep141StorageService";
import { getNEP141StorageRequired } from "@defuse-protocol/defuse-sdk/dist/services/nep141StorageService";

import { getTokenAccountIds } from "@defuse-protocol/defuse-sdk/dist/utils/tokenUtils";

import { createWithdrawIntentMessage } from "@defuse-protocol/defuse-sdk/dist/core/messages";

import type { PublishIntentResult } from "@defuse-protocol/defuse-sdk/dist/sdk/solverRelay/publishIntent";
import { publishIntent } from "@defuse-protocol/defuse-sdk/dist/sdk/solverRelay/publishIntent";

import { waitForIntentSettlement } from "@defuse-protocol/defuse-sdk/dist/sdk/solverRelay/waitForIntentSettlement";

import { AuthMethod } from "@defuse-protocol/defuse-sdk/dist/types/authHandle";
import type { ERC191SignatureData } from "@defuse-protocol/defuse-sdk/dist/types/walletMessage";
import { parseErc6492Signature } from "viem";
import {
  getCurrentTokenBalance,
  pollForDepositConfirmation,
} from "../lib/intents-patch";
import type {
  CallbackParams,
  IntentProgress,
  NearIntentsDisplayInfo,
} from "../types/onramp";
import { getOnrampTokens, LIST_TOKENS } from "./tokens";

// Helper function to extract a reason string from an error object
const getErrorReasonString = (
  errorValue: unknown,
  defaultMessage: string = "Unknown error",
): string => {
  if (
    errorValue &&
    typeof errorValue === "object" &&
    errorValue !== null &&
    "reason" in errorValue &&
    typeof (errorValue as { reason: unknown }).reason === "string"
  ) {
    return (errorValue as { reason: string }).reason;
  }
  // Check for nested error structures sometimes returned by SDKs
  if (errorValue && typeof errorValue === "object" && "data" in errorValue) {
    const data = errorValue as { data: unknown };
    if (
      data.data &&
      typeof data.data === "object" &&
      "reason" in data.data &&
      typeof (data.data as { reason: unknown }).reason === "string"
    ) {
      return (data.data as { reason: string }).reason;
    }
  }
  if (errorValue instanceof Error) {
    return errorValue.message;
  }
  return defaultMessage;
};

interface ProcessNearIntentParams {
  callbackParams: Required<CallbackParams>;
  userEvmAddress: string;
  signMessageAsync: (args: { message: string }) => Promise<`0x${string}`>;
  updateProgress: (progress: IntentProgress) => void;
  updateErrorMessage: (message: string | null) => void;
  updateDisplayInfo: (
    info:
      | NearIntentsDisplayInfo
      | ((prev: NearIntentsDisplayInfo) => NearIntentsDisplayInfo),
  ) => void;

  depositChainName?: string; // e.g. "base", TODO: configurable
  targetChainName?: string; // e.g. "near", TODO: configurable
  storageTokenSymbol?: string; // e.g. "NEAR"
  storageTokenChainName?: string; // e.g. "near"
}

export const processNearIntentWithdrawal = async ({
  callbackParams,
  userEvmAddress,
  signMessageAsync,
  updateProgress,
  updateErrorMessage,
  updateDisplayInfo,

  depositChainName = "base",
  targetChainName = "near",
  storageTokenSymbol = "NEAR",
  storageTokenChainName = "near",
}: ProcessNearIntentParams): Promise<void> => {
  const {
    amount: fiatAmountStr,
    asset: assetSymbol,
    recipient: nearRecipient,
  } = callbackParams;

  if (!assetSymbol || !fiatAmountStr || !nearRecipient) {
    updateErrorMessage("Missing critical information from onramp callback.");
    updateProgress("error");
    return;
  }

  try {
    const onrampTokens = getOnrampTokens(
      assetSymbol,
      depositChainName,
      targetChainName,
      storageTokenSymbol,
      storageTokenChainName,
      LIST_TOKENS,
    );

    if (!onrampTokens) {
      updateErrorMessage(
        `Token configuration error. Required tokens (e.g., ${assetSymbol}.${depositChainName}, ${assetSymbol}.${targetChainName}, ${storageTokenSymbol}.${storageTokenChainName}) not found.`,
      );
      updateProgress("error");
      return;
    }
    const { tokenIn, tokenOut, nearStorageTokenDef } = onrampTokens;

    const NEP141_STORAGE_TOKEN_ID = nearStorageTokenDef.defuseAssetId;
    const userEvmAddressLower = userEvmAddress.toLowerCase(); // Use a consistent variable

    // ===== START: waitForDepositsCompletion REPLACEMENT =====
    updateDisplayInfo({
      message: `Checking your current ${assetSymbol} balance on ${depositChainName}...`,
    });
    let initialTokenInBalance: bigint;
    try {
      // Ensure tokenIn.address is the correct ERC20 contract address for the deposit token
      if (
        !tokenIn.defuseAssetId ||
        tokenIn.defuseAssetId.toLowerCase() ===
          "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
      ) {
        // This check is for native currency, which this ERC20 polling won't handle.
        // If you need to support native currency deposits, the logic here needs to change
        // to use viem's getBalance instead of readContract for balanceOf.
        updateErrorMessage(
          `Native currency deposit monitoring is not yet supported by this flow. Please use an ERC20 token.`,
        );
        updateProgress("error");
        return;
      }
      initialTokenInBalance = await getCurrentTokenBalance(
        userEvmAddressLower,
        tokenIn.defuseAssetId,
        depositChainName, // This is the chain where the user deposits
      );
      console.log(
        `Initial ${assetSymbol} balance on ${depositChainName} for ${userEvmAddressLower}: ${initialTokenInBalance}`,
      );
    } catch (balanceError) {
      updateErrorMessage(
        `Could not check your initial token balance: ${(balanceError as Error).message}`,
      );
      updateProgress("error");
      return;
    }

    const fiatAmountNum = parseFloat(fiatAmountStr);
    if (isNaN(fiatAmountNum) || fiatAmountNum <= 0) {
      updateErrorMessage("Invalid amount received from onramp callback.");
      updateProgress("error");
      return;
    }
    // This is the amount in the token's smallest unit (e.g., wei for ETH-like tokens)
    const amountInBigInt = BigInt(
      Math.floor(fiatAmountNum * 10 ** tokenIn.decimals),
    );

    updateDisplayInfo({
      message: `Please deposit ${fiatAmountNum.toFixed(tokenIn.decimals > 6 ? 6 : tokenIn.decimals)} ${assetSymbol} to your address ${userEvmAddress} on the ${depositChainName} network. Waiting for confirmation... (this may take several minutes)`,
    });
    updateProgress("depositing");

    try {
      await pollForDepositConfirmation(
        userEvmAddressLower,
        tokenIn.defuseAssetId,
        depositChainName,
        initialTokenInBalance,
        amountInBigInt, // This is the minimum expected increase
        {
          onPoll: (currentBalance, attempts) => {
            console.log(
              `Poll attempt ${attempts}: Current ${assetSymbol} balance on ${depositChainName}: ${currentBalance}`,
            );
            // You could update a more granular progress message here if desired
            updateDisplayInfo((prev) => ({
              ...prev,
              message: `Waiting for deposit... (Attempt ${attempts}, Current Balance: ${Number(currentBalance) / 10 ** tokenIn.decimals} ${assetSymbol})`,
            }));
          },
        },
      );
    } catch (depositError) {
      updateErrorMessage(
        `Deposit not detected: ${(depositError as Error).message}`,
      );
      updateProgress("error");
      return;
    }
    // ===== END: waitForDepositsCompletion REPLACEMENT =====

    updateDisplayInfo((prev) => ({
      ...prev,
      message: `Quoting bridge for ${fiatAmountNum.toFixed(2)} ${assetSymbol}...`,
      amountIn: fiatAmountNum,
    }));
    updateProgress("querying");

    const quoteInput: AggregatedQuoteParams = {
      tokensIn: [tokenIn],
      tokenOut: tokenOut,
      amountIn: { amount: amountInBigInt, decimals: tokenIn.decimals },
      balances: { [tokenIn.defuseAssetId]: amountInBigInt },
      waitMs: 3000,
    };

    const quoteResult: QuoteResult = await queryQuote(quoteInput);

    if (quoteResult.tag === "err") {
      console.error("SDK: Failed to get quote:", quoteResult.value);
      const reason = getErrorReasonString(quoteResult.value);
      updateErrorMessage(`Could not find a bridge route: ${reason}`);
      updateProgress("error");
      return;
    }

    const swapQuote = quoteResult.value as AggregatedQuote;
    // Assuming tokenDeltas structure: [[tokenInId, deltaIn], [tokenOutId, deltaOut]]
    // And deltaOut is positive for amount received
    const usdcNearAmountOutGross =
      swapQuote.tokenDeltas.find((d) => d[0] === tokenOut.defuseAssetId)?.[1] ??
      BigInt(0);

    if (usdcNearAmountOutGross <= BigInt(0)) {
      console.error(
        "SDK: Quote returned zero or negative output amount for tokenOut.",
        swapQuote.tokenDeltas,
      );
      updateErrorMessage(`Could not find a valid bridge route (zero output).`);
      updateProgress("error");
      return;
    }

    const grossAmountOutDisplay =
      Number(usdcNearAmountOutGross) / 10 ** tokenOut.decimals;
    updateDisplayInfo((prev) => ({
      ...prev,
      message: `Preparing to bridge ${grossAmountOutDisplay.toFixed(tokenOut.decimals)} ${tokenOut.symbol}...`,
      amountOut: grossAmountOutDisplay,
    }));

    const storageRequiredResult: Nep141StorageOutput =
      await getNEP141StorageRequired({
        token: tokenOut,
        userAccountId: nearRecipient,
      });
    if (storageRequiredResult.tag === "err") {
      const reason = getErrorReasonString(storageRequiredResult.value);
      updateErrorMessage(`Error checking storage requirements: ${reason}`);
      updateProgress("error");
      return;
    }
    const storageDepositNearAmount = storageRequiredResult.value;
    const needsStorageDeposit = storageDepositNearAmount > BigInt(0);

    let storageSwapQuote: AggregatedQuote | null = null;
    let storageCostInAsset = BigInt(0);

    if (needsStorageDeposit) {
      const storageQuoteResult = await queryQuoteExactOut(
        {
          tokenIn: tokenOut.defuseAssetId,
          tokenOut: NEP141_STORAGE_TOKEN_ID,
          exactAmountOut: storageDepositNearAmount,
          minDeadlineMs: 10 * 60 * 1000,
        },
        { logBalanceSufficient: true },
      );
      if (storageQuoteResult.tag === "err") {
        const reason = getErrorReasonString(storageQuoteResult.value);
        updateErrorMessage(
          `Could not find a quote for storage deposit: ${reason}`,
        );
        updateProgress("error");
        return;
      }
      storageSwapQuote = storageQuoteResult.value as AggregatedQuote;
      // Assuming tokenDeltas structure: [[tokenInId, deltaIn], [tokenOutId, deltaOut]]
      // deltaIn for tokenOut.defuseAssetId (which is tokenIn for this quote) will be negative
      storageCostInAsset = -(
        storageSwapQuote.tokenDeltas.find(
          (d) => d[0] === tokenOut.defuseAssetId,
        )?.[1] ?? BigInt(0)
      );
      if (storageCostInAsset <= BigInt(0)) {
        console.error(
          "SDK: Storage quote returned zero or negative input cost.",
          storageSwapQuote.tokenDeltas,
        );
        updateErrorMessage(
          `Could not find a valid storage deposit quote (zero cost).`,
        );
        updateProgress("error");
        return;
      }
    }

    const finalAmountToReceive = usdcNearAmountOutGross - storageCostInAsset;
    if (finalAmountToReceive <= BigInt(0)) {
      updateErrorMessage(
        `Calculated final amount is too low after storage costs.`,
      );
      updateProgress("error");
      return;
    }
    const finalAmountDisplay =
      Number(finalAmountToReceive) / 10 ** tokenOut.decimals;
    updateDisplayInfo((prev) => ({ ...prev, amountOut: finalAmountDisplay }));

    const intentMessagePayload = createWithdrawIntentMessage(
      {
        type: "to_near",
        amount: finalAmountToReceive,
        tokenAccountId: getTokenAccountIds([tokenOut])[0],
        receiverId: nearRecipient,
        storageDeposit: storageDepositNearAmount,
      },
      { signerId: userEvmAddressLower as IntentsUserId }, // Use the lowercased version
    );

    const intentObject = JSON.parse(intentMessagePayload.ERC191.message);
    const referral = "pingpay.near";

    // Ensure intents array exists
    if (!intentObject.intents) intentObject.intents = [];

    if (needsStorageDeposit && storageSwapQuote) {
      intentObject.intents.unshift({
        intent: "token_diff",
        diff: {
          [tokenOut.defuseAssetId]: "-" + storageCostInAsset.toString(),
          [NEP141_STORAGE_TOKEN_ID]: storageDepositNearAmount.toString(),
        },
        referral,
      });
    }
    intentObject.intents.unshift({
      intent: "token_diff",
      diff: {
        [tokenIn.defuseAssetId]: "-" + amountInBigInt.toString(),
        [tokenOut.defuseAssetId]: usdcNearAmountOutGross.toString(),
      },
      referral,
    });

    updateDisplayInfo((prev) => ({
      ...prev,
      message: `Please sign the transaction in your wallet to bridge ${finalAmountDisplay.toFixed(Math.min(tokenOut.decimals, 6))} ${tokenOut.symbol} to ${nearRecipient}.`,
    }));
    updateProgress("signing");

    const messageToSign = JSON.stringify(intentObject);
    const signature = await signMessageAsync({ message: messageToSign });
    const parsedSignature = parseErc6492Signature(signature);
    const signatureData = parsedSignature.signature;

    updateDisplayInfo((prev) => ({
      ...prev,
      message: `Publishing your bridge transaction...`,
    }));
    updateProgress("withdrawing");

    const quoteHashes = [swapQuote.quoteHashes[0]];
    if (storageSwapQuote && storageSwapQuote.quoteHashes[0]) {
      quoteHashes.push(storageSwapQuote.quoteHashes[0]);
    }
    const sdkSignatureData: ERC191SignatureData = {
      type: "ERC191",
      signatureData: signatureData as `0x${string}`,
      signedData: { message: messageToSign },
    };
    const sdkUserInfo = {
      userAddress: userEvmAddressLower, // Use the lowercased version
      userChainType: AuthMethod.EVM,
    };

    const publishResult: PublishIntentResult = await publishIntent(
      sdkSignatureData,
      sdkUserInfo,
      quoteHashes,
    );

    if (publishResult.tag === "err") {
      console.error("SDK: Failed to publish intent:", publishResult.value);
      const reason = getErrorReasonString(publishResult.value);
      updateErrorMessage(`Failed to publish transaction: ${reason}`);
      updateProgress("error");
      return;
    }
    const intentHash = publishResult.value;

    updateDisplayInfo((prev) => ({
      ...prev,
      message: `Waiting for bridge transaction to complete...`,
    }));
    await waitForIntentSettlement(new AbortController().signal, intentHash);

    const explorerUrl = `https://nearblocks.io/txns/${intentHash}`;
    updateDisplayInfo({
      message: `Successfully bridged ${finalAmountDisplay.toFixed(Math.min(tokenOut.decimals, 6))} ${tokenOut.symbol} to ${nearRecipient}!`,
      explorerUrl,
      amountOut: finalAmountDisplay,
      amountIn: fiatAmountNum,
    });
    updateProgress("done");
  } catch (err: unknown) {
    console.error("SDK: NEAR Intent processing failed:", err);
    let errorMessage = "An unknown error occurred during the NEAR transaction.";
    if (typeof err === "string") {
      errorMessage = err;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    updateErrorMessage(errorMessage);
    updateProgress("error");
    updateDisplayInfo((prev) => ({
      amountIn: prev?.amountIn, // Ensure prev.amountIn is preserved if it exists
      message: `Error: ${errorMessage}`,
      explorerUrl: undefined,
      amountOut: undefined,
    }));
  }
};
