import { useMemo, useState } from "react";
import { cn } from "../../lib/utils";
import Navbar from "../../components/home/Navbar";
import BottomNav from "../../components/home/BottomNav";
import ReelFeed from "../../components/home/ReelFeed";
import FeedToolbar from "../../components/feed/FeedToolbar";
import FoodGrid from "../../components/feed/FoodGrid";
import FeedEmptyState from "../../components/feed/FeedEmptyState";
import ReelSkeleton from "../../components/skeletons/ReelSkeleton";
import { useFoodList } from "../../hooks/useFoodList";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import {
  filterFoods,
  sortFoods,
  getUniqueCategories,
  VEG_FILTERS,
  SORT_OPTIONS,
  FOOD_CATEGORIES,
} from "../../lib/foodFeed";

const Home = () => {
  const { foods, loading, error, refetch, toggleLike, toggleSave } =
    useFoodList();

  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const [vegFilter, setVegFilter] = useState(VEG_FILTERS.ALL);
  const [category, setCategory] = useState("All");
  const [trendingOnly, setTrendingOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.DEFAULT);

  const categories = useMemo(() => {
    const unique = getUniqueCategories(foods);
    return ["All", ...unique];
  }, [foods]);

  const filteredFoods = useMemo(() => {
    const filtered = filterFoods(foods, {
      query: debouncedSearch,
      vegFilter,
      category,
      trendingOnly,
      savedOnly,
    });
    return sortFoods(filtered, sortBy);
  }, [
    foods,
    debouncedSearch,
    vegFilter,
    category,
    trendingOnly,
    savedOnly,
    sortBy,
  ]);

  const hasActiveFilters =
    debouncedSearch ||
    vegFilter !== VEG_FILTERS.ALL ||
    category !== "All" ||
    trendingOnly ||
    savedOnly;

  const showSearchEmpty =
    !loading &&
    !error &&
    foods.length > 0 &&
    filteredFoods.length === 0 &&
    hasActiveFilters;

  const showGlobalEmpty =
    !loading && !error && foods.length === 0;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#fafafa] dark:bg-[#050507] text-neutral-800 dark:text-neutral-100 select-none transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.03)_0%,_rgba(250,250,250,1)_75%)] dark:bg-[radial-gradient(circle_at_center,_rgba(24,24,27,0.25)_0%,_rgba(5,5,7,1)_75%)] transition-colors duration-300" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] transition-colors duration-300" />

      <Navbar viewMode={viewMode} />

      <main className={cn(
        "relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 pt-4 md:px-6 transition-all duration-300",
        viewMode === "grid" ? "pb-24 md:pb-8" : "pb-16 md:pb-4"
      )}>
        <FeedToolbar
          search={search}
          onSearchChange={setSearch}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          resultCount={viewMode === "grid" ? filteredFoods.length : foods.length}
          categories={categories.length > 1 ? categories : FOOD_CATEGORIES}
          filterProps={{
            vegFilter,
            onVegFilterChange: setVegFilter,
            category,
            onCategoryChange: setCategory,
            trendingOnly,
            onTrendingChange: setTrendingOnly,
            savedOnly,
            onSavedChange: setSavedOnly,
            sortBy,
            onSortChange: setSortBy,
            loading,
          }}
        />

        <div className={cn(
          "transition-all duration-300",
          viewMode === "reels" ? "mt-4 h-[calc(100dvh-200px)] md:h-[calc(100vh-170px)] -mx-4 md:mx-0" : "mt-6"
        )}>
          {viewMode === "reels" ? (
            loading ? (
              <ReelSkeleton />
            ) : error ? (
              <FeedEmptyState variant="error" onRetry={refetch} />
            ) : foods.length === 0 ? (
              <FeedEmptyState variant="empty" onRetry={refetch} />
            ) : (
              <ReelFeed
                items={foods}
                onLike={toggleLike}
                onSave={toggleSave}
                emptyMessage="No viral reels active. Be the first to post!"
              />
            )
          ) : error ? (
            <FeedEmptyState variant="error" onRetry={refetch} />
          ) : showGlobalEmpty ? (
            <FeedEmptyState variant="empty" onRetry={refetch} />
          ) : showSearchEmpty ? (
            <FeedEmptyState variant="search" />
          ) : (
            <FoodGrid
              items={filteredFoods}
              loading={loading}
              onLike={toggleLike}
              onSave={toggleSave}
            />
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
