import React from 'react'
import { Heart, Bookmark, Eye, Store } from 'lucide-react'
import { Link } from 'react-router-dom'

// =========================================================================
// REUSABLE REEL CARD PREVIEW (VideoCard)
// =========================================================================
// Renders static video preview card for reels feeds, bookmarks list,
// or search grids.
// - Supports hover-scaling transform behaviors
// - Integrates direct merchant links and visual metrics badges
const VideoCard = ({ item, onLike, onSave }) => {
  return (
    <article className="group bg-neutral-900 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1">
      
      {/* Video Preview Block */}
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-black select-none pointer-events-none">
        <video 
          src={item.video} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          muted 
          playsInline 
          preload="metadata"
        />
        
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-80" />

        {/* Floating Category Tag */}
        <span className="absolute top-3 left-3 bg-black/40 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-black uppercase text-orange-400 tracking-wider">
          {item.name || "Bestseller"}
        </span>
      </div>

      {/* Info details */}
      <div className="p-4 space-y-3">
        <div>
          <h4 className="text-sm font-extrabold text-white tracking-tight line-clamp-1">
            {item.name || "Delicious Bite"}
          </h4>
          <p className="text-xs text-neutral-400 font-medium line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          {item.foodPartner && (
            <Link 
              to={`/food-partner/${item.foodPartner}`}
              className="flex items-center space-x-1 text-[11px] font-bold text-neutral-300 hover:text-orange-500 transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-orange-500" />
              <span>Merchant Page</span>
            </Link>
          )}

          <div className="flex items-center space-x-3 text-[11px] font-extrabold text-neutral-400 select-none">
            <span className="flex items-center space-x-1">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
              <span>{item.likeCount ?? item.likesCount ?? 0}</span>
            </span>
          </div>
        </div>

      </div>

    </article>
  )
}

export default VideoCard
