/**
 * Date-Time Formatter Utility Functions
 * Provides various date and time formatting capabilities
 */

/**
 * Formats a date object or string into a readable format
 * @param {Date|string|number} date - The date to format
 * @param {Object} options - Formatting options
 * @param {string} options.format - Format type ('short', 'long', 'iso', 'custom')
 * @param {string} options.customFormat - Custom format string (when format is 'custom')
 * @param {string} options.locale - Locale string (default: 'en-US')
 * @param {string} options.timezone - Timezone (default: local timezone)
 * @returns {string} Formatted date string
 */
function formatDate(date, options = {}) {
    const {
        format = 'short',
        customFormat = null,
        locale = 'en-US',
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    } = options;

    // Convert input to Date object
    const dateObj = new Date(date);
    
    // Validate date
    if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date provided');
    }

    // Handle different format types
    switch (format) {
        case 'short':
            return dateObj.toLocaleDateString(locale, { timezone });
        
        case 'long':
            return dateObj.toLocaleDateString(locale, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timezone
            });
        
        case 'iso':
            return dateObj.toISOString();
        
        case 'custom':
            if (!customFormat) {
                throw new Error('Custom format string required when format is "custom"');
            }
            return formatCustomDate(dateObj, customFormat, locale, timezone);
        
        default:
            throw new Error(`Unsupported format: ${format}`);
    }
}

/**
 * Formats time from a date object
 * @param {Date|string|number} date - The date to extract time from
 * @param {Object} options - Formatting options
 * @param {string} options.format - Format type ('12h', '24h')
 * @param {boolean} options.includeSeconds - Whether to include seconds
 * @param {string} options.locale - Locale string (default: 'en-US')
 * @param {string} options.timezone - Timezone (default: local timezone)
 * @returns {string} Formatted time string
 */
function formatTime(date, options = {}) {
    const {
        format = '12h',
        includeSeconds = false,
        locale = 'en-US',
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    } = options;

    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date provided');
    }

    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: format === '12h',
        timeZone: timezone
    };

    if (includeSeconds) {
        timeOptions.second = '2-digit';
    }

    return dateObj.toLocaleTimeString(locale, timeOptions);
}

/**
 * Formats date and time together
 * @param {Date|string|number} date - The date to format
 * @param {Object} options - Formatting options
 * @param {string} options.dateFormat - Date format type
 * @param {string} options.timeFormat - Time format type
 * @param {string} options.separator - Separator between date and time (default: ' ')
 * @param {string} options.locale - Locale string
 * @param {string} options.timezone - Timezone
 * @returns {string} Formatted date-time string
 */
function formatDateTime(date, options = {}) {
    const {
        dateFormat = 'short',
        timeFormat = '12h',
        separator = ' ',
        locale = 'en-US',
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    } = options;

    const formattedDate = formatDate(date, { format: dateFormat, locale, timezone });
    const formattedTime = formatTime(date, { format: timeFormat, locale, timezone });

    return `${formattedDate}${separator}${formattedTime}`;
}

/**
 * Custom date formatting with pattern strings
 * @param {Date} date - Date object
 * @param {string} pattern - Format pattern (YYYY, MM, DD, HH, mm, ss, etc.)
 * @param {string} locale - Locale string
 * @param {string} timezone - Timezone
 * @returns {string} Formatted date string
 */
