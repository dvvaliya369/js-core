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
 * Generates a random unique ID using UUID v4 format (RFC 4122)
 * 
 * @returns {string} A UUID v4 string in the format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * 
 * @example
 * const id = generateUniqueId();
 * console.log(id); // "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 */
const generateUniqueId = () => {
    // Use crypto.randomUUID() if available (modern browsers and Node.js 16+)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    
    // Fallback implementation for older environments
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

/**
 * Generates a timestamp-based unique ID
 * 
 * @param {string} [prefix=''] - Optional prefix for the ID
 * @returns {string} A unique ID based on timestamp and random suffix
 * 
 * @example
 * const id = generateTimestampId('user');
 * console.log(id); // "user_1697565280123_a7b2c"
 */
const generateTimestampId = (prefix = '') => {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substr(2, 5);
    return prefix ? `${prefix}_${timestamp}_${randomSuffix}` : `${timestamp}_${randomSuffix}`;
};

/**
 * Generates a short random alphanumeric ID
 * 
 * @param {number} [length=8] - The length of the generated ID (default: 8)
 * @param {boolean} [includeNumbers=true] - Whether to include numbers (0-9)
 * @param {boolean} [includeUppercase=true] - Whether to include uppercase letters (A-Z)
 * @param {boolean} [includeLowercase=true] - Whether to include lowercase letters (a-z)
 * @returns {string} A random alphanumeric string
 * 
 * @example
 * const id = generateShortId(12);
 * console.log(id); // "A7b2C9x1M4n8"
 * 
 * const numbersOnly = generateShortId(6, true, false, false);
 * console.log(numbersOnly); // "742901"
 */
const generateShortId = (length = 8, includeNumbers = true, includeUppercase = true, includeLowercase = true) => {
    let characters = '';
    
    if (includeNumbers) characters += '0123456789';
    if (includeUppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
    
    if (!characters) {
        throw new Error('At least one character set must be enabled');
    }
    
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
};

/**
 * Generates a nanoid-style unique ID (URL-safe base64 characters)
 * 
 * @param {number} [size=21] - The size of the ID (default: 21 characters)
 * @returns {string} A URL-safe unique ID
 * 
 * @example
 * const id = generateNanoId();
 * console.log(id); // "V1StGXR8_Z5jdHi6B-myT"
 * 
 * const shortId = generateNanoId(10);
 * console.log(shortId); // "V1StGXR8_Z"
 */
const generateNanoId = (size = 21) => {
    const alphabet = '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = '';
    
    // Use crypto.getRandomValues if available for better randomness
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1;
        const step = -~(1.6 * mask * size / alphabet.length);
        
        while (true) {
            const bytes = crypto.getRandomValues(new Uint8Array(step));
            let j = step;
            while (j-- && id.length < size) {
                id += alphabet[bytes[j] & mask] || '';
            }
            if (id.length >= size) return id.slice(0, size);
        }
    } else {
        // Fallback for environments without crypto
        for (let i = 0; i < size; i++) {
            id += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        return id;
    }
};

/**
 * Creates a unique ID generator with collision detection
 * 
 * @param {function} [generator=generateUniqueId] - The ID generation function to use
 * @param {number} [maxAttempts=10] - Maximum attempts to generate a unique ID
 * @returns {function} A function that generates unique IDs with collision detection
 * 
 * @example
 * const uniqueGenerator = createUniqueIdGenerator(generateShortId);
 * const usedIds = new Set();
 * 
 * const getId = uniqueGenerator();
 * const newId = getId(usedIds);
 * usedIds.add(newId);
 */
const createUniqueIdGenerator = (generator = generateUniqueId, maxAttempts = 10) => {
    return (usedIds = new Set()) => {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const id = generator();
            if (!usedIds.has(id)) {
                return id;
            }
        }
        throw new Error(`Failed to generate unique ID after ${maxAttempts} attempts`);
    };
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = { 
        debounce,
        generateUniqueId,
        generateTimestampId,
        generateShortId,
        generateNanoId,
        createUniqueIdGenerator
    };
} else if (typeof exports !== 'undefined') {
    // ES6 modules (for environments that support it)
    exports.debounce = debounce;
    exports.generateUniqueId = generateUniqueId;
    exports.generateTimestampId = generateTimestampId;
    exports.generateShortId = generateShortId;
    exports.generateNanoId = generateNanoId;
    exports.createUniqueIdGenerator = createUniqueIdGenerator;
}

// Also make available globally if in browser
if (typeof window !== 'undefined') {
    window.debounce = debounce;
    window.generateUniqueId = generateUniqueId;
    window.generateTimestampId = generateTimestampId;
    window.generateShortId = generateShortId;
    window.generateNanoId = generateNanoId;
    window.createUniqueIdGenerator = createUniqueIdGenerator;
}
