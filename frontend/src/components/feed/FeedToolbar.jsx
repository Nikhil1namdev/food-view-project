import { LayoutGrid, Play } from "lucide-react";
import { cn } from "../../lib/utils";
import FeedSearchBar from "./FeedSearchBar";
import FeedFilters from "./FeedFilters";

export default function FeedToolbar({
  search,
  onSearchChange,
  filterProps,
  viewMode,
  onViewModeChange,
  resultCount,
  categories,
}) {
  return (
    <div className={cn(
      "sticky top-[57px] z-40 -mx-4 px-4 py-4 md:static md:top-auto md:z-auto md:mx-0 md:px-0 md:py-0 transition-colors duration-300",
      viewMode === "grid" ? "border-b border-zinc-200 dark:border-zinc-900/80 bg-white/90 dark:bg-[#050507]/90 backdrop-blur-xl md:border-0 md:bg-transparent md:backdrop-blur-none" : "border-0 bg-transparent"
    )}>
      <div className="mx-auto max-w-7xl space-y-4">
        <div className={cn("flex flex-row items-center gap-4", viewMode === "reels" ? "justify-center md:justify-end" : "justify-between")}>
          {viewMode === "grid" && (
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-3xl">
                Order your{" "}
                <span className="text-gradient">favourites</span>
              </h1>
              {!filterProps.loading && (
                <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {resultCount} dish{resultCount !== 1 ? "es" : ""} available
                </p>
              )}
            </div>
          )}

          <div className={cn(
            "flex shrink-0 rounded-xl p-1 transition-colors duration-300",
            viewMode === "reels" ? "border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/80 shadow-md backdrop-blur-md" : "border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/80"
          )}>
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all",
                viewMode === "grid"
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              Browse
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("reels")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all",
                viewMode === "reels"
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Play className="h-4 w-4" />
              Reels
            </button>
          </div>
        </div>

        {viewMode === "grid" && (
          <>
            <FeedSearchBar value={search} onChange={onSearchChange} />
            <FeedFilters
              vegFilter={filterProps.vegFilter}
              onVegFilterChange={filterProps.onVegFilterChange}
              category={filterProps.category}
              onCategoryChange={filterProps.onCategoryChange}
              trendingOnly={filterProps.trendingOnly}
              onTrendingChange={filterProps.onTrendingChange}
              savedOnly={filterProps.savedOnly}
              onSavedChange={filterProps.onSavedChange}
              sortBy={filterProps.sortBy}
              onSortChange={filterProps.onSortChange}
              categories={categories}
            />
          </>
        )}
      </div>
    </div>
  );
}
