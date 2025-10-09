/**
 * Utility functions collection
 */

/**
 * Creates a deep clone of an object or array, handling nested structures.
 * This function recursively copies all properties and nested objects/arrays,
 * creating a completely independent copy.
 * 
 * @param {*} obj - The object, array, or primitive value to clone
 * @param {WeakMap} [visited] - Internal parameter to track visited objects (prevents circular references)
 * @returns {*} A deep copy of the input
 * 
 * @example
 * const original = { a: 1, b: { c: 2, d: [3, 4] } };
 * const cloned = deepClone(original);
 * cloned.b.c = 99;
 * console.log(original.b.c); // Still 2
 * 
 * @example
 * const originalArray = [1, { a: 2 }, [3, 4]];
 * const clonedArray = deepClone(originalArray);
 * clonedArray[1].a = 99;
 * console.log(originalArray[1].a); // Still 2
 */
function deepClone(obj, visited = new WeakMap()) {
  // Handle primitive values and null/undefined
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle Date objects
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp objects
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle circular references
  if (visited.has(obj)) {
    return visited.get(obj);
  }

  // Handle Arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    visited.set(obj, clonedArray);
    
    for (let i = 0; i < obj.length; i++) {
      clonedArray[i] = deepClone(obj[i], visited);
    }
    
    return clonedArray;
  }

  // Handle plain Objects
  if (obj.constructor === Object || obj.constructor === undefined) {
    const clonedObj = {};
    visited.set(obj, clonedObj);
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key], visited);
      }
    }
    
    return clonedObj;
  }

  // For other object types (like custom classes), create a new instance
  // and copy enumerable properties
  const clonedObj = Object.create(Object.getPrototypeOf(obj));
  visited.set(obj, clonedObj);
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key], visited);
    }
  }
  
  return clonedObj;
}

/**
 * Creates a debounced function that delays the execution of the provided function 
 * until after wait milliseconds have elapsed since the last time it was invoked.
 * This is useful for limiting the rate at which a function can fire, particularly
 * for events like scrolling, resizing, or input field changes.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} [immediate=false] - If true, trigger the function on the leading edge instead of trailing
 * @returns {Function} The debounced function
 * 
 * @example
 * // Debounce a search function to avoid excessive API calls
 * const debouncedSearch = debounce(function(query) {
 *   console.log('Searching for:', query);
 *   // Make API call here
 * }, 300);
 * 
 * // Usage with input field
 * document.getElementById('search').addEventListener('input', function(e) {
 *   debouncedSearch(e.target.value);
 * });
 * 
 * @example
 * // Debounce window resize handler
 * const debouncedResize = debounce(function() {
 *   console.log('Window resized to:', window.innerWidth, 'x', window.innerHeight);
 * }, 250);
 * 
 * window.addEventListener('resize', debouncedResize);
 * 
 * @example
 * // Immediate execution example
 * const debouncedImmediate = debounce(function() {
 *   console.log('Executed immediately, then debounced');
 * }, 1000, true);
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
 * Creates a throttled function that only invokes the provided function at most once 
 * per every wait milliseconds. Unlike debounce, throttle guarantees execution at 
 * regular intervals while the function is being called repeatedly.
 * This is useful for limiting the rate of execution for performance-intensive operations
 * like scroll handlers, mousemove events, or API calls that need regular updates.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to wait between executions
 * @param {Object} [options={}] - Options object
 * @param {boolean} [options.leading=true] - Specify invoking on the leading edge of the timeout
 * @param {boolean} [options.trailing=true] - Specify invoking on the trailing edge of the timeout
 * @returns {Function} The throttled function
 * 
 * @example
 * // Throttle a scroll handler to improve performance
 * const throttledScroll = throttle(function() {
 *   console.log('Scroll position:', window.scrollY);
 *   // Update UI elements based on scroll position
 * }, 100);
 * 
 * window.addEventListener('scroll', throttledScroll);
 * 
 * @example
 * // Throttle API calls for live search
 * const throttledApiCall = throttle(function(query) {
 *   console.log('Making API call for:', query);
 *   fetch('/api/search?q=' + encodeURIComponent(query))
 *     .then(response => response.json())
 *     .then(data => console.log(data));
 * }, 500);
 * 
 * @example
 * // Throttle with custom options (no leading edge)
 * const throttledSave = throttle(function(data) {
 *   console.log('Saving data:', data);
 *   // Save data to server
 * }, 2000, { leading: false, trailing: true });
 * 
 * @example
 * // Throttle mouse move events
 * const throttledMouseMove = throttle(function(event) {
 *   console.log('Mouse position:', event.clientX, event.clientY);
 * }, 50);
 * 
 * document.addEventListener('mousemove', throttledMouseMove);
 */
function throttle(func, wait, options = {}) {
  let timeout;
  let previous = 0;
  let result;
  
  const { leading = true, trailing = true } = options;
  
  const later = function(context, args) {
    previous = leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  
  const throttled = function(...args) {
    const now = Date.now();
    
    if (!previous && leading === false) previous = now;
    
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(this, args);
      if (!timeout) args = null;
    } else if (!timeout && trailing !== false) {
      timeout = setTimeout(() => later(this, args), remaining);
    }
    
    return result;
  };
  
  // Add cancel method to the throttled function
  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = null;
  };
  
  return throttled;
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = { deepClone, debounce, throttle };
} else if (typeof window !== 'undefined') {
  // Browser global
  window.utils = window.utils || {};
  window.utils.deepClone = deepClone;
  window.utils.debounce = debounce;
  window.utils.throttle = throttle;
}

// Also support ES6 modules if needed
if (typeof exports !== 'undefined') {
  exports.deepClone = deepClone;
  exports.debounce = debounce;
  exports.throttle = throttle;
}
