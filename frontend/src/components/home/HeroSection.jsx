import React, { useEffect, useRef } from 'react'
import { Sparkles, ArrowRight, Play, Flame } from 'lucide-react'
import gsap from 'gsap'

// =========================================================================
// PREMIUM HERO SECTION PROMO BRANDING (HeroSection)
// =========================================================================
// Renders dynamic, high-fidelity promotional highlights for ByteBite's
// short-video commerce offerings. Features staggering entrances and glowing tokens.
const HeroSection = () => {
  const badgeRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    // Custom GSAP entrance spring/elastic animations on mounting
    gsap.fromTo(badgeRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
    )

    gsap.fromTo(titleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: "power3.out" }
    )
  }, [])

  return (
    <section className="relative w-full overflow-hidden select-none bg-neutral-950 px-6 pt-12 pb-6 text-center text-white">
      
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-orange-500/10 blur-[80px] pointer-events-none" />

      <div className="max-w-2xl mx-auto flex flex-col items-center space-y-4">
        
        {/* Animated Badge */}
        <div 
          ref={badgeRef}
          className="inline-flex items-center space-x-1.5 bg-orange-500/10 border border-orange-500/30 px-4.5 py-1.5 rounded-full text-orange-400 text-xs font-black uppercase tracking-wider"
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Bite-sized Commerce</span>
        </div>

        {/* Title */}
        <h2 
          ref={titleRef}
          className="text-3xl md:text-5xl font-black tracking-tight"
        >
          Order Directly From <br />
          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Your Favourite Reels
          </span>
        </h2>

        {/* Short info */}
        <p className="text-xs md:text-sm text-neutral-400 font-medium max-w-md leading-relaxed">
          Swipe through high-definition viral recipes and street food reels. Spot something you like? Order it directly with single-tap checkout.
        </p>

      </div>

    </section>
  )
}

export default HeroSection
