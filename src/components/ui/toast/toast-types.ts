
import { ToastAction } from "./toast-primitives";
import { ReactNode } from "react";

export type ToastProps = React.ComponentPropsWithoutRef<typeof ToastAction>;

export type ToastActionElement = React.ReactElement<typeof ToastAction>;

export type ToastType = {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  className?: string;
};

export type ToasterToast = ToastType & {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  variant?: "default" | "destructive";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};
