import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { foodApi } from "../lib/api";
import { normalizeFoodList } from "../lib/foodFeed";

export function useFoodList() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFoods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await foodApi.getAll();
      const rawFoods = normalizeFoodList(data.foodItems || []);
      
      const likedIds = JSON.parse(localStorage.getItem("likedFoodIds") || "[]");
      const savedIds = JSON.parse(localStorage.getItem("savedFoodIds") || "[]");

      const processed = rawFoods.map((item) => {
        const isLiked = likedIds.includes(item._id);
        const isSaved = savedIds.includes(item._id);
        return {
          ...item,
          isLiked,
          isSaved,
          likeCount: isLiked ? (item.likeCount || 0) + 1 : (item.likeCount || 0),
          savesCount: isSaved ? (item.savesCount || 0) + 1 : (item.savesCount || 0),
        };
      });

      setFoods(processed);
    } catch (err) {
      console.error("Failed to fetch foods:", err);
      setError(
        err.response?.data?.message || "Unable to load dishes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const toggleLike = useCallback((item) => {
    const likedIds = JSON.parse(localStorage.getItem("likedFoodIds") || "[]");
    const wasLiked = likedIds.includes(item._id);
    let newLikedIds;
    
    if (wasLiked) {
      newLikedIds = likedIds.filter((id) => id !== item._id);
    } else {
      newLikedIds = [...likedIds, item._id];
    }
    localStorage.setItem("likedFoodIds", JSON.stringify(newLikedIds));

    setFoods((prev) =>
      prev.map((v) =>
        v._id === item._id
          ? {
              ...v,
              isLiked: !wasLiked,
              likeCount: wasLiked
                ? Math.max(0, (v.likeCount || 0) - 1)
                : (v.likeCount || 0) + 1,
            }
          : v
      )
    );

    if (!wasLiked) {
      toast("Liked!", {
        duration: 1500,
        style: {
          background: "#18181b",
          color: "#f87171",
          border: "1px solid #7f1d1d",
          fontSize: "12px",
          fontWeight: 600,
        },
      });
    }
  }, []);

  const toggleSave = useCallback((item) => {
    const savedIds = JSON.parse(localStorage.getItem("savedFoodIds") || "[]");
    const wasSaved = savedIds.includes(item._id);
    let newSavedIds;

    if (wasSaved) {
      newSavedIds = savedIds.filter((id) => id !== item._id);
    } else {
      newSavedIds = [...savedIds, item._id];
    }
    localStorage.setItem("savedFoodIds", JSON.stringify(newSavedIds));

    setFoods((prev) =>
      prev.map((v) =>
        v._id === item._id
          ? {
              ...v,
              isSaved: !wasSaved,
              savesCount: wasSaved
                ? Math.max(0, (v.savesCount || 0) - 1)
                : (v.savesCount || 0) + 1,
            }
          : v
      )
    );

    toast(wasSaved ? "Removed from saved" : "Saved to bookmarks", {
      duration: 1500,
      style: {
        background: "#18181b",
        color: wasSaved ? "#a1a1aa" : "#fb923c",
        border: `1px solid ${wasSaved ? "#27272a" : "#7c2d12"}`,
        fontSize: "12px",
        fontWeight: 600,
      },
    });
  }, []);

  return {
    foods,
    loading,
    error,
    refetch: fetchFoods,
    toggleLike,
    toggleSave,
  };
}
