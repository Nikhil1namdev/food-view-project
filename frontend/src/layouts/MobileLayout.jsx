import React from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Home, Bookmark, PlusSquare, User, LogOut, Store } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '../lib/utils'

// =========================================================================
// FLOATING GLASSMORPHIC MOBILE SHELL (MobileLayout)
// =========================================================================
// Houses the mobile-first responsive layout viewports.
// - Fixed glassmorphic topheader bar with dynamic logouts
// - Central rendering outlet
// - TikTok/Instagram custom bottom navigation tabs
const MobileLayout = () => {
  const navigate = useNavigate()
  const { isAuthenticated, role, user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate("/register")
  }

  return (
    <div className="flex md:hidden flex-col min-h-screen w-screen bg-neutral-950 text-white overflow-hidden font-sans">
      
      {/* 📱 TOP BAR FLOATING GLASS PORTAL */}
      <header className="flex items-center justify-between px-5 h-16 border-b border-white/5 bg-neutral-950/80 backdrop-blur-md z-40 select-none">
        <Link to="/" className="text-xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent tracking-tighter">
          ByteBite
        </Link>
        
        {isAuthenticated ? (
          <button 
            onClick={handleLogout}
            className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer active:scale-95"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        ) : (
          <Link 
            to="/user/login"
            className="text-xs font-black bg-white/10 hover:bg-white/15 px-4 py-2.5 rounded-xl border border-white/10 transition-colors"
          >
            Sign In
          </Link>
        )}
      </header>

      {/* 📱 CENTRAL PORTAL VIEWPORT OUTLET */}
      <main className="flex-1 overflow-y-auto pb-16 bg-neutral-950 z-10 scrollbar-none">
        <Outlet />
      </main>

      {/* 📱 FLOATING TIKTOK STYLE BOTTOM NAV TABS */}
      <nav 
        className="fixed bottom-0 left-0 right-0 h-16 border-t border-white/5 bg-neutral-950/80 backdrop-blur-lg flex justify-around items-center px-4 z-40 select-none"
        aria-label="Mobile Layout Bottom Nav"
      >
        <NavLink 
          to="/" 
          end 
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 active:scale-90",
            isActive ? "text-orange-500 scale-110" : "text-neutral-500"
          )}
        >
          <Home className="w-5.5 h-5.5" />
          <span className="text-[9px] font-extrabold mt-0.5 tracking-tight">Feed</span>
        </NavLink>

        {role === 'partner' && (
          <NavLink 
            to="/create-food" 
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 active:scale-90",
              isActive ? "text-orange-500 scale-110" : "text-neutral-500"
            )}
          >
            <PlusSquare className="w-5.5 h-5.5" />
            <span className="text-[9px] font-extrabold mt-0.5 tracking-tight">Upload</span>
          </NavLink>
        )}

        {role === 'user' && (
          <NavLink 
            to="/saved" 
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 active:scale-90",
              isActive ? "text-orange-500 scale-110" : "text-neutral-500"
            )}
          >
            <Bookmark className="w-5.5 h-5.5" />
            <span className="text-[9px] font-extrabold mt-0.5 tracking-tight">Saved</span>
          </NavLink>
        )}

        <NavLink 
          to={isAuthenticated ? (role === 'partner' ? `/food-partner/${user?._id}` : "/saved") : "/register"}
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 active:scale-90",
            isActive ? "text-orange-500 scale-110" : "text-neutral-500"
          )}
        >
          {role === 'partner' ? <Store className="w-5.5 h-5.5" /> : <User className="w-5.5 h-5.5" />}
          <span className="text-[9px] font-extrabold mt-0.5 tracking-tight">Account</span>
        </NavLink>
      </nav>

    </div>
  )
}

export default MobileLayout
