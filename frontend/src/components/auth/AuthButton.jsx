import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

// =========================================================================
// PREMIUM ACTION CONTROLLER BUTTON (AuthButton)
// =========================================================================
// Features:
// - Built-in loader spinners to track active async submissions
// - Tactile transform scaling on active press states
const AuthButton = ({ children, loading = false, disabled = false, type = "submit", className = "", ...props }) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xs py-4.5 rounded-2xl shadow-lg shadow-orange-500/10 transition-all duration-300 active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none",
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-white" />
      ) : (
        children
      )}
    </button>
  )
}

export default AuthButton
