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

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = { deepClone, debounce };
} else if (typeof window !== 'undefined') {
  // Browser global
  window.utils = window.utils || {};
  window.utils.deepClone = deepClone;
  window.utils.debounce = debounce;
}

// Also support ES6 modules if needed
if (typeof exports !== 'undefined') {
  exports.deepClone = deepClone;
  exports.debounce = debounce;
}
