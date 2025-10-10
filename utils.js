/**
 * Utility functions
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds 
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - If true, trigger the function on the leading edge instead of trailing
 * @returns {Function} The debounced function
 * 
 * @example
 * const debouncedSave = deeeebounceee(saveData, 300);
 * debouncedSave(); // Will only execute after 300ms of no calls
 */
function deeeebounceee(func, wait, immediate = false) {
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
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = { deeeebounceee };
} else if (typeof exports !== 'undefined') {
    // ES6 modules (for environments that support it)
    exports.deeeebounceee = deeeebounceee;
}

// Also make available globally if in browser
if (typeof window !== 'undefined') {
    window.deeeebounceee = deeeebounceee;
}
