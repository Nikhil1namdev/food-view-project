import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Play, Sparkles, Store, Flame, UtensilsCrossed } from 'lucide-react'
import gsap from 'gsap'

// =========================================================================
// PREMIUM DISCOVERY EMPTY FEED COMPONENT (EmptyFeed)
// =========================================================================
// Renders a high-end cinematic onboarding display when the active reels
// feed array is empty.
// Features:
// - Subtle analog noise grid backdrop mapping
// - 3D floating visual mockups using premium gradients & spring loops
// - Balanced glow beacons and clear merchant CTAs
const EmptyFeed = () => {
  const containerRef = useRef(null)
  const floatCard1 = useRef(null)
  const floatCard2 = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Sleek fade-up entrance triggers
      gsap.fromTo(".animate-fade-up", 
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: "power3.out" }
      )

      // 2. Slow continuous floating mechanical loops
      gsap.to(floatCard1.current, {
        y: -14,
        rotation: 6,
        duration: 3.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      })

      gsap.to(floatCard2.current, {
        y: 12,
        rotation: -4,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 0.4
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] md:min-h-screen w-full bg-[#050507] overflow-hidden px-6 text-white py-16 select-none"
    >
      
      {/* Layer 1: Ambient Cinema Spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(24,24,27,0.35)_0%,_rgba(5,5,7,1)_70%)] pointer-events-none z-0" />
      
      {/* Layer 2: Technical Grid Alignment Mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Layer 3: Elegant Soft Glow Badges */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-orange-500/[0.03] blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[250px] h-[250px] rounded-full bg-red-600/[0.015] blur-[100px] pointer-events-none z-0" />

      {/* Layer 4: Analog Noise Grain overlay */}
      <div 
        className="absolute inset-0 opacity-[0.012] pointer-events-none mix-blend-overlay z-0" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* 🍕 FLOATING DECORATIVE CARD 1 */}
      <div 
        ref={floatCard1}
        className="absolute top-24 left-[10%] hidden lg:flex flex-col bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-4 rounded-2xl w-48 shadow-2xl rotate-3 select-none pointer-events-none z-10"
      >
        <div className="w-full h-28 bg-gradient-to-tr from-orange-500/80 to-amber-400/80 rounded-xl mb-3 flex items-center justify-center">
          <Flame className="w-10 h-10 text-white animate-pulse" />
        </div>
        <div className="h-3 w-3/4 bg-white/20 rounded mb-1.5" />
        <div className="h-2.5 w-1/2 bg-white/10 rounded" />
      </div>

      {/* 🍔 FLOATING DECORATIVE CARD 2 */}
      <div 
        ref={floatCard2}
        className="absolute bottom-24 right-[10%] hidden lg:flex flex-col bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-4 rounded-2xl w-48 shadow-2xl -rotate-6 select-none pointer-events-none z-10"
      >
        <div className="w-full h-28 bg-gradient-to-tr from-red-600/80 to-pink-500/80 rounded-xl mb-3 flex items-center justify-center">
          <UtensilsCrossed className="w-10 h-10 text-white animate-pulse" />
        </div>
        <div className="h-3 w-2/3 bg-white/20 rounded mb-1.5" />
        <div className="h-2.5 w-1/3 bg-white/10 rounded" />
      </div>

      {/* CONTENT BLOCK */}
      <div className="flex flex-col items-center text-center max-w-xl z-20 space-y-6">
        
        {/* Glow Badge */}
        <div className="animate-fade-up inline-flex items-center space-x-1.5 bg-orange-500/5 border border-orange-500/15 px-4 py-1.5 rounded-full text-orange-400 text-xs font-black uppercase tracking-wider shadow-sm select-none">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ByteBite Premiere</span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Discover Viral <br />
          <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Food Reels 🍔
          </span>
        </h1>

        {/* Subheading */}
        <p className="animate-fade-up text-xs md:text-sm text-neutral-400 font-medium max-w-md leading-relaxed">
          TikTok-style short video commerce is here. Browse delicious local bites, swipe reels, and order your next meal directly from merchants near you!
        </p>

        {/* CTA Actions */}
        <div className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-4">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-sm px-8 py-3.5 rounded-2xl w-full sm:w-auto shadow-xl shadow-orange-500/10 active:scale-95 transition-all duration-300"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Refresh Feed</span>
          </button>

          <Link 
            to="/food-partner/register" 
            className="flex items-center justify-center space-x-2 bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-white font-extrabold text-sm px-8 py-3.5 rounded-2xl w-full sm:w-auto active:scale-95 transition-all duration-300 group"
          >
            <Store className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
            <span>Upload as Merchant</span>
          </Link>
        </div>

      </div>

    </div>
  )
}

export default EmptyFeed
