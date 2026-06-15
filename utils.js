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
 * Creates a throttled function that only invokes func at most once per every limit milliseconds.
 * Useful for rate-limiting handlers on events like scroll, resize, or mousemove.
 *
 * @param {function} func - The function to throttle
 * @param {number} limit - The number of milliseconds between allowed invocations
 * @returns {function} The throttled function with a .cancel() method to reset the timer
 *
 * @example
 * const throttledScroll = throttle(onScroll, 100);
 * window.addEventListener('scroll', throttledScroll); // fires at most every 100ms
 */
const throttle = (func, limit) => {
    let lastCall = 0;
    let timeout = null;

    function throttled(...args) {
        const now = Date.now();
        const remaining = limit - (now - lastCall);

        if (remaining <= 0) {
            // Enough time has passed — invoke immediately
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            lastCall = now;
            func.apply(this, args);
        } else {
            // Schedule a trailing call so the last invocation always fires
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                lastCall = Date.now();
                timeout = null;
                func.apply(this, args);
            }, remaining);
        }
    }

    throttled.cancel = function () {
        clearTimeout(timeout);
        timeout = null;
        lastCall = 0;
    };

    return throttled;
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = { debounce, throttle };
} else if (typeof exports !== 'undefined') {
    // ES6 modules (for environments that support it)
    exports.debounce = debounce;
    exports.throttle = throttle;
}

// Also make available globally if in browser
if (typeof window !== 'undefined') {
    window.debounce = debounce;
    window.throttle = throttle;
}
