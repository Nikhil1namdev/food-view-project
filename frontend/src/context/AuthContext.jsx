import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

// =========================================================================
// GLOBAL AUTHENTICATION STATE PROVIDER (AuthContext)
// =========================================================================
// This is the brain of ByteBite's security system. It manages:
//
// 1. USER STATE: Stores current user object, role, and authentication status
// 2. SESSION VERIFICATION: On app boot, checks if a valid JWT cookie exists
//    by calling the backend's /check-auth endpoint (stateless verification)
// 3. LOGOUT FLOW: Calls the role-appropriate backend logout API to clear
//    the HttpOnly cookie, then wipes all frontend state and redirects
// 4. LOADING STATES: Prevents UI flicker by holding a loading flag while
//    async auth operations are in flight
//
// Architecture Decision - Why Context API instead of Redux?
// ---------------------------------------------------------
// Redux would be overkill here. Auth state is:
// - Read by many components (sidebar, routes, profile)
// - Written by very few actions (login, logout, checkAuth)
// - Simple in shape (user object + role string + boolean flags)
// Context API handles this perfectly without extra bundle size.
//
// Security Decision - Why no token in state?
// -------------------------------------------
// The JWT token is NEVER stored in React state or localStorage.
// It lives exclusively in an HttpOnly cookie that JavaScript cannot read.
// This completely eliminates XSS-based token theft. The browser auto-sends
// the cookie on every request when we use `withCredentials: true` in Axios.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // ─── SESSION VERIFICATION ───
  // Called on app boot and after every login/register action.
  // Hits the unified /check-auth endpoint which:
  //   1. Reads the JWT from the HttpOnly cookie
  //   2. Decodes it to get the user ID
  //   3. Looks up the user in both 'users' and 'foodpartners' collections
  //   4. Returns the user object + role ('user' or 'partner')
  const checkUserAuth = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:5000/api/auth/check-auth", {
        withCredentials: true
      })
      
      if (response.data.authenticated) {
        setUser(response.data.user)
        setRole(response.data.role)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setRole(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Session verification failed:", error)
      setUser(null)
      setRole(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }, [])

  // ─── LOGOUT FLOW ───
  // Production-level logout that handles:
  // 1. Determines correct backend endpoint based on role
  // 2. Calls backend to clear the HttpOnly JWT cookie server-side
  // 3. Wipes all frontend auth state regardless of API success/failure
  // 4. Shows user-friendly toast notification
  // 5. Redirects to the appropriate login page
  //
  // Why do we save currentRole BEFORE clearing state?
  // Because setRole(null) is async - by the time setTimeout fires,
  // `role` would already be null. We capture it beforehand.
  const logout = useCallback(async () => {
    // Capture current role before wiping state (needed for redirect)
    const currentRole = role

    try {
      setLoading(true)
      const logoutUrl = currentRole === 'partner' 
        ? "http://localhost:5000/api/auth/food-partner/logout"
        : "http://localhost:5000/api/auth/user/logout"

      await axios.get(logoutUrl, { withCredentials: true })
      toast.success("Successfully logged out. See you soon!")
    } catch (error) {
      console.error("Server-side logout failed:", error)
      toast.error("Network issue. Local session cleared.")
    } finally {
      // Always clear local memory regardless of network success
      setUser(null)
      setRole(null)
      setIsAuthenticated(false)
      setLoading(false)
      
      // Redirect to login page matching the user's role
      setTimeout(() => {
        window.location.href = currentRole === 'partner' ? '/food-partner/login' : '/user/login'
      }, 500)
    }
  }, [role])

  // ─── ONE-TIME BOOT VERIFICATION ───
  // On first render, verify if the browser has a valid session cookie.
  // This handles page refreshes and returning users automatically.
  useEffect(() => {
    checkUserAuth()
  }, [checkUserAuth])

  return (
    <AuthContext.Provider value={{ 
      user,           // Current user object (name, email, avatar, etc.)
      role,           // 'user' | 'partner' | null
      isAuthenticated, // Boolean: is there an active session?
      loading,        // Boolean: is an auth operation in progress?
      logout,         // Function: call to end the session
      checkUserAuth   // Function: call to re-verify session (after login)
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── CUSTOM HOOK ───
// Provides a clean, type-safe way to access auth state from any component.
// Throws a helpful error if used outside the AuthProvider tree.
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be wrapped inside an AuthProvider")
  }
  return context
}
