/**
 * Utility functions — Throttle
 */

/**
 * Creates a throttled function that invokes func at most once per every wait milliseconds.
 * Unlike debounce (which resets the timer on every call), throttle guarantees the function
 * is called on a fixed schedule — useful for scroll handlers, resize listeners, and
 * any callback that fires at very high frequency.
 *
 * Behaviour:
 *  - Leading edge  (leading=true, default)  : fires immediately on the first call.
 *  - Trailing edge (trailing=true, default) : fires once more after the last call
 *    if the function was invoked during the wait window.
 *  - Setting both leading and trailing to false is a no-op (returns a function that never fires).
 *
 * @param {function} func    - The function to throttle.
 * @param {number}   wait    - Minimum milliseconds between invocations.
 * @param {object}   [options]
 * @param {boolean}  [options.leading=true]  - Invoke on the leading edge of the timeout.
 * @param {boolean}  [options.trailing=true] - Invoke on the trailing edge of the timeout.
 * @returns {function} The throttled function.
 *   The returned function exposes two helpers:
 *     .cancel()  – cancel any pending trailing invocation.
 *     .flush()   – immediately invoke any pending trailing invocation.
 *
 * @example
 * // Fire at most once every 200 ms while the user scrolls
 * window.addEventListener('scroll', throttle(updateScrollIndicator, 200));
 *
 * @example
 * // Leading-only: fire immediately, ignore subsequent calls during the window
 * const throttledSave = throttle(saveDocument, 1000, { trailing: false });
 *
 * @example
 * // Trailing-only: fire once after the burst settles
 * const throttledResize = throttle(recalcLayout, 300, { leading: false });
 */
const throttle = (func, wait, options = {}) => {
    const { leading = true, trailing = true } = options;

    let lastInvokeTime = null; // null means "never invoked"
    let timeout = null;        // handle for the trailing-edge timer
    let lastArgs = null;       // arguments saved for a potential trailing call
    let lastThis = null;       // `this` context saved for a potential trailing call
    let result;                // cached return value from the last real invocation

    /** Execute func and reset bookkeeping. */
    const invoke = (time) => {
        lastInvokeTime = time;
        result = func.apply(lastThis, lastArgs);
        lastThis = lastArgs = null;
        return result;
    };

    /** Called when the trailing timer fires. */
    const trailingEdge = () => {
        timeout = null;
        if (trailing && lastArgs !== null) {
            invoke(Date.now());
        }
    };

    const throttled = function (...args) {
        const now = Date.now();

        // Save context/args for a potential trailing invocation.
        lastThis = this;
        lastArgs = args;

        // First-ever call, or we are past the wait window.
        const neverCalled = lastInvokeTime === null;
        const windowExpired = !neverCalled && (now - lastInvokeTime) >= wait;

        if (neverCalled || windowExpired) {
            // Clear any old trailing timer that may have been left over.
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }

            if (leading) {
                result = invoke(now);
                // If trailing is also enabled, schedule a trailing call for the
                // end of this window so repeated calls within the window get
                // the last set of args delivered.
                // (The timer is only set if a call arrives inside the window.)
            } else {
                // Leading disabled: just record the window start so we know
                // when to allow the next leading-edge fire, and schedule a
                // trailing timer so the first call still fires (at the end).
                lastInvokeTime = now;
                if (trailing && !timeout) {
                    timeout = setTimeout(trailingEdge, wait);
                }
            }
            return result;
        }

        // We are inside the current wait window.
        // Schedule a trailing invocation if one isn't already pending.
        if (trailing && !timeout) {
            const remaining = wait - (now - lastInvokeTime);
            timeout = setTimeout(trailingEdge, remaining);
        }

        return result;
    };

    /**
     * Cancel any pending trailing invocation.
     * Safe to call multiple times.
     */
    throttled.cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        lastInvokeTime = null;
        lastArgs = lastThis = null;
    };

    /**
     * Immediately invoke the pending trailing call (if any) and cancel the timer.
     * Returns the result of the invocation, or the last cached result if there
     * was nothing pending.
     */
    throttled.flush = () => {
        if (timeout && lastArgs !== null) {
            clearTimeout(timeout);
            timeout = null;
            result = invoke(Date.now());
        }
        return result;
    };

    return throttled;
};

// ---------------------------------------------------------------------------
// Module / global export — mirrors the pattern used in utils.js (debounce)
// ---------------------------------------------------------------------------

if (typeof module !== 'undefined' && module.exports) {
    // CommonJS (Node.js)
    module.exports = { throttle };
} else if (typeof exports !== 'undefined') {
    // ES6-style exports shim
    exports.throttle = throttle;
}

// Make available globally when loaded in a browser via <script> tag
if (typeof window !== 'undefined') {
    window.throttle = throttle;
}
