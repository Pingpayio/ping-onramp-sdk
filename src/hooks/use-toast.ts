
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

export { toastOriginal as toast }

// Export the Toast type with className
export type { ToastType as Toast } from "@/components/ui/toast"
