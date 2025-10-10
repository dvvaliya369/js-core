/**
 * Creates a debounced version of a function that delays its execution until after
 * the specified delay period has passed since the last time it was invoked.
 * 
 * @param func - The function to debounce
 * @param delay - The number of milliseconds to delay execution
 * @returns A debounced version of the input function
 * 
 * @example
 * ```javascript
 * const debouncedSearch = debounce((query) => {
 *   console.log('Searching for:', query);
 * }, 300);
 * 
 * // Will only execute once after 300ms, even if called multiple times
 * debouncedSearch('hello');
 * debouncedSearch('hello world');
 * debouncedSearch('hello world!');
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
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
 * @param func - The function to debounce
 * @param delay - The number of milliseconds to delay execution
 * @returns An object with the debounced function and a cancel method
 * 
 * @example
 * ```javascript
 * const { debounced, cancel } = debounceWithCancel((data) => {
 *   console.log('Processing:', data);
 * }, 500);
 * 
 * debounced('test');
 * // Cancel the pending execution
 * cancel();
 * ```
 */
export function debounceWithCancel<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): {
  debounced: (...args: Parameters<T>) => void;
  cancel: () => void;
} {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = function(this: ThisParameterType<T>, ...args: Parameters<T>) {
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
 * @param func - The function to debounce
 * @param delay - The number of milliseconds to delay execution
 * @returns A debounced version of the input function with immediate first execution
 * 
 * @example
 * ```javascript
 * const debouncedImmediate = debounceImmediate((value) => {
 *   console.log('Value:', value);
 * }, 1000);
 * 
 * // Executes immediately
 * debouncedImmediate('first');
 * // These will be debounced
 * debouncedImmediate('second');
 * debouncedImmediate('third');
 * ```
 */
export function debounceImmediate<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isFirstCall = true;

  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
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
