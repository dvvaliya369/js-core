/**
 * Date and time formatting utilities
 * Provides various formatting options for dates and times
 */

/**
 * Format a date/time with various preset and custom options
 * 
 * @param {Date|string|number} date - Date object, ISO string, or timestamp
 * @param {string} format - Format type or custom format string
 * @param {Object} options - Additional formatting options
 * @param {string} options.timezone - Timezone (e.g., 'UTC', 'America/New_York')
 * @param {string} options.locale - Locale for formatting (e.g., 'en-US', 'fr-FR')
 * @returns {string} Formatted date string
 * 
 * @example
 * // Preset formats
 * formatDateTime(new Date(), 'iso')           // "2025-10-07T15:01:59.123Z"
 * formatDateTime(new Date(), 'short')         // "10/7/2025"
 * formatDateTime(new Date(), 'medium')        // "Oct 7, 2025, 3:01:59 PM"
 * formatDateTime(new Date(), 'long')          // "October 7, 2025 at 3:01:59 PM UTC"
 * formatDateTime(new Date(), 'full')          // "Monday, October 7, 2025 at 3:01:59 PM Coordinated Universal Time"
 * 
 * // Custom formats
 * formatDateTime(new Date(), 'YYYY-MM-DD')    // "2025-10-07"
 * formatDateTime(new Date(), 'MM/DD/YYYY HH:mm:ss') // "10/07/2025 15:01:59"
 * 
 * // With options
 * formatDateTime(new Date(), 'medium', { 
 *   timezone: 'America/New_York', 
 *   locale: 'en-US' 
 * })
 */
function formatDateTime(date, format = 'medium', options = {}) {
  // Parse input date
  let dateObj;
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'string' || typeof date === 'number') {
    dateObj = new Date(date);
  } else {
    throw new Error('Invalid date input. Expected Date object, string, or number.');
  }

  // Validate date
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided.');
  }

  const { timezone = 'UTC', locale = 'en-US' } = options;

  // Preset formats using Intl.DateTimeFormat
  const presetFormats = {
    iso: () => dateObj.toISOString(),
    short: () => new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).format(dateObj),
    medium: () => new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    }).format(dateObj),
    long: () => new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }).format(dateObj),
    full: () => new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'long'
    }).format(dateObj),
    time: () => new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    }).format(dateObj),
    date: () => new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj)
  };

  // Check if it's a preset format
  if (presetFormats[format]) {
    return presetFormats[format]();
  }

  // Custom format parsing
  return formatCustomDateTime(dateObj, format, timezone);
}

/**
 * Format date with custom format string
 * 
 * @param {Date} date - Date object
 * @param {string} format - Custom format string
 * @param {string} timezone - Timezone
 * @returns {string} Formatted date string
 */
function formatCustomDateTime(date, format, timezone = 'UTC') {
  // Create a date in the specified timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const parts = formatter.formatToParts(date);
  const values = {};
  parts.forEach(part => {
    values[part.type] = part.value;
  });

  // Custom format tokens
  const tokens = {
    YYYY: values.year,
    YY: values.year.slice(-2),
    MM: values.month,
    M: parseInt(values.month).toString(),
    DD: values.day,
    D: parseInt(values.day).toString(),
    HH: values.hour,
    H: parseInt(values.hour).toString(),
    mm: values.minute,
    m: parseInt(values.minute).toString(),
    ss: values.second,
    s: parseInt(values.second).toString(),
    MMM: new Intl.DateTimeFormat('en-US', { 
      timeZone: timezone, 
      month: 'short' 
    }).format(date),
    MMMM: new Intl.DateTimeFormat('en-US', { 
      timeZone: timezone, 
      month: 'long' 
    }).format(date)
  };

  // Replace tokens in format string (longer tokens first to avoid conflicts)
  let result = format;
  const sortedTokens = Object.keys(tokens).sort((a, b) => b.length - a.length);
  
  sortedTokens.forEach(token => {
    result = result.replace(new RegExp(token, 'g'), tokens[token]);
  });

  return result;
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * 
 * @param {Date|string|number} date - Date to compare
 * @param {Date|string|number} baseDate - Base date for comparison (defaults to now)
 * @param {string} locale - Locale for formatting
 * @returns {string} Relative time string
 * 
 * @example
 * getRelativeTime(new Date(Date.now() - 3600000))  // "1 hour ago"
 * getRelativeTime(new Date(Date.now() + 86400000)) // "in 1 day"
 */
function getRelativeTime(date, baseDate = new Date(), locale = 'en-US') {
  const dateObj = new Date(date);
  const baseDateObj = new Date(baseDate);
  
  if (isNaN(dateObj.getTime()) || isNaN(baseDateObj.getTime())) {
    throw new Error('Invalid date provided.');
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const diffInMs = dateObj.getTime() - baseDateObj.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (Math.abs(diffInDays) > 0) {
    return rtf.format(diffInDays, 'day');
  } else if (Math.abs(diffInHours) > 0) {
    return rtf.format(diffInHours, 'hour');
  } else if (Math.abs(diffInMinutes) > 0) {
    return rtf.format(diffInMinutes, 'minute');
  } else {
    return rtf.format(diffInSeconds, 'second');
  }
}

/**
 * Check if a year is a leap year
 * 
 * @param {number} year - Year to check
 * @returns {boolean} True if leap year, false otherwise
 */
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get the number of days in a specific month
 * 
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @returns {number} Number of days in the month
 */
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * Parse various date string formats into Date object
 * 
 * @param {string} dateString - Date string to parse
 * @returns {Date} Parsed Date object
 */
function parseDate(dateString) {
  // Try native parsing first
  let date = new Date(dateString);
  
  if (!isNaN(date.getTime())) {
    return date;
  }

  // Try common formats
  const formats = [
    /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
    /^(\d{2})\/(\d{2})\/(\d{4})$/, // MM/DD/YYYY
    /^(\d{2})-(\d{2})-(\d{4})$/, // MM-DD-YYYY
  ];

  for (const format of formats) {
    const match = dateString.match(format);
    if (match) {
      if (format.source.startsWith('^(\\d{4})')) {
        // YYYY-MM-DD format
        date = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
      } else {
        // MM/DD/YYYY or MM-DD-YYYY format
        date = new Date(parseInt(match[3]), parseInt(match[1]) - 1, parseInt(match[2]));
      }
      
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  throw new Error(`Unable to parse date string: ${dateString}`);
}

// Export functions for use in other modules
module.exports = {
  formatDateTime,
  getRelativeTime,
  isLeapYear,
  getDaysInMonth,
  parseDate
};

// For ES6 modules, you can also export like this:
// export { formatDateTime, getRelativeTime, isLeapYear, getDaysInMonth, parseDate };
