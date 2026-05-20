import { Flame, Bookmark, ArrowUpDown } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  VEG_FILTERS,
  SORT_OPTIONS,
  FOOD_CATEGORIES,
} from "../../lib/foodFeed";

function FilterChip({ active, onClick, children, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
          active
            ? "border-orange-500/50 bg-orange-500/15 text-orange-600 dark:text-orange-400 shadow-sm shadow-orange-500/10"
            : "border-zinc-200 bg-zinc-100 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-200 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200",
        className
      )}
    >
      {children}
    </button>
  );
}

export default function FeedFilters({
  vegFilter,
  onVegFilterChange,
  category,
  onCategoryChange,
  categories = FOOD_CATEGORIES,
  trendingOnly,
  onTrendingChange,
  savedOnly,
  onSavedChange,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="space-y-3">
      {/* Veg toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-500">
          Type
        </span>
        {[
          { id: VEG_FILTERS.ALL, label: "All" },
          { id: VEG_FILTERS.VEG, label: "Veg" },
          { id: VEG_FILTERS.NON_VEG, label: "Non-Veg" },
        ].map(({ id, label }) => (
          <FilterChip
            key={id}
            active={vegFilter === id}
            onClick={() => onVegFilterChange(id)}
          >
            {label}
          </FilterChip>
        ))}
      </div>

      {/* Category scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-500">
          Cuisine
        </span>
        {categories.map((cat) => (
          <FilterChip
            key={cat}
            active={category === cat}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </FilterChip>
        ))}
      </div>

      {/* Quick filters + sort */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterChip
          active={trendingOnly}
          onClick={() => onTrendingChange(!trendingOnly)}
        >
          <span className="inline-flex items-center gap-1">
            <Flame className="h-3.5 w-3.5" />
            Trending
          </span>
        </FilterChip>

        <FilterChip
          active={savedOnly}
          onClick={() => onSavedChange(!savedOnly)}
        >
          <span className="inline-flex items-center gap-1">
            <Bookmark className="h-3.5 w-3.5" />
            Saved
          </span>
        </FilterChip>

        <div className="ml-auto flex items-center gap-2">
          <ArrowUpDown className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-500" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700 outline-none transition-colors focus:border-orange-500/40 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300"
            aria-label="Sort dishes"
          >
            <option value={SORT_OPTIONS.DEFAULT}>Newest</option>
            <option value={SORT_OPTIONS.PRICE_LOW}>Price: Low to High</option>
            <option value={SORT_OPTIONS.PRICE_HIGH}>Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
