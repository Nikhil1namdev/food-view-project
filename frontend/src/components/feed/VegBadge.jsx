import { cn } from "../../lib/utils";

export default function VegBadge({ isVeg, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        isVeg
          ? "border-emerald-600/40 bg-emerald-500/10 text-emerald-400"
          : "border-red-600/40 bg-red-500/10 text-red-400",
        className
      )}
      aria-label={isVeg ? "Vegetarian" : "Non-vegetarian"}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-sm border-2",
          isVeg ? "border-emerald-500" : "border-red-500"
        )}
      >
        <span
          className={cn(
            "mx-auto mt-0.5 block h-1 w-1 rounded-full",
            isVeg ? "bg-emerald-500" : "bg-red-500"
          )}
        />
      </span>
      {isVeg ? "Veg" : "Non-Veg"}
    </span>
  );
}
