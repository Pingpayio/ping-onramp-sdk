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
import type { TransactionStage } from '../hooks/use-transaction-progress';

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
  urlParams: URLSearchParams;
  connectedWalletAddress: string;
  signMessageAsync: (message: string) => Promise<string>;
  fiatAmount: string;
  setIntentStage: (stage: TransactionStage) => void;
  setIntentError: (error: string | null) => void;
  setNearIntentsDisplayInfo: React.Dispatch<React.SetStateAction<{ message?: string; amountIn?: number; amountOut?: number; explorerUrl?: string; error?: string }>>;
  setCurrentStepForPage: (step: number) => void;
  toastFn: (options: { title: string; description: string; variant?: "default" | "destructive" }) => void;
  masterTokenList: (BaseTokenInfo | UnifiedTokenInfo)[];
}

export const processNearIntentWithdrawal = async ({
  urlParams,
  connectedWalletAddress,
  signMessageAsync,
  fiatAmount,
  setIntentStage,
  setIntentError,
  setNearIntentsDisplayInfo,
  setCurrentStepForPage,
  toastFn,
  masterTokenList,
}: ProcessNearIntentParams): Promise<void> => {
  const asset = urlParams.get("asset");
  const nearRecipient = urlParams.get("recipient");

  if (!asset || !fiatAmount || !nearRecipient) {
    setIntentError("Missing critical information from URL to process NEAR transaction.");
    setIntentStage('intent_failed');
    return;
  }

  setCurrentStepForPage(1);

  try {
    const tokenIn = findTokenFromList("USDC", "base", masterTokenList);
    const tokenOut = findTokenFromList("USDC", "near", masterTokenList);
    const nearToken = findTokenFromList("NEAR", "near", masterTokenList);

    if (!tokenIn || !tokenOut || !nearToken) { 
      setIntentError("Token configuration error for NEAR transaction. Required tokens (USDC.base, USDC.near, NEAR.near) not found.");
      setIntentStage('intent_failed');
      console.error("SDK: TokenIn, TokenOut, or NearToken not found in masterTokenList", { tokenIn, tokenOut, nearToken });
      return;
    }

    setNearIntentsDisplayInfo({ message: `Waiting for your ${asset} deposit to be confirmed...` });
    setIntentStage('confirming_evm_deposit');
    await waitForDepositsCompletion(connectedWalletAddress.toLowerCase() as IntentsUserId);

    const cryptoAmountInEstimated = BigInt(Math.floor(parseFloat(fiatAmount) * (10 ** tokenIn.decimals)));
    setNearIntentsDisplayInfo({ message: `Quoting bridge for ${parseFloat(fiatAmount)} ${asset}...`, amountIn: parseFloat(fiatAmount) });
    setIntentStage('quoting_bridge_swap');

    const quoteInput = {
      tokensIn: [tokenIn],
      tokenOut: tokenOut,
      amountIn: { amount: cryptoAmountInEstimated, decimals: tokenIn.decimals },
      balances: { [tokenIn.defuseAssetId]: cryptoAmountInEstimated },
      waitMs: 2000,
    };

    const quoteResult: QuoteResult = await queryQuote(quoteInput as Parameters<typeof queryQuote>[0]);


    if (quoteResult.tag === 'err') {
      console.error("SDK: Failed to get quote:", quoteResult.value);
      const reason = (quoteResult.value && 'reason' in quoteResult.value && typeof quoteResult.value.reason === 'string') ? quoteResult.value.reason : 'Unknown error';
      setIntentError(`Could not find a bridge route: ${reason}`);
      setIntentStage('intent_failed');
      return;
    }

    const quoteValue = quoteResult.value as AggregatedQuote; // SDK types suggest this is AggregatedQuote
    const actualAmountOutBI = quoteValue.tokenDeltas[1][1];
    const actualAmountOut = Number(actualAmountOutBI) / (10 ** tokenOut.decimals);
    setNearIntentsDisplayInfo(prev => ({ ...prev, message: `Preparing to bridge ${actualAmountOut.toFixed(tokenOut.decimals)} ${tokenOut.symbol}...`, amountOut: actualAmountOut }));

    const storageRequiredResult: Output = await getNEP141StorageRequired({ token: tokenOut, userAccountId: nearRecipient });
    if (storageRequiredResult.tag === 'err') {
      setIntentError("Error checking storage requirements for recipient.");
      setIntentStage('intent_failed');
      return;
    }
    const storageDepositAmount = storageRequiredResult.value;
    const needsStorageDeposit = storageDepositAmount > BigInt(0);

    let quoteStorageResult: QuoteResult | null = null;
    if (needsStorageDeposit) {
      quoteStorageResult = await queryQuoteExactOut(
        { tokenIn: tokenOut.defuseAssetId, tokenOut: nearToken.defuseAssetId, exactAmountOut: storageDepositAmount, minDeadlineMs: 10 * 60 * 1000 },
        { logBalanceSufficient: true }
      );
      if (quoteStorageResult.tag === 'err') {
        setIntentError("Could not find a quote for storage deposit.");
        setIntentStage('intent_failed');
        return;
      }
    }
    
    const storageQuoteValue = quoteStorageResult?.value as AggregatedQuote | undefined;
    const storageCostInTokenOut = storageQuoteValue ? -(storageQuoteValue.tokenDeltas[0][1]) : BigInt(0);
    const finalAmountOutToRecipient = actualAmountOutBI - storageCostInTokenOut;


    const intentMessageObj = createWithdrawIntentMessage(
      { type: 'to_near', amount: finalAmountOutToRecipient, tokenAccountId: getTokenAccountIds([tokenOut])[0], receiverId: nearRecipient, storageDeposit: storageDepositAmount },
      { signerId: connectedWalletAddress.toLowerCase() as IntentsUserId }
    );

    const intentObject = JSON.parse(intentMessageObj.ERC191.message);
    const referral = "ping-onramp.near";

    if (Number(storageCostInTokenOut) > 0 && storageQuoteValue) {
      intentObject.intents.unshift({
        intent: "token_diff",
        diff: { [tokenOut.defuseAssetId]: `-${storageCostInTokenOut.toString()}`, [nearToken.defuseAssetId]: storageDepositAmount.toString() },
        referral,
      });
    }
    intentObject.intents.unshift({
      intent: "token_diff",
      diff: { [tokenIn.defuseAssetId]: `-${cryptoAmountInEstimated.toString()}`, [tokenOut.defuseAssetId]: actualAmountOutBI.toString() },
      referral,
    });

    const displayFinalAmount = (Number(finalAmountOutToRecipient * BigInt(1000000) / BigInt(10 ** tokenOut.decimals)) / 1000000).toFixed(Math.min(tokenOut.decimals, 6));
    setNearIntentsDisplayInfo(prev => ({ ...prev, message: `Please sign the transaction in your wallet to bridge ${displayFinalAmount} ${tokenOut.symbol} to ${nearRecipient}.` }));
    setIntentStage('awaiting_intent_signature');

    const messageToSign = JSON.stringify(intentObject);
    const signature = await signMessageAsync(messageToSign);
    const signatureData = parseErc6492Signature(signature as `0x${string}`).signature;

    setNearIntentsDisplayInfo(prev => ({ ...prev, message: `Publishing your bridge transaction...` }));
    setIntentStage('publishing_intent');

    const quoteHashes = storageQuoteValue ? [quoteValue.quoteHashes[0], storageQuoteValue.quoteHashes[0]] : [quoteValue.quoteHashes[0]];
    const publishResult = await publishIntent(
      { type: 'ERC191', signatureData: signatureData as `0x${string}`, signedData: { message: messageToSign } },
      { userAddress: connectedWalletAddress, userChainType: 'evm' },
      quoteHashes
    );

    if (publishResult.tag === 'err') {
      console.error("SDK: Failed to publish intent:", publishResult.value);
      const reason = (publishResult.value && 'reason' in publishResult.value) ? (publishResult.value as { reason: string }).reason : 'Unknown error';
      setIntentError(`Failed to publish transaction: ${reason}`);
      setIntentStage('intent_failed');
      return;
    }
    const intentHash = publishResult.value;

    setNearIntentsDisplayInfo(prev => ({ ...prev, message: `Waiting for bridge transaction to complete...` }));
    setIntentStage('awaiting_intent_settlement');
    await waitForIntentSettlement(new AbortController().signal, intentHash);

    const explorerUrl = `https://nearblocks.io/txns/${intentHash}`;
    setNearIntentsDisplayInfo({ message: `Successfully bridged ${displayFinalAmount} ${tokenOut.symbol} to ${nearRecipient}!`, explorerUrl });
    setIntentStage('intent_completed');
    toastFn({ title: "Bridge Successful", description: `${displayFinalAmount} ${tokenOut.symbol} sent to ${nearRecipient}.` });

  } catch (err: unknown) {
    console.error("SDK: NEAR Intent processing failed:", err);
    let errorMessage = "An unknown error occurred during the NEAR transaction.";
    if (typeof err === "string") {
      errorMessage = err;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    setIntentError(errorMessage);
    setIntentStage('intent_failed');
    setNearIntentsDisplayInfo(prev => ({ ...prev, error: errorMessage }));
  }
};
