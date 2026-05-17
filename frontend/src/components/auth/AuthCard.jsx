import React from 'react'

// =========================================================================
// GLASSMORPHIC WRAPPER PANEL (AuthCard)
// =========================================================================
// Renders visual bounds using professional glassmorphism standards.
const AuthCard = ({ children, className = "" }) => {
  return (
    <div 
      className={`glass-card p-6 md:p-8 rounded-3xl ${className}`}
      role="region"
    >
      {children}
    </div>
  )
}

export default AuthCard
