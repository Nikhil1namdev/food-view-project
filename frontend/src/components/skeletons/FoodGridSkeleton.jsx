import React from "react";
import FoodCardSkeleton from "./FoodCardSkeleton";

/**
 * Grid layout matching the standard 1/2/3/4 column listing feed.
 * Fills empty grid nodes seamlessly during data loading states.
 */
export default function FoodGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <FoodCardSkeleton key={i} />
      ))}
    </div>
  );
}
