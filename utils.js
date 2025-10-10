/**
 * Utility functions for common operations
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - If true, trigger the function on the leading edge instead of trailing
 * @returns {Function} Returns the new debounced function
 * 
 * @example
 * // Debounce a search function to avoid excessive API calls
 * const debouncedSearch = debounce((query) => {
 *   console.log('Searching for:', query);
 * }, 300);
 * 
 * // This will only execute once after 300ms of no calls
 * debouncedSearch('hello');
 * debouncedSearch('world');
 */
export function debounce(func, wait, immediate = false) {
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
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle invocations to
 * @returns {Function} Returns the new throttled function
 * 
 * @example
 * // Throttle scroll event handler
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event fired');
 * }, 100);
 * 
 * window.addEventListener('scroll', throttledScroll);
 */
export function throttle(func, wait) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
}

/**
 * Delays execution of a function by the specified number of milliseconds
 * 
 * @param {number} ms - Number of milliseconds to delay
 * @returns {Promise} A promise that resolves after the specified delay
 * 
 * @example
 * // Wait 1 second before continuing
 * await delay(1000);
 * console.log('This runs after 1 second');
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
