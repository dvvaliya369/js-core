/**
 * Utility functions for common JavaScript operations
 */

/**
 * Creates a debounced function that delays invoking the provided function until after
 * wait milliseconds have elapsed since the last time the debounced function was invoked.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - If true, trigger the function on the leading edge instead of trailing
 * @returns {Function} - The debounced function
 * 
 * @example
 * // Basic usage - delays execution for 300ms after last call
 * const debouncedSearch = debounce((query) => {
 *   console.log('Searching for:', query);
 * }, 300);
 * 
 * // Usage with immediate execution
 * const debouncedClick = debounce((event) => {
 *   console.log('Button clicked');
 * }, 1000, true);
 * 
 * // In a real scenario - search input
 * document.getElementById('search').addEventListener('input', 
 *   debounce((e) => performSearch(e.target.value), 500)
 * );
 */
function debounce(func, wait, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}

/**
 * Creates a throttled function that only invokes the provided function at most once per
 * every wait milliseconds.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle invocations to
 * @returns {Function} - The throttled function
 * 
 * @example
 * // Throttle scroll events
 * window.addEventListener('scroll', 
 *   throttle(() => {
 *     console.log('Scroll event triggered');
 *   }, 100)
 * );
 */
function throttle(func, wait) {
  let inThrottle;
  
  return function(...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
}

/**
 * Formats a date object or timestamp into a human-readable string with various format options.
 * Supports predefined formats and custom format strings with timezone handling.
 * 
 * @param {Date|number|string} date - The date to format (Date object, timestamp, or date string)
 * @param {string} format - The format type or custom format string
 * @param {Object} options - Additional formatting options
 * @param {string} options.locale - The locale for formatting (default: 'en-US')
 * @param {string} options.timezone - The timezone for formatting (default: system timezone)
 * @returns {string} - The formatted date string
 * 
 * @example
 * const now = new Date();
 * 
 * // Predefined formats
 * formatDateTime(now, 'iso')        // '2023-12-25T14:30:00.000Z'
 * formatDateTime(now, 'short')      // '12/25/2023, 2:30 PM'
 * formatDateTime(now, 'medium')     // 'Dec 25, 2023, 2:30:00 PM'
 * formatDateTime(now, 'long')       // 'December 25, 2023 at 2:30:00 PM EST'
 * formatDateTime(now, 'full')       // 'Monday, December 25, 2023 at 2:30:00 PM Eastern Standard Time'
 * formatDateTime(now, 'date-only')  // '12/25/2023'
 * formatDateTime(now, 'time-only')  // '2:30 PM'
 * 
 * // Custom formats using tokens
 * formatDateTime(now, 'YYYY-MM-DD HH:mm:ss')     // '2023-12-25 14:30:00'
 * formatDateTime(now, 'MMM DD, YYYY at hh:mm A') // 'Dec 25, 2023 at 02:30 PM'
 * formatDateTime(now, 'dddd, MMMM Do, YYYY')     // 'Monday, December 25th, 2023'
 * 
 * // With locale and timezone options
 * formatDateTime(now, 'full', { locale: 'de-DE', timezone: 'Europe/Berlin' });
 * formatDateTime(now, 'YYYY年MM月DD日', { locale: 'ja-JP' });
 */
function formatDateTime(date, format = 'medium', options = {}) {
  // Convert input to Date object
  let dateObj;
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'number' || typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    throw new Error('Invalid date input. Expected Date object, number, or string.');
  }
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }
  
  const { locale = 'en-US', timezone } = options;
  
  // Predefined formats using Intl.DateTimeFormat
  const predefinedFormats = {
    'iso': () => dateObj.toISOString(),
    'short': () => dateObj.toLocaleString(locale, { 
      dateStyle: 'short', 
      timeStyle: 'short',
      timeZone: timezone 
    }),
    'medium': () => dateObj.toLocaleString(locale, { 
      dateStyle: 'medium', 
      timeStyle: 'medium',
      timeZone: timezone 
    }),
    'long': () => dateObj.toLocaleString(locale, { 
      dateStyle: 'long', 
      timeStyle: 'long',
      timeZone: timezone 
    }),
    'full': () => dateObj.toLocaleString(locale, { 
      dateStyle: 'full', 
      timeStyle: 'full',
      timeZone: timezone 
    }),
    'date-only': () => dateObj.toLocaleDateString(locale, { timeZone: timezone }),
    'time-only': () => dateObj.toLocaleTimeString(locale, { timeZone: timezone }),
    'timestamp': () => dateObj.getTime().toString(),
    'relative': () => getRelativeTime(dateObj, locale)
  };
  
  // Check if it's a predefined format
  if (predefinedFormats[format]) {
    return predefinedFormats[format]();
  }
  
  // Custom format using token replacement
  return formatCustomDateTime(dateObj, format, locale, timezone);
}

