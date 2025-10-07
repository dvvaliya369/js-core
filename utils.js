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

/**
 * Creates a throttled version of a function that limits its execution
 * to at most once per specified time period
 * @param {Function} func - The function to throttle
 * @param {number} delay - The throttle delay in milliseconds
 * @param {Object} [options={}] - Configuration options
 * @param {boolean} [options.leading=true] - Execute on the leading edge
 * @param {boolean} [options.trailing=true] - Execute on the trailing edge
 * @returns {Function} A throttled version of the input function
 * 
 * @example
 * // Basic usage - limits execution to once per 1000ms
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event handled');
 * }, 1000);
 * 
 * // Usage with options - only execute on leading edge
 * const throttledClick = throttle(() => {
 *   console.log('Button clicked!');
 * }, 500, { leading: true, trailing: false });
 * 
 * // Usage with options - only execute on trailing edge
 * const throttledInput = throttle((value) => {
 *   console.log('Input value:', value);
 * }, 300, { leading: false, trailing: true });
 * 
 * // The returned function has cancel and flush methods
 * throttledScroll.cancel(); // Cancels pending execution
 * throttledScroll.flush();  // Immediately executes if pending
 */
function throttle(func, delay, options = {}) {
  // Validate inputs
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  if (typeof delay !== 'number' || delay < 0) {
    throw new TypeError('Expected a non-negative number for delay');
  }

  const { leading = true, trailing = true } = options;
  
  let timeoutId;
  let lastCallTime = 0;
  let lastArgs;
  let lastThis;
  let result;

  const invokeFunc = (time) => {
    const args = lastArgs;
    const thisArg = lastThis;
    
    lastArgs = lastThis = undefined;
    lastCallTime = time;
    result = func.apply(thisArg, args);
    return result;
  };

  const leadingEdge = (time) => {
    // Reset the last call time
    lastCallTime = time;
    
    // Start the timer for the trailing edge
    timeoutId = setTimeout(timerExpired, delay);
    
    // If leading, invoke the function immediately
    return leading ? invokeFunc(time) : result;
  };

  const remainingWait = (time) => {
    const timeSinceLastCall = time - lastCallTime;
    return delay - timeSinceLastCall;
  };

  const shouldInvoke = (time) => {
    const timeSinceLastCall = time - lastCallTime;
    
    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === 0 || (timeSinceLastCall >= delay) ||
            (timeSinceLastCall < 0));
  };

  const timerExpired = () => {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer
    timeoutId = setTimeout(timerExpired, remainingWait(time));
  };

  const trailingEdge = (time) => {
    timeoutId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  };

  const throttled = function(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(time);
      }
      // Handle invocations in a tight loop
      timeoutId = setTimeout(timerExpired, delay);
      return leading ? invokeFunc(time) : result;
    }
    
    if (timeoutId === undefined) {
      timeoutId = setTimeout(timerExpired, remainingWait(time));
    }
    
    return result;
  };

  // Add cancel method to the throttled function
  throttled.cancel = function() {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    lastCallTime = 0;
    lastArgs = lastThis = timeoutId = undefined;
  };

  // Add flush method to execute immediately if pending
  throttled.flush = function() {
    return timeoutId === undefined ? result : trailingEdge(Date.now());
  };

  return throttled;
}

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    cloneObject,
    shallowClone,
    debounce,
    throttle
  };
}

// ES6 export (if supported)
if (typeof window !== 'undefined') {
  window.Utils = window.Utils || {};
  window.Utils.cloneObject = cloneObject;
  window.Utils.shallowClone = shallowClone;
  window.Utils.debounce = debounce;
  window.Utils.throttle = throttle;
}
