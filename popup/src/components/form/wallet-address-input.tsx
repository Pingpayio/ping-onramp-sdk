import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { memoizedValidateRecipientAddress } from "@/lib/address-validation";
import { onrampTargetAtom } from "@/state/atoms";
import type { FormValues } from "../steps/form-entry-view";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function WalletAddressInput() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  const onrampTarget = useAtomValue(onrampTargetAtom);

  // Memoize validation function to prevent recreating on every render
  const validateAddress = useCallback(
    (value: string) =>
      memoizedValidateRecipientAddress(value, onrampTarget.chain),
    [onrampTarget.chain],
  );

  return (
    <div className="flex flex-col gap-1">
      <Label
        htmlFor="recipientAddress"
        className="block text-sm text-white mb-1"
      >
        Recipient Wallet Address
      </Label>
      <Input
        type="text"
        id="recipientAddress"
        {...register("recipientAddress", {
          required: "Recipient wallet address is required",
          validate: validateAddress,
        })}
        className="block w-full p-4 rounded-lg h-[54px] bg-white/[0.08] border border-[rgba(255,255,255,0.18)] focus:ring-blue-500 focus:border-blue-500 focus-visible:border-[#AF9EF9] hover:border-[#AF9EF9]/70 placeholder:text-base placeholder:font-base"
        placeholder="Enter Recipient Address"
      />
      {errors.recipientAddress && (
        <p className="text-red-400 text-xs mt-1">
          {errors.recipientAddress.message}
        </p>
      )}
      <p className="text-xs text-white/50 mt-1 px-1">
        Funds will be onramped and then swapped to this address.
      </p>
    </div>
  );
}
