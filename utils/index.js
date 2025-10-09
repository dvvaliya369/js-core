// JavaScript version without TypeScript types
// For use in plain JavaScript projects

/**
 * Creates a debounced function that delays invoking the provided function until after
 * wait milliseconds have elapsed since the last time the debounced function was invoked.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} [immediate=false] - If true, trigger the function on the leading edge instead of trailing
 * @returns {Function} The debounced function
 * 
 * @example
 * const debouncedSearch = debounce((query) => {
 *   console.log('Searching for:', query);
 * }, 300);
 * 
 * // Will only execute once after 300ms of no calls
 * debouncedSearch('hello');
 * debouncedSearch('hello world');
 */
export function debounce(func, wait, immediate = false) {
  let timeout = null;

  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    if (callNow) {
      func(...args);
    }
  };
}

/**
 * Creates a throttled function that only invokes the provided function at most once per
 * every wait milliseconds.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle invocations to
 * @returns {Function} The throttled function
 * 
 * @example
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event handled');
 * }, 100);
 * 
 * window.addEventListener('scroll', throttledScroll);
 */
export function throttle(func, wait) {
  let inThrottle = false;

  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, wait);
    }
  };
}

/**
 * Delays execution for the specified number of milliseconds
 * 
 * @param {number} ms - The number of milliseconds to delay
 * @returns {Promise<void>} A promise that resolves after the delay
 * 
 * @example
 * await delay(1000); // Wait for 1 second
 * console.log('This runs after 1 second');
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Checks if a value is not null or undefined
 * 
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is not null or undefined
 * 
 * @example
 * const maybeString = getValue();
 * if (isDefined(maybeString)) {
 *   console.log(maybeString.toUpperCase());
 * }
 */
export function isDefined(value) {
  return value !== null && value !== undefined;
}

/**
 * Creates a function that can only be called once
 * 
 * @param {Function} func - The function to call only once
 * @returns {Function} A function that can only be called once
 * 
 * @example
 * const initialize = once(() => {
 *   console.log('Initializing...');
 * });
 * 
 * initialize(); // Logs "Initializing..."
 * initialize(); // Does nothing
 */
export function once(func) {
  let called = false;
  let result;

  return (...args) => {
    if (!called) {
      called = true;
      result = func(...args);
    }
    return result;
  };
}

/**
 * Formats a date/time value into a string according to the specified format
 * 
 * @param {Date|number|string} date - The date to format (Date object, timestamp, or date string)
 * @param {string} [format='yyyy-MM-dd HH:mm:ss'] - The format string
 * @param {Object} [options={}] - Additional formatting options
 * @param {string} [options.locale='en-US'] - The locale for formatting
 * @param {string} [options.timeZone] - The timezone for formatting (e.g., 'UTC', 'America/New_York')
 * @returns {string} The formatted date string
 * 
 * Format tokens:
 * - yyyy: 4-digit year
 * - MM: 2-digit month (01-12)
 * - dd: 2-digit day (01-31)
 * - HH: 2-digit hour in 24h format (00-23)
 * - mm: 2-digit minute (00-59)
 * - ss: 2-digit second (00-59)
 * - SSS: 3-digit millisecond (000-999)
 * 
 * @example
 * const now = new Date();
 * 
 * // Basic formatting
 * formatDateTime(now); // '2023-12-25 14:30:45'
 * formatDateTime(now, 'MM/dd/yyyy'); // '12/25/2023'
 * formatDateTime(now, 'yyyy-MM-dd'); // '2023-12-25'
 * formatDateTime(now, 'HH:mm:ss'); // '14:30:45'
 * 
 * // With timezone
 * formatDateTime(now, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'UTC' });
 * formatDateTime(now, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'America/New_York' });
 * 
 * // From timestamp
 * formatDateTime(1703520645000, 'yyyy-MM-dd HH:mm:ss');
 */
