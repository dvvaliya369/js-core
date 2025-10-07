/**
 * Utility functions for common operations
 */

/**
 * Creates a debounced function that delays invoking the provided function until after
 * the specified delay has elapsed since the last time the debounced function was invoked.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @param {boolean} [immediate=false] - Whether to trigger the function on the leading edge instead of trailing
 * @returns {Function} Returns the new debounced function
 * 
 * @example
 * // Debounce a search function to avoid excessive API calls
 * const debouncedSearch = debounce((query) => {
 *   console.log('Searching for:', query);
 * }, 300);
 * 
 * // This will only log once, 300ms after the last call
 * debouncedSearch('hello');
 * debouncedSearch('hello world');
 * debouncedSearch('hello world!');
 * 
 * @example
 * // Immediate execution on first call
 * const debouncedImmediate = debounce(() => {
 *   console.log('Executed immediately!');
 * }, 1000, true);
 */
export function debounce(func, delay, immediate = false) {
  let timeoutId;
  let lastArgs;
  let lastThis;
  
  return function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    
    const callNow = immediate && !timeoutId;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        func.apply(lastThis, lastArgs);
      }
    }, delay);
    
    if (callNow) {
      func.apply(lastThis, lastArgs);
    }
  };
}

/**
 * Creates a throttled function that only invokes the provided function at most once
 * per specified time period.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} Returns the new throttled function
 * 
 * @example
 * // Throttle scroll event handler
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event handled');
 * }, 100);
 * 
 * window.addEventListener('scroll', throttledScroll);
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Utility function to check if a value is a function
 * 
 * @param {*} value - The value to check
 * @returns {boolean} Returns true if value is a function
 */
export function isFunction(value) {
  return typeof value === 'function';
}

/**
 * Utility function to validate debounce/throttle parameters
 * 
 * @param {Function} func - The function to validate
 * @param {number} delay - The delay to validate
 * @throws {Error} Throws error if parameters are invalid
 */
function validateParameters(func, delay) {
  if (!isFunction(func)) {
    throw new Error('Expected a function as the first parameter');
  }
  
  if (typeof delay !== 'number' || delay < 0) {
    throw new Error('Expected a non-negative number as the delay parameter');
  }
}

export function safeDebounce(func, delay, immediate = false) {
  validateParameters(func, delay);
  return debounce(func, delay, immediate);
}

export function safeThrottle(func, limit) {
  validateParameters(func, limit);
  return throttle(func, limit);
}

// For CommonJS compatibility when testing in Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle,
    safeDebounce,
    safeThrottle,
    isFunction
  };
}
