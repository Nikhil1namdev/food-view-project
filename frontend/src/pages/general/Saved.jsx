import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ReelFeed from "../../components/home/ReelFeed";
import PageWrapper from "../../layouts/PageWrapper";
import { Bookmark, Loader2 } from "lucide-react";

// =========================================================================
// CUSTOMER BOOKMARKS VIEW CONTROLLER (Saved)
// =========================================================================
// Loads and manages the consumer's saved bookmarks collection.
// Features:
// - Fetches saved foods from backend with populated food + partner data
// - Unsave (remove bookmark) with toast notification
// - Premium empty state when no bookmarks exist
// - Instant UI removal on unsave (no page reload needed)
const Saved = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── FETCH SAVED BOOKMARKS ON MOUNT ───
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/food/save", { 
          withCredentials: true 
        });
        
        // Map the saved documents into a flat video-friendly format
        // Each save document has: { _id, user, food: { ...foodDoc } }
        const savedFoods = (response.data.savedFoods || []).map((item) => ({
          _id: item.food._id,
          name: item.food.name,
          video: item.food.video,
          description: item.food.description,
          likeCount: item.food.likeCount,
          savesCount: item.food.savesCount,
          foodPartner: item.food.foodPartner,
          isSaved: true, // These are all saved by definition
        }));
        setVideos(savedFoods);
      } catch (err) {
        console.error("Failed fetching saved bookmarks list:", err);
        // Don't show error for empty saves (404 is expected)
        if (err.response?.status !== 404) {
          toast.error("Failed to load bookmarks");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  // ─── UNSAVE HANDLER ───
  // Removes a food item from bookmarks and instantly removes it from the list
  const removeSaved = async (item) => {
    // Optimistic: remove from UI immediately
    setVideos((prev) => prev.filter((v) => v._id !== item._id));

    try {
      await axios.post(
        "http://localhost:3000/api/food/save",
        { foodId: item._id },
        { withCredentials: true }
      );
      
      toast('🗑️ Removed from bookmarks', { 
        duration: 1500,
        style: { background: '#18181b', color: '#a1a1aa', border: '1px solid #27272a', fontSize: '11px', fontWeight: 700 }
      });
    } catch (error) {
      console.error("Failed removing bookmark selection:", error);
      toast.error("Failed to remove bookmark. Try again!");
      // Rollback: add item back to list
      setVideos((prev) => [...prev, { ...item, isSaved: true }]);
    }
  };

  return (
    <PageWrapper className="flex flex-col h-full bg-neutral-950">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full text-white space-y-4">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          <p className="text-xs font-black tracking-widest text-neutral-500 uppercase animate-pulse">
            Loading bookmarks...
          </p>
        </div>
      ) : (
        <ReelFeed
          items={videos}
          onSave={removeSaved}
          emptyMessage="You haven't bookmarked any street food reels yet! Go browse some delicious feeds."
        />
      )}
    </PageWrapper>
  );
};

export default Saved;
