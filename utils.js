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

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    cloneObject,
    shallowClone
  };
}

// ES6 export (if supported)
if (typeof window !== 'undefined') {
  window.Utils = window.Utils || {};
  window.Utils.cloneObject = cloneObject;
  window.Utils.shallowClone = shallowClone;
}
