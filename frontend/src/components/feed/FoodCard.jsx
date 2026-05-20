import { useRef } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Heart, Store, TrendingUp, ShoppingCart } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { cn } from "../../lib/utils";
import { formatPrice } from "../../lib/foodFeed";
import VegBadge from "./VegBadge";
import RatingStars from "./RatingStars";

export default function FoodCard({ item, onLike, onSave }) {
  const videoRef = useRef(null);
  const { addToCart } = useCart();

  const handleMouseEnter = () => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const partnerLink = item.partnerId
    ? `/food-partner/${item.partnerId}`
    : null;

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:shadow-lg dark:hover:border-orange-500/25 dark:hover:shadow-xl dark:hover:shadow-orange-500/5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Media */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-950">
        <video
          ref={videoRef}
          src={item.video}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          muted
          playsInline
          loop
          preload="metadata"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20 opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

        {item.isTrending && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-orange-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
            <TrendingUp className="h-3 w-3" />
            Trending
          </span>
        )}

        <div className="absolute right-3 top-3">
          <VegBadge isVeg={item.isVeg} />
        </div>

        <button
          type="button"
          onClick={() => onSave?.(item)}
          className={cn(
            "absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-200",
            item.isSaved
              ? "border-orange-500/50 bg-orange-500/20 text-orange-400"
              : "border-white/10 bg-black/40 text-zinc-300 hover:bg-black/60 hover:text-white"
          )}
          aria-label={item.isSaved ? "Remove from saved" : "Save dish"}
        >
          <Bookmark
            className={cn("h-4 w-4", item.isSaved && "fill-current")}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-heading text-base font-bold text-zinc-900 dark:text-zinc-50">
              {item.name}
            </h3>
            {partnerLink ? (
              <Link
                to={partnerLink}
                className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-zinc-600 transition-colors hover:text-orange-500 dark:text-zinc-400 dark:hover:text-orange-400"
              >
                <Store className="h-3 w-3 shrink-0 text-orange-500" />
                <span className="truncate">{item.restaurantName}</span>
              </Link>
            ) : (
              <p className="mt-0.5 truncate text-xs text-zinc-600 dark:text-zinc-500">
                {item.restaurantName}
              </p>
            )}
          </div>
          <RatingStars rating={item.rating} />
        </div>

        {item.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-500">
            {item.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-zinc-800/80">
          <div>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {formatPrice(item.price)}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-500">
              {item.category}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onLike?.(item)}
              className={cn(
                "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                item.isLiked
                  ? "border-red-500/30 bg-red-500/10 text-red-500 dark:text-red-400"
                  : "border-zinc-200 bg-zinc-100 text-zinc-600 hover:border-red-500/20 hover:text-red-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-red-400"
              )}
              aria-label={item.isLiked ? "Unlike" : "Like"}
            >
              <Heart
                className={cn("h-3.5 w-3.5", item.isLiked && "fill-current")}
              />
              {item.likeCount ?? 0}
            </button>
            <button
              onClick={() => addToCart(item)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-orange-500/30 active:scale-95"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
