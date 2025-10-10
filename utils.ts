/**
 * Advanced debounce utility with TypeScript support
 */

/**
 * Type definition for a debounced function
 */
export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => ReturnType<T> | undefined;
  pending: () => boolean;
}

/**
 * Options for debounce configuration
 */
export interface DebounceOptions {
  /** If true, trigger the function on the leading edge instead of trailing */
  leading?: boolean;
  /** If true, trigger the function on the trailing edge (default: true) */
  trailing?: boolean;
  /** Maximum time func is allowed to be delayed before it's invoked */
  maxWait?: number;
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds 
 * have elapsed since the last time the debounced function was invoked.
 * 
 * The debounced function comes with additional methods:
 * - cancel(): Cancels any pending function invocations
 * - flush(): Immediately invokes any pending function and returns its result
 * - pending(): Returns true if there are any pending function invocations
 * 
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param options - Options object for advanced configuration
 * @returns The debounced function with additional control methods
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const debouncedSave = debounce((data: string) => {
 *   console.log('Saving:', data);
 * }, 300);
 * 
 * // With options
 * const debouncedSearch = debounce(
 *   (query: string) => searchAPI(query),
 *   500,
 *   { leading: true, maxWait: 1000 }
 * );
 * 
 * // Using control methods
 * debouncedSave('data');
 * if (debouncedSave.pending()) {
 *   debouncedSave.cancel(); // Cancel pending execution
 * }
 * ```
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: DebounceOptions = {}
): DebouncedFunction<T> => {
  const {
    leading = false,
    trailing = true,
    maxWait
  } = options;

  let timeoutId: NodeJS.Timeout | number | undefined;
  let maxTimeoutId: NodeJS.Timeout | number | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | undefined;
  let lastThis: any;
  let result: ReturnType<T> | undefined;

  const invokeFunc = (time: number): ReturnType<T> => {
    const args = lastArgs!;
    const thisArg = lastThis;

    lastArgs = undefined;
    lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  };

  const shouldInvoke = (time: number): boolean => {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  };

  const timerExpired = (): ReturnType<T> | undefined => {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;
    const remainingWait = maxWait === undefined 
      ? timeWaiting
      : Math.min(timeWaiting, maxWait - timeSinceLastInvoke);

    timeoutId = setTimeout(timerExpired, remainingWait);
    return result;
  };

  const trailingEdge = (time: number): ReturnType<T> | undefined => {
    timeoutId = undefined;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = undefined;
    lastThis = undefined;
    return result;
  };

  const leadingEdge = (time: number): ReturnType<T> | undefined => {
    lastInvokeTime = time;
    timeoutId = setTimeout(timerExpired, wait);

    if (maxWait !== undefined) {
      maxTimeoutId = setTimeout(() => {
        if (timeoutId) {
          clearTimeout(timeoutId as any);
          timerExpired();
        }
      }, maxWait);
    }

    return leading ? invokeFunc(time) : result;
  };

  const cancel = (): void => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId as any);
    }
    if (maxTimeoutId !== undefined) {
      clearTimeout(maxTimeoutId as any);
    }
    lastInvokeTime = 0;
    lastArgs = undefined;
    lastCallTime = undefined;
    lastThis = undefined;
    timeoutId = undefined;
    maxTimeoutId = undefined;
  };

  const flush = (): ReturnType<T> | undefined => {
    return timeoutId === undefined ? result : trailingEdge(Date.now());
  };

  const pending = (): boolean => {
    return timeoutId !== undefined;
  };

  const debounced = ((...args: Parameters<T>) => {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        timeoutId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timeoutId === undefined) {
      timeoutId = setTimeout(timerExpired, wait);
    }
    return result;
  }) as DebouncedFunction<T>;

  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;

  return debounced;
};

/**
 * Legacy support - maintains backward compatibility with the old function name
 * @deprecated Use `debounce` instead
 */
export const deeeebounceee = debounce;

export default debounce;
