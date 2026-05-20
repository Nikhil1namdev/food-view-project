import React from "react";
import ReelFeed from "../../components/home/ReelFeed";
import PageWrapper from "../../layouts/PageWrapper";
import { Loader2 } from "lucide-react";
import { useFoodList } from "../../hooks/useFoodList";

// =========================================================================
// CUSTOMER BOOKMARKS VIEW CONTROLLER (Saved)
// =========================================================================
// Loads and manages the consumer's saved bookmarks collection locally.
// Features:
// - Retreives saved foods using modular useFoodList hook (localStorage based)
// - Premium dark theme layout consistent with the platform
// - Live reactive feed filtering on save/unsave toggling
// - Styled empty state when no saved items are present
const Saved = () => {
  const { foods, loading, toggleLike, toggleSave } = useFoodList();

  // Filter to show only saved items
  const savedFoods = foods.filter((item) => item.isSaved);

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
        <div className="flex-1 w-full h-[calc(100dvh-4rem)]">
          <ReelFeed
            items={savedFoods}
            onLike={toggleLike}
            onSave={toggleSave}
            emptyMessage="No saved foods yet"
          />
        </div>
      )}
    </PageWrapper>
  );
};

export default Saved;
