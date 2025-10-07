/**
 * Creates a debounced version of a function that delays its execution until after
 * a specified delay has passed since the last time it was invoked.
 * 
 * @template T - The type of the function to debounce
 * @param func - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the function
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
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function debouncedFunction(...args: Parameters<T>) {
    // Clear the previous timeout if it exists
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Creates a debounced version of a function that returns a Promise.
 * Only the last invocation within the delay period will resolve.
 * Previous pending promises will be rejected with a cancellation error.
 * 
 * @template T - The type of the function to debounce
 * @param func - The async function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the function that returns a Promise
 * 
 * @example
 * ```typescript
 * const debouncedFetch = debounceAsync(async (url: string) => {
 *   const response = await fetch(url);
 *   return response.json();
 * }, 500);
 * 
 * // Only the last call will complete, others will be cancelled
 * debouncedFetch('/api/users/1').catch(() => console.log('Cancelled'));
 * debouncedFetch('/api/users/2').then(data => console.log('Success:', data));
 * ```
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  delay: number
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  let timeoutId: NodeJS.Timeout | null = null;
  let pendingReject: ((reason: any) => void) | null = null;

  return function debouncedAsyncFunction(...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> {
    // Cancel previous pending promise
    if (pendingReject) {
      pendingReject(new Error('Debounced function call cancelled'));
    }

    // Clear the previous timeout
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    return new Promise((resolve, reject) => {
      pendingReject = reject;

      timeoutId = setTimeout(async () => {
        try {
          const result = await func(...args);
          pendingReject = null;
          resolve(result);
        } catch (error) {
          pendingReject = null;
          reject(error);
        }
      }, delay);
    });
  };
}

/**
 * Creates a debounced version of a function with immediate execution option.
 * If immediate is true, the function will be called immediately on the first invocation,
 * then debounced for subsequent calls.
 * 
 * @template T - The type of the function to debounce
 * @param func - The function to debounce
 * @param delay - The delay in milliseconds
 * @param immediate - Whether to execute immediately on first call
 * @returns A debounced version of the function
 */
export function debounceImmediate<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function debouncedImmediateFunction(...args: Parameters<T>) {
    const callNow = immediate && timeoutId === null;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        func(...args);
      }
    }, delay);

    if (callNow) {
      func(...args);
    }
  };
}

export default {
  debounce,
  debounceAsync,
  debounceImmediate,
};
