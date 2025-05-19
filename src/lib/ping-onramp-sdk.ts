import {
  AggregatedQuote,
  createWithdrawIntentMessage,
  getNEP141StorageRequired,
  getTokenAccountIds,
  IntentsUserId,
  isBaseToken,
  Output,
  publishIntent,
  queryQuote,
  queryQuoteExactOut,
  QuoteResult,
  waitForDepositsCompletion,
  waitForIntentSettlement,
  type BaseTokenInfo,
  type UnifiedTokenInfo
} from 'near-intents-sdk';
import { parseErc6492Signature } from 'viem';
import type { IntentProgress, CallbackParams, TokenInfo as GuideTokenInfo } from '@/types/onramp';

export const findTokenFromList = (
  symbol: string,
  chainName: string,
  tokenList: (BaseTokenInfo | UnifiedTokenInfo)[]
): BaseTokenInfo | undefined => {
  for (const item of tokenList) {
    if (isBaseToken(item)) {
      if (item.symbol === symbol && item.chainName === chainName) {
        return item;
      }
    } else {
      // It's a UnifiedTokenInfo, check its groupedTokens
      const foundInGroup = item.groupedTokens.find(
        (bt) => bt.symbol === symbol && bt.chainName === chainName
      );
      if (foundInGroup) {
        return foundInGroup;
      }
    }
  }
  return undefined;
};


interface ProcessNearIntentParams {
  callbackParams: Required<CallbackParams>;
  userEvmAddress: string;
  signMessageAsync: (args: { message: string }) => Promise<`0x${string}`>;
  tokenList: (BaseTokenInfo | UnifiedTokenInfo)[];
  updateProgress: (progress: IntentProgress) => void;
  updateErrorMessage: (message: string | null) => void;
  updateDisplayInfo: React.Dispatch<React.SetStateAction<{ message?: string; amountIn?: number; amountOut?: number; explorerUrl?: string }>>;
  toastFn: (title: string, options: { description: string; }) => void;
}

