import React from 'react'
import { Heart, Bookmark, MessageSquare, Share2, Volume2, VolumeX } from 'lucide-react'
import { cn } from '../../lib/utils'

// =========================================================================
// PREMIUM REEL ACTIONS COLUMN (FeedActions)
// =========================================================================
// Renders the absolute-positioned sidebar on video cards containing
// interactive buttons (Like, Save/Bookmark, Comment, Share, Mute).
const FeedActions = ({ 
  item, 
  isLiked, 
  isSaved, 
  isMuted, 
  onLikeClick, 
  onSaveClick, 
  onMuteClick,
  onCommentClick 
}) => {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center space-y-5 select-none pointer-events-auto">
      
      {/* Sound Toggle Action */}
      <button 
        onClick={(e) => { e.stopPropagation(); onMuteClick(); }}
        className="p-3 rounded-full bg-zinc-950/60 backdrop-blur-md border border-zinc-800 text-zinc-100 transition-all duration-300 hover:bg-zinc-900/80 hover:border-zinc-700 active:scale-90 cursor-pointer shadow-lg"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-4.5 h-4.5 text-zinc-400" /> : <Volume2 className="w-4.5 h-4.5 text-orange-500" />}
      </button>

      {/* Heart Like Action */}
      <div className="flex flex-col items-center">
        <button
          onClick={(e) => onLikeClick(e, item)}
          className={cn(
            "p-3 rounded-full bg-zinc-950/60 backdrop-blur-md border border-zinc-800 text-zinc-100 transition-all duration-300 hover:bg-zinc-900/80 hover:border-zinc-700 active:scale-90 cursor-pointer shadow-lg",
            isLiked && "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
          )}
          aria-label="Like"
        >
          <Heart className={cn("w-4.5 h-4.5 like-icon transition-transform duration-300", isLiked && "fill-current scale-110")} />
        </button>
        <span className="text-[10px] font-black text-zinc-300 mt-1.5 drop-shadow-sm">
          {item.likeCount ?? item.likesCount ?? 0}
        </span>
      </div>

      {/* Bookmark Save Action */}
      <div className="flex flex-col items-center">
        <button
          onClick={(e) => onSaveClick(e, item)}
          className={cn(
            "p-3 rounded-full bg-zinc-950/60 backdrop-blur-md border border-zinc-800 text-zinc-100 transition-all duration-300 hover:bg-zinc-900/80 hover:border-zinc-700 active:scale-90 cursor-pointer shadow-lg",
            isSaved && "bg-orange-500/10 border-orange-500/30 text-orange-500 hover:bg-orange-500/20"
          )}
          aria-label="Save"
        >
          <Bookmark className={cn("w-4.5 h-4.5 save-icon transition-transform duration-300", isSaved && "fill-current scale-110")} />
        </button>
        <span className="text-[10px] font-black text-zinc-300 mt-1.5 drop-shadow-sm">
          {item.savesCount ?? item.saves ?? 0}
        </span>
      </div>

      {/* Message Comments Action */}
      <div className="flex flex-col items-center">
        <button
          onClick={(e) => { e.stopPropagation(); if (onCommentClick) onCommentClick(item); }}
          className="p-3 rounded-full bg-zinc-950/60 backdrop-blur-md border border-zinc-800 text-zinc-100 transition-all duration-300 hover:bg-zinc-900/80 hover:border-zinc-700 active:scale-90 cursor-pointer shadow-lg"
          aria-label="Comments"
        >
          <MessageSquare className="w-4.5 h-4.5 text-zinc-300" />
        </button>
        <span className="text-[10px] font-black text-zinc-300 mt-1.5 drop-shadow-sm">
          {item.commentsCount ?? (Array.isArray(item.comments) ? item.comments.length : 0)}
        </span>
      </div>

      {/* Share Action */}
      <button
        onClick={(e) => { e.stopPropagation(); }}
        className="p-3 rounded-full bg-zinc-950/60 backdrop-blur-md border border-zinc-800 text-zinc-100 transition-all duration-300 hover:bg-zinc-900/80 hover:border-zinc-700 active:scale-90 cursor-pointer shadow-lg"
        aria-label="Share"
      >
        <Share2 className="w-4.5 h-4.5 text-zinc-300" />
      </button>

    </div>
  )
}

export default FeedActions
