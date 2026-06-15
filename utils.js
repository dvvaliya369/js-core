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
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 * Subsequent calls within the wait period are queued and executed only at the trailing edge,
 * unless the trailing option is disabled.
 *
 * @param {function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle invocations to
 * @param {object} [options={}] - Options object
 * @param {boolean} [options.leading=true] - If true, invoke on the leading edge of the timeout
 * @param {boolean} [options.trailing=true] - If true, invoke on the trailing edge of the timeout
 * @returns {function} The throttled function
 *
 * @example
 * // Throttle scroll handler to fire at most once every 200ms
 * const throttledScroll = throttle(handleScroll, 200);
 * window.addEventListener('scroll', throttledScroll);
 *
 * @example
 * // Leading-edge only (fires immediately, ignores trailing call)
 * const throttledClick = throttle(handleClick, 500, { trailing: false });
 */
const throttle = (func, wait, options = {}) => {
    let lastCallTime = 0;
    let timeout = null;
    let lastArgs = null;
    let lastThis = null;

    const { leading = true, trailing = true } = options;

    const invokeFunc = () => {
        lastCallTime = Date.now();
        timeout = null;
        func.apply(lastThis, lastArgs);
        lastArgs = null;
        lastThis = null;
    };

    return function throttled(...args) {
        const now = Date.now();
        const isFirstCall = lastCallTime === 0;
        const remaining = wait - (now - lastCallTime);

        lastArgs = args;
        lastThis = this;

        if (remaining <= 0 || remaining > wait) {
            // Past the wait window: invoke immediately
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            if (leading || !isFirstCall) {
                lastCallTime = now;
                func.apply(this, args);
                lastArgs = null;
                lastThis = null;
            }
        } else if (!timeout && trailing) {
            // Still within wait window: schedule a trailing call
            timeout = setTimeout(invokeFunc, remaining);
        }
    };
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
