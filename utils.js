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
 * wait milliseconds. The throttled function comes with a `cancel` method to
 * cancel delayed invocations and a `flush` method to immediately invoke them.
 *
 * Unlike debounce, throttle guarantees that the function fires at a regular
 * interval as long as it is being called — useful for scroll/resize handlers
 * and rate-limited API calls.
 *
 * @param {function} func  - The function to throttle
 * @param {number}   wait  - Minimum milliseconds between invocations
 * @param {object}   [options]
 * @param {boolean}  [options.leading=true]  - Invoke on the leading edge
 * @param {boolean}  [options.trailing=true] - Invoke on the trailing edge
 * @returns {function} The throttled function (with .cancel() and .flush())
 *
 * @example
 * const throttledScroll = throttle(onScroll, 200);
 * window.addEventListener('scroll', throttledScroll);
 *
 * // Stop all pending invocations
 * throttledScroll.cancel();
 *
 * // Force the pending trailing call to fire immediately
 * throttledScroll.flush();
 */
const throttle = (func, wait, options = {}) => {
    const { leading = true, trailing = true } = options;

    let lastCallTime = 0;
    let lastInvokeTime = 0;
    let timerId = null;
    let lastArgs = null;
    let lastThis = null;
    let result;

    const invokeFunc = (time) => {
        const args = lastArgs;
        const thisArg = lastThis;
        lastArgs = lastThis = null;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
    };

    const startTimer = (pendingFunc, wait) => {
        timerId = setTimeout(pendingFunc, wait);
    };

    const cancelTimer = () => {
        if (timerId !== undefined) clearTimeout(timerId);
        timerId = null;
    };

    const remainingWait = (time) => {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeWaiting = wait - timeSinceLastCall;
        return Math.min(timeWaiting, wait - timeSinceLastInvoke);
    };

    const shouldInvoke = (time) => {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;
        return (
            lastCallTime === 0 ||
            timeSinceLastCall >= wait ||
            timeSinceLastCall < 0 ||
            timeSinceLastInvoke >= wait
        );
    };

    const trailingEdge = (time) => {
        timerId = null;
        if (trailing && lastArgs) return invokeFunc(time);
        lastArgs = lastThis = null;
        return result;
    };

    const timerExpired = () => {
        const time = Date.now();
        if (shouldInvoke(time)) return trailingEdge(time);
        startTimer(timerExpired, remainingWait(time));
    };

    const leadingEdge = (time) => {
        lastInvokeTime = time;
        startTimer(timerExpired, wait);
        return leading ? invokeFunc(time) : result;
    };

    const throttled = function (...args) {
        const time = Date.now();
        const isInvoking = shouldInvoke(time);

        lastArgs = args;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
            if (timerId === null) return leadingEdge(lastCallTime);
            if (trailing) {
                cancelTimer();
                startTimer(timerExpired, wait);
                return invokeFunc(lastCallTime);
            }
        }

        if (timerId === null && trailing) {
            startTimer(timerExpired, wait);
        }

        return result;
    };

    throttled.cancel = () => {
        cancelTimer();
        lastInvokeTime = 0;
        lastCallTime = 0;
        lastArgs = lastThis = null;
    };

    throttled.flush = () => {
        return timerId === null ? result : trailingEdge(Date.now());
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
