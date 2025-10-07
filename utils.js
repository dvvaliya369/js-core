/**
 * Utility functions for common operations
 */

/**
 * Creates a debounced version of a function that delays invoking the function
 * until after wait milliseconds have elapsed since the last time the debounced
 * function was invoked.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} [immediate=false] - If true, trigger the function on the leading edge instead of trailing
 * @returns {Function} The debounced function
 * 
 * @example
 * // Basic usage
 * const debouncedSave = debounce(saveData, 500);
 * 
 * // With immediate execution
 * const debouncedSearch = debounce(searchAPI, 300, true);
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
 * Creates a throttled version of a function that only invokes the function
 * at most once per every wait milliseconds.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle invocations to
 * @returns {Function} The throttled function
 * 
 * @example
 * const throttledScroll = throttle(handleScroll, 100);
 */
export function throttle(func, wait) {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
}

/**
 * Deep clones an object or array
 * 
 * @param {any} obj - The object to clone
 * @returns {any} A deep copy of the object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * Capitalizes the first letter of a string
 * 
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
export function capitalize(str) {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle,
    deepClone,
    capitalize
  };
}
