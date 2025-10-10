/**
 * Creates a debounced function that delays invoking the provided function 
 * until after wait milliseconds have elapsed since the last time the 
 * debounced function was invoked.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - If true, trigger the function on the leading edge instead of trailing
 * @returns {Function} The debounced function
 * 
 * @example
 * // Basic usage
 * const debouncedFunction = debounce(() => {
 *   console.log('This will be called after 300ms of inactivity');
 * }, 300);
 * 
 * // With immediate execution
 * const immediateDebounced = debounce(() => {
 *   console.log('This will be called immediately, then debounced');
 * }, 300, true);
 * 
 * // Usage with parameters
 * const debouncedSearch = debounce((searchTerm) => {
 *   performSearch(searchTerm);
 * }, 500);
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
 * Creates a throttled function that only invokes the provided function 
 * at most once per every wait milliseconds.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle invocations to
 * @returns {Function} The throttled function
 * 
 * @example
 * const throttledFunction = throttle(() => {
 *   console.log('This will be called at most once every 100ms');
 * }, 100);
 */
function throttle(func, wait) {
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
 * Simple utility to check if a value is a function
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is a function
 */
function isFunction(value) {
  return typeof value === 'function';
}

/**
 * Simple utility to check if a value is a number
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is a number
 */
function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

// Export functions for use in other modules
module.exports = {
  debounce,
  throttle,
  isFunction,
  isNumber
};

// For ES6 modules (if needed)
// export { debounce, throttle, isFunction, isNumber };
