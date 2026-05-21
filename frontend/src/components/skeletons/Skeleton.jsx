import React from "react";
import { cn } from "../../lib/utils";

/**
 * Reusable base Skeleton component with premium shimmer loading animation.
 * Adapts dynamically to light and dark theme backgrounds.
 */
export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "shimmer rounded-lg bg-zinc-200/80 dark:bg-zinc-800/60",
        className
      )}
      {...props}
    />
  );
}
