import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Bookmark, MessageSquare, Volume2, VolumeX, Store, Play } from 'lucide-react'
import { cn } from '../lib/utils'
import gsap from 'gsap'

// =========================================================================
// PREMIUM VERTICAL REEL FEED COMPONENT (GSAP Powered)
// =========================================================================
// Renders an immersive TikTok/Instagram-style vertical full-screen video feed.
// Integrates:
// - Intersection Observer for smart auto-play/pause
// - GSAP for high-fidelity animations (bouncy entry animations on scroll)
// - Tactile feedback states (Tap-to-mute overlay, animated action triggers)
const ReelFeed = ({ items = [], onLike, onSave, emptyMessage = 'No videos yet.' }) => {
  const videoRefs = useRef(new Map())
  const [isMuted, setIsMuted] = useState(true)
  const [activeVideoId, setActiveVideoId] = useState(null)
  
  // Custom tracking to handle optimistic visual states for likes/saves
  const [userActions, setUserActions] = useState({ liked: {}, saved: {} })

  // Smart Autoplay: Intersection Observer tracks active videos in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target
          if (!(video instanceof HTMLVideoElement)) return
          
          const videoId = video.dataset.id

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => { /* Autoplay block prevention */ })
            setActiveVideoId(videoId)
            
            // GSAP Stagger Entrance: Premium animation on reel entry
            const parent = video.closest('.reel-section')
            if (parent) {
              const details = parent.querySelector('.reel-details')
              const actions = parent.querySelectorAll('.reel-action-btn')
              
              gsap.fromTo(details, 
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", overwrite: "auto" }
              )
              
              gsap.fromTo(actions,
                { scale: 0.7, opacity: 0, rotation: -15 },
                { scale: 1, opacity: 1, rotation: 0, duration: 0.5, stagger: 0.08, ease: "back.out(1.8)", overwrite: "auto" }
              )
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

  // Mute control helper for unified sound across all reels
  const toggleMute = () => {
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    videoRefs.current.forEach((vid) => {
      vid.muted = nextMuted
    })
  }

  // Like click feedback (Bouncy pop effect on button click)
  const handleLikeClick = async (e, item) => {
    e.stopPropagation()
    const target = e.currentTarget.querySelector('.like-icon')
    
    // Tap bounce animation
    gsap.fromTo(target, 
      { scale: 0.8 }, 
      { scale: 1.3, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out" }
    )

    if (onLike) {
      await onLike(item)
      setUserActions(prev => ({
        ...prev,
        liked: { ...prev.liked, [item._id]: !prev.liked[item._id] }
      }))
    }
  }

  // Save click feedback (Bouncy pop effect on button click)
  const handleSaveClick = async (e, item) => {
    e.stopPropagation()
    const target = e.currentTarget.querySelector('.save-icon')
    
    // Tap bounce animation
    gsap.fromTo(target, 
      { scale: 0.8 }, 
      { scale: 1.3, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out" }
    )

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
        className="w-full h-[calc(100vh-4rem)] md:h-[90vh] max-w-[440px] bg-black md:rounded-2xl border border-white/10 md:shadow-2xl overflow-y-scroll snap-y snap-mandatory scrollbar-none relative" 
        role="list"
      >
        
        {/* Floating Global Audio Controller */}
        <button 
          onClick={toggleMute}
          className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-all duration-300 cursor-pointer active:scale-95"
          aria-label={isMuted ? "Unmute sound" : "Mute sound"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center text-muted-foreground select-none">
            <Play className="w-12 h-12 mb-4 text-primary/40 animate-pulse" />
            <p className="text-sm font-semibold">{emptyMessage}</p>
          </div>
        )}

        {/* Dynamic Infinite Reels Mapping */}
        {items.map((item) => {
          const isLiked = userActions.liked[item._id]
          const isSaved = userActions.saved[item._id]

          return (
            <section 
              key={item._id} 
              onClick={toggleMute}
              className="reel-section w-full h-full snap-start snap-always relative overflow-hidden flex items-center justify-center group cursor-pointer" 
              role="listitem"
            >
              
              {/* Premium HTML5 loop video */}
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

              {/* Responsive Interface Overlays */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-black/10 p-5 select-none">
                
                {/* Overlay Inner Flexbox */}
                <div className="flex justify-between items-end w-full space-x-4">
                  
                  {/* Left Side: Merchant brand & Description details */}
                  <div className="reel-details flex-1 flex flex-col space-y-3 pb-2 pr-4 text-white">
                    
                    {item.foodPartner && (
                      <Link 
                        to={`/food-partner/${item.foodPartner}`} 
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full w-fit transition-all duration-300 cursor-pointer active:scale-95 group"
                      >
                        <Store className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-xs font-black tracking-tight">Visit Partner Store</span>
                      </Link>
                    )}

                    <div>
                      <h3 className="text-base font-extrabold tracking-tight">
                        {item.name || "Special Byte"}
                      </h3>
                      <p className="text-xs text-white/85 font-medium line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                  </div>

                  {/* Right Side: Fluid Action Buttons */}
                  <div className="flex flex-col space-y-4 items-center">
                    
                    {/* Like Action */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={(e) => handleLikeClick(e, item)}
                        className={cn(
                          "reel-action-btn p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white transition-all duration-300 hover:bg-white/20 active:scale-90 cursor-pointer",
                          isLiked && "bg-red-500/20 border-red-500/40 text-red-500 hover:bg-red-500/30"
                        )}
                        aria-label="Like post"
                      >
                        <Heart className={cn("w-5 h-5 like-icon transition-transform duration-300", isLiked && "fill-current scale-110")} />
                      </button>
                      <span className="text-[10px] font-extrabold text-white/90 mt-1.5 shadow-sm">
                        {item.likeCount ?? item.likesCount ?? 0}
                      </span>
                    </div>

                    {/* Save Action */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={(e) => handleSaveClick(e, item)}
                        className={cn(
                          "reel-action-btn p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white transition-all duration-300 hover:bg-white/20 active:scale-90 cursor-pointer",
                          isSaved && "bg-amber-500/20 border-amber-500/40 text-amber-500 hover:bg-amber-500/30"
                        )}
                        aria-label="Bookmark post"
                      >
                        <Bookmark className={cn("w-5 h-5 save-icon transition-transform duration-300", isSaved && "fill-current scale-110")} />
                      </button>
                      <span className="text-[10px] font-extrabold text-white/90 mt-1.5 shadow-sm">
                        {item.savesCount ?? item.saves ?? 0}
                      </span>
                    </div>

                    {/* Comments Action (Placeholder navigation/trigger) */}
                    <div className="flex flex-col items-center">
                      <button
                        className="reel-action-btn p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white transition-all duration-300 hover:bg-white/20 active:scale-90 cursor-pointer"
                        aria-label="Comments"
                      >
                        <MessageSquare className="w-5 h-5" />
                      </button>
                      <span className="text-[10px] font-extrabold text-white/90 mt-1.5 shadow-sm">
                        {item.commentsCount ?? (Array.isArray(item.comments) ? item.comments.length : 0)}
                      </span>
                    </div>

                  </div>

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
