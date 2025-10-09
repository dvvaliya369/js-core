/**
 * Utility functions for common programming tasks
 */

/**
 * Creates a debounced function that delays invoking the provided function until after
 * wait milliseconds have elapsed since the last time the debounced function was invoked.
 * 
 * @template T - The type of the function to debounce
 * @param {T} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} [immediate=false] - If true, trigger the function on the leading edge instead of trailing
 * @returns {(...args: Parameters<T>) => void} The debounced function
 * 
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 * 
 * // Will only execute once after 300ms of no calls
 * debouncedSearch('hello');
 * debouncedSearch('hello world');
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
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
 * @template T - The type of the function to throttle
 * @param {T} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle invocations to
 * @returns {(...args: Parameters<T>) => void} The throttled function
 * 
 * @example
 * ```typescript
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event handled');
 * }, 100);
 * 
 * window.addEventListener('scroll', throttledScroll);
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function executedFunction(...args: Parameters<T>) {
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
 * ```typescript
 * await delay(1000); // Wait for 1 second
 * console.log('This runs after 1 second');
 * ```
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Checks if a value is not null or undefined
 * 
 * @template T
 * @param {T | null | undefined} value - The value to check
 * @returns {value is T} True if the value is not null or undefined
 * 
 * @example
 * ```typescript
 * const maybeString: string | null = getValue();
 * if (isDefined(maybeString)) {
 *   // TypeScript knows maybeString is string here
 *   console.log(maybeString.toUpperCase());
 * }
 * ```
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Creates a function that can only be called once
 * 
 * @template T - The type of the function
 * @param {T} func - The function to call only once
 * @returns {T} A function that can only be called once
 * 
 * @example
 * ```typescript
 * const initialize = once(() => {
 *   console.log('Initializing...');
 * });
 * 
 * initialize(); // Logs "Initializing..."
 * initialize(); // Does nothing
 * ```
 */
export function once<T extends (...args: any[]) => any>(func: T): T {
  let called = false;
  let result: ReturnType<T>;

  return ((...args: Parameters<T>): ReturnType<T> => {
    if (!called) {
      called = true;
      result = func(...args);
    }
    return result;
  }) as T;
}

export default {
  debounce,
  throttle,
  delay,
  isDefined,
  once
};
