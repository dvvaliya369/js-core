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
 * Creates a throttled function that only invokes func at most once per every
 * `limit` milliseconds. Useful for rate-limiting events like scroll, resize,
 * or mousemove handlers.
 *
 * @param {function} func - The function to throttle
 * @param {number} limit - The minimum time in milliseconds between invocations
 * @returns {function} The throttled function with a `cancel` method to reset state
 *
 * @example
 * const throttledScroll = throttle(handleScroll, 200);
 * window.addEventListener('scroll', throttledScroll);
 * // handleScroll will fire at most once every 200ms no matter how fast the user scrolls
 */
const throttle = (func, limit) => {
    let lastCall = 0;
    let timeoutId = null;

    const throttled = function (...args) {
        const now = Date.now();
        const remaining = limit - (now - lastCall);

        if (remaining <= 0) {
            // Enough time has passed — invoke immediately
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            lastCall = now;
            func.apply(this, args);
        } else {
            // Schedule a trailing call so the last invocation always fires
            clearTimeout(timeoutId);
            const context = this;
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                timeoutId = null;
                func.apply(context, args);
            }, remaining);
        }
    };

    /** Cancel any pending trailing invocation */
    throttled.cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        lastCall = 0;
    };

    return throttled;
};

/**
 * Creates a memoized version of a function that caches the result of each
 * unique set of arguments. Subsequent calls with the same arguments return
 * the cached result without re-executing the function.
 *
 * The cache key is computed by JSON-serialising the arguments array, so it
 * works correctly for primitive values and plain objects / arrays.
 *
 * @param {function} func - The function to memoize
 * @returns {function} The memoized function with a `cache` Map and a `clear` method
 *
 * @example
 * const memoizedFib = memoize(n => n <= 1 ? n : memoizedFib(n - 1) + memoizedFib(n - 2));
 * memoizedFib(40); // computed once, subsequent calls hit the cache
 */
const memoize = (func) => {
    const cache = new Map();

    const memoized = function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = func.apply(this, args);
        cache.set(key, result);
        return result;
    };

    /** Expose the cache so callers can inspect or pre-warm it */
    memoized.cache = cache;

    /** Clear all cached results */
    memoized.clear = () => cache.clear();

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
