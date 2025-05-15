
import { useToast, toast } from "@/hooks/use-toast";

// Re-export the standardized toast functions
export { useToast, toast };

// Export a special wallet toast function for backward compatibility
export const walletToast = (title: string, description?: string) => {
  return toast({
    title,
    description
  });
};
