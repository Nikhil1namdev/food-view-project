import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../../components/home/Navbar'
import EmptyFeed from '../../components/home/EmptyFeed'
import ReelFeed from '../../components/home/ReelFeed'
import BottomNav from '../../components/home/BottomNav'
import { Loader2 } from 'lucide-react'

// =========================================================================
// CONTAINER PAGE CONTROLLER (Home)
// =========================================================================
// Acts exclusively as a state controller and data-fetching orchestrator.
// Delegates UI layout streams entirely to specialized, reusable components:
// - Navbar: Header dashboard portals
// - EmptyFeed: Premium promotional landing state if feed array is empty
// - ReelFeed: Cinematic full-screen video player if food reels exist
// - BottomNav: Mobile glassmorphic sticky footer navigators
const Home = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  // Retrieves active recipe/food videos on mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:3000/api/food", { 
          withCredentials: true 
        })
        setVideos(response.data.foodItems || [])
      } catch (error) {
        console.error("Failed fetching reels database feed:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  // Optimistic Heart like update handler
  const likeVideo = async (item) => {
    try {
      const response = await axios.post("http://localhost:3000/api/food/like", { 
        foodId: item._id 
      }, { withCredentials: true })

      if (response.data.like) {
        setVideos((prev) => 
          prev.map((v) => v._id === item._id ? { ...v, likeCount: (v.likeCount || 0) + 1 } : v)
        )
      } else {
        setVideos((prev) => 
          prev.map((v) => v._id === item._id ? { ...v, likeCount: Math.max(0, (v.likeCount || 1) - 1) } : v)
        )
      }
    } catch (err) {
      console.error("Error setting video like toggle:", err)
    }
  }

  // Optimistic Bookmark save update handler
  const saveVideo = async (item) => {
    try {
      const response = await axios.post("http://localhost:3000/api/food/save", { 
        foodId: item._id 
      }, { withCredentials: true })

      if (response.data.save) {
        setVideos((prev) => 
          prev.map((v) => v._id === item._id ? { ...v, savesCount: (v.savesCount || 0) + 1 } : v)
        )
      } else {
        setVideos((prev) => 
          prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount || 1) - 1) } : v)
        )
      }
    } catch (err) {
      console.error("Error toggling bookmark status:", err)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#050507] w-full relative overflow-hidden select-none">
      
      {/* Ambient Cinema Spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(24,24,27,0.25)_0%,_rgba(5,5,7,1)_75%)] pointer-events-none z-0" />
      
      {/* Technical Grid Mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Analog Noise Grain Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.01] pointer-events-none mix-blend-overlay z-0" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Dynamic top bar header */}
      <Navbar />

      {/* Main Core Feed Controller Block */}
      <main className="flex-1 w-full relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] w-full text-white space-y-4">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            <p className="text-xs font-black tracking-widest text-neutral-500 uppercase animate-pulse">
              Buffering Feeds...
            </p>
          </div>
        ) : videos.length === 0 ? (
          <EmptyFeed />
        ) : (
          <ReelFeed 
            items={videos} 
            onLike={likeVideo} 
            onSave={saveVideo} 
            emptyMessage="No viral reels active. Be the first to post!"
          />
        )}
      </main>

      {/* Floating Sticky Mobile footer nav */}
      <BottomNav />
    </div>
  )
}

export default Home