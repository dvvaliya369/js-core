/**
 * Utility functions
 */

/**
 * Generates a random unique ID using crypto API if available, otherwise falls back to random-based generation.
 *
 * @param {number} [length=8] - The length of the ID to generate
 * @returns {string} A random unique ID
 *
 * @example
 * const id = generateUniqueId(); // e.g. "a1b2c3d4"
 * const longId = generateUniqueId(16); // 16-character ID
 */
const generateUniqueId = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        // Use cryptographically secure random
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        for (let i = 0; i < length; i++) {
            result += chars.charAt(array[i] % chars.length);
        }
    } else {
        // Fallback to less secure method
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    }
    
    return result;
};

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
    window.debounce = debounce;
}
