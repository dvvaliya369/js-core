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
 * Useful for rate-limiting expensive operations triggered by frequent events (scroll, resize, mousemove).
 *
 * @param {function} func - The function to throttle
 * @param {number} wait - The minimum number of milliseconds between invocations
 * @param {object} [options={}] - Optional configuration
 * @param {boolean} [options.leading=true]  - If false, suppress the leading-edge call
 * @param {boolean} [options.trailing=true] - If false, suppress the trailing-edge call
 * @returns {function} The throttled function
 *
 * @example
 * // Fire at most once every 200ms while the user scrolls
 * window.addEventListener('scroll', throttle(updateScrollBar, 200));
 *
 * @example
 * // Leading-only: fires immediately, then is silent for `wait` ms
 * const handleResize = throttle(recalculateLayout, 300, { trailing: false });
 */
const throttle = (func, wait, options = {}) => {
    let lastInvokeTime = 0;
    let timeout = null;
    let lastArgs = null;
    let lastThis = null;

    const { leading = true, trailing = true } = options;

    const invokeFunc = (time) => {
        lastInvokeTime = time;
        timeout = null;
        return func.apply(lastThis, lastArgs);
    };

    const shouldInvoke = (time) => {
        const timeSinceLastInvoke = time - lastInvokeTime;
        return lastInvokeTime === 0 ? leading : timeSinceLastInvoke >= wait;
    };

    const trailingEdge = (time) => {
        timeout = null;
        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        lastArgs = null;
        lastThis = null;
    };

    const throttled = function (...args) {
        const time = Date.now();
        lastArgs = args;
        lastThis = this;

        if (shouldInvoke(time)) {
            if (timeout !== null) {
                clearTimeout(timeout);
                timeout = null;
            }
            return invokeFunc(time);
        }

        if (trailing && timeout === null) {
            const remaining = wait - (time - lastInvokeTime);
            timeout = setTimeout(() => trailingEdge(Date.now()), remaining);
        }
    };

    /**
     * Cancels any pending trailing invocation.
     */
    throttled.cancel = () => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        lastInvokeTime = 0;
        timeout = null;
        lastArgs = null;
        lastThis = null;
    };

    /**
     * Returns true if a trailing call is currently pending.
     */
    throttled.pending = () => timeout !== null;

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
