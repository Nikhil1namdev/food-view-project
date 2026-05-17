import React from 'react'
import { Link } from 'react-router-dom'
import { Store, ArrowUpRight } from 'lucide-react'

// =========================================================================
// PREMIUM REEL DETAILS OVERLAY (FeedOverlay)
// =========================================================================
// Renders absolute text descriptions, titles, and partner links for each
// vertical video. Designed with a smooth black gradient overlay base.
const FeedOverlay = ({ name, description, foodPartner }) => {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 pt-24 select-none text-white z-20 flex flex-col space-y-3.5 pr-20">
      
      {/* Dynamic Merchant Tag */}
      {foodPartner && (
        <Link 
          to={`/food-partner/${foodPartner._id || foodPartner}`} 
          onClick={(e) => e.stopPropagation()}
          className="flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 backdrop-blur-md px-3.5 py-1.5 rounded-full w-fit text-[10px] font-black uppercase tracking-wider text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/30 transition-all duration-300 active:scale-95 group"
        >
          <Store className="w-3.5 h-3.5 group-hover:rotate-6 transition-transform" />
          <span>Visit {foodPartner.name || "Partner Store"}</span>
          <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      )}

      {/* Info Context Area */}
      <div className="space-y-1.5 text-left">
        <h3 className="text-base font-extrabold tracking-tight leading-tight">
          {name || "Delicious Byte"}
        </h3>
        <p className="text-xs text-zinc-300/90 font-medium line-clamp-2 leading-relaxed max-w-[280px]">
          {description || "Explore delicious bites nearby."}
        </p>
      </div>

    </div>
  )
}

export default FeedOverlay
