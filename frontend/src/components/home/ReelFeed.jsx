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
  
  // Track actions locally for responsive visual state feedback
  const [userActions, setUserActions] = useState({ liked: {}, saved: {} })

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
    if (onLike) {
      await onLike(item)
      setUserActions(prev => ({
        ...prev,
        liked: { ...prev.liked, [item._id]: !prev.liked[item._id] }
      }))
    }
  }

  const handleSaveClick = async (e, item) => {
    e.stopPropagation()
    if (onSave) {
      await onSave(item)
      setUserActions(prev => ({
        ...prev,
        saved: { ...prev.saved, [item._id]: !prev.saved[item._id] }
      }))
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-black/95">
      <div 
        className="w-full h-[calc(100vh-4rem)] md:h-[90vh] max-w-[420px] bg-black md:rounded-2xl border border-zinc-900 md:shadow-2xl overflow-y-scroll snap-y snap-mandatory scrollbar-none relative" 
        role="list"
      >
        
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center text-zinc-500">
            <Play className="w-12 h-12 mb-4 text-orange-500/20 animate-pulse" />
            <p className="text-sm font-semibold">{emptyMessage}</p>
          </div>
        )}

        {items.map((item) => {
          const isLiked = userActions.liked[item._id] || item.isLiked
          const isSaved = userActions.saved[item._id] || item.isSaved

          return (
            <section 
              key={item._id} 
              onClick={toggleMute}
              className="reel-section w-full h-full snap-start snap-always relative overflow-hidden flex items-center justify-center group cursor-pointer" 
              role="listitem"
            >
              
              {/* Fullscreen Video Element */}
              <video
                ref={setVideoRef(item._id)}
                data-id={item._id}
                className="w-full h-full object-cover select-none pointer-events-none"
                src={item.video}
                muted={isMuted}
                playsInline
                loop
                preload="metadata"
              />

              {/* Modular Food Details Overlay */}
              <div className="reel-details-container w-full">
                <FeedOverlay 
                  name={item.name} 
                  description={item.description} 
                  foodPartner={item.foodPartner} 
                />
              </div>

              {/* Modular Action Sidebar */}
              <div className="reel-action-container">
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

            </section>
          )
        })}

      </div>
    </div>
  )
}

export default ReelFeed
