import React, { useState, useRef, useEffect } from "react";
import { Search, X, Clock, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { useRecentSearches } from "../../hooks/useRecentSearches";

export default function FeedSearchBar({
  value,
  onChange,
  placeholder = "Search dishes, restaurants, cuisines…",
  className,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const { recentSearches, addSearch, removeSearch, clearAll } = useRecentSearches();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && value.trim()) {
      addSearch(value);
      setIsFocused(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const handleRecentClick = (term) => {
    onChange(term);
    addSearch(term);
    setIsFocused(false);
  };

  const handleRemoveClick = (e, term) => {
    e.stopPropagation();
    removeSearch(term);
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    clearAll();
  };

  return (
    <div ref={containerRef} className={cn("relative w-full z-30", className)}>
      <div className="relative w-full">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-neutral-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 py-3 pl-11 pr-11 text-sm text-neutral-800 dark:text-zinc-100 placeholder:text-zinc-500 outline-none transition-all focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/15"
          aria-label="Search food"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setIsFocused(true);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-zinc-500 transition-colors hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-zinc-300"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Recent Searches Dropdown */}
      {isFocused && recentSearches.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-neutral-200/80 dark:border-zinc-800 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md shadow-lg py-2 transition-all duration-300">
          <div className="flex items-center justify-between px-4 py-1.5 border-b border-neutral-100 dark:border-zinc-900/50 text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500 select-none">
            <span>Recent Searches</span>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-red-500 hover:text-red-600 transition-colors cursor-pointer font-black"
            >
              Clear All
            </button>
          </div>

          <ul className="flex flex-col mt-1">
            {recentSearches.map((term, index) => (
              <li
                key={index}
                onClick={() => handleRecentClick(term)}
                className="flex items-center justify-between px-4 py-2 hover:bg-neutral-100 dark:hover:bg-zinc-800/50 text-xs font-semibold text-neutral-700 dark:text-zinc-300 cursor-pointer transition-colors group"
              >
                <div className="flex items-center">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 mr-2.5 flex-shrink-0 group-hover:text-orange-500 transition-colors" />
                  <span>{term}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleRemoveClick(e, term)}
                  className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-200 dark:hover:bg-zinc-700 hover:text-red-500 transition-colors"
                  aria-label={`Remove search term ${term}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
