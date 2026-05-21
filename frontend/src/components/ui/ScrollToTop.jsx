import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Reusable animated Scroll-To-Top button that fades/slides in.
 * Operates with smooth scroll physics and handles listeners performance-safely.
 */
export default function ScrollToTop({ threshold = 300, className }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Passive listener optimized for fluid scrolling frames
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Garbage collection on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-20 md:bottom-8 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 dark:shadow-orange-500/10 outline-none transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer",
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-4 opacity-0 pointer-events-none",
        className
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