export const processNearIntentWithdrawal = async ({
  callbackParams,
  userEvmAddress,
  signMessageAsync,
  tokenList,
  updateProgress,
  updateErrorMessage,
  updateDisplayInfo,
  toastFn,
}: ProcessNearIntentParams): Promise<void> => {
  const { amount: fiatAmountStr, asset: assetSymbol, recipient: nearRecipient } = callbackParams;

  if (!assetSymbol || !fiatAmountStr || !nearRecipient) {
    updateErrorMessage("Missing critical information from onramp callback.");
    updateProgress('error');
    return;
  }

  try {
    const tokenIn = findTokenFromList(assetSymbol, "base", tokenList);
    const tokenOut = findTokenFromList(assetSymbol, "near", tokenList);
    const nearStorageTokenDef = findTokenFromList("NEAR", "near", tokenList);


    if (!tokenIn || !tokenOut || !nearStorageTokenDef) {
      updateErrorMessage("Token configuration error. Required tokens (USDC.base, USDC.near, NEAR.near) not found.");
      updateProgress('error');
      console.error("SDK: TokenIn, TokenOut, or NearStorageTokenDef not found in masterTokenList", { tokenIn, tokenOut, nearStorageTokenDef });
      return;
    }
    
    const NEP141_STORAGE_TOKEN_ID = nearStorageTokenDef.defuseAssetId;

    updateDisplayInfo({ message: `Waiting for your ${assetSymbol} deposit to be confirmed...` });
    updateProgress('depositing');
    await waitForDepositsCompletion(userEvmAddress.toLowerCase() as IntentsUserId);

    const fiatAmountNum = parseFloat(fiatAmountStr);
    if (isNaN(fiatAmountNum) || fiatAmountNum <= 0) {
        updateErrorMessage("Invalid amount received from onramp callback.");
        updateProgress("error");
        throw new Error("Invalid amount from callback.");
    }
    const amountInBigInt = BigInt(Math.floor(fiatAmountNum * (10 ** tokenIn.decimals)));
    updateDisplayInfo(prev => ({ ...prev, message: `Quoting bridge for ${fiatAmountNum.toFixed(2)} ${assetSymbol}...`, amountIn: fiatAmountNum }));
    updateProgress('querying');

    const quoteInput = {
      tokensIn: [tokenIn],
      tokenOut: tokenOut,
      amountIn: { amount: amountInBigInt, decimals: tokenIn.decimals },
      balances: { [tokenIn.defuseAssetId]: amountInBigInt },
      waitMs: 3000,
    };
    // Using 'as any' for quoteInput due to potential subtle mismatches between the locally constructed object
    // and the precise input type expected by the SDK's queryQuote function.
    // BaseTokenInfo is used for tokens, but the overall structure or other properties might have
    // stricter requirements not fully captured here without direct access to the SDK's internal QuoteInput type.
    // TODO: Revisit this if SDK types are updated or a more precise local type can be defined.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const quoteResult: QuoteResult = await queryQuote(quoteInput as any);


    if (quoteResult.tag === 'err') {
      console.error("SDK: Failed to get quote:", quoteResult.value);
      const reason = (quoteResult.value && typeof quoteResult.value === 'object' && 'reason' in quoteResult.value && typeof quoteResult.value.reason === 'string') ? quoteResult.value.reason : 'Unknown error';
      updateErrorMessage(`Could not find a bridge route: ${reason}`);
      updateProgress('error');
      return;
    }

    const swapQuote = quoteResult.value as AggregatedQuote;
    const usdcNearAmountOutGross = swapQuote.tokenDeltas[1][1];
    const grossAmountOutDisplay = Number(usdcNearAmountOutGross) / (10 ** tokenOut.decimals);
    updateDisplayInfo(prev => ({ ...prev, message: `Preparing to bridge ${grossAmountOutDisplay.toFixed(tokenOut.decimals)} ${tokenOut.symbol}...`, amountOut: grossAmountOutDisplay }));


    const storageRequiredResult: Output = await getNEP141StorageRequired({ token: tokenOut, userAccountId: nearRecipient });
    if (storageRequiredResult.tag === 'err') {
      const reason = (storageRequiredResult.value && typeof storageRequiredResult.value === 'object' && 'reason' in storageRequiredResult.value && typeof storageRequiredResult.value.reason === 'string') ? storageRequiredResult.value.reason : 'Unknown error';
      updateErrorMessage(`Error checking storage requirements: ${reason}`);
      updateProgress('error');
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
        { logBalanceSufficient: true }
      );
      if (storageQuoteResult.tag === 'err') {
        const reason = (storageQuoteResult.value && typeof storageQuoteResult.value === 'object' && 'reason' in storageQuoteResult.value && typeof storageQuoteResult.value.reason === 'string') ? storageQuoteResult.value.reason : 'Unknown error';
        updateErrorMessage(`Could not find a quote for storage deposit: ${reason}`);
        updateProgress('error');
        return;
      }
      storageSwapQuote = storageQuoteResult.value as AggregatedQuote;
      storageCostInAsset = -storageSwapQuote.tokenDeltas[0][1];
    }

    const finalAmountToReceive = usdcNearAmountOutGross - storageCostInAsset;
    const finalAmountDisplay = Number(finalAmountToReceive) / (10 ** tokenOut.decimals);
    updateDisplayInfo(prev => ({ ...prev, amountOut: finalAmountDisplay }));


    const intentMessagePayload = createWithdrawIntentMessage(
      { type: 'to_near', amount: finalAmountToReceive, tokenAccountId: getTokenAccountIds([tokenOut])[0], receiverId: nearRecipient, storageDeposit: storageDepositNearAmount },
      { signerId: userEvmAddress.toLowerCase() as IntentsUserId }
    );

    const intentObject = JSON.parse(intentMessagePayload.ERC191.message);
    const referral = "pingpay.near";

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

    updateDisplayInfo(prev => ({ ...prev, message: `Please sign the transaction in your wallet to bridge ${finalAmountDisplay.toFixed(Math.min(tokenOut.decimals, 6))} ${tokenOut.symbol} to ${nearRecipient}.` }));
    updateProgress('signing');

    const messageToSign = JSON.stringify(intentObject);
    const signature = await signMessageAsync({ message: messageToSign });
    const signatureData = parseErc6492Signature(signature).signature;

    updateDisplayInfo(prev => ({ ...prev, message: `Publishing your bridge transaction...` }));
    updateProgress('withdrawing');

    const quoteHashes = [swapQuote.quoteHashes[0]];
    if (storageSwapQuote) {
      quoteHashes.push(storageSwapQuote.quoteHashes[0]);
    }
    const publishResult = await publishIntent(
      { type: 'ERC191', signatureData: signatureData as `0x${string}`, signedData: { message: messageToSign } },
      { userAddress: userEvmAddress, userChainType: 'evm' },
      quoteHashes
    );

    if (publishResult.tag === 'err') {
      console.error("SDK: Failed to publish intent:", publishResult.value);
      const reason = (publishResult.value && typeof publishResult.value === 'object' && 'reason' in publishResult.value) ? (publishResult.value as { reason: string }).reason : 'Unknown error';
      updateErrorMessage(`Failed to publish transaction: ${reason}`);
      updateProgress('error');
      return;
    }
    const intentHash = publishResult.value;

    updateDisplayInfo(prev => ({ ...prev, message: `Waiting for bridge transaction to complete...` }));
    await waitForIntentSettlement(new AbortController().signal, intentHash);

    const explorerUrl = `https://nearblocks.io/txns/${intentHash}`;
    updateDisplayInfo({ message: `Successfully bridged ${finalAmountDisplay.toFixed(Math.min(tokenOut.decimals, 6))} ${tokenOut.symbol} to ${nearRecipient}!`, explorerUrl, amountOut: finalAmountDisplay });
    updateProgress('done');
    toastFn("Bridge Successful", { description: `${finalAmountDisplay.toFixed(Math.min(tokenOut.decimals, 6))} ${tokenOut.symbol} sent to ${nearRecipient}.` });

  } catch (err: unknown) {
    console.error("SDK: NEAR Intent processing failed:", err);
    let errorMessage = "An unknown error occurred during the NEAR transaction.";
    if (typeof err === "string") {
      errorMessage = err;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    updateErrorMessage(errorMessage);
    updateProgress('error');
    updateDisplayInfo(prev => ({
      amountIn: prev.amountIn,
      message: `Error: ${errorMessage}`,
      explorerUrl: undefined,
      amountOut: undefined,
    }));
  }
};
