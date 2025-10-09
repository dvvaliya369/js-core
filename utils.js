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

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = { deepClone };
} else if (typeof window !== 'undefined') {
  // Browser global
  window.utils = window.utils || {};
  window.utils.deepClone = deepClone;
}

// Also support ES6 modules if needed
if (typeof exports !== 'undefined') {
  exports.deepClone = deepClone;
}
