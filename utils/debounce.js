/**
 * Debounce utility function
 * 
 * Creates a debounced version of a function that delays its execution until after 
 * the specified delay time has passed since its last invocation.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @param {Object} options - Configuration options
 * @param {boolean} options.immediate - If true, trigger the function on the leading edge instead of trailing
 * @returns {Function} The debounced function
 * 
 * @example
 * // Basic usage
 * const debouncedSearch = debounce(searchFunction, 300);
 * 
 * // With immediate execution
 * const debouncedSubmit = debounce(submitForm, 1000, { immediate: true });
 * 
 * // Cancel pending execution
 * const debouncedFn = debounce(myFunction, 500);
 * debouncedFn.cancel(); // Cancels any pending execution
 */
function debounce(func, delay, options = {}) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  if (typeof delay !== 'number' || delay < 0) {
    throw new TypeError('Expected a non-negative number for delay');
  }

  const { immediate = false } = options;
  let timeoutId = null;
  let lastArgs = null;
  let lastThis = null;

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;

    const callNow = immediate && !timeoutId;

    // Clear the previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        func.apply(lastThis, lastArgs);
      }
    }, delay);

    // If immediate is true and there's no timeout, call the function now
    if (callNow) {
      return func.apply(lastThis, lastArgs);
    }
  }

  // Add a cancel method to clear any pending execution
  debounced.cancel = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  // Add a flush method to immediately execute any pending call
  debounced.flush = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      if (lastArgs !== null) {
        func.apply(lastThis, lastArgs);
      }
    }
  };

  // Add a pending method to check if there's a pending execution
  debounced.pending = function() {
    return timeoutId !== null;
  };

  return debounced;
}

module.exports = {
  debounce
};
