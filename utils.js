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
 * Creates a deep clone of an object, recursively copying all nested objects and arrays.
 * Handles primitives, objects, arrays, and Date instances. Does not handle functions, undefined values in objects, or circular references.
 *
 * @param {*} obj - The object to deep clone
 * @returns {*} The deep cloned object
 *
 * @example
 * const original = { a: 1, b: { c: 2 }, d: [3, 4] };
 * const cloned = deepClone(original);
 * cloned.b.c = 99; // Does not affect original
 * console.log(original.b.c); // 2
 */
const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;

    if (obj instanceof Date) return new Date(obj.getTime());

    if (Array.isArray(obj)) return obj.map(deepClone);

    const cloned = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = { debounce, deepClone };
} else if (typeof exports !== 'undefined') {
    // ES6 modules (for environments that support it)
    exports.debounce = debounce;
    exports.deepClone = deepClone;
}

// Also make available globally if in browser
if (typeof window !== 'undefined') {
    window.debounce = debounce;
    window.deepClone = deepClone;
}
