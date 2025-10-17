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
 * 
 * @param {function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle invocations to
 * @param {boolean} [trailing=true] - If true, invoke func on the trailing edge of the timeout
 * @returns {function} The throttled function
 * 
 * @example
 * const throttledScroll = throttle(handleScroll, 100);
 * window.addEventListener('scroll', throttledScroll);
 */
const throttle = (func, wait, trailing = true) => {
    let timeout;
    let previous = 0;
    
    return function executedFunction(...args) {
        const now = Date.now();
        
        if (!previous) previous = now;
        
        const remaining = wait - (now - previous);
        
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(this, args);
        } else if (!timeout && trailing) {
            timeout = setTimeout(() => {
                previous = Date.now();
                timeout = null;
                func.apply(this, args);
            }, remaining);
        }
    };
};

/**
 * Generates a random unique identifier with customizable options.
 * 
 * @param {Object} [options={}] - Configuration options
 * @param {number} [options.length=8] - Length of the generated ID
 * @param {string} [options.type='alphanumeric'] - Type of ID: 'uuid', 'alphanumeric', 'alphabetic', 'numeric', 'hex'
 * @param {string} [options.prefix=''] - Prefix to add to the generated ID
 * @param {string} [options.suffix=''] - Suffix to add to the generated ID
 * @param {boolean} [options.uppercase=false] - Whether to convert alphabetic characters to uppercase
 * @param {boolean} [options.timestamp=false] - Whether to include timestamp for additional uniqueness
 * @returns {string} The generated unique ID
 * 
 * @example
 * generateId(); // 'a1b2c3d4'
 * generateId({ length: 12 }); // 'a1b2c3d4e5f6'
 * generateId({ type: 'uuid' }); // '550e8400-e29b-41d4-a716-446655440000'
 * generateId({ type: 'numeric', length: 6 }); // '123456'
 * generateId({ prefix: 'user_', suffix: '_id', length: 8 }); // 'user_a1b2c3d4_id'
 * generateId({ type: 'alphabetic', uppercase: true, length: 10 }); // 'ABCDEFGHIJ'
 * generateId({ timestamp: true }); // 'a1b2c3d4_1634567890123'
 */
const generateId = (options = {}) => {
    const {
        length = 8,
        type = 'alphanumeric',
        prefix = '',
        suffix = '',
        uppercase = false,
        timestamp = false
    } = options;

    let id = '';

    switch (type.toLowerCase()) {
        case 'uuid':
            // Generate UUID v4-like format (not cryptographically secure)
            id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            break;

        case 'alphanumeric':
            const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < length; i++) {
                id += alphanumericChars.charAt(Math.floor(Math.random() * alphanumericChars.length));
            }
            break;

        case 'alphabetic':
            const alphabeticChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            for (let i = 0; i < length; i++) {
                id += alphabeticChars.charAt(Math.floor(Math.random() * alphabeticChars.length));
            }
            break;

        case 'numeric':
            for (let i = 0; i < length; i++) {
                // Avoid leading zeros for first digit
                if (i === 0) {
                    id += Math.floor(Math.random() * 9) + 1;
                } else {
                    id += Math.floor(Math.random() * 10);
                }
            }
            break;

        case 'hex':
            const hexChars = '0123456789abcdef';
            for (let i = 0; i < length; i++) {
                id += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
            }
            break;

        default:
            throw new Error(`Invalid ID type: ${type}. Use 'uuid', 'alphanumeric', 'alphabetic', 'numeric', or 'hex'.`);
    }

    // Apply uppercase transformation if requested (except for UUID)
    if (uppercase && type !== 'uuid') {
        id = id.toUpperCase();
    }

    // Add timestamp if requested
    if (timestamp && type !== 'uuid') {
        id += '_' + Date.now();
    }

    // Add prefix and suffix
    return prefix + id + suffix;
};

/**
 * Generates a short unique ID using base-36 encoding with timestamp and random component.
 * This provides a good balance of uniqueness and brevity.
 * 
 * @param {number} [randomLength=4] - Length of the random component
 * @returns {string} A short unique ID
 * 
 * @example
 * generateShortId(); // 'lkjhgf_a1b2'
 * generateShortId(6); // 'lkjhgf_a1b2c3'
 */
const generateShortId = (randomLength = 4) => {
    const timestamp = Date.now().toString(36);
    const randomChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomPart = '';
    
    for (let i = 0; i < randomLength; i++) {
        randomPart += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    
    return timestamp + '_' + randomPart;
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = { debounce, throttle, generateId, generateShortId };
} else if (typeof exports !== 'undefined') {
    // ES6 modules (for environments that support it)
    exports.debounce = debounce;
    exports.throttle = throttle;
    exports.generateId = generateId;
    exports.generateShortId = generateShortId;
}

// Also make available globally if in browser
if (typeof window !== 'undefined') {
    window.debounce = debounce;
    window.throttle = throttle;
    window.generateId = generateId;
    window.generateShortId = generateShortId;
}
