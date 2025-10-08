/**
 * Throttle function that limits the rate at which a function can fire.
 * The throttled function will only execute at most once every `limit` milliseconds.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} limit - The minimum time in milliseconds between function calls
 * @returns {Function} The throttled function
 * 
 * @example
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event fired');
 * }, 100);
 * 
 * window.addEventListener('scroll', throttledScroll);
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Advanced throttle function with leading and trailing edge options.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} limit - The minimum time in milliseconds between function calls
 * @param {Object} options - Configuration options
 * @param {boolean} options.leading - Execute on the leading edge (default: true)
 * @param {boolean} options.trailing - Execute on the trailing edge (default: true)
 * @returns {Function} The throttled function
 */
function throttleAdvanced(func, limit, options = {}) {
  let timeout;
  let previous = 0;
  const opts = { leading: true, trailing: true, ...options };
  
  return function() {
    const now = Date.now();
    const context = this;
    const args = arguments;
    
    if (!previous && !opts.leading) {
      previous = now;
    }
    
    const remaining = limit - (now - previous);
    
    if (remaining <= 0 || remaining > limit) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout && opts.trailing) {
      timeout = setTimeout(() => {
        previous = opts.leading ? Date.now() : 0;
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { throttle, throttleAdvanced };
}

// Export for ES6 modules
if (typeof window !== 'undefined') {
  window.throttle = throttle;
  window.throttleAdvanced = throttleAdvanced;
}
