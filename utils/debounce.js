/**
 * Creates a debounced version of a function that delays its execution until after
 * the specified delay period has passed since the last time it was invoked.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} delay - The number of milliseconds to delay execution
 * @returns {Function} A debounced version of the input function
 * 
 * @example
 * const debouncedSearch = debounce((query) => {
 *   console.log('Searching for:', query);
 * }, 300);
 * 
 * // Will only execute once after 300ms, even if called multiple times
 * debouncedSearch('hello');
 * debouncedSearch('hello world');
 * debouncedSearch('hello world!');
 */
export function debounce(func, delay) {
  let timeoutId = null;

  return function(...args) {
    // Clear the previous timeout if it exists
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Creates a debounced version of a function that also returns a cancel method
 * to manually cancel the pending execution.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} delay - The number of milliseconds to delay execution
 * @returns {Object} An object with the debounced function and a cancel method
 * 
 * @example
 * const { debounced, cancel } = debounceWithCancel((data) => {
 *   console.log('Processing:', data);
 * }, 500);
 * 
 * debounced('test');
 * // Cancel the pending execution
 * cancel();
 */
export function debounceWithCancel(func, delay) {
  let timeoutId = null;

  const debounced = function(...args) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };

  const cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return { debounced, cancel };
}

/**
 * Creates a debounced version of a function that executes immediately on the first call,
 * then debounces subsequent calls.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} delay - The number of milliseconds to delay execution
 * @returns {Function} A debounced version of the input function with immediate first execution
 * 
 * @example
 * const debouncedImmediate = debounceImmediate((value) => {
 *   console.log('Value:', value);
 * }, 1000);
 * 
 * // Executes immediately
 * debouncedImmediate('first');
 * // These will be debounced
 * debouncedImmediate('second');
 * debouncedImmediate('third');
 */
export function debounceImmediate(func, delay) {
  let timeoutId = null;
  let isFirstCall = true;

  return function(...args) {
    if (isFirstCall) {
      func.apply(this, args);
      isFirstCall = false;
      return;
    }

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
      isFirstCall = true;
    }, delay);
  };
}
