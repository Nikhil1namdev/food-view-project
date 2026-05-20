import React, { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { 
    Play, 
    MapPin, 
    Activity, 
    Users, 
    Eye, 
    Bookmark, 
    Edit3, 
    Trash2, 
    Settings,
    CheckCircle2,
    CalendarDays
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

// =========================================================================
// PREMIUM CREATOR STUDIO DASHBOARD (Profile.jsx)
// =========================================================================
// Dual-purpose page:
// 1. If visited by a consumer -> Beautiful Public Profile
// 2. If visited by the owner -> Comprehensive Creator Dashboard
const Profile = () => {
    const { id } = useParams()
    const { user, role } = useAuth()
    const [profile, setProfile] = useState(null)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchParams] = useSearchParams()

    // Determine active tab: 'dashboard' (default), 'analytics', or 'uploads'
    const activeTab = searchParams.get('tab') || 'dashboard'

    // Determine if the current authenticated user owns this profile
    const isOwner = user && (user._id === id || user.id === id) && role === 'partner'

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/food-partner/${id}`, { 
                    withCredentials: true 
                })
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.foodItems || [])
            } catch (error) {
                console.error("Error fetching food partner:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [id])

    // ==========================================
    // ACTION HANDLERS (Placeholders for future)
    // ==========================================
    const handleDelete = (videoId, e) => {
        e.stopPropagation()
        // API call to delete video would go here
        console.log("Delete video:", videoId)
    }

    const handleEdit = (videoId, e) => {
        e.stopPropagation()
        // Navigate to edit form would go here
        console.log("Edit video:", videoId)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-neutral-500">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-zinc-900 rounded-full border-4 border-zinc-800" />
                    <div className="w-40 h-5 bg-zinc-900 rounded-full" />
                </div>
            </div>
        )
    }

    // Dynamic stat calculation based on fetched videos
    const totalViews = videos.reduce((acc, v) => acc + (v.viewCount || 0), 0);
    const totalSaves = videos.reduce((acc, v) => acc + (v.saveCount || 0), 0);

    return (
        <main className="min-h-screen w-full bg-neutral-950 px-4 py-8 md:p-8 xl:p-10 select-none pb-32">
            
            {/* Dashboard Header Container */}
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* 🎨 PREMIUM PROFILE HEADER */}
                <section className="relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-6 md:p-10 overflow-hidden backdrop-blur-xl shadow-2xl">
                    
                    {/* Cinematic Background Glow Elements */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-500/5 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                        
                        {/* Avatar & Verification */}
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-zinc-950 shadow-2xl overflow-hidden shrink-0 bg-zinc-800 flex items-center justify-center relative z-10">
                                {profile?.profilePicture ? (
                                    <img 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                        src={profile.profilePicture} 
                                        alt={profile?.name || "Partner"} 
                                        draggable={false}
                                    />
                                ) : (
                                    <span className="text-6xl font-black text-zinc-600 uppercase">
                                        {(profile?.name || "P").charAt(0)}
                                    </span>
                                )}
                            </div>
                            {/* Verification Badge */}
                            <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-blue-500 text-white p-1.5 rounded-full border-4 border-zinc-900 shadow-xl z-20">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Core Meta Details */}
                        <div className="flex-1 text-center md:text-left space-y-4 pt-2">
                            <div>
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                        {profile?.name || "Partner Store"}
                                    </h1>
                                    <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] uppercase font-black tracking-widest rounded-full border border-orange-500/20 whitespace-nowrap mt-1">
                                        Official Partner
                                    </span>
                                </div>
                                {profile?.address && (
                                    <p className="text-sm font-medium text-neutral-400 flex items-center justify-center md:justify-start mt-2">
                                        <MapPin className="w-4 h-4 mr-1.5 text-red-500/80" />
                                        {profile.address}
                                    </p>
                                )}
                            </div>

                            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
                                {profile?.bio || "Serving the most delicious and visually stunning meals in town. Follow our journey through taste and cinematic bites."}
                            </p>

                            {/* Owner Dashboard Actions */}
                            {isOwner && (
                                <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
                                    <button 
                                        onClick={() => toast("Profile editing coming soon!", { icon: '⚒️' })}
                                        className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-zinc-200 active:scale-95 shadow-lg"
                                    >
                                        <Edit3 className="w-4 h-4" /> Edit Profile
                                    </button>
                                    <button 
                                        onClick={() => toast("Settings dashboard coming soon!", { icon: '⚙️' })}
                                        className="flex items-center gap-2 bg-white/5 text-white border border-white/10 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-white/10 active:scale-95"
                                    >
                                        <Settings className="w-4 h-4 text-zinc-400" /> Settings
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* 📊 ANALYTICS STATS GRID */}
                {(activeTab === 'dashboard' || activeTab === 'analytics') && (
                    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
                        {[
                        { label: "Total Uploads", value: videos.length, icon: Play, color: "text-blue-500", bg: "bg-blue-500/10" },
                        { label: "Customers Served", value: profile?.customersServed || 0, icon: Users, color: "text-orange-500", bg: "bg-orange-500/10" },
                        { label: "Total Views", value: totalViews, icon: Eye, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                        { label: "Saves & Bookmarks", value: totalSaves, icon: Bookmark, color: "text-purple-500", bg: "bg-purple-500/10" }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:bg-zinc-900/50 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-colors group-hover:bg-opacity-20`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-white tracking-tighter mb-1">
                                {stat.value}
                            </h3>
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                    </section>
                )}

                {/* 🎬 UPLOADED REELS/FOOD GRID */}
                {(activeTab === 'dashboard' || activeTab === 'uploads') && (
                    <section className="space-y-6 pt-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8">
                        
                        {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <Play className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white tracking-tight">Studio Content</h2>
                                <p className="text-xs text-zinc-500 font-medium mt-0.5">Manage your viral bites</p>
                            </div>
                        </div>

                        {isOwner && (
                            <Link 
                                to="/create-food" 
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20"
                            >
                                <Play className="w-4 h-4 fill-white" /> Upload New Reel
                            </Link>
                        )}
                    </div>

                    {/* Content Grid */}
                    {videos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-zinc-900/20 rounded-[2rem] border border-white/5 border-dashed">
                            <Play className="w-12 h-12 text-zinc-800 mb-4" />
                            <h3 className="text-lg font-black text-white">No reels published yet</h3>
                            <p className="text-sm font-medium text-neutral-500 mt-2 max-w-sm text-center">
                                Start recording your delicious creations and share them with food lovers nearby.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {videos.map((v) => (
                                <div 
                                    key={v._id || v.id} 
                                    className="group relative bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer border border-zinc-800/50 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10"
                                >
                                    
                                    {/* Video Thumbnail Box */}
                                    <div className="relative aspect-[9/16] overflow-hidden bg-black">
                                        <video
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                            src={v.video}
                                            muted
                                            playsInline
                                            loop
                                            onMouseOver={(e) => e.target.play()}
                                            onMouseOut={(e) => {
                                                e.target.pause()
                                                e.target.currentTime = 0
                                            }}
                                        />
                                        
                                        {/* Auto-play indicator */}
                                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5 opacity-100 group-hover:opacity-0 transition-opacity">
                                            <Play className="w-3 h-3 text-white fill-white" />
                                            <span className="text-[9px] font-black tracking-widest uppercase text-white">Reel</span>
                                        </div>

                                        {/* Gradient Shadow for text readability */}
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                    </div>

                                    {/* Meta Information overlay */}
                                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-sm font-extrabold text-white line-clamp-1 drop-shadow-md">
                                            {v.name || "Delicious Byte"}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-zinc-300">
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3 text-zinc-400" /> 1.2K
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Activity className="w-3 h-3 text-orange-400" /> {v.likeCount || 0}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Hover Actions (Only visible if owner) */}
                                    {isOwner && (
                                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                            <button 
                                                onClick={(e) => handleEdit(v._id, e)}
                                                className="p-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full hover:bg-white hover:text-black transition-colors"
                                                title="Edit Details"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={(e) => handleDelete(v._id, e)}
                                                className="p-2 bg-red-500/20 backdrop-blur-xl border border-red-500/30 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                                title="Delete Reel"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                </div>
                            ))}
                        </div>
                    )}
                    </section>
                )}

            </div>
        </main>
    )
}

export default Profile