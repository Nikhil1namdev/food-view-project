import React, { useEffect, useRef } from 'react'
import { animateFadeUp } from '../animations/gsap'

// =========================================================================
// HIGH-FIDELITY ROUTE TRANSITION WRAPPER (PageWrapper)
// =========================================================================
// Wraps individual page elements to perform premium entrance animations on mount.
// Ensures visual continuity, eliminates sudden layouts flashes, and gives
// the SPA a native, fluid application-like feel.
const PageWrapper = ({ children, className = "" }) => {
  const wrapperRef = useRef(null)

  useEffect(() => {
    // Elegant slide-up fade-in transition on mount
    animateFadeUp(wrapperRef.current, {
      y: 20,
      duration: 0.5,
      ease: "power2.out"
    })
  }, [])

  return (
    <div 
      ref={wrapperRef} 
      className={`w-full min-h-screen bg-neutral-950 opacity-0 ${className}`}
    >
      {children}
    </div>
  )
}

export default PageWrapper
