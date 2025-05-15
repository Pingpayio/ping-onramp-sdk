
import * as React from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast as useToastOriginal, toast as toastOriginal, ToastType } from "@/components/ui/toast"

export const ToastContext = React.createContext<ReturnType<typeof useToastOriginal> | null>(null)

export function useToast() {
  const context = React.useContext(ToastContext)
  
  if (context === null) {
    const toastInstance = useToastOriginal()
    return toastInstance
  }
  
  return context
}

// Standardized toast with consistent wallet styling for all notifications
export const toast = (props: Parameters<typeof toastOriginal>[0]) => {
  return toastOriginal({
    ...props,
    className: "bg-[#AF9EF9] text-white font-inter border-none",
  });
};

// Export the original toast function as well in case it's needed
export { toastOriginal as originalToast }

// Export the Toast type with className
export type { ToastType as Toast } from "@/components/ui/toast"
