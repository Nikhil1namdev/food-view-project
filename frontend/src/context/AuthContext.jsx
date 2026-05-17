import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

// =========================================================================
// GLOBAL AUTHENTICATION STATE PROVIDER (AuthContext)
// =========================================================================
// Manages global user authentication state, active sessions, and logout flows.
// Protects the app from unauthenticated access and cross-role session hijacking.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Verifies cookie-based active session on application boot
  const checkUserAuth = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:3000/api/auth/check-auth", {
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
  }

  // Logs out merchant or consumer and wipes state parameters
  const logout = async () => {
    try {
      setLoading(true)
      const logoutUrl = role === 'partner' 
        ? "http://localhost:3000/api/auth/food-partner/logout"
        : "http://localhost:3000/api/auth/user/logout"

      await axios.get(logoutUrl, { withCredentials: true })
    } catch (error) {
      console.error("Server-side logout failed:", error)
    } finally {
      // Always clear local memory regardless of network success
      setUser(null)
      setRole(null)
      setIsAuthenticated(false)
      setLoading(false)
    }
  }

  // Trigger one-time session validation on component mounting
  useEffect(() => {
    checkUserAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, loading, logout, checkUserAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook helper for quick state usage in child components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be wrapped inside an AuthProvider")
  }
  return context
}
