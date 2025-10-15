/**
 * Generic Utility Functions Collection
 * A comprehensive set of commonly used utility functions
 */

// =============================================================================
// FUNCTION UTILITIES
// =============================================================================

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
 * Creates a throttled function that only invokes func at most once per every wait milliseconds
 * 
 * @param {function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle invocations to
 * @returns {function} The throttled function
 * 
 * @example
 * const throttledScroll = throttle(handleScroll, 100);
 * window.addEventListener('scroll', throttledScroll);
 */
const throttle = (func, wait) => {
    let inThrottle;
    
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, wait);
        }
    };
};

// =============================================================================
// TYPE CHECKING UTILITIES
// =============================================================================

/**
 * Type checking utilities for better type validation
 */
const isType = {
    string: (val) => typeof val === 'string',
    number: (val) => typeof val === 'number' && !isNaN(val),
    boolean: (val) => typeof val === 'boolean',
    function: (val) => typeof val === 'function',
    object: (val) => val !== null && typeof val === 'object' && !Array.isArray(val),
    array: (val) => Array.isArray(val),
    null: (val) => val === null,
    undefined: (val) => val === undefined,
    defined: (val) => val !== null && val !== undefined,
    empty: (val) => {
        if (val === null || val === undefined) return true;
        if (typeof val === 'string' || Array.isArray(val)) return val.length === 0;
        if (typeof val === 'object') return Object.keys(val).length === 0;
        return false;
    }
};

// =============================================================================
// OBJECT UTILITIES
// =============================================================================

/**
 * Creates a deep clone of an object
 * 
 * @param {*} obj - The object to clone
 * @returns {*} A deep copy of the object
 * 
 * @example
 * const original = { a: 1, b: { c: 2 } };
 * const cloned = deepClone(original);
 */
const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        Object.keys(obj).forEach(key => {
            clonedObj[key] = deepClone(obj[key]);
        });
        return clonedObj;
    }
    return obj;
};

/**
 * Merges multiple objects deeply
 * 
 * @param {...object} objects - Objects to merge
 * @returns {object} Merged object
 * 
 * @example
 * const merged = deepMerge({a: 1}, {b: 2}, {c: {d: 3}});
 */
const deepMerge = (...objects) => {
    const isObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj);
    
    return objects.reduce((prev, obj) => {
        Object.keys(obj).forEach(key => {
            const pVal = prev[key];
            const oVal = obj[key];
            
            if (Array.isArray(pVal) && Array.isArray(oVal)) {
                prev[key] = pVal.concat(...oVal);
            } else if (isObject(pVal) && isObject(oVal)) {
                prev[key] = deepMerge(pVal, oVal);
            } else {
                prev[key] = oVal;
            }
        });
        return prev;
    }, {});
};

/**
 * Gets a nested property value safely
 * 
 * @param {object} obj - The object to search
 * @param {string} path - Dot-notation path (e.g., 'user.profile.name')
 * @param {*} defaultValue - Default value if path not found
 * @returns {*} The value at the path or default value
 * 
 * @example
 * const value = getNestedValue(user, 'profile.settings.theme', 'light');
 */
const getNestedValue = (obj, path, defaultValue = undefined) => {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
};

// =============================================================================
// ARRAY UTILITIES
// =============================================================================

/**
 * Removes duplicate values from an array
 * 
 * @param {array} arr - The array to process
 * @param {string|function} [key] - Key for object comparison or comparison function
 * @returns {array} Array with unique values
 * 
 * @example
 * const unique = uniqueArray([1, 2, 2, 3]);
 * const uniqueObjects = uniqueArray(users, 'id');
 */
const uniqueArray = (arr, key) => {
    if (!Array.isArray(arr)) return [];
    
    if (!key) {
        return [...new Set(arr)];
    }
    
    if (typeof key === 'function') {
        return arr.filter((item, index, self) => 
            index === self.findIndex(t => key(t) === key(item))
        );
    }
    
    return arr.filter((item, index, self) => 
        index === self.findIndex(t => t[key] === item[key])
    );
};

/**
 * Chunks an array into smaller arrays of specified size
 * 
 * @param {array} arr - The array to chunk
 * @param {number} size - Size of each chunk
 * @returns {array} Array of chunks
 * 
 * @example
 * const chunks = chunkArray([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 */
const chunkArray = (arr, size) => {
    if (!Array.isArray(arr) || size <= 0) return [];
    
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
};

// =============================================================================
// STRING UTILITIES
// =============================================================================

/**
 * Converts string to camelCase
 * 
 * @param {string} str - String to convert
 * @returns {string} camelCase string
 * 
 * @example
 * const camel = toCamelCase('hello-world-test'); // 'helloWorldTest'
 */
