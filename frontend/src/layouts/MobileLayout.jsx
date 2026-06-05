import React from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Home, Bookmark, PlusSquare, User, LogOut, Store } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'
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
  const { isDark } = useTheme()

  const handleLogout = async () => {
    await logout()
    navigate("/register")
  }

  return (
    <div className={cn(
      "flex md:hidden flex-col min-h-screen w-screen transition-colors duration-300 overflow-hidden font-sans",
      isDark ? "bg-[#09090b] text-neutral-100" : "bg-[#fafafa] text-neutral-800"
    )}>
      
      {/* 📱 TOP BAR FLOATING GLASS PORTAL */}
      <header className={cn(
        "flex items-center justify-between px-5 h-16 border-b backdrop-blur-md z-40 select-none transition-all duration-300",
        isDark ? "border-white/5 bg-neutral-950/80" : "border-neutral-200/80 bg-neutral-50/80"
      )}>
        <Link to="/" className="text-xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent tracking-tighter">
          ByteBite
        </Link>
        
        {isAuthenticated ? (
          <button 
            onClick={handleLogout}
            className={cn(
              "p-2 rounded-xl transition-all cursor-pointer active:scale-95",
              isDark 
                ? "text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20" 
                : "text-red-500 hover:bg-red-500/5 border border-transparent hover:border-red-500/10"
            )}
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        ) : (
          <Link 
            to="/user/login"
            className={cn(
              "text-xs font-black px-4 py-2.5 rounded-xl border transition-colors duration-300",
              isDark 
                ? "bg-white/10 hover:bg-white/15 border-white/10 text-white" 
                : "bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-800"
            )}
          >
            Sign In
          </Link>
        )}
      </header>

      {/* 📱 CENTRAL PORTAL VIEWPORT OUTLET */}
      <main className={cn(
        "flex-1 overflow-y-auto pb-16 z-10 scrollbar-none transition-colors duration-300",
        isDark ? "bg-[#09090b]" : "bg-neutral-50"
      )}>
        <Outlet />
      </main>

      {/* 📱 FLOATING TIKTOK STYLE BOTTOM NAV TABS */}
      <nav 
        className={cn(
          "fixed bottom-0 left-0 right-0 h-16 border-t backdrop-blur-lg flex justify-around items-center px-4 z-40 select-none transition-all duration-300",
          isDark ? "border-white/5 bg-neutral-950/80" : "border-neutral-200/80 bg-[#fafafa]/90 shadow-md"
        )}
        aria-label="Mobile Layout Bottom Nav"
      >
        <NavLink 
          to="/" 
          end 
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 active:scale-90",
            isActive ? "text-orange-500 scale-110" : (isDark ? "text-neutral-500" : "text-neutral-400")
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
              isActive ? "text-orange-500 scale-110" : (isDark ? "text-neutral-500" : "text-neutral-400")
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
              isActive ? "text-orange-500 scale-110" : (isDark ? "text-neutral-500" : "text-neutral-400")
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
            isActive ? "text-orange-500 scale-110" : (isDark ? "text-neutral-500" : "text-neutral-400")
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
