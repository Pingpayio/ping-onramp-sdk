"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  variant?: "default" | "failed";
}

function Progress({
  className,
  value,
  variant = "default",
  ...props
}: ProgressProps) {
  const isFailed = variant === "failed";
  
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-white/10 relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 transition-all",
          isFailed ? "bg-[#ac4f51]" : "bg-[#AF9EF9]",
        )}
        style={{
          transform: isFailed
            ? "translateX(0%)" // Show full bar for failed state
            : `translateX(-${100 - (value || 0)}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
