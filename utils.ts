/**
 * Utility functions with TypeScript support
 */

// TypeScript type definitions
type DebouncedFunction<T extends (...args: any[]) => any> = {
    (...args: Parameters<T>): void;
    cancel: () => void;
    flush: (...args: Parameters<T>) => ReturnType<T> | undefined;
};

type DebounceOptions = {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
};

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds 
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @template T - The type of the function to debounce
 * @param {T} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} [immediate=false] - If true, trigger the function on the leading edge instead of trailing
 * @returns {DebouncedFunction<T>} The debounced function with additional methods
 * 
 * @example
 * const debouncedSave = createDebouncedFunction(saveData, 300);
 * debouncedSave(); // Will only execute after 300ms of no calls
 * 
 * @example
 * const debouncedSearch = createDebouncedFunction(search, 250, true);
 * debouncedSearch(); // Executes immediately, then debounces subsequent calls
 */
const createDebouncedFunction = <T extends (...args: any[]) => any>(
    func: T, 
    wait: number, 
    immediate: boolean = false
): DebouncedFunction<T> => {
    let timeout: NodeJS.Timeout | number | null = null;
    let lastArgs: Parameters<T> | null = null;
    let lastThis: any = null;
    
    const debounced = (...args: Parameters<T>): void => {
        lastArgs = args;
        lastThis = debounced;
        
        const later = (): void => {
            timeout = null;
            if (!immediate && lastArgs) {
                func.apply(lastThis, lastArgs);
            }
        };
        
        const callNow = immediate && !timeout;
        
        if (timeout) {
            clearTimeout(timeout as number);
        }
        timeout = setTimeout(later, wait);
        
        if (callNow && lastArgs) {
            func.apply(lastThis, lastArgs);
        }
    };
    
    // Add cancel method to clear pending executions
    debounced.cancel = (): void => {
        if (timeout) {
            clearTimeout(timeout as number);
            timeout = null;
        }
        lastArgs = null;
        lastThis = null;
    };
    
    // Add flush method to immediately execute pending function
    debounced.flush = (...args: Parameters<T>): ReturnType<T> | undefined => {
        if (timeout) {
            clearTimeout(timeout as number);
            timeout = null;
        }
        
        const argsToUse = args.length > 0 ? args : lastArgs;
        if (argsToUse) {
            return func.apply(lastThis, argsToUse);
        }
        return undefined;
    };
    
    return debounced as DebouncedFunction<T>;
};

/**
 * Legacy alias for backward compatibility
 * @deprecated Use createDebouncedFunction instead
 */
const debounce = createDebouncedFunction;

/**
 * Advanced debounced function with more options
 * 
 * @template T - The type of the function to debounce
 * @param {T} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {DebounceOptions} [options={}] - Additional options
 * @returns {DebouncedFunction<T>} The debounced function with additional methods
 * 
 * @example
 * const debouncedFn = advancedDebounce(myFunction, 300, {
 *   leading: true,
 *   trailing: false,
 *   maxWait: 1000
 * });
 */
const advancedDebounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    options: DebounceOptions = {}
): DebouncedFunction<T> => {
    const {
        leading = false,
        trailing = true,
        maxWait
    } = options;
    
    let timeout: NodeJS.Timeout | number | null = null;
    let maxTimeout: NodeJS.Timeout | number | null = null;
    let lastArgs: Parameters<T> | null = null;
    let lastThis: any = null;
    let lastCallTime: number | null = null;
    let lastInvokeTime = 0;
    
    const invokeFunc = (time: number): ReturnType<T> | undefined => {
        const args = lastArgs;
        const thisArg = lastThis;
        
        lastArgs = null;
        lastThis = null;
        lastInvokeTime = time;
        
        if (args) {
            return func.apply(thisArg, args);
        }
        return undefined;
    };
    
    const leadingEdge = (time: number): ReturnType<T> | undefined => {
        lastInvokeTime = time;
        timeout = setTimeout(timerExpired, wait);
        return leading ? invokeFunc(time) : undefined;
    };
    
    const remainingWait = (time: number): number => {
        const timeSinceLastCall = time - (lastCallTime || 0);
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeWaiting = wait - timeSinceLastCall;
        
        return maxWait !== undefined
            ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
            : timeWaiting;
    };
    
    const shouldInvoke = (time: number): boolean => {
        const timeSinceLastCall = time - (lastCallTime || 0);
        const timeSinceLastInvoke = time - lastInvokeTime;
        
        return (lastCallTime === null || 
                timeSinceLastCall >= wait || 
                timeSinceLastCall < 0 || 
                (maxWait !== undefined && timeSinceLastInvoke >= maxWait));
    };
    
    const timerExpired = (): void => {
        const time = Date.now();
        if (shouldInvoke(time)) {
            trailingEdge(time);
        } else {
            timeout = setTimeout(timerExpired, remainingWait(time));
        }
    };
    
    const trailingEdge = (time: number): ReturnType<T> | undefined => {
        timeout = null;
        
        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        lastArgs = null;
        lastThis = null;
        return undefined;
    };
    
    const debounced = (...args: Parameters<T>): void => {
        const time = Date.now();
        const isInvoking = shouldInvoke(time);
        
        lastArgs = args;
        lastThis = debounced;
        lastCallTime = time;
        
        if (isInvoking) {
            if (timeout === null) {
                leadingEdge(lastCallTime);
                return;
            }
            if (maxWait !== undefined) {
                timeout = setTimeout(timerExpired, wait);
                maxTimeout = setTimeout(() => invokeFunc(time), maxWait);
                return;
            }
        }
        if (timeout === null) {
            timeout = setTimeout(timerExpired, wait);
        }
    };
    
    debounced.cancel = (): void => {
        if (timeout) {
            clearTimeout(timeout as number);
            timeout = null;
        }
        if (maxTimeout) {
            clearTimeout(maxTimeout as number);
            maxTimeout = null;
        }
        lastInvokeTime = 0;
        lastArgs = null;
        lastThis = null;
        lastCallTime = null;
    };
    
    debounced.flush = (...args: Parameters<T>): ReturnType<T> | undefined => {
        if (timeout === null && maxTimeout === null) {
            return undefined;
        }
        
        debounced.cancel();
        const argsToUse = args.length > 0 ? args : lastArgs;
        if (argsToUse) {
            lastArgs = argsToUse;
            return invokeFunc(Date.now());
        }
        return undefined;
    };
    
    return debounced as DebouncedFunction<T>;
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = { 
        createDebouncedFunction, 
        debounce, 
        advancedDebounce 
    };
} else if (typeof exports !== 'undefined') {
    // ES6 modules (for environments that support it)
    exports.createDebouncedFunction = createDebouncedFunction;
    exports.debounce = debounce;
    exports.advancedDebounce = advancedDebounce;
}

// Also make available globally if in browser
if (typeof window !== 'undefined') {
    window.createDebouncedFunction = createDebouncedFunction;
    window.debounce = debounce;
    window.advancedDebounce = advancedDebounce;
}
