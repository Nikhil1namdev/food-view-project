import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Home, Bookmark, PlusSquare, LogOut, Store } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '../lib/utils'

// =========================================================================
// PREMIUM DESKTOP-CENTRIC ROUTING SHELL (AppLayout)
// =========================================================================
// Houses the core desktop-first application interface structure.
// Features:
// - Left Sticky Navigation Sidebar with premium gradients and scale hovers
// - Dynamic account profile summaries based on secure HTTP context
// - Clean responsive outlet grids
const AppLayout = () => {
  const { role, user, logout, isAuthenticated } = useAuth()

  return (
    <div className="hidden md:flex h-screen w-screen bg-neutral-950 text-white overflow-hidden font-sans">
      
      {/* 🖥️ LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 h-full border-r border-white/5 bg-zinc-900/40 backdrop-blur-md p-6 flex flex-col justify-between select-none">
        
        <div className="flex flex-col space-y-8">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2 px-2">
            <span className="text-2xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent tracking-tighter">
              ByteBite
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1.5" aria-label="Desktop Layout Sidebar">
            {role === 'user' && (
              <>
                <NavLink 
                  to="/" 
                  end 
                  className={({ isActive }) => cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-black tracking-tight transition-all duration-300 group hover:bg-white/5",
                    isActive ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/10" : "text-neutral-400 hover:text-white"
                  )}
                >
                  <Home className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" />
                  <span>Reels Feed</span>
                </NavLink>

                <NavLink 
                  to="/saved" 
                  className={({ isActive }) => cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-black tracking-tight transition-all duration-300 group hover:bg-white/5",
                    isActive ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/10" : "text-neutral-400 hover:text-white"
                  )}
                >
                  <Bookmark className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" />
                  <span>Saved Items</span>
                </NavLink>
              </>
            )}

            {role === 'partner' && (
              <NavLink 
                to="/create-food" 
                className={({ isActive }) => cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-black tracking-tight transition-all duration-300 group hover:bg-white/5",
                  isActive ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/10" : "text-neutral-400 hover:text-white"
                )}
              >
                <PlusSquare className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" />
                <span>Upload Food</span>
              </NavLink>
            )}
          </nav>
        </div>

        {/* Sidebar Footer (Profile details or Exit action) */}
        <div className="space-y-4">
          {isAuthenticated && (
            <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center font-black text-xs text-white uppercase">
                {user?.fullName?.charAt(0) || user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white truncate">
                  {user?.fullName || user?.name || "Member"}
                </p>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                  {role}
                </span>
              </div>
            </div>
          )}

          {isAuthenticated ? (
            <button 
              onClick={logout}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-xs font-black text-red-400 transition-all duration-300 hover:bg-red-500/5 group cursor-pointer active:scale-95"
            >
              <LogOut className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1" />
              <span>Exit Session</span>
            </button>
          ) : (
            <Link 
              to="/user/login"
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xs px-4 py-3 rounded-xl w-full text-center transition-all duration-300"
            >
              <Store className="w-4 h-4" />
              <span>Partner Login</span>
            </Link>
          )}
        </div>

      </aside>

      {/* 🖥️ VIEWPORT OUTLET CONTAINER */}
      <main className="flex-1 h-full overflow-y-auto bg-neutral-950 scrollbar-none z-10">
        <Outlet />
      </main>

    </div>
  )
}

export default AppLayout
