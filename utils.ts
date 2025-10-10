/**
 * Utility functions with TypeScript support
 */

// TypeScript type definitions
export type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
};

export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds 
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param options - Configuration options for debounce behavior
 * @returns The debounced function with cancel and flush methods
 * 
 * @example
 * const debouncedSave = debounce(saveData, 300);
 * debouncedSave(); // Will only execute after 300ms of no calls
 * 
 * @example
 * const debouncedSearch = debounce(search, 500, { leading: true });
 * debouncedSearch(); // Executes immediately, then debounces subsequent calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: DebounceOptions = {}
): DebouncedFunction<T> => {
  const { leading = false, trailing = true } = options;
  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;

  const later = (): void => {
    timeout = null;
    if (trailing && lastArgs) {
      func.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
    }
  };

  const cancel = (): void => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
      lastArgs = null;
      lastThis = null;
    }
  };

  const flush = (): void => {
    if (timeout && lastArgs) {
      func.apply(lastThis, lastArgs);
      cancel();
    }
  };

  const debounced = function (this: any, ...args: Parameters<T>): void {
    lastArgs = args;
    lastThis = this;

    const callNow = leading && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(this, args);
    }
  } as DebouncedFunction<T>;

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced;
};

// For backward compatibility, keep the old function name as an alias
export const deeeebounceee = (
  func: (...args: any[]) => any,
  wait: number,
  immediate: boolean = false
) => {
  console.warn('deeeebounceee is deprecated. Use debounce() instead.');
  return debounce(func, wait, { leading: immediate });
};

// Default export
export default debounce;
