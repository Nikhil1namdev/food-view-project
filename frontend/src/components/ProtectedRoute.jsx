import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Play } from 'lucide-react'

// =========================================================================
// SECURITY LAYER ROUTE GATING (ProtectedRoute)
// =========================================================================
// Production-level route guard that enforces three layers of security:
//
// 1. AUTHENTICATION CHECK:
//    Unauthenticated users attempting to access any protected page are
//    immediately redirected to the registration portal. The original
//    requested URL is preserved via `location.state.from` so the user
//    can be seamlessly returned after successful login.
//
// 2. ROLE-BASED ACCESS CONTROL (RBAC):
//    Routes declare `allowedRoles` (e.g., ['user'] or ['partner']).
//    If the authenticated user's role doesn't match, they are redirected
//    to their appropriate home page instead of seeing a blank screen.
//    - Consumers ('user') → redirected to Home Feed (/)
//    - Partners ('partner') → redirected to their Dashboard
//
// 3. LOADING STATE RESOLUTION:
//    On first mount, the AuthContext fires a `checkUserAuth()` request.
//    Until that async call resolves, this guard displays a high-fidelity
//    loading animation to prevent flash-of-unauthorized-content (FOUC).
//
// Usage in routes:
//   <Route element={<ProtectedRoute allowedRoles={['user']} />}>
//     <Route path="/" element={<Home />} />
//   </Route>
const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { isAuthenticated, role, loading, user } = useAuth()
  const location = useLocation()

  // ─── Phase 1: Session Verification In Progress ───
  // Display premium loading spinner while JWT cookie is being verified
  // against the backend. This prevents unauthorized content flashes.
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

  // ─── Phase 2: Authentication Gate ───
  // No valid session detected → redirect to registration portal.
  // We store the attempted URL in state.from so login pages can
  // redirect the user back to their original destination after auth.
  if (!isAuthenticated) {
    return <Navigate to="/register" state={{ from: location }} replace />
  }

  // ─── Phase 3: Role-Based Access Control (RBAC) ───
  // User is authenticated but doesn't have the required role for this route.
  // Instead of showing a blank page or error, redirect them to their
  // role-appropriate home page for a seamless experience.
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Partners trying to access consumer pages → send to their dashboard
    if (role === 'partner') {
      const partnerId = user?._id || user?.id
      return <Navigate to={partnerId ? `/food-partner/${partnerId}` : '/register'} replace />
    }
    // Consumers trying to access partner pages → send to home feed
    return <Navigate to="/" replace />
  }

  // ─── Phase 4: Authorized Access Granted ───
  // Render children (if directly nested) or Outlet (if wrapping parent route)
  return children ? children : <Outlet />
}

export default ProtectedRoute