/**
 * Helper function for custom date formatting using tokens
 * @private
 */
function formatCustomDateTime(date, format, locale, timezone) {
  // Create a date in the specified timezone
  const options = timezone ? { timeZone: timezone } : {};
  
  // Token mapping for custom formats
  const tokens = {
    'YYYY': () => date.getFullYear().toString(),
    'YY': () => date.getFullYear().toString().slice(-2),
    'MMMM': () => date.toLocaleDateString(locale, { month: 'long', ...options }),
    'MMM': () => date.toLocaleDateString(locale, { month: 'short', ...options }),
    'MM': () => String(date.getMonth() + 1).padStart(2, '0'),
    'M': () => String(date.getMonth() + 1),
    'DD': () => String(date.getDate()).padStart(2, '0'),
    'Do': () => getOrdinalSuffix(date.getDate()),
    'D': () => String(date.getDate()),
    'dddd': () => date.toLocaleDateString(locale, { weekday: 'long', ...options }),
    'ddd': () => date.toLocaleDateString(locale, { weekday: 'short', ...options }),
    'HH': () => String(date.getHours()).padStart(2, '0'),
    'H': () => String(date.getHours()),
    'hh': () => String(date.getHours() % 12 || 12).padStart(2, '0'),
    'h': () => String(date.getHours() % 12 || 12),
    'mm': () => String(date.getMinutes()).padStart(2, '0'),
    'm': () => String(date.getMinutes()),
    'ss': () => String(date.getSeconds()).padStart(2, '0'),
    's': () => String(date.getSeconds()),
    'SSS': () => String(date.getMilliseconds()).padStart(3, '0'),
    'A': () => date.getHours() >= 12 ? 'PM' : 'AM',
    'a': () => date.getHours() >= 12 ? 'pm' : 'am'
  };
  
  // Replace tokens in format string
  return format.replace(/(YYYY|YY|MMMM|MMM|MM|M|DD|Do|D|dddd|ddd|HH|H|hh|h|mm|m|ss|s|SSS|A|a)/g, 
    (match) => tokens[match] ? tokens[match]() : match
  );
}

/**
 * Helper function to get ordinal suffix for dates (1st, 2nd, 3rd, etc.)
 * @private
 */
function getOrdinalSuffix(num) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = num % 100;
  return num + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
}

/**
 * Helper function to get relative time (e.g., "2 hours ago", "in 3 days")
 * @private
 */
function getRelativeTime(date, locale = 'en-US') {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  // Use Intl.RelativeTimeFormat if available
  if (typeof Intl !== 'undefined' && Intl.RelativeTimeFormat) {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    
    const intervals = [
      { unit: 'year', seconds: 31536000 },
      { unit: 'month', seconds: 2592000 },
      { unit: 'day', seconds: 86400 },
      { unit: 'hour', seconds: 3600 },
      { unit: 'minute', seconds: 60 },
      { unit: 'second', seconds: 1 }
    ];
    
    for (const interval of intervals) {
      const value = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
      if (value >= 1) {
        return rtf.format(diffInSeconds < 0 ? value : -value, interval.unit);
      }
    }
    
    return rtf.format(0, 'second');
  }
  
  // Fallback for older browsers
  const absSeconds = Math.abs(diffInSeconds);
  const isPast = diffInSeconds > 0;
  
  if (absSeconds < 60) return isPast ? 'just now' : 'in a moment';
  if (absSeconds < 3600) {
    const minutes = Math.floor(absSeconds / 60);
    return isPast ? `${minutes} minute${minutes !== 1 ? 's' : ''} ago` : `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  if (absSeconds < 86400) {
    const hours = Math.floor(absSeconds / 3600);
    return isPast ? `${hours} hour${hours !== 1 ? 's' : ''} ago` : `in ${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  const days = Math.floor(absSeconds / 86400);
  return isPast ? `${days} day${days !== 1 ? 's' : ''} ago` : `in ${days} day${days !== 1 ? 's' : ''}`;
}

// Export functions for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle,
    formatDateTime
  };
}

// For browser environments without module system
if (typeof window !== 'undefined') {
  window.Utils = {
    debounce,
    throttle,
    formatDateTime
  };
}
