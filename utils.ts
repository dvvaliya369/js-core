/**
 * Utility functions
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param immediate - If true, trigger the function on the leading edge instead of trailing
 * @returns The debounced function
 *
 * @example
 * const debouncedSave = debounce(saveData, 300);
 * debouncedSave(); // Will only execute after 300ms of no calls
 */
const debounce = (func: (...args: any[]) => any, wait: number, immediate: boolean = false): (...args: any[]) => void => {
    let timeout: number | null = null;

    return (...args: any[]) => {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };

        const callNow = immediate && !timeout;

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (callNow) func(...args);
    };
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = { debounce };
} else if (typeof exports !== 'undefined') {
    // ES6 modules (for environments that support it)
    exports.debounce = debounce;
}

// Also make available globally if in browser
if (typeof window !== 'undefined') {
    (window as any).debounce = debounce;
}