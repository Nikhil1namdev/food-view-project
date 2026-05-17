import React from 'react'
import { cn } from '../../lib/utils'

// =========================================================================
// PREMIUM REUSABLE INPUT CONTROL (AuthInput)
// =========================================================================
// Standardizes form inputs, focus ring animations, and placeholder bounds.
// - Supports Lucide React component icons
// - Displays inline error warnings under standard styles
const AuthInput = ({ label, id, icon: Icon, type = "text", placeholder, error, ...props }) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full group">
      {label && (
        <label htmlFor={id} className="text-[9px] font-black text-neutral-500 uppercase tracking-widest pl-1 select-none">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4.5 text-neutral-500 group-focus-within:text-orange-500 transition-colors pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        
        <input 
          id={id}
          type={type}
          placeholder={placeholder}
          className={cn(
            "w-full bg-zinc-950/30 border border-zinc-800 rounded-2xl py-3.5 pr-4.5 text-xs text-zinc-100 placeholder-neutral-500 focus:outline-none focus:border-orange-500/40 focus:ring-4 focus:ring-orange-500/5 transition-all duration-300",
            Icon ? "pl-12" : "pl-4.5"
          )}
          {...props}
        />
      </div>

      {error && (
        <span className="text-[10px] font-bold text-red-500 pl-1 leading-none select-none">
          {error}
        </span>
      )}
    </div>
  )
}

export default AuthInput