const toCamelCase = (str) => {
    return str.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '');
};

/**
 * Converts string to kebab-case
 * 
 * @param {string} str - String to convert
 * @returns {string} kebab-case string
 * 
 * @example
 * const kebab = toKebabCase('helloWorldTest'); // 'hello-world-test'
 */
const toKebabCase = (str) => {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
};

/**
 * Capitalizes the first letter of a string
 * 
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 * 
 * @example
 * const capitalized = capitalize('hello world'); // 'Hello world'
 */
const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncates a string to specified length with ellipsis
 * 
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @param {string} [suffix='...'] - Suffix to add when truncated
 * @returns {string} Truncated string
 * 
 * @example
 * const short = truncate('This is a long string', 10); // 'This is a...'
 */
const truncate = (str, length, suffix = '...') => {
    if (!str || str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
};

// =============================================================================
// NUMBER UTILITIES
// =============================================================================

/**
 * Generates a random number between min and max (inclusive)
 * 
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 * 
 * @example
 * const random = randomBetween(1, 100);
 */
const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Clamps a number between min and max values
 * 
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 * 
 * @example
 * const clamped = clamp(150, 0, 100); // 100
 */
const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};

// =============================================================================
// ASYNC UTILITIES
// =============================================================================

/**
 * Creates a promise that resolves after specified milliseconds
 * 
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after delay
 * 
 * @example
 * await sleep(1000); // Wait 1 second
 */
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retries an async function with exponential backoff
 * 
 * @param {function} fn - Async function to retry
 * @param {number} [maxRetries=3] - Maximum number of retries
 * @param {number} [delay=1000] - Initial delay in milliseconds
 * @returns {Promise} Promise that resolves with function result
 * 
 * @example
 * const result = await retry(() => fetch('/api/data'), 3, 1000);
 */
const retry = async (fn, maxRetries = 3, delay = 1000) => {
    let lastError;
    
    for (let i = 0; i <= maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (i === maxRetries) break;
            await sleep(delay * Math.pow(2, i)); // Exponential backoff
        }
    }
    
    throw lastError;
};

// =============================================================================
// DOM UTILITIES (Browser only)
// =============================================================================

/**
 * DOM utilities (only available in browser environment)
 */
const dom = typeof window !== 'undefined' ? {
    /**
     * Selects a single DOM element
     * 
     * @param {string} selector - CSS selector
     * @param {Element} [parent=document] - Parent element to search within
     * @returns {Element|null} Found element
     */
    $: (selector, parent = document) => parent.querySelector(selector),
    
    /**
     * Selects multiple DOM elements
     * 
     * @param {string} selector - CSS selector
     * @param {Element} [parent=document] - Parent element to search within
     * @returns {NodeList} Found elements
     */
    $$: (selector, parent = document) => parent.querySelectorAll(selector),
    
    /**
     * Creates a DOM element with attributes and content
     * 
     * @param {string} tag - HTML tag name
     * @param {object} [attrs={}] - Element attributes
     * @param {string|Element|Array} [content] - Element content
     * @returns {Element} Created element
     * 
     * @example
     * const div = dom.create('div', {class: 'container'}, 'Hello World');
     */
    create: (tag, attrs = {}, content = null) => {
        const el = document.createElement(tag);
        
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'class') {
                el.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(el.style, value);
            } else {
                el.setAttribute(key, value);
            }
        });
        
        if (content !== null) {
            if (typeof content === 'string') {
                el.textContent = content;
            } else if (content instanceof Element) {
                el.appendChild(content);
            } else if (Array.isArray(content)) {
                content.forEach(child => {
                    if (typeof child === 'string') {
                        el.appendChild(document.createTextNode(child));
                    } else if (child instanceof Element) {
                        el.appendChild(child);
                    }
                });
            }
        }
        
        return el;
    }
} : {};

// =============================================================================
// UTILITY OBJECT EXPORT
// =============================================================================

const utils = {
    // Function utilities
    debounce,
    throttle,
    
    // Type checking
    isType,
    
    // Object utilities
    deepClone,
    deepMerge,
    getNestedValue,
    
    // Array utilities
    uniqueArray,
    chunkArray,
    
    // String utilities
    toCamelCase,
    toKebabCase,
    capitalize,
    truncate,
    
    // Number utilities
    randomBetween,
    clamp,
    
    // Async utilities
    sleep,
    retry,
    
    // DOM utilities (browser only)
    dom
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = utils;
} else if (typeof exports !== 'undefined') {
    // ES6 modules
    Object.assign(exports, utils);
}

// Make available globally if in browser
if (typeof window !== 'undefined') {
    window.utils = utils;
    // Also expose individual functions for convenience
    Object.assign(window, utils);
}
