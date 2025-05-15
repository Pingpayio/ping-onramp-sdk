
import * as React from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast as useToastOriginal } from "@/components/ui/toast"

export const ToastContext = React.createContext<ReturnType<typeof useToastOriginal> | null>(null)

export function useToast() {
  const context = React.useContext(ToastContext)
  
  if (context === null) {
    const toast = useToastOriginal()
    return toast
  }
  
  return context
}

export { toast } from "@/components/ui/toast"
export type { Toast } from "@/components/ui/toast"
