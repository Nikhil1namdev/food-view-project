import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Play } from "lucide-react";

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
// FIXED OVERLAY UX:
//   Uses `fixed inset-0 z-[9999]` to cover the entire screen during initial
//   session boot, hiding the half-loaded sidebar and preventing horizontal
//   scrollbars (the w-screen + sidebar flex-pushing bug).
const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { isAuthenticated, role, loading, user } = useAuth();
  const location = useLocation();

  // ─── Phase 1: Session Verification In Progress ───
  // Display premium full-screen loading spinner while JWT cookie is being verified
  // against the backend. Uses fixed absolute positioning to cover all UI layout shells.
  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 text-white select-none space-y-6">
        <div className="custom-loader"></div>
        <p className="text-[10px] font-black tracking-widest text-zinc-500 uppercase animate-pulse">
          Serving deliciousness...
        </p>
      </div>
    );
  }

  // ─── Phase 2: Authentication Gate ───
  // No valid session detected → redirect to registration portal.
  if (!isAuthenticated) {
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  // ─── Phase 3: Role-Based Access Control (RBAC) ───
  // User is authenticated but doesn't have the required role for this route.
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === "partner") {
      const partnerId = user?._id || user?.id;
      return (
        <Navigate
          to={partnerId ? `/food-partner/${partnerId}` : "/register"}
          replace
        />
      );
    }
    return <Navigate to="/feed" replace />;
  }

  // ─── Phase 4: Authorized Access Granted ───
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
