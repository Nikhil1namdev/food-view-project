import FoodCard from "./FoodCard";
import FoodCardSkeleton from "./FoodCardSkeleton";

export default function FoodGrid({
  items,
  loading,
  skeletonCount = 8,
  onLike,
  onSave,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <FoodCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <FoodCard
          key={item._id}
          item={item}
          onLike={onLike}
          onSave={onSave}
        />
      ))}
    </div>
  );
}
