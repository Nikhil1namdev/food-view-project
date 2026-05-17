import gsap from 'gsap'

// =========================================================================
// REUSABLE GSAP ANIMATION HELPERS (gsap.js)
// =========================================================================
// Provides pre-configured, high-fidelity motion profiles for the ByteBite UI.
// - Standardizes easing functions (power3, back, etc.)
// - Keeps components clean by moving animation configs outside markup files
// - Supports safe element selection checks to avoid runtime crash scripts

/**
 * Basic Fade Up Slide entrance trigger.
 * @param {string|Element} element - Target element to animate
 * @param {object} options - Custom overrides (delay, duration, etc.)
 */
export const animateFadeUp = (element, options = {}) => {
  if (!element) return null
  
  const defaults = {
    y: 0,
    opacity: 1,
    duration: 0.65,
    ease: "power3.out"
  }

  return gsap.fromTo(element, 
    { y: 35, opacity: 0 },
    { ...defaults, ...options }
  )
}

/**
 * Pop spring/elastic scale-up, often used on CTA buttons or metrics badges.
 * @param {string|Element} element - Target element to animate
 */
export const animateHoverPop = (element) => {
  if (!element) return null
  
  return gsap.fromTo(element,
    { scale: 0.95 },
    { scale: 1.05, duration: 0.4, ease: "back.out(2)" }
  )
}

/**
 * Staggered entrance for listings, dashboard cards, or reel buttons.
 * @param {string|NodeList} elements - Node array or query selector
 * @param {object} options - Override parameters (stagger, delay, etc.)
 */
export const animateStagger = (elements, options = {}) => {
  if (!elements || elements.length === 0) return null

  const defaults = {
    scale: 1,
    opacity: 1,
    rotation: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: "back.out(1.8)"
  }

  return gsap.fromTo(elements,
    { scale: 0.8, opacity: 0, rotation: -10 },
    { ...defaults, ...options }
  )
}

/**
 * Smooth, infinite hovering loops for decorative assets.
 * @param {string|Element} element - Floating item target
 * @param {object} options - Options overrides (y bounds, duration, etc.)
 */
export const animateFloat = (element, options = {}) => {
  if (!element) return null

  const defaults = {
    y: -12,
    rotation: 5,
    duration: 3,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut"
  }

  return gsap.to(element, {
    y: defaults.y,
    rotation: defaults.rotation,
    ...defaults,
    ...options
  })
}
