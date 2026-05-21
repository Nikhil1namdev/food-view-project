import React from "react";
import Skeleton from "./Skeleton";

/**
 * Immersive vertical Reel Video Loader matching the ReelFeed UI exactly.
 * Standardizes immersive loading mechanics with deep contrast dark shapes.
 */
export default function ReelSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black/95 select-none">
      <div className="w-full h-[calc(100vh-4rem)] md:h-[90vh] max-w-[440px] bg-zinc-950 md:rounded-2xl border border-white/10 md:shadow-2xl relative overflow-hidden">
        
        {/* Floating Sound Control Placeholder */}
        <div className="absolute top-5 right-5 z-20">
          <Skeleton className="h-9 w-9 rounded-full bg-zinc-900/80 border border-white/5" />
        </div>

        {/* Fullscreen Video Shimmer */}
        <Skeleton className="w-full h-full rounded-none bg-zinc-950" />

        {/* Responsive Overlay Elements */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
          <div className="flex justify-between items-end w-full space-x-4">
            
            {/* Left Side Details Skeleton */}
            <div className="flex-1 flex flex-col space-y-3 pb-2 pr-4">
              {/* Partner Store Link */}
              <Skeleton className="h-7 w-32 rounded-full bg-white/10 border border-white/5" />
              
              {/* Food Title & Description */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-2/3 bg-white/10" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-full bg-white/10" />
                  <Skeleton className="h-3 w-5/6 bg-white/10" />
                </div>
              </div>
            </div>

            {/* Right Side Action Circle Buttons */}
            <div className="flex flex-col space-y-4 items-center">
              {/* Like Action */}
              <div className="flex flex-col items-center">
                <Skeleton className="h-11 w-11 rounded-full bg-white/10 border border-white/5" />
                <Skeleton className="h-3 w-6 mt-1.5 bg-white/10" />
              </div>

              {/* Bookmark Action */}
              <div className="flex flex-col items-center">
                <Skeleton className="h-11 w-11 rounded-full bg-white/10 border border-white/5" />
                <Skeleton className="h-3 w-6 mt-1.5 bg-white/10" />
              </div>

              {/* Comment Action */}
              <div className="flex flex-col items-center">
                <Skeleton className="h-11 w-11 rounded-full bg-white/10 border border-white/5" />
                <Skeleton className="h-3 w-6 mt-1.5 bg-white/10" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
