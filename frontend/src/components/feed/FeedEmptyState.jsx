import { Link } from "react-router-dom";
import {
  SearchX,
  UtensilsCrossed,
  WifiOff,
  RefreshCw,
  Store,
} from "lucide-react";
import { cn } from "../../lib/utils";

const VARIANTS = {
  empty: {
    icon: UtensilsCrossed,
    title: "No dishes yet",
    description:
      "The menu is empty right now. Check back soon or ask a restaurant partner to add their specials.",
    showRefresh: true,
    showPartnerCta: true,
  },
  search: {
    icon: SearchX,
    title: "No food found",
    description:
      "We couldn't find anything matching your search or filters. Try different keywords or clear filters.",
    showRefresh: false,
    showPartnerCta: false,
  },
  error: {
    icon: WifiOff,
    title: "Couldn't load dishes",
    description:
      "Something went wrong while fetching the menu. Please check your connection and try again.",
    showRefresh: true,
    showPartnerCta: false,
  },
};

export default function FeedEmptyState({
  variant = "empty",
  onRetry,
  className,
}) {
  const config = VARIANTS[variant] || VARIANTS.empty;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-zinc-200 bg-white/60 px-6 py-16 text-center backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/40",
        className
      )}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20">
        <Icon className="h-8 w-8 text-orange-400" />
      </div>

      <h3 className="font-heading text-xl font-bold text-zinc-900 dark:text-zinc-100">
        {config.title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {config.description}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {config.showRefresh && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        )}

        {config.showPartnerCta && (
          <Link
            to="/food-partner/register"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-zinc-100 px-6 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-orange-500/50 hover:text-orange-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-orange-500/30 dark:hover:text-orange-400"
          >
            <Store className="h-4 w-4 text-orange-500" />
            Partner with us
          </Link>
        )}
      </div>
    </div>
  );
}