function formatCustomDate(date, pattern, locale = 'en-US', timezone) {
    const options = { timeZone: timezone };
    const formatter = new Intl.DateTimeFormat(locale, options);
    
    // Get date parts
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours24 = String(date.getHours()).padStart(2, '0');
    const hours12 = String(date.getHours() % 12 || 12).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    // Replace patterns
    return pattern
        .replace(/YYYY/g, year)
        .replace(/YY/g, String(year).slice(-2))
        .replace(/MM/g, month)
        .replace(/M/g, String(date.getMonth() + 1))
        .replace(/DD/g, day)
        .replace(/D/g, String(date.getDate()))
        .replace(/HH/g, hours24)
        .replace(/H/g, String(date.getHours()))
        .replace(/hh/g, hours12)
        .replace(/h/g, String(date.getHours() % 12 || 12))
        .replace(/mm/g, minutes)
        .replace(/m/g, String(date.getMinutes()))
        .replace(/ss/g, seconds)
        .replace(/s/g, String(date.getSeconds()))
        .replace(/A/g, ampm)
        .replace(/a/g, ampm.toLowerCase());
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param {Date|string|number} date - The date to compare
 * @param {Date|string|number} baseDate - Base date for comparison (default: now)
 * @param {string} locale - Locale string
 * @returns {string} Relative time string
 */
function getRelativeTime(date, baseDate = new Date(), locale = 'en-US') {
    const dateObj = new Date(date);
    const baseDateObj = new Date(baseDate);
    
    if (isNaN(dateObj.getTime()) || isNaN(baseDateObj.getTime())) {
        throw new Error('Invalid date provided');
    }

    const diff = dateObj.getTime() - baseDateObj.getTime();
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    const units = [
        { unit: 'year', ms: 31536000000 },
        { unit: 'month', ms: 2628000000 },
        { unit: 'week', ms: 604800000 },
        { unit: 'day', ms: 86400000 },
        { unit: 'hour', ms: 3600000 },
        { unit: 'minute', ms: 60000 },
        { unit: 'second', ms: 1000 }
    ];

    for (const { unit, ms } of units) {
        if (Math.abs(diff) >= ms) {
            const value = Math.round(diff / ms);
            return rtf.format(value, unit);
        }
    }

    return rtf.format(0, 'second');
}

/**
 * Check if a date is valid
 * @param {any} date - Value to check
 * @returns {boolean} True if valid date
 */
function isValidDate(date) {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
}

/**
 * Creates a debounced version of a function that delays execution until after 
 * a specified delay has passed since the last time it was invoked
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @param {Object} options - Additional options
 * @param {boolean} options.immediate - Execute on the leading edge instead of trailing
 * @returns {Function} The debounced function
 */
function debounce(func, delay, options = {}) {
    if (typeof func !== 'function') {
        throw new Error('First argument must be a function');
    }
    
    if (typeof delay !== 'number' || delay < 0) {
        throw new Error('Delay must be a non-negative number');
    }

    const { immediate = false } = options;
    let timeoutId;
    let lastArgs;
    let lastThis;
    let result;

    const debounced = function(...args) {
        lastArgs = args;
        lastThis = this;

        const callNow = immediate && !timeoutId;

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            timeoutId = null;
            if (!immediate) {
                result = func.apply(lastThis, lastArgs);
            }
        }, delay);

        if (callNow) {
            result = func.apply(lastThis, lastArgs);
        }

        return result;
    };

    // Add utility methods to the debounced function
    debounced.cancel = function() {
        clearTimeout(timeoutId);
        timeoutId = null;
    };

    debounced.flush = function() {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
            result = func.apply(lastThis, lastArgs);
        }
        return result;
    };

    debounced.pending = function() {
        return !!timeoutId;
    };

    return debounced;
}

/**
 * Creates a throttled version of a function that limits execution to at most 
 * once per specified time interval
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @param {Object} options - Additional options
 * @param {boolean} options.leading - Execute on the leading edge (default: true)
 * @param {boolean} options.trailing - Execute on the trailing edge (default: true)
 * @returns {Function} The throttled function
 */
function throttle(func, limit, options = {}) {
    if (typeof func !== 'function') {
        throw new Error('First argument must be a function');
    }
    
    if (typeof limit !== 'number' || limit < 0) {
        throw new Error('Limit must be a non-negative number');
    }

    const { leading = true, trailing = true } = options;
    
    let timeoutId;
    let lastExecTime = 0;
    let lastArgs;
    let lastThis;
    let result;

    const throttled = function(...args) {
        lastArgs = args;
        lastThis = this;
        
        const now = Date.now();
        
        // If this is the first call and leading is false, set lastExecTime to now
        if (!lastExecTime && !leading) {
            lastExecTime = now;
        }
        
        const remaining = limit - (now - lastExecTime);
        
        if (remaining <= 0 || remaining > limit) {
            // Time to execute
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            
            lastExecTime = now;
            result = func.apply(lastThis, lastArgs);
        } else if (!timeoutId && trailing) {
            // Schedule execution for the trailing edge
            timeoutId = setTimeout(() => {
                lastExecTime = leading ? Date.now() : 0;
                timeoutId = null;
                result = func.apply(lastThis, lastArgs);
            }, remaining);
        }
        
        return result;
    };

    // Add utility methods to the throttled function
    throttled.cancel = function() {
        clearTimeout(timeoutId);
        timeoutId = null;
        lastExecTime = 0;
    };

    throttled.flush = function() {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
            lastExecTime = Date.now();
            result = func.apply(lastThis, lastArgs);
        }
        return result;
    };

    throttled.pending = function() {
        return !!timeoutId;
    };

    return throttled;
}

/**
 * Common date format presets
 */
const DATE_FORMATS = {
    US_SHORT: 'MM/DD/YYYY',
    US_LONG: 'MMMM D, YYYY',
    EU_SHORT: 'DD/MM/YYYY',
    ISO_DATE: 'YYYY-MM-DD',
    ISO_DATETIME: 'YYYY-MM-DD HH:mm:ss',
    TIMESTAMP: 'YYYY-MM-DD HH:mm:ss.SSS'
};

// Export functions
module.exports = {
    formatDate,
    formatTime,
    formatDateTime,
    formatCustomDate,
    getRelativeTime,
    isValidDate,
    debounce,
    throttle,
    DATE_FORMATS
};

// ES6 export syntax (if using modules)
// export {
//     formatDate,
//     formatTime,
//     formatDateTime,
//     formatCustomDate,
//     getRelativeTime,
//     isValidDate,
//     debounce,
//     throttle,
//     DATE_FORMATS
// };
