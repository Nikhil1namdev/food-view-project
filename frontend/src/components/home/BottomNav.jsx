import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Bookmark, PlusSquare, User, Store } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../lib/utils'

// =========================================================================
// FLOATING MOBILE BOTTOM NAVIGATION (BottomNav)
// =========================================================================
// Renders glassmorphic footer nav bar on mobile viewports.
// - Supports tactile hover/scale transitions
// - Dynamically switches links matching user/merchant roles
const BottomNav = () => {
  const { isAuthenticated, role, user } = useAuth()
  const { isDark } = useTheme()

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 h-16 border-t flex md:hidden justify-around items-center px-4 z-40 select-none transition-all duration-300",
        isDark 
          ? "border-zinc-900 bg-[#09090b]/85 backdrop-blur-md" 
          : "border-neutral-200 bg-[#fafafa]/90 shadow-md backdrop-blur-md"
      )}
      aria-label="Mobile Navigation"
    >
      
      {/* 1. Feed Home Route */}
      <NavLink 
        to="/feed" 
        end 
        className={({ isActive }) => cn(
          "flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 active:scale-90",
          isActive ? "text-orange-500 scale-110" : (isDark ? "text-neutral-500" : "text-neutral-400")
        )}
      >
        <Home className="w-5.5 h-5.5" />
        <span className="text-[9px] font-extrabold mt-0.5 tracking-tight">Feed</span>
      </NavLink>

      {/* 2. Merchant uploads Route (Partner role only) */}
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

      {/* 3. Consumer bookmarks Route (User role only) */}
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

      {/* 4. Portal Account Route (Register or Profile redirect) */}
      <NavLink 
        to={isAuthenticated ? (role === 'partner' ? `/food-partner/${user?._id}` : "/saved") : "/register"}
        className={({ isActive }) => cn(
          "flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 active:scale-90",
          isActive ? "text-orange-500 scale-110" : (isDark ? "text-neutral-500" : "text-neutral-400")
        )}
      >
        {role === 'partner' ? <Store className="w-5.5 h-5.5" /> : <User className="w-5.5 h-5.5" />}
        <span className="text-[9px] font-extrabold mt-0.5 tracking-tight">Profile</span>
      </NavLink>

    </nav>
  )
}

export default BottomNav
