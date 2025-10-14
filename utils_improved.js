/**
 * Enhanced utility functions with improved debounce implementation
 * Now uses arrow functions for clarity and includes TypeScript-style JSDoc comments
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds 
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @template T
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} [immediate=false] - If true, trigger the function on the leading edge instead of trailing
 * @returns {Function & {cancel: Function, flush: Function}} The debounced function with additional methods
 * 
 * @example
 * const debouncedSave = createDebouncedFunction(saveData, 300);
 * debouncedSave(); // Will only execute after 300ms of no calls
 * debouncedSave.cancel(); // Cancel pending execution
 * debouncedSave.flush(); // Execute immediately
 */
const createDebouncedFunction = (func, wait, immediate = false) => {
    let timeout = null;
    let lastArgs = null;
    let lastThis = null;
    
    // Use arrow function for the main debounced function for clarity
    const debounced = (...args) => {
        lastArgs = args;
        lastThis = debounced;
        
        // Arrow function for the later execution
        const later = () => {
            timeout = null;
            if (!immediate && lastArgs) {
                func.apply(lastThis, lastArgs);
            }
        };
        
        const callNow = immediate && !timeout;
        
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
        
        if (callNow && lastArgs) {
            func.apply(lastThis, lastArgs);
        }
    };
    
    // Add cancel method to clear pending executions
    debounced.cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        lastArgs = null;
        lastThis = null;
    };
    
    // Add flush method to immediately execute pending function
    debounced.flush = (...args) => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        
        const argsToUse = args.length > 0 ? args : lastArgs;
        if (argsToUse) {
            return func.apply(lastThis, argsToUse);
        }
        return undefined;
    };
    
    return debounced;
};

/**
 * Legacy alias for backward compatibility
 * @deprecated Use createDebouncedFunction instead for better clarity
 */
const debounce = createDebouncedFunction;

/**
 * Advanced debounced function with more options
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {Object} [options={}] - Additional options
 * @param {boolean} [options.leading=false] - Execute on the leading edge
 * @param {boolean} [options.trailing=true] - Execute on the trailing edge
 * @param {number} [options.maxWait] - Maximum time to wait before execution
 * @returns {Function & {cancel: Function, flush: Function}} The debounced function with additional methods
 * 
 * @example
 * const debouncedFn = advancedDebounce(myFunction, 300, {
 *   leading: true,
 *   trailing: false,
 *   maxWait: 1000
 * });
 */
const advancedDebounce = (func, wait, options = {}) => {
    const {
        leading = false,
        trailing = true,
        maxWait
    } = options;
    
    let timeout = null;
    let maxTimeout = null;
    let lastArgs = null;
    let lastThis = null;
    let lastCallTime = null;
    let lastInvokeTime = 0;
    
    // Arrow function for invoking the function
    const invokeFunc = (time) => {
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
    
    // Arrow function for leading edge
    const leadingEdge = (time) => {
        lastInvokeTime = time;
        timeout = setTimeout(timerExpired, wait);
        return leading ? invokeFunc(time) : undefined;
    };
    
    // Arrow function to calculate remaining wait time
    const remainingWait = (time) => {
        const timeSinceLastCall = time - (lastCallTime || 0);
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeWaiting = wait - timeSinceLastCall;
        
        return maxWait !== undefined
            ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
            : timeWaiting;
    };
    
    // Arrow function to determine if should invoke
    const shouldInvoke = (time) => {
        const timeSinceLastCall = time - (lastCallTime || 0);
        const timeSinceLastInvoke = time - lastInvokeTime;
        
        return (lastCallTime === null || 
                timeSinceLastCall >= wait || 
                timeSinceLastCall < 0 || 
                (maxWait !== undefined && timeSinceLastInvoke >= maxWait));
    };
    
    // Arrow function for when timer expires
    const timerExpired = () => {
        const time = Date.now();
        if (shouldInvoke(time)) {
            trailingEdge(time);
        } else {
            timeout = setTimeout(timerExpired, remainingWait(time));
        }
    };
    
    // Arrow function for trailing edge
    const trailingEdge = (time) => {
        timeout = null;
        
        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        lastArgs = null;
        lastThis = null;
        return undefined;
    };
    
    // Main debounced function using arrow syntax for clarity
    const debounced = (...args) => {
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
    
    // Cancel method using arrow function
    debounced.cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        if (maxTimeout) {
            clearTimeout(maxTimeout);
            maxTimeout = null;
        }
        lastInvokeTime = 0;
        lastArgs = null;
        lastThis = null;
        lastCallTime = null;
    };
    
    // Flush method using arrow function
    debounced.flush = (...args) => {
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
    
    return debounced;
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
