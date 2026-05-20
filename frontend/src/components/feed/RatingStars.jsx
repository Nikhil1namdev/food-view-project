import { Star } from "lucide-react";
import { cn } from "../../lib/utils";

export default function RatingStars({ rating = 0, className }) {
  const value = Math.min(5, Math.max(0, Number(rating) || 0));

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      aria-label={`Rating ${value} out of 5`}
    >
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="text-xs font-bold text-zinc-200">{value.toFixed(1)}</span>
    </div>
  );
}
