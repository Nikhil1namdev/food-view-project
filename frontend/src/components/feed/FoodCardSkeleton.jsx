export default function FoodCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60">
      <div className="aspect-[4/3] w-full animate-pulse bg-zinc-800" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded-md bg-zinc-800" />
        <div className="h-3 w-1/2 animate-pulse rounded-md bg-zinc-800/80" />
        <div className="flex justify-between pt-2">
          <div className="h-3 w-1/3 animate-pulse rounded-md bg-zinc-800/80" />
          <div className="h-6 w-16 animate-pulse rounded-lg bg-zinc-800" />
        </div>
      </div>
    </article>
  );
}
