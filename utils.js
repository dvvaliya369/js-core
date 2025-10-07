/**
 * JavaScript Utility Functions
 * A collection of common utility functions for JavaScript development
 */

/**
 * Deep clones an object, handling nested objects, arrays, dates, and primitive values
 * @param {any} obj - The object to clone
 * @param {WeakMap} [visited] - Internal parameter to handle circular references
 * @returns {any} A deep clone of the input object
 * 
 * @example
 * const original = { name: 'John', hobbies: ['reading', 'coding'], date: new Date() };
 * const cloned = cloneObject(original);
 * cloned.hobbies.push('swimming');
 * console.log(original.hobbies); // ['reading', 'coding'] - original unchanged
 */
function cloneObject(obj, visited = new WeakMap()) {
  // Handle null and undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle primitive values (string, number, boolean, symbol, bigint)
  if (typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (visited.has(obj)) {
    return visited.get(obj);
  }

  // Handle Date objects
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp objects
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle Arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    visited.set(obj, clonedArray);
    
    for (let i = 0; i < obj.length; i++) {
      clonedArray[i] = cloneObject(obj[i], visited);
    }
    
    return clonedArray;
  }

  // Handle Objects
  const clonedObj = {};
  visited.set(obj, clonedObj);

  // Clone all enumerable properties
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = cloneObject(obj[key], visited);
    }
  }

  return clonedObj;
}

/**
 * Alternative shallow clone function for simple objects
 * @param {Object} obj - The object to shallow clone
 * @returns {Object} A shallow clone of the input object
 * 
 * @example
 * const original = { name: 'John', age: 30 };
 * const cloned = shallowClone(original);
 */
function shallowClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return [...obj];
  }

  return { ...obj };
}

/**
 * Creates a debounced version of a function that delays its execution
 * until after the specified delay period has passed since the last invocation
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @param {boolean} [immediate=false] - If true, trigger on the leading edge instead of trailing
 * @returns {Function} A debounced version of the input function
 * 
 * @example
 * // Basic usage - delays execution until 300ms of inactivity
 * const debouncedSearch = debounce((query) => {
 *   console.log('Searching for:', query);
 * }, 300);
 * 
 * // Usage with immediate execution on first call
 * const debouncedClick = debounce(() => {
 *   console.log('Button clicked!');
 * }, 1000, true);
 * 
 * // The returned function also has a cancel method
 * debouncedSearch.cancel(); // Cancels pending execution
 */
function debounce(func, delay, immediate = false) {
  let timeoutId;
  let lastArgs;
  let lastThis;
  
  const debounced = function(...args) {
    lastArgs = args;
    lastThis = this;
    
    const callNow = immediate && !timeoutId;
    
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Set new timeout
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        func.apply(lastThis, lastArgs);
      }
    }, delay);
    
    // Call immediately if configured to do so
    if (callNow) {
      func.apply(lastThis, lastArgs);
    }
  };
  
  // Add cancel method to the debounced function
  debounced.cancel = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  
  // Add flush method to execute immediately
  debounced.flush = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      func.apply(lastThis, lastArgs);
    }
  };
  
  return debounced;
}

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    cloneObject,
    shallowClone,
    debounce
  };
}

// ES6 export (if supported)
if (typeof window !== 'undefined') {
  window.Utils = window.Utils || {};
  window.Utils.cloneObject = cloneObject;
  window.Utils.shallowClone = shallowClone;
  window.Utils.debounce = debounce;
}
