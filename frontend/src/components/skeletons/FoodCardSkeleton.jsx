import React from "react";
import Skeleton from "./Skeleton";

/**
 * High-fidelity Skeleton loader mimicking the premium FoodCard UI.
 * Provides identical responsive dimensions and structural alignment.
 */
export default function FoodCardSkeleton() {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50">
      {/* Media Aspect Ratio Wrapper */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
        <Skeleton className="h-full w-full rounded-none" />
        
        {/* Floating Trending Badge Skeleton */}
        <Skeleton className="absolute left-3 top-3 h-5 w-20 rounded-full" />
        
        {/* Veg/Non-Veg Badge Skeleton */}
        <Skeleton className="absolute right-3 top-3 h-5 w-5 rounded-full" />

        {/* Bookmark Action Skeleton */}
        <Skeleton className="absolute bottom-3 right-3 h-9 w-9 rounded-full" />
      </div>

      {/* Content Section Skeletons */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        {/* Title + Ratings Row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
          <div className="flex gap-0.5 pt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-3.5 w-3.5 rounded-full" />
            ))}
          </div>
        </div>

        {/* Description Lines */}
        <div className="space-y-1.5 my-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>

        {/* Price & Primary Action Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-zinc-800/80">
          <div className="space-y-1">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-3 w-10" />
          </div>

          <div className="flex items-center gap-2">
            {/* Like Action Skeleton */}
            <Skeleton className="h-8 w-14 rounded-xl" />
            {/* Add Action Skeleton */}
            <Skeleton className="h-8 w-16 rounded-xl" />
          </div>
        </div>
      </div>
    </article>
  );
}
