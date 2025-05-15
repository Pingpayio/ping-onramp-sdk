
import { useToast, toast } from "@/hooks/use-toast";

// Special toast variant for wallet notifications with custom styling
export const walletToast = (title: string, description?: string) => {
  return toast({
    title,
    description,
    className: "bg-[#AF9EF9] text-white font-inter border-none"
  });
};

export { useToast, toast };
