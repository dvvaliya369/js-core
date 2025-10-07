/**
 * Utility functions for common JavaScript operations
 */

/**
 * Creates a debounced function that delays invoking the provided function until after
 * wait milliseconds have elapsed since the last time the debounced function was invoked.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - If true, trigger the function on the leading edge instead of trailing
 * @returns {Function} - The debounced function
 * 
 * @example
 * // Basic usage - delays execution for 300ms after last call
 * const debouncedSearch = debounce((query) => {
 *   console.log('Searching for:', query);
 * }, 300);
 * 
 * // Usage with immediate execution
 * const debouncedClick = debounce((event) => {
 *   console.log('Button clicked');
 * }, 1000, true);
 * 
 * // In a real scenario - search input
 * document.getElementById('search').addEventListener('input', 
 *   debounce((e) => performSearch(e.target.value), 500)
 * );
 */
function debounce(func, wait, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}

/**
 * Creates a throttled function that only invokes the provided function at most once per
 * every wait milliseconds.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle invocations to
 * @returns {Function} - The throttled function
 * 
 * @example
 * // Throttle scroll events
 * window.addEventListener('scroll', 
 *   throttle(() => {
 *     console.log('Scroll event triggered');
 *   }, 100)
 * );
 */
function throttle(func, wait) {
  let inThrottle;
  
  return function(...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
}

// Export functions for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle
  };
}

// For browser environments without module system
if (typeof window !== 'undefined') {
  window.Utils = {
    debounce,
    throttle
  };
}
