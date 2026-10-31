/**
 * scrollState.js — Conductor de scroll normalizado y reversible
 * 
 * u = progreso normalizado [0, 1] del scroll del documento.
 * uSmooth = u suavizado con lerp para cámara y luz.
 * Determinista y reversible: la misma posición de scroll siempre produce el mismo u.
 */

const state = {
  u: 0,
  uSmooth: 0,
  scrollHeight: 0,
  viewportHeight: 0,
  isWorldVisible: true
};

const LERP_FACTOR = 0.07;

/**
 * Smoothstep interpolation helper
 * @param {number} edge0 - Start of transition
 * @param {number} edge1 - End of transition
 * @param {number} x - Current value
 * @returns {number} Smoothstepped value [0, 1]
 */
export function sm(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Linear interpolation
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Clamp value between min and max
 */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Initialize scroll state tracking on a scroll container element
 * @param {HTMLElement} scrollContainer - The element with the tall height (e.g., 600vh wrapper)
 */
export function initScrollState(scrollContainer) {
  function measure() {
    state.viewportHeight = window.innerHeight;
    state.scrollHeight = scrollContainer.offsetHeight;
  }

  function onScroll() {
    const maxScroll = state.scrollHeight - state.viewportHeight;
    if (maxScroll <= 0) {
      state.u = 0;
      return;
    }
    state.u = clamp(window.scrollY / maxScroll, 0, 1);
  }

  measure();
  onScroll();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    measure();
    onScroll();
  });
}

/**
 * Update the smoothed u value — call once per frame in the render loop
 * @param {number} dt - Delta time (not used for now, lerp is frame-rate dependent)
 */
export function updateSmooth() {
  state.uSmooth = lerp(state.uSmooth, state.u, LERP_FACTOR);
  // Snap if very close to avoid perpetual animation
  if (Math.abs(state.uSmooth - state.u) < 0.0001) {
    state.uSmooth = state.u;
  }
}

/**
 * Get current scroll state (read-only snapshot)
 * @returns {{ u: number, uSmooth: number, isWorldVisible: boolean }}
 */
export function getScrollState() {
  return {
    u: state.u,
    uSmooth: state.uSmooth,
    isWorldVisible: state.u < 1.02
  };
}

/**
 * Force set u to a specific value (for chapter jump buttons)
 */
export function jumpTo(targetU) {
  const maxScroll = state.scrollHeight - state.viewportHeight;
  if (maxScroll <= 0) return;
  const targetScroll = clamp(targetU, 0, 1) * maxScroll;
  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
}

export default state;
