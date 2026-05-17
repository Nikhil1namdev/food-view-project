import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Play } from 'lucide-react'

// =========================================================================
// GUEST-ONLY ROUTE GUARD (GuestRoute)
// =========================================================================
// Prevents already-authenticated users from accessing login/register pages.
//
// FIXED OVERLAY UX:
//   Uses `fixed inset-0 z-[9999]` to cover the entire screen during initial
//   session boot, keeping the UX clean and consistent with ProtectedRoute.
const GuestRoute = ({ children }) => {
  const { isAuthenticated, role, loading, user } = useAuth()
  const location = useLocation()

  // Wait for auth state to resolve before making a decision
  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 text-white select-none space-y-6">
        <div className="custom-loader"></div>
        <p className="text-[10px] font-black tracking-widest text-zinc-500 uppercase animate-pulse">
          Serving deliciousness...
        </p>
      </div>
    )
  }

  // ─── Already Logged In: Redirect to Role-Appropriate Home ───
  if (isAuthenticated) {
    const from = location.state?.from?.pathname

    if (from) {
      return <Navigate to={from} replace />
    }

    if (role === 'partner') {
      const partnerId = user?._id || user?.id
      return <Navigate to={partnerId ? `/food-partner/${partnerId}` : '/feed'} replace />
    }

    return <Navigate to="/feed" replace />
  }

  // ─── Not Logged In: Render the Auth Page Normally ───
  return children
}

export default GuestRoute
