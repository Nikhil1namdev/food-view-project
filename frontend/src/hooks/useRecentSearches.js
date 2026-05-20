import { useCallback, useState } from "react";

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState(() => {
    return JSON.parse(localStorage.getItem("recentSearches") || "[]");
  });

  const addSearch = useCallback((term) => {
    if (!term || !term.trim()) return;
    const cleanTerm = term.trim();
    
    setRecentSearches((prev) => {
      // Remove any existing copy to prevent duplicates, then place it at the very top (index 0)
      const filtered = prev.filter(
        (item) => item.toLowerCase() !== cleanTerm.toLowerCase()
      );
      const updated = [cleanTerm, ...filtered].slice(0, 5); // Restrict to latest 5 searches
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeSearch = useCallback((term) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== term);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    localStorage.removeItem("recentSearches");
    setRecentSearches([]);
  }, []);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearAll,
  };
}
