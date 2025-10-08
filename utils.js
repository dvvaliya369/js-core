/**
 * Utility functions for common JavaScript operations
 */

/**
 * Creates a debounced version of a function that delays its execution
 * until after the specified delay has passed since its last invocation.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @param {boolean} [immediate=false] - If true, trigger the function on the leading edge instead of trailing
 * @returns {Function} The debounced function
 * 
 * @example
 * // Basic usage - delays execution by 300ms after last call
 * const debouncedSearch = debounce((query) => {
 *   console.log('Searching for:', query);
 * }, 300);
 * 
 * // Usage with immediate execution
 * const debouncedSave = debounce(() => {
 *   console.log('Saving data...');
 * }, 1000, true);
 * 
 * // Cancel pending execution
 * debouncedSearch.cancel();
 * 
 * // Execute immediately, bypassing the delay
 * debouncedSearch.flush();
 */
function debounce(func, delay, immediate = false) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  if (typeof delay !== 'number' || delay < 0) {
    throw new TypeError('Expected delay to be a non-negative number');
  }

  let timeoutId;
  let lastArgs;
  let lastThis;
  let result;

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;

    const callNow = immediate && !timeoutId;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        result = func.apply(lastThis, lastArgs);
      }
    }, delay);
    
    if (callNow) {
      result = func.apply(lastThis, lastArgs);
    }
    
    return result;
  }

  // Cancel any pending execution
  debounced.cancel = function() {
    clearTimeout(timeoutId);
    timeoutId = null;
  };

  // Execute immediately, bypassing the delay
  debounced.flush = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      result = func.apply(lastThis, lastArgs);
    }
    return result;
  };

  // Check if there's a pending execution
  debounced.pending = function() {
    return timeoutId != null;
  };

  return debounced;
}

/**
 * Creates a throttled version of a function that limits its execution
 * to at most once per specified time period.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} The throttled function
 * 
 * @example
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event handled');
 * }, 100);
 */
function throttle(func, limit) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  if (typeof limit !== 'number' || limit < 0) {
    throw new TypeError('Expected limit to be a non-negative number');
  }

  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle
  };
}

// For browser environments without module system
if (typeof window !== 'undefined') {
  window.debounce = debounce;
  window.throttle = throttle;
}
