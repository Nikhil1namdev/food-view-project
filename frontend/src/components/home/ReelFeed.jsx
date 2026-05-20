import React, { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { animateFadeUp, animateStagger } from '../../animations/gsap'
import FeedOverlay from './FeedOverlay'
import FeedActions from './FeedActions'

// =========================================================================
// MODULAR VERTICAL REEL FEED COMPONENT (ReelFeed)
// =========================================================================
// Manages vertical layout feeds, snap-start scroll sequences, sound control state,
// and delegates individual overlay features and action sidebars to sub-components.
// Integrates:
// - Intersection Observer for precise video autoplay/pause binds
// - GSAP animation helpers for active text reveals and button spring pops
const ReelFeed = ({ items = [], onLike, onSave, emptyMessage = 'No videos active.' }) => {
  const videoRefs = useRef(new Map())
  const [isMuted, setIsMuted] = useState(true)
  const [activeVideoId, setActiveVideoId] = useState(null)

  useEffect(() => {
    // Autoplay/Pause logic bound to 60% dynamic view visibility
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target
          if (!(video instanceof HTMLVideoElement)) return
          
          const videoId = video.dataset.id

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => {})
            setActiveVideoId(videoId)
            
            // Premium entrance reveals using GSAP standard models
            const parent = video.closest('.reel-section')
            if (parent) {
              const details = parent.querySelector('.reel-details-container')
              const actions = parent.querySelectorAll('.reel-action-container button')
              
              if (details) animateFadeUp(details, { delay: 0.1, overwrite: "auto" })
              if (actions.length > 0) animateStagger(actions, { delay: 0.2, overwrite: "auto" })
            }
          } else {
            video.pause()
          }
        })
      },
      { threshold: [0.6] }
    )

    videoRefs.current.forEach((vid) => observer.observe(vid))
    return () => observer.disconnect()
  }, [items])

  const setVideoRef = (id) => (el) => {
    if (!el) { videoRefs.current.delete(id); return }
    videoRefs.current.set(id, el)
  }

  const toggleMute = () => {
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    videoRefs.current.forEach((vid) => {
      vid.muted = nextMuted
    })
  }

  const handleLikeClick = async (e, item) => {
    e.stopPropagation()
    if (onLike) await onLike(item)
  }

  const handleSaveClick = async (e, item) => {
    e.stopPropagation()
    if (onSave) await onSave(item)
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#050507] rounded-xl md:rounded-2xl overflow-hidden relative group">
      {/* Cinematic ambient radial glow */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(249,115,22,0.12)_0%,_rgba(5,5,7,1)_60%)] opacity-80 transition-opacity duration-700" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black to-transparent z-0" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black to-transparent z-0" />
      
      <div 
        className="w-full h-full max-w-[420px] bg-black md:rounded-2xl border-x md:border border-zinc-900 shadow-[0_0_60px_rgba(249,115,22,0.05)] overflow-y-scroll snap-y snap-mandatory scrollbar-none relative z-10" 
        role="list"
      >
        
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center text-zinc-500">
            <Play className="w-12 h-12 mb-4 text-orange-500/20 animate-pulse" />
            <p className="text-sm font-semibold">{emptyMessage}</p>
          </div>
        )}

        {items.map((item) => {
          // Read like/save status directly from the item
          // (set by parent's optimistic state management)
          const isLiked = item.isLiked || false
          const isSaved = item.isSaved || false

          return (
            <section 
              key={item._id} 
              onClick={toggleMute}
              className="reel-section w-full h-full snap-start snap-always relative overflow-hidden flex items-center justify-center group cursor-pointer" 
              role="listitem"
            >
              
              {/* Fullscreen Video Element (Absolute to prevent flex-shrinking issues) */}
              <video
                ref={setVideoRef(item._id)}
                data-id={item._id}
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0"
                src={item.video}
                muted={isMuted}
                playsInline
                loop
                preload="metadata"
              />

              {/* OVERLAYS MUST BE ABSOLUTE TO NOT DISTURB FLEX LAYOUT */}
              
              {/* Modular Food Details Overlay */}
              <div className="reel-details-container absolute inset-0 z-20 pointer-events-none">
                <div className="pointer-events-auto">
                  <FeedOverlay 
                    name={item.name} 
                    description={item.description} 
                    foodPartner={item.foodPartner} 
                  />
                </div>
              </div>

              {/* Modular Action Sidebar */}
              <div className="reel-action-container absolute inset-0 z-30 pointer-events-none">
                <div className="pointer-events-auto w-full h-full">
                  <FeedActions 
                    item={item}
                    isLiked={isLiked}
                    isSaved={isSaved}
                    isMuted={isMuted}
                    onLikeClick={handleLikeClick}
                    onSaveClick={handleSaveClick}
                    onMuteClick={toggleMute}
                  />
                </div>
              </div>

            </section>
          )
        })}

      </div>
    </div>
  )
}

export default ReelFeed
