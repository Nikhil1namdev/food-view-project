import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { UtensilsCrossed } from 'lucide-react'
import PageWrapper from '../../layouts/PageWrapper'
import gsap from 'gsap'

// =========================================================================
// CINEMATIC PREMIUM AUTH LAYOUT WRAPPER (AuthLayout)
// =========================================================================
// Serves as the ultimate immersive onboarding shell for ByteBite.
// Features:
// - Apple-style layered dark radial backgrounds
// - Technical subtle grid alignment mask
// - Hardware-accelerated GSAP floating ambient glow blobs
// - Analog noise grain texture overlay for high-fidelity contrast
const AuthLayout = ({ children, title = "Welcome to ByteBite", subtitle = "Your gateway to bite-sized food commerce." }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    // Dynamic spring entrances on form mount
    const ctx = gsap.context(() => {
      // 1. Staggered elements slide up
      gsap.fromTo(".auth-element", 
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: "power3.out" }
      )

      // 2. Slow sinusoidal floating motion for glow blobs (Hardware accelerated)
      gsap.to(".glow-blob-orange", {
        x: "50px",
        y: "-30px",
        scale: 1.15,
        duration: 16,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      gsap.to(".glow-blob-red", {
        x: "-40px",
        y: "40px",
        scale: 0.9,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      gsap.to(".glow-blob-zinc", {
        x: "30px",
        y: "20px",
        scale: 1.05,
        duration: 24,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    }, containerRef)
    
    return () => ctx.revert()
  }, [])

  return (
    <PageWrapper>
      <div 
        ref={containerRef}
        className="relative min-h-screen w-screen flex flex-col items-center justify-center bg-[#050507] overflow-y-auto px-6 py-12 text-white select-none"
      >
        
        {/* Layer 1: Ambient Cinema Spotlight (Focuses light behind the card) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(24,24,27,0.35)_0%,_rgba(5,5,7,1)_70%)] pointer-events-none z-0" />
        
        {/* Layer 2: Technical Grid Alignment Mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

        {/* Layer 3: Hardware-Accelerated Floating Blur Blobs */}
        <div className="glow-blob-orange absolute top-1/4 left-1/3 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-orange-500/[0.025] blur-[100px] pointer-events-none z-0" />
        <div className="glow-blob-red absolute bottom-1/4 right-1/3 translate-x-1/2 w-[400px] h-[400px] rounded-full bg-red-600/[0.015] blur-[120px] pointer-events-none z-0" />
        <div className="glow-blob-zinc absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full bg-zinc-500/[0.01] blur-[90px] pointer-events-none z-0" />

        {/* Layer 4: Analog Noise Grain overlay (Adds subtle high-fidelity physical texture) */}
        <div 
          className="absolute inset-0 opacity-[0.012] pointer-events-none mix-blend-overlay z-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        {/* Layer 5: Global Branding Header */}
        <div className="auth-element flex flex-col items-center mb-8 text-center z-10">
          <Link to="/" className="flex items-center space-x-2 bg-orange-500/5 border border-orange-500/15 px-4 py-2 rounded-2xl mb-4 hover:bg-orange-500/10 active:scale-95 transition-all duration-300">
            <UtensilsCrossed className="w-5 h-5 text-orange-500/80" />
            <span className="text-xs font-black tracking-tight text-zinc-100">ByteBite Brand</span>
          </Link>
          <h1 className="text-3xl font-black bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent tracking-tighter">
            {title}
          </h1>
          <p className="text-xs text-neutral-400 font-semibold mt-1.5 max-w-xs leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Layer 6: Forms Render Area */}
        <div className="auth-element w-full max-w-sm z-10">
          {children}
        </div>

      </div>
    </PageWrapper>
  )
}

export default AuthLayout
