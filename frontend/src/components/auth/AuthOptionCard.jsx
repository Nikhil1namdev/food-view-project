import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'

// =========================================================================
// REGISTER ROLE OPTION CARD (AuthOptionCard)
// =========================================================================
// Renders high-fidelity selection cards on registration role portals.
// Features:
// - Lucide react component icons
// - Clean responsive scaling and layout offsets
const AuthOptionCard = ({ title, description, to, icon: Icon }) => {
  return (
    <Link 
      to={to}
      className="group h-28 flex items-center justify-between p-5 rounded-2xl border border-zinc-800 bg-zinc-950/20 hover:bg-zinc-900/30 hover:border-orange-500/20 transition-all duration-300 active:scale-95 shadow-sm w-full"
    >
      
      <div className="flex items-center space-x-4">
        {Icon && (
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        <div className="text-left">
          <h3 className="text-sm font-black text-white group-hover:text-orange-400 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-[10px] text-neutral-400 font-semibold mt-0.5 leading-snug max-w-[200px]">
            {description}
          </p>
        </div>
      </div>

      <div className="text-neutral-500 group-hover:text-orange-500 group-hover:translate-x-1.5 transition-all duration-300">
        <ArrowRight className="w-4 h-4" />
      </div>

    </Link>
  )
}

export default AuthOptionCard
