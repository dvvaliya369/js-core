/**
 * Utility functions
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds 
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @param {function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} [immediate=false] - If true, trigger the function on the leading edge instead of trailing
 * @returns {function} The debounced function
 * 
 * @example
 * const debouncedSave = debounce(saveData, 300);
 * debouncedSave(); // Will only execute after 300ms of no calls
 */
const debounce = (func, wait, immediate = false) => {
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
};

/**
 * Creates a throttled function that invokes func at most once per every wait milliseconds.
 * Unlike debounce (which resets the timer on each call), throttle guarantees the function
 * is called at a regular interval — useful for scroll/resize handlers.
 *
 * @param {function} func - The function to throttle
 * @param {number} wait - The minimum number of milliseconds between invocations
 * @param {object} [options={}] - Options object
 * @param {boolean} [options.leading=true]returns {function} The throttled function with a `cancel` method to cancel pending invocations
 *
 * @example
 * // Limit scroll handler to fire at most once every 200ms
 * const throttledScroll = throttle(handleScroll, 200);
 * window.addEventListener('scroll', throttledScroll);
 *
 * // Cancel any pending trailing invocation
 * throttledScroll.cancel();
 */
const throttle = (func, wait, options = {}) => {
    let lastCallTime = 0;
    let timeout = null;
    let lastArgs = null;
    let lastThis = null;

    const { leading = true, trailing = true } = options;

    const invoke = () => {
        lastCallTime = Date.now();
        timeout = null;
        func.apply(lastThis, lastArgs);
        lastArgs = null;
        lastThis = null;
    };

    const throttled = function (...args) {
        const now = Date.now();
        const remaining = wait - (now - lastCallTime);

        lastArgs = args;
        lastThis = this;

        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            if (leading) {
                invoke();
            } else {
                lastCallTime = now;
            }
        } else if (!timeout && trailing) {
            timeout = setTimeout(invoke, remaining);
        }
    };

    throttled.cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        lastCallTime = 0;
        lastArgs = null;
        lastThis = null;
    };

    return throttled;
};

/**
 * Creates a memoized version of func that caches the result of calls with the same arguments.
 * Subsequent calls with identical arguments return the cached result without re-executing func.
 * The cache key is derived from JSON serialization of the arguments by default.
 *
 * @param {function} func - The function to memoize
 * @param {function} [resolver] - Optional function that determines the cache key for a given set of arguments.
 *                                Receives the same arguments as func. Defaults to JSON.stringify.
 * @returns {function} The memoized function with a `cache` Map for inspection/clearing
 *
 * @example
 * const expensiveCalc = (n) => { /* heavy computation *\/ return n * n; };
 * const memoized = memoize(expensiveCalc);
 * memoized(4); // computes → 16
 * memoized(4); // returns cached → 16 (no recomputation)
 *
 * // Custom resolver — cache only by the first argument
 * const memoizedByFirst = memoize(func, (...args) => args[0]);
 *
 * // Clear the cache
 * memoized.cache.clear();
 */
const memoize = (func, resolver) => {
    if (typeof func !== 'function') {
        throw new TypeError('memoize: first argument must be a function');
    }

    const cache = new Map();

    const memoized = function (...args) {
        const key = resolver ? resolver.apply(this, args) : JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = func.apply(this, args);
        cache.set(key, result);
        return result;
    };

    memoized.cache = cache;

    return memoized;
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = { debounce, throttle, memoize };
} else if (typeof exports !== 'undefined') {
    // ES6 modules (for environments that support it)
    exports.debounce = debounce;
    exports.throttle = throttle;
    exports.memoize = memoize;
}

// Also make available globally if in browser
if (typeof window !== 'undefined') {
    window.debounce = debounce;
    window.throttle = throttle;
    window.memoize = memoize;
}
