import React, { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Home, Bookmark, User, Store, LogOut, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../lib/utils'
import gsap from 'gsap'

// =========================================================================
// FLOATING GLASSMORPHIC GLOBAL HEADER (Navbar)
// =========================================================================
// Provides unified responsive navigation controls:
// - ByteBite logo branding
// - NavLinks for Feed, Saved items, and Merchant dashboards
// - Secure Context-based user login state visibility and dynamic CTA
const Navbar = () => {
  const { isAuthenticated, role, user, logout } = useAuth()
  const { toggleTheme, isDark } = useTheme()
  const navRef = useRef(null)

  useEffect(() => {
    // Elegant entrance slide-down animation using GSAP
    gsap.fromTo(navRef.current, 
      { y: -30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    )
  }, [])

  return (
    <header 
      ref={navRef}
      className="sticky top-0 left-0 right-0 z-50 w-full border-b border-neutral-200/80 dark:border-zinc-900 bg-white/75 dark:bg-[#09090b]/75 backdrop-blur-md select-none px-6 py-3.5 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent tracking-tighter">
            ByteBite
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold" aria-label="Desktop Top Navigation">
          
          {role === 'user' && (
            <>
              <NavLink 
                to="/feed" 
                end 
                className={({ isActive }) => cn(
                  "hover:text-orange-500 transition-colors duration-200", 
                  isActive ? "text-orange-500" : "text-neutral-600 dark:text-neutral-300"
                )}
              >
                Home Feed
              </NavLink>

              <NavLink 
                to="/saved" 
                className={({ isActive }) => cn(
                  "hover:text-orange-500 transition-colors duration-200", 
                  isActive ? "text-orange-500" : "text-neutral-600 dark:text-neutral-300"
                )}
              >
                Saved
              </NavLink>
            </>
          )}

          {role === 'partner' && (
            <NavLink 
              to="/create-food" 
              className={({ isActive }) => cn(
                "hover:text-orange-500 transition-colors duration-200", 
                isActive ? "text-orange-500" : "text-neutral-600 dark:text-neutral-300"
              )}
            >
              Upload Food
            </NavLink>
          )}
        </nav>

        {/* CTA User Area */}
        <div className="flex items-center space-x-4">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 text-neutral-600 dark:text-zinc-300 hover:bg-neutral-200 dark:hover:bg-zinc-800 hover:text-orange-500 dark:hover:text-orange-400 rounded-xl transition-all duration-300 cursor-pointer active:scale-95"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center space-x-3.5">
              <span className="hidden sm:inline text-xs font-black text-neutral-600 dark:text-neutral-300">
                Hi, {user?.fullName || user?.name || "Member"}
              </span>
              
              <button 
                onClick={logout}
                className="flex items-center space-x-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 hover:bg-red-500/10 hover:border-red-500/30 text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:text-red-400 dark:hover:text-red-400 px-3 py-2 rounded-xl transition-all duration-300 cursor-pointer active:scale-95"
                aria-label="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link 
                to="/user/login" 
                className="text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white font-extrabold text-xs px-4 py-2 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl transition-all duration-300"
              >
                Log In
              </Link>
              
              <Link 
                to="/food-partner/register" 
                className="flex items-center space-x-1.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md shadow-orange-500/10 active:scale-95 transition-all duration-300"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Partner Portal</span>
              </Link>
            </div>
          )}

        </div>

      </div>
    </header>
  )
}

export default Navbar
