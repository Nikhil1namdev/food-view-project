import React from 'react'
import AppLayout from '../layouts/AppLayout'
import MobileLayout from '../layouts/MobileLayout'

// =========================================================================
// RESPONSIVE VIEWPORT LAYOUT DISPATCHER (Layout)
// =========================================================================
// Serves as the global entry shell that routes child pages.
// Uses performant, zero-overhead CSS media queries to swap layouts:
// - AppLayout: Displayed on Desktop screen bounds (hidden md:flex)
// - MobileLayout: Displayed on Phone screen bounds (flex md:hidden)
// Avoids JavaScript window listener resize loops, maximizing rendering performance.
const Layout = () => {
  return (
    <>
      <AppLayout />
      <MobileLayout />
    </>
  )
}

export default Layout
