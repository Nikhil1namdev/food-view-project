import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Play } from 'lucide-react'

// =========================================================================
// GUEST-ONLY ROUTE GUARD (GuestRoute)
// =========================================================================
// Prevents already-authenticated users from accessing login/register pages.
//
// Problem this solves:
//   After a user logs in, if they manually type /user/login in the URL bar,
//   they would see the login form again even though they're already signed in.
//   This creates a confusing UX and potential security issues (double sessions).
//
// How it works:
//   1. If user is NOT authenticated → render the login/register page normally
//   2. If user IS authenticated → redirect them to their role-appropriate home:
//      - Consumers ('user') → Home Feed (/)
//      - Partners ('partner') → Their Dashboard (/food-partner/:id)
//
// Usage in routes:
//   <Route path="/user/login" element={
//     <GuestRoute><UserLogin /></GuestRoute>
//   } />
const GuestRoute = ({ children }) => {
  const { isAuthenticated, role, loading, user } = useAuth()
  const location = useLocation()

  // Wait for auth state to resolve before making a decision
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-black text-white select-none">
        <div className="relative flex items-center justify-center">
          <div className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-primary/30 opacity-75"></div>
          <Play className="w-8 h-8 text-primary animate-pulse relative z-10" />
        </div>
        <p className="text-xs font-black tracking-widest text-muted-foreground uppercase mt-6 animate-pulse">
          Checking Session...
        </p>
      </div>
    )
  }

  // ─── Already Logged In: Redirect to Role-Appropriate Home ───
  if (isAuthenticated) {
    // If there's a saved "from" location (user was redirected here), go back there
    const from = location.state?.from?.pathname

    if (from) {
      return <Navigate to={from} replace />
    }

    // Otherwise, redirect based on role
    if (role === 'partner') {
      const partnerId = user?._id || user?.id
      return <Navigate to={partnerId ? `/food-partner/${partnerId}` : '/'} replace />
    }

    // Default: send consumers to home feed
    return <Navigate to="/" replace />
  }

  // ─── Not Logged In: Render the Auth Page Normally ───
  return children
}

export default GuestRoute
