import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Play } from 'lucide-react'

// =========================================================================
// SECURITY LAYER ROUTE GATING (ProtectedRoute)
// =========================================================================
// Intercepts navigation attempts for authenticated pages.
// Resolves:
// - Direct unauthenticated routing (redirects to signup portal)
// - Privilege escalation prevention (checks against authorized roles)
// - Seamless mount state resolution (displays high-fidelity loader during fetch)
const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { isAuthenticated, role, loading } = useAuth()

  // High-fidelity animated loading spinner for boots and transitions
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-black text-white select-none">
        <div className="relative flex items-center justify-center">
          <div className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-primary/30 opacity-75"></div>
          <Play className="w-8 h-8 text-primary animate-pulse relative z-10" />
        </div>
        <p className="text-xs font-black tracking-widest text-muted-foreground uppercase mt-6 animate-pulse">
          Securing Session...
        </p>
      </div>
    )
  }

  // Redirect to ChooseRegister portal if no active session detected
  if (!isAuthenticated) {
    return <Navigate to="/register" replace />
  }

  // Check role authorization to prevent unauthorized partner access to user flows or vice-versa
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/register" replace />
  }

  // Render children (if directly nested) or Outlet (if wrapping parent route)
  return children ? children : <Outlet />
}

export default ProtectedRoute