export function formatDateTime(date, format = 'yyyy-MM-dd HH:mm:ss', options = {}) {
  // Convert input to Date object
  let dateObj;
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    throw new Error('Invalid date input. Expected Date object, number timestamp, or date string.');
  }

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided.');
  }

  const { locale = 'en-US', timeZone } = options;

  // Create formatter options
  const formatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  if (timeZone) {
    formatOptions.timeZone = timeZone;
  }

  // Get formatted parts using Intl.DateTimeFormat
  const formatter = new Intl.DateTimeFormat(locale, formatOptions);
  const parts = formatter.formatToParts(dateObj);

  // Create a map of part types to values
  const partMap = {};
  parts.forEach(part => {
    partMap[part.type] = part.value;
  });

  // Get milliseconds separately since Intl.DateTimeFormat doesn't include them
  const milliseconds = dateObj.getMilliseconds().toString().padStart(3, '0');

  // Replace format tokens
  let result = format
    .replace(/yyyy/g, partMap.year)
    .replace(/MM/g, partMap.month)
    .replace(/dd/g, partMap.day)
    .replace(/HH/g, partMap.hour)
    .replace(/mm/g, partMap.minute)
    .replace(/ss/g, partMap.second)
    .replace(/SSS/g, milliseconds);

  return result;
}

/**
 * Creates a clone of an object or value
 * 
 * @param {*} obj - The object or value to clone
 * @param {boolean} [deep=false] - Whether to perform deep cloning
 * @returns {*} The cloned object or value
 * 
 * @example
 * // Shallow clone
 * const original = { a: 1, b: { c: 2 } };
 * const shallowClone = clone(original);
 * shallowClone.a = 999;
 * console.log(original.a); // 1 (unchanged)
 * shallowClone.b.c = 999;
 * console.log(original.b.c); // 999 (changed because b is shared)
 * 
 * // Deep clone
 * const deepClone = clone(original, true);
 * deepClone.b.c = 777;
 * console.log(original.b.c); // 2 (unchanged)
 * 
 * // Works with arrays
 * const arr = [1, 2, { x: 3 }];
 * const clonedArr = clone(arr, true);
 * 
 * // Works with dates
 * const date = new Date();
 * const clonedDate = clone(date);
 */
export function clone(obj, deep = false) {
  // Handle null and undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle primitive types
  if (typeof obj !== 'object') {
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

  // Handle Arrays
  if (Array.isArray(obj)) {
    if (deep) {
      return obj.map(item => clone(item, true));
    } else {
      return [...obj];
    }
  }

  // Handle Functions (return as-is since functions are typically shared)
  if (typeof obj === 'function') {
    return obj;
  }

  // Handle plain objects
  if (obj.constructor === Object || obj.constructor === undefined) {
    const cloned = {};
    
    if (deep) {
      // Deep clone - recursively clone all properties
      // Use a WeakMap to track circular references
      return cloneDeepWithCircularCheck(obj, new WeakMap());
    } else {
      // Shallow clone - copy enumerable own properties
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = obj[key];
        }
      }
      return cloned;
    }
  }

  // For other object types (custom classes, etc.), return a shallow copy
  // or the original object depending on the deep flag
  if (deep) {
    // Attempt to create a new instance and copy properties
    try {
      const cloned = Object.create(Object.getPrototypeOf(obj));
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = clone(obj[key], true);
        }
      }
      return cloned;
    } catch (e) {
      // If we can't clone it, return the original
      return obj;
    }
  } else {
    return obj;
  }
}

/**
 * Internal helper function for deep cloning with circular reference detection
 * 
 * @private
 * @param {*} obj - The object to clone
 * @param {WeakMap} visited - Map to track visited objects for circular reference detection
 * @returns {*} The deeply cloned object
 */
function cloneDeepWithCircularCheck(obj, visited) {
  // Handle null and undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle primitive types
  if (typeof obj !== 'object') {
    return obj;
  }

  // Check for circular references
  if (visited.has(obj)) {
    throw new Error('Cannot clone object with circular references');
  }

  // Handle Date objects
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp objects
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle Functions
  if (typeof obj === 'function') {
    return obj;
  }

  // Mark this object as visited
  visited.set(obj, true);

  let cloned;

  // Handle Arrays
  if (Array.isArray(obj)) {
    cloned = [];
    for (let i = 0; i < obj.length; i++) {
      cloned[i] = cloneDeepWithCircularCheck(obj[i], visited);
    }
  } else if (obj.constructor === Object || obj.constructor === undefined) {
    // Handle plain objects
    cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = cloneDeepWithCircularCheck(obj[key], visited);
      }
    }
  } else {
    // Handle other object types
    try {
      cloned = Object.create(Object.getPrototypeOf(obj));
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = cloneDeepWithCircularCheck(obj[key], visited);
        }
      }
    } catch (e) {
      cloned = obj;
    }
  }

  // Remove from visited map after cloning
  visited.delete(obj);

  return cloned;
}

export default {
  debounce,
  throttle,
  delay,
  isDefined,
  once,
  formatDateTime,
  clone
};
