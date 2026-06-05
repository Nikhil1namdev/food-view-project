import React from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Home, Bookmark, PlusSquare, LogOut, Store } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'
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
  const { isDark } = useTheme()
  const location = useLocation()
  
  // Tab reading for active state
  const searchParams = new URLSearchParams(location.search)
  const activeTab = searchParams.get('tab') || 'dashboard'
  
  // Check if we are actually on the dashboard profile page
  const isOnDashboardPath = location.pathname.startsWith('/food-partner/') && !location.pathname.includes('/login') && !location.pathname.includes('/register')
  
  const getLinkClass = (isActive) => {
    return cn(
      "flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-black tracking-tight transition-all duration-300 group cursor-pointer",
      isActive 
        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/10 scale-[1.02]" 
        : cn(
            isDark 
              ? "text-neutral-400 hover:text-white hover:bg-white/5" 
              : "text-neutral-600 hover:text-orange-500 hover:bg-orange-500/5"
          )
    )
  }

  const getTabClass = (tabName) => {
    const isActive = isOnDashboardPath && activeTab === tabName;
    return getLinkClass(isActive);
  }

  return (
    <div className={cn(
      "hidden md:flex h-screen w-screen transition-colors duration-300 overflow-hidden font-sans",
      isDark ? "bg-[#09090b] text-neutral-100" : "bg-neutral-50 text-neutral-800"
    )}>
      
      {/* 🖥️ LEFT SIDEBAR NAVIGATION */}
      <aside className={cn(
        "w-64 h-full border-r p-6 flex flex-col justify-between select-none transition-all duration-300 z-25",
        isDark 
          ? "border-white/5 bg-zinc-900/40 backdrop-blur-md" 
          : "border-neutral-200/80 bg-neutral-50/90 shadow-md shadow-neutral-100/30"
      )}>
        
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
                  to="/feed" 
                  end 
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <Home className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" />
                  <span>Reels Feed</span>
                </NavLink>

                <NavLink 
                  to="/saved" 
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <Bookmark className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" />
                  <span>Saved Items</span>
                </NavLink>
              </>
            )}

            {role === 'partner' && (
              <>
                <Link 
                  to={`/food-partner/${user?._id || user?.id}`} 
                  className={getTabClass('dashboard')}
                >
                  <Home className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" />
                  <span>Dashboard</span>
                </Link>

                <NavLink 
                  to="/create-food" 
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <PlusSquare className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" />
                  <span>Upload Food</span>
                </NavLink>

                <Link 
                  to={`/food-partner/${user?._id || user?.id}?tab=uploads`} 
                  className={getTabClass('uploads')}
                >
                  <Store className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" />
                  <span>My Uploads</span>
                </Link>

                <Link 
                  to={`/food-partner/${user?._id || user?.id}?tab=analytics`} 
                  className={getTabClass('analytics')}
                >
                  <Bookmark className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" />
                  <span>Analytics</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Sidebar Footer (Profile details or Exit action) */}
        <div className="space-y-4">
          {isAuthenticated && (
            <div className={cn(
              "flex items-center space-x-3 p-3 rounded-xl border transition-all duration-300",
              isDark ? "bg-white/5 border-white/5" : "bg-neutral-100/80 border-neutral-200/50"
            )}>
              <div className={cn(
                "w-9 h-9 shrink-0 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center font-black text-xs text-white uppercase overflow-hidden border transition-colors duration-300",
                isDark ? "border-white/10" : "border-orange-500/20"
              )}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  user?.fullName?.charAt(0) || user?.name?.charAt(0) || "U"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-xs font-black truncate transition-colors duration-300",
                  isDark ? "text-white" : "text-neutral-800"
                )}>
                  {user?.fullName || user?.name || "Member"}
                </p>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider block transition-colors duration-300",
                  isDark ? "text-neutral-500" : "text-neutral-400"
                )}>
                  {role}
                </span>
              </div>
            </div>
          )}

          {isAuthenticated ? (
            <button 
              onClick={logout}
              className={cn(
                "flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-xs font-black transition-all duration-300 group cursor-pointer active:scale-95",
                isDark ? "text-red-400 hover:bg-red-500/5" : "text-red-500 hover:bg-red-500/10"
              )}
            >
              <LogOut className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1" />
              <span>Exit Session</span>
            </button>
          ) : (
            <Link 
              to="/user/login"
              className={cn(
                "flex items-center justify-center space-x-2 font-black text-xs px-4 py-3 rounded-xl w-full text-center transition-all duration-300 active:scale-95",
                isDark 
                  ? "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white" 
                  : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-sm shadow-orange-500/10"
              )}
            >
              <Store className="w-4 h-4" />
              <span>Partner Login</span>
            </Link>
          )}
        </div>

      </aside>

      {/* 🖥️ VIEWPORT OUTLET CONTAINER */}
      <main className={cn(
        "flex-1 h-full overflow-y-auto scrollbar-none z-10 transition-colors duration-300",
        isDark ? "bg-[#09090b]" : "bg-neutral-50"
      )}>
        <Outlet />
      </main>

    </div>
  )
}

export default AppLayout
