import React, { useEffect, useState } from "react";
import axios from "axios";
import ReelFeed from "../../components/home/ReelFeed";
import PageWrapper from "../../layouts/PageWrapper";

// =========================================================================
// CUSTOMER BOOKMARKS VIEW CONTROLLER (Saved)
// =========================================================================
// Loads and manages the consumer's saved bookmarks collection.
// Wraps renders under:
// - PageWrapper: custom GSAP load transitions
// - ReelFeed: modular vertical short-video feed with scroll-snapping
const Saved = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Retrieve bookmark entries on component mounting
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/food/save", { 
          withCredentials: true 
        });
        
        const savedFoods = (response.data.savedFoods || []).map((item) => ({
          _id: item.food._id,
          video: item.food.video,
          description: item.food.description,
          likeCount: item.food.likeCount,
          savesCount: item.food.savesCount,
          commentsCount: item.food.commentsCount,
          foodPartner: item.food.foodPartner,
        }));
        setVideos(savedFoods);
      } catch (err) {
        console.error("Failed fetching saved bookmarks list:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  // Remove item from saved bookmarks list and toggle local visibility
  const removeSaved = async (item) => {
    try {
      await axios.post(
        "http://localhost:3000/api/food/save",
        { foodId: item._id },
        { withCredentials: true }
      );
      
      // Update bookmarks locally
      setVideos((prev) => prev.filter((v) => v._id !== item._id));
    } catch (error) {
      console.error("Failed removing bookmark selection:", error);
    }
  };

  return (
    <PageWrapper className="flex flex-col h-full bg-neutral-950">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full text-white">
          <div className="animate-pulse text-xs font-black uppercase tracking-widest text-neutral-500">
            Loading bookmarks...
          </div>
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
