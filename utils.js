/**
 * Utility functions for common operations
 */

/**
 * Format a date object to a readable string format
 * @param {Date} date - The date to format
 * @param {string} format - The format pattern (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns {string} - Formatted date string
 */
function formatDateTime(date = new Date(), format = 'YYYY-MM-DD HH:mm:ss') {
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error('Invalid date provided');
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formatMap = {
    'YYYY': year,
    'MM': month,
    'DD': day,
    'HH': hours,
    'mm': minutes,
    'ss': seconds
  };

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => formatMap[match]);
}

/**
 * Creates a debounced version of the provided function
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, delay) {
  if (typeof func !== 'function') {
    throw new Error('First argument must be a function');
  }
  
  if (typeof delay !== 'number' || delay < 0) {
    throw new Error('Delay must be a non-negative number');
  }

  let timeoutId = null;

  return function debounced(...args) {
    const context = this;
    
    // Clear the previous timeout if it exists
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    
    // Set a new timeout
    timeoutId = setTimeout(() => {
      timeoutId = null;
      func.apply(context, args);
    }, delay);
  };
}

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatDateTime,
    debounce
  };
}

// For browser environments
if (typeof window !== 'undefined') {
  window.utils = {
    formatDateTime,
    debounce
  };
}
