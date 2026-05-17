import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Play, Flame, ArrowRight, Heart, Bookmark, Eye, Star, Store, Sparkles, ChefHat } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP ScrollTrigger plugin safely
gsap.registerPlugin(ScrollTrigger)

// =========================================================================
// PREMIUM CINEMATIC PORTAL ENTRY (LandingPage)
// =========================================================================
// The front door of the ByteBite platform. Designed with premium dark grids,
// radial spotlights, glassmorphic bento blocks, and interactive GSAP reveals.
//
// UX Goal:
// - Educate new users immediately on the TikTok + Zomato hybrid value proposition.
// - Auto-route already logged-in users directly to their workspace (reels feed or dashboard).
const LandingPage = () => {
  const { isAuthenticated, role, user, loading } = useAuth()
  const navigate = useNavigate()
  
  const heroRef = useRef(null)
  const cardsRef = useRef(null)
  const featuresRef = useRef(null)
  const partnerRef = useRef(null)

  // ─── 1. AUTO-ROUTE AUTHENTICATED SESSIONS ───
  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (role === 'partner') {
        navigate(`/food-partner/${user?._id || user?.id}`, { replace: true })
      } else {
        navigate('/feed', { replace: true })
      }
    }
  }, [isAuthenticated, role, user, loading, navigate])

  // ─── 2. GSAP SCROLL & ENTRANCE ANIMATIONS ───
  useEffect(() => {
    // Prevent animation timeline initialization if elements aren't mounted
    if (!heroRef.current) return

    // Clean initial styles for clean fade-in sequence
    const heroElements = heroRef.current.querySelectorAll('.hero-fade')
    gsap.set(heroElements, { opacity: 0, y: 30 })

    // Hero Entrance Timeline
    const tl = gsap.timeline()
    tl.to(heroElements, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    })

    // Floating animation for mockup reels cards
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.floating-card')
      cards.forEach((card, idx) => {
        gsap.to(card, {
          y: idx % 2 === 0 ? '-=15' : '+=15',
          duration: 3 + idx,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: idx * 0.2
        })
      })
    }

    // Scroll reveal for Bento features
    if (featuresRef.current) {
      const bentoItems = featuresRef.current.querySelectorAll('.bento-fade')
      gsap.fromTo(bentoItems,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
          }
        }
      )
    }

    // Scroll reveal for Partner CTA Callout
    if (partnerRef.current) {
      gsap.fromTo(partnerRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: partnerRef.current,
            start: 'top 85%',
          }
        }
      )
    }

    // Clean up ScrollTrigger instances on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [loading, isAuthenticated])

  // Show a blank loader window only during the fast redirect check
  if (loading || isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 text-white select-none space-y-6">
        <div className="custom-loader"></div>
        <p className="text-[10px] font-black tracking-widest text-zinc-500 uppercase animate-pulse">
          Serving deliciousness...
        </p>
      </div>
    )
  }

  // ─── MOCK REEL PREVIEW DATA ───
  const mockReels = [
    {
      id: 1,
      chef: 'Chef Nitin',
      kitchen: "Nitin's Spice Kitchen",
      dish: 'Smoke-Infused Butter Chicken 🍛',
      likes: '12.4K',
      views: '58K',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces',
      thumb: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=400&h=600&fit=crop',
    },
    {
      id: 2,
      chef: 'Nikhil Namdev',
      kitchen: 'Varanasi Chaat Bhandar 🥟',
      dish: 'Dynamic Flame-Roasted Street Tacos 🔥',
      likes: '9.8K',
      views: '42K',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=faces',
      thumb: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=600&fit=crop',
    },
    {
      id: 3,
      chef: 'Sunil Masterchef',
      kitchen: 'Sunil Cheesy Corner 🍔',
      dish: 'Cheese-Explosion Volcano Burger 🧀',
      likes: '18.2K',
      views: '89K',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
      thumb: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=600&fit=crop',
    }
  ]

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans overflow-x-hidden relative select-none">
      
      {/* 🔮 CINEMATIC AMBIENCE GRADIENTS */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,_rgba(249,115,22,0.07)_0%,_transparent_65%)] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,_rgba(239,68,68,0.05)_0%,_transparent_70%)] pointer-events-none z-0" />
      
      {/* Technical Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* ─── PREMIUM GLASS HEADER ─── */}
      <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-white/5 bg-[#050507]/75 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent tracking-tighter">
              ByteBite
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-black uppercase tracking-widest text-neutral-400">
            <a href="#preview" className="hover:text-white transition-colors duration-200">Mock Reels</a>
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#partners" className="hover:text-white transition-colors duration-200">Partner Program</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link 
              to="/user/login" 
              className="text-neutral-300 hover:text-white font-black text-xs px-4 py-2 rounded-xl transition-all duration-300"
            >
              Log In
            </Link>
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/10 transition-all duration-300 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO CINEMATIC SECTION ─── */}
      <section ref={heroRef} className="max-w-6xl mx-auto px-6 pt-20 pb-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
          
          <div className="hero-fade inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 px-3.5 py-1.5 rounded-full w-fit">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest uppercase text-orange-400">
              Introducing vertical street food commerce
            </span>
          </div>

          <h1 className="hero-fade text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Discover Viral <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Food Reels</span> Near You 🍔
          </h1>

          <p className="hero-fade text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
            ByteBite connects hungry street food lovers with nearby home kitchens and cloud chefs. Swipe vertical-video reels, watch preparation secrets live, and explore local kitchens instantly.
          </p>

          <div className="hero-fade flex flex-wrap gap-4 pt-2">
            <Link 
              to="/user/login"
              className="group flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xs px-6 py-3.5 rounded-2xl shadow-lg shadow-orange-500/15 active:scale-95 transition-all duration-300"
            >
              <span>Explore Live Reels</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            
            <Link 
              to="/food-partner/register"
              className="flex items-center space-x-2 bg-zinc-900 border border-white/5 hover:border-white/10 hover:bg-zinc-800 text-neutral-300 hover:text-white font-black text-xs px-6 py-3.5 rounded-2xl transition-all duration-300 active:scale-95"
            >
              <Store className="w-4 h-4" />
              <span>Become a Partner</span>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="hero-fade grid grid-cols-3 gap-6 border-t border-white/5 pt-8 mt-4 max-w-lg">
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">100%</p>
              <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Video Driven</span>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">10K+</p>
              <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Food Swipers</span>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">O(1)</p>
              <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Visual Order</span>
            </div>
          </div>

        </div>

        {/* ─── DYNAMIC FLOATING CARDS MOCKUP ─── */}
        <div ref={cardsRef} className="lg:col-span-5 relative h-[500px] w-full hidden sm:flex items-center justify-center">
          
          {/* Card 1 */}
          <div className="floating-card absolute top-[10%] left-[5%] w-[200px] h-[300px] glass-card rounded-2xl overflow-hidden p-2.5 z-10 origin-bottom shadow-2xl scale-95 border-orange-500/10">
            <div className="w-full h-full relative rounded-xl overflow-hidden">
              <img src={mockReels[0].thumb} alt="Mock Food" className="w-full h-full object-cover filter brightness-[0.75]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 flex flex-col space-y-1">
                <span className="text-[9px] font-extrabold text-orange-400 uppercase tracking-widest truncate">{mockReels[0].chef}</span>
                <p className="text-[10px] font-black leading-snug text-white line-clamp-2">{mockReels[0].dish}</p>
              </div>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-2.5 text-white/80">
                <div className="flex flex-col items-center"><Heart className="w-3.5 h-3.5 text-red-500 fill-current" /><span className="text-[7px] font-black mt-0.5">{mockReels[0].likes}</span></div>
                <div className="flex flex-col items-center"><Bookmark className="w-3.5 h-3.5 text-orange-500 fill-current" /><span className="text-[7px] font-black mt-0.5">Save</span></div>
              </div>
            </div>
          </div>

          {/* Card 2 (Core Featured Card) */}
          <div className="floating-card absolute w-[240px] h-[360px] glass-card rounded-2xl overflow-hidden p-2.5 z-20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-orange-500/20">
            <div className="w-full h-full relative rounded-xl overflow-hidden">
              <img src={mockReels[1].thumb} alt="Mock Food" className="w-full h-full object-cover filter brightness-[0.8]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Play Badge */}
              <div className="absolute top-3 left-3 bg-zinc-950/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/5 flex items-center space-x-1">
                <Play className="w-2.5 h-2.5 text-orange-500 fill-current" />
                <span className="text-[8px] font-black tracking-widest text-neutral-200">SWIPE REEL</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex flex-col space-y-1.5">
                <div className="flex items-center space-x-1.5">
                  <div className="w-4 h-4 rounded-full overflow-hidden border border-white/20"><img src={mockReels[1].avatar} className="w-full h-full object-cover" /></div>
                  <span className="text-[8px] font-extrabold text-orange-400 uppercase tracking-widest truncate">{mockReels[1].chef}</span>
                </div>
                <p className="text-xs font-black leading-snug text-white">{mockReels[1].dish}</p>
              </div>

              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-3.5 text-white/80">
                <div className="flex flex-col items-center"><Heart className="w-4.5 h-4.5 text-red-500 fill-current" /><span className="text-[8px] font-black mt-0.5">{mockReels[1].likes}</span></div>
                <div className="flex flex-col items-center"><Bookmark className="w-4.5 h-4.5 text-zinc-300" /><span className="text-[8px] font-black mt-0.5">Save</span></div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="floating-card absolute bottom-[5%] right-[5%] w-[190px] h-[280px] glass-card rounded-2xl overflow-hidden p-2.5 z-10 origin-bottom shadow-2xl scale-90 border-orange-500/10">
            <div className="w-full h-full relative rounded-xl overflow-hidden">
              <img src={mockReels[2].thumb} alt="Mock Food" className="w-full h-full object-cover filter brightness-[0.75]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 flex flex-col space-y-1">
                <span className="text-[9px] font-extrabold text-orange-400 uppercase tracking-widest truncate">{mockReels[2].chef}</span>
                <p className="text-[10px] font-black leading-snug text-white line-clamp-2">{mockReels[2].dish}</p>
              </div>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-2.5 text-white/80">
                <div className="flex flex-col items-center"><Heart className="w-3.5 h-3.5 text-zinc-300" /><span className="text-[7px] font-black mt-0.5">{mockReels[2].likes}</span></div>
                <div className="flex flex-col items-center"><Bookmark className="w-3.5 h-3.5 text-zinc-300" /><span className="text-[7px] font-black mt-0.5">Save</span></div>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* ─── PREVIEW: DYNAMIC MOCK REEL GRID ─── */}
      <section id="preview" className="max-w-6xl mx-auto px-6 py-16 border-t border-white/5 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="flex flex-col space-y-2 text-left">
            <span className="text-[9px] font-black tracking-widest uppercase text-orange-500">Live Showrooms</span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">Trending Cravings 🔥</h2>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-md font-medium">See what food lovers are swiping, sharing, and ordering right now.</p>
          </div>
          <Link 
            to="/user/login" 
            className="flex items-center space-x-1.5 text-xs font-black text-orange-400 hover:text-orange-300 transition-colors uppercase tracking-widest mt-4 md:mt-0"
          >
            <span>Open Interactive Feed</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Video Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockReels.map((reel) => (
            <div 
              key={reel.id} 
              className="glass-card rounded-3xl overflow-hidden p-3 relative group transition-transform duration-500 hover:scale-[1.02] border-white/5"
            >
              <div className="relative aspect-[3/4.5] w-full rounded-2xl overflow-hidden">
                <img 
                  src={reel.thumb} 
                  alt={reel.dish} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.75] group-hover:brightness-[0.85]" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                {/* Ambient Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="p-4 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-500/30 text-orange-500 scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-6 h-6 fill-current" />
                  </div>
                </div>

                {/* Creator Header */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2 bg-zinc-950/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5">
                    <div className="w-5 h-5 rounded-full overflow-hidden border border-white/20">
                      <img src={reel.avatar} alt={reel.chef} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[8px] font-black uppercase text-neutral-200 tracking-wider">{reel.chef}</span>
                  </div>
                  <div className="bg-zinc-950/60 backdrop-blur-md px-2 py-1.5 rounded-xl border border-white/5 flex items-center space-x-1">
                    <Eye className="w-3 h-3 text-neutral-400" />
                    <span className="text-[8px] font-black text-neutral-300">{reel.views}</span>
                  </div>
                </div>

                {/* Description Bottom overlay */}
                <div className="absolute bottom-4 left-4 right-14 text-left flex flex-col space-y-1.5">
                  <span className="text-[8px] font-black text-orange-400 uppercase tracking-widest truncate">{reel.kitchen}</span>
                  <h3 className="text-sm font-black text-white leading-snug">{reel.dish}</h3>
                </div>

                {/* Interactive Sidebar actions overlay */}
                <div className="absolute right-4 bottom-4 flex flex-col items-center space-y-3">
                  <div className="flex flex-col items-center">
                    <button className="p-2.5 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all active:scale-90">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <span className="text-[7px] font-black text-neutral-400 mt-1">{reel.likes}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <button className="p-2.5 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 text-neutral-300 hover:bg-orange-500/10 hover:border-orange-500/20 transition-all active:scale-90">
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[7px] font-black text-neutral-400 mt-1">Save</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ─── FEATURES: BENTO BOX LAYOUT ─── */}
      <section id="features" ref={featuresRef} className="max-w-6xl mx-auto px-6 py-16 border-t border-white/5 relative z-10">
        
        <div className="text-center max-w-lg mx-auto mb-16 flex flex-col space-y-3">
          <span className="text-[9px] font-black tracking-widest uppercase text-orange-500">Why ByteBite?</span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">Experience Street Food 2.0 ⚡</h2>
          <p className="text-neutral-400 text-xs sm:text-sm font-medium">We combined TikTok-style video discovery with cloud kitchen ordering interfaces to completely rebuild neighborhood food setups.</p>
        </div>

        {/* Premium Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: 9:16 Video Discovery */}
          <div className="bento-fade md:col-span-8 glass-card rounded-3xl p-8 flex flex-col justify-between min-h-[300px] border-white/5 relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-[radial-gradient(circle_at_center,_rgba(249,115,22,0.06)_0%,_transparent_65%)] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            
            <div className="flex flex-col space-y-4 max-w-md text-left z-10">
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-2xl w-fit">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <h3 className="text-xl font-black text-white">Cinematic Short-Video Food Discovery</h3>
              <p className="text-neutral-400 text-xs sm:text-sm font-medium leading-relaxed">
                Images are deceptive, but videos never lie. Swiping our custom vertical reels allows you to watch chefs prepare their signature dishes, showing you exact quality, scale, and kitchen hygiene live!
              </p>
            </div>
            
            <div className="flex items-center space-x-1.5 text-orange-400 font-extrabold text-[10px] tracking-widest uppercase mt-6 z-10">
              <span>9:16 Infinite Scroll Player</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Creator Kitchens */}
          <div className="bento-fade md:col-span-4 glass-card rounded-3xl p-8 flex flex-col justify-between min-h-[300px] border-white/5 group">
            <div className="flex flex-col space-y-4 text-left">
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl w-fit">
                <ChefHat className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white">Local Cloud Chefs</h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-medium">
                Directly support local creators, home chefs, and neighborhood food corners that aren't on large, expensive aggregators.
              </p>
            </div>

            <div className="text-zinc-500 font-bold text-[9px] tracking-wider uppercase mt-6">
              Verified Partner Badges
            </div>
          </div>

          {/* Card 3: Instant Action */}
          <div className="bento-fade md:col-span-4 glass-card rounded-3xl p-8 flex flex-col justify-between min-h-[300px] border-white/5 group">
            <div className="flex flex-col space-y-4 text-left">
              <div className="p-3 bg-zinc-800 border border-white/10 text-neutral-300 rounded-2xl w-fit">
                <Bookmark className="w-5 h-5 fill-current" />
              </div>
              <h3 className="text-xl font-black text-white">One-Tap Saved Lists</h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-medium">
                Found something mouthwatering? Bookmark the reel instantly to build a visual bucket list of street food you must try.
              </p>
            </div>

            <div className="text-zinc-500 font-bold text-[9px] tracking-wider uppercase mt-6">
              Cloud Synchronized
            </div>
          </div>

          {/* Card 4: Smart recommendations */}
          <div className="bento-fade md:col-span-8 glass-card rounded-3xl p-8 flex flex-col justify-between min-h-[300px] border-white/5 relative overflow-hidden group">
            <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-[radial-gradient(circle_at_center,_rgba(239,68,68,0.04)_0%,_transparent_65%)] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            
            <div className="flex flex-col space-y-4 max-w-md text-left z-10">
              <div className="p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 text-orange-400 rounded-2xl w-fit">
                <Star className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white">Personalized Visual Cravings Feed</h3>
              <p className="text-neutral-400 text-xs sm:text-sm font-medium leading-relaxed">
                Our lightweight ranking engine learns your visual engagement tastes. The more you swipe, like, and save, the better we curate hot, freshly cooked, hyper-local reels tailor-made for your tastebuds.
              </p>
            </div>

            <div className="flex items-center space-x-1.5 text-red-400 font-extrabold text-[10px] tracking-widest uppercase mt-6 z-10">
              <span>Interactive Analytics Binds</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

      </section>

      {/* ─── CALL TO ACTION: PARTNER PROGRAM ─── */}
      <section id="partners" className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        
        <div 
          ref={partnerRef}
          className="glass-card rounded-3xl p-8 sm:p-12 border-orange-500/10 bg-gradient-to-br from-zinc-900/50 to-neutral-950 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group"
        >
          {/* Backdrop spotlight */}
          <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,_rgba(249,115,22,0.06)_0%,_transparent_70%)] pointer-events-none z-0" />
          
          <div className="flex flex-col space-y-4 text-left max-w-xl z-10">
            <span className="text-[9px] font-black tracking-widest uppercase text-orange-500">For Cloud Chefs & Restaurants</span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Grow Your Kitchen Through <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Reels Commerce</span> 🍳
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm font-medium leading-relaxed">
              Showcase your cooking skills, live preparation setups, and signature recipes through video. Join as a ByteBite Partner today, upload reels directly from your Creator Studio, and watch nearby foodies discover your kitchen.
            </p>
          </div>

          <div className="shrink-0 flex flex-col space-y-3 w-full md:w-auto z-10">
            <Link 
              to="/food-partner/register" 
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xs px-6 py-4 rounded-2xl shadow-lg shadow-orange-500/15 active:scale-95 transition-all duration-300"
            >
              <Store className="w-4 h-4" />
              <span>Launch Creator Kitchen</span>
            </Link>
            
            <Link 
              to="/food-partner/login" 
              className="text-neutral-400 hover:text-white font-black text-xs px-4 py-2.5 rounded-xl border border-white/5 hover:bg-white/5 transition-all duration-300 text-center"
            >
              Partner Login Portal
            </Link>
          </div>

        </div>

      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5 bg-[#030304] relative z-10 py-16 px-6 select-none">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: Branding */}
          <div className="flex flex-col space-y-4 text-left">
            <span className="text-xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent tracking-tighter">
              ByteBite
            </span>
            <p className="text-[11px] font-bold text-neutral-500 leading-relaxed">
              Disrupting local street food discovery through micro-video reels commerce. Designed with visual-first and O(1) performance benchmarks.
            </p>
          </div>

          {/* Column 2: Swipers */}
          <div className="flex flex-col space-y-3.5 text-left">
            <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Swiper Hub</span>
            <Link to="/user/login" className="text-neutral-400 hover:text-white text-xs font-bold transition-colors">Explore Live Reels</Link>
            <Link to="/register" className="text-neutral-400 hover:text-white text-xs font-bold transition-colors">Create Account</Link>
            <Link to="/user/login" className="text-neutral-400 hover:text-white text-xs font-bold transition-colors">Swiper Login</Link>
          </div>

          {/* Column 3: Partner Hub */}
          <div className="flex flex-col space-y-3.5 text-left">
            <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Kitchen Partners</span>
            <Link to="/food-partner/register" className="text-neutral-400 hover:text-white text-xs font-bold transition-colors">Register Restaurant</Link>
            <Link to="/food-partner/login" className="text-neutral-400 hover:text-white text-xs font-bold transition-colors">Creator Studio Login</Link>
            <a href="#partners" className="text-neutral-400 hover:text-white text-xs font-bold transition-colors">Partner FAQ</a>
          </div>

          {/* Column 4: Tech stack */}
          <div className="flex flex-col space-y-3.5 text-left">
            <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Engineering Architecture</span>
            <div className="flex flex-wrap gap-2 pt-1.5">
              <span className="bg-zinc-900 border border-white/5 text-zinc-400 text-[8px] font-black px-2 py-1 rounded-md">REACT 19</span>
              <span className="bg-zinc-900 border border-white/5 text-zinc-400 text-[8px] font-black px-2 py-1 rounded-md">GSAP 3</span>
              <span className="bg-zinc-900 border border-white/5 text-zinc-400 text-[8px] font-black px-2 py-1 rounded-md">NODEJS</span>
              <span className="bg-zinc-900 border border-white/5 text-zinc-400 text-[8px] font-black px-2 py-1 rounded-md">MONGODB</span>
              <span className="bg-zinc-900 border border-white/5 text-zinc-400 text-[8px] font-black px-2 py-1 rounded-md">JWT COOKIES</span>
            </div>
            <p className="text-[10px] font-black text-zinc-600 pt-2">© 2026 ByteBite. Made with ❤️ for street food lovers.</p>
          </div>

        </div>
      </footer>

    </div>
  )
}

export default LandingPage
