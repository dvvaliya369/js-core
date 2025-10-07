/**
 * Utility Functions
 * A collection of commonly used utility functions
 */

/**
 * Creates a debounced version of a function that delays invoking func until 
 * after wait milliseconds have elapsed since the last time the debounced 
 * function was invoked.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - If true, trigger the function on the leading edge instead of trailing
 * @returns {Function} The debounced function
 * 
 * @example
 * // Basic usage
 * const debouncedSearch = debounce((query) => {
 *   console.log('Searching for:', query);
 * }, 300);
 * 
 * // With immediate execution
 * const debouncedSave = debounce(saveData, 1000, true);
 */
function debounce(func, wait, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(this, args);
  };
}

/**
 * Creates a throttled version of a function that only invokes func at most 
 * once per every wait milliseconds.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle invocations to
 * @returns {Function} The throttled function
 */
function throttle(func, wait) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
}

// Export functions for different module systems
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = {
    debounce,
    throttle
  };
} else if (typeof define === 'function' && define.amd) {
  // AMD
  define([], () => ({ debounce, throttle }));
} else {
  // Browser globals
  window.Utils = window.Utils || {};
  window.Utils.debounce = debounce;
  window.Utils.throttle = throttle;
}
