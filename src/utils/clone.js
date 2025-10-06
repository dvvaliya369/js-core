/**
 * Utility functions for JavaScript
 * Provides object cloning and debounce functionality
 */

/**
 * Performs a shallow clone of an object
 * @param {any} obj - The object to clone
 * @returns {any} A shallow copy of the object
 */
function shallowClone(obj) {
  // Handle null and undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle primitive types
  if (typeof obj !== 'object') {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return [...obj];
  }

  // Handle Date objects
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp objects
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle Map objects
  if (obj instanceof Map) {
    return new Map(obj);
  }

  // Handle Set objects
  if (obj instanceof Set) {
    return new Set(obj);
  }

  // Handle plain objects
  return { ...obj };
}

/**
 * Performs a deep clone of an object
 * @param {any} obj - The object to clone
 * @param {WeakMap} [visited] - Internal parameter to track circular references
 * @returns {any} A deep copy of the object
 */
function deepClone(obj, visited = new WeakMap()) {
  // Handle null and undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle primitive types
  if (typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (visited.has(obj)) {
    return visited.get(obj);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    visited.set(obj, clonedArray);
    
    for (let i = 0; i < obj.length; i++) {
      clonedArray[i] = deepClone(obj[i], visited);
    }
    
    return clonedArray;
  }

  // Handle Date objects
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp objects
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle Map objects
  if (obj instanceof Map) {
    const clonedMap = new Map();
    visited.set(obj, clonedMap);
    
    for (const [key, value] of obj) {
      clonedMap.set(deepClone(key, visited), deepClone(value, visited));
    }
    
    return clonedMap;
  }

  // Handle Set objects
  if (obj instanceof Set) {
    const clonedSet = new Set();
    visited.set(obj, clonedSet);
    
    for (const value of obj) {
      clonedSet.add(deepClone(value, visited));
    }
    
    return clonedSet;
  }

  // Handle plain objects
  const clonedObj = {};
  visited.set(obj, clonedObj);

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key], visited);
    }
  }

  return clonedObj;
}

/**
 * General clone function that can perform both shallow and deep cloning
 * @param {any} obj - The object to clone
 * @param {boolean} [deep=false] - Whether to perform deep cloning
 * @returns {any} A cloned copy of the object
 */
function clone(obj, deep = false) {
  return deep ? deepClone(obj) : shallowClone(obj);
}

// CommonJS exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    shallowClone,
    deepClone,
    clone
  };
}

// ES6 exports
if (typeof window !== 'undefined') {
  window.CloneUtils = {
    shallowClone,
    deepClone,
    clone
  };
}

// Example usage (uncomment to test):
/*
const original = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'New York',
    zip: '10001'
  },
  date: new Date(),
  regex: /test/gi
};

// Shallow clone
const shallow = shallowClone(original);
console.log('Shallow clone:', shallow);

// Deep clone
const deep = deepClone(original);
console.log('Deep clone:', deep);

// Using the general clone function
const shallowClone2 = clone(original, false);
const deepClone2 = clone(original, true);
*/
