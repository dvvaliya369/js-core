/**
 * Date-Time Formatter Utilities
 * A comprehensive set of functions for formatting, parsing, and manipulating dates and times
 */

/**
 * Format a date to a specific format string
 * @param {Date|string|number} date - The date to format
 * @param {string} format - The format string (e.g., 'YYYY-MM-DD', 'DD/MM/YYYY HH:mm:ss')
 * @returns {string} The formatted date string
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided');
  }

  const formats = {
    YYYY: d.getFullYear().toString(),
    YY: d.getFullYear().toString().slice(-2),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    M: (d.getMonth() + 1).toString(),
    DD: String(d.getDate()).padStart(2, '0'),
    D: d.getDate().toString(),
    HH: String(d.getHours()).padStart(2, '0'),
    H: d.getHours().toString(),
    mm: String(d.getMinutes()).padStart(2, '0'),
    m: d.getMinutes().toString(),
    ss: String(d.getSeconds()).padStart(2, '0'),
    s: d.getSeconds().toString(),
    SSS: String(d.getMilliseconds()).padStart(3, '0'),
    A: d.getHours() >= 12 ? 'PM' : 'AM',
    a: d.getHours() >= 12 ? 'pm' : 'am',
    hh: String(d.getHours() % 12 || 12).padStart(2, '0'),
    h: (d.getHours() % 12 || 12).toString(),
  };

  return format.replace(/YYYY|YY|MM?|DD?|HH?|mm?|ss?|SSS|A|a|hh?/g, match => formats[match] || match);
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 5 minutes")
 * @param {Date|string|number} date - The date to compare
 * @param {Date|string|number} baseDate - The base date to compare against (defaults to now)
 * @returns {string} The relative time string
 */
function getRelativeTime(date, baseDate = new Date()) {
  const d = new Date(date);
  const base = new Date(baseDate);
  
  if (isNaN(d.getTime()) || isNaN(base.getTime())) {
    throw new Error('Invalid date provided');
  }

  const diff = base.getTime() - d.getTime();
  const absDiff = Math.abs(diff);
  const isFuture = diff < 0;

  const units = [
    { name: 'year', ms: 1000 * 60 * 60 * 24 * 365 },
    { name: 'month', ms: 1000 * 60 * 60 * 24 * 30 },
    { name: 'week', ms: 1000 * 60 * 60 * 24 * 7 },
    { name: 'day', ms: 1000 * 60 * 60 * 24 },
    { name: 'hour', ms: 1000 * 60 * 60 },
    { name: 'minute', ms: 1000 * 60 },
    { name: 'second', ms: 1000 },
  ];

  for (const unit of units) {
    const value = Math.floor(absDiff / unit.ms);
    if (value >= 1) {
      const plural = value > 1 ? 's' : '';
      return isFuture 
        ? `in ${value} ${unit.name}${plural}`
        : `${value} ${unit.name}${plural} ago`;
    }
  }

  return 'just now';
}

/**
 * Parse various date string formats into a Date object
 * @param {string} dateString - The date string to parse
 * @returns {Date} The parsed Date object
 */
function parseDate(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    throw new Error('Invalid date string provided');
  }

  // Common date formats
  const formats = [
    // ISO 8601 formats
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?[+-]\d{2}:\d{2}$/,
    
    // Standard formats
    /^\d{4}-\d{2}-\d{2}$/,              // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/,            // MM/DD/YYYY
    /^\d{2}-\d{2}-\d{4}$/,              // MM-DD-YYYY
    /^\d{1,2}\/\d{1,2}\/\d{4}$/,        // M/D/YYYY
    /^\d{4}\/\d{2}\/\d{2}$/,            // YYYY/MM/DD
  ];

  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date;
  }

  throw new Error(`Unable to parse date string: ${dateString}`);
}

/**
 * Check if a date is valid
 * @param {Date|string|number} date - The date to validate
 * @returns {boolean} True if the date is valid
 */
function isValidDate(date) {
  try {
    const d = new Date(date);
    return !isNaN(d.getTime());
  } catch {
    return false;
  }
}

/**
 * Get the start of day for a given date
 * @param {Date|string|number} date - The date
 * @returns {Date} Date object set to start of day (00:00:00.000)
 */
function startOfDay(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided');
  }
  
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of day for a given date
 * @param {Date|string|number} date - The date
 * @returns {Date} Date object set to end of day (23:59:59.999)
 */
function endOfDay(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided');
  }
  
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Add time to a date
 * @param {Date|string|number} date - The base date
 * @param {number} amount - The amount to add
 * @param {string} unit - The unit (years, months, days, hours, minutes, seconds, milliseconds)
 * @returns {Date} New Date object with added time
 */
function addTime(date, amount, unit) {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided');
  }

  const units = {
    milliseconds: 1,
    seconds: 1000,
    minutes: 1000 * 60,
    hours: 1000 * 60 * 60,
    days: 1000 * 60 * 60 * 24,
    weeks: 1000 * 60 * 60 * 24 * 7,
  };

  if (unit === 'months') {
    d.setMonth(d.getMonth() + amount);
  } else if (unit === 'years') {
    d.setFullYear(d.getFullYear() + amount);
  } else if (units[unit]) {
    d.setTime(d.getTime() + (amount * units[unit]));
  } else {
    throw new Error(`Unsupported unit: ${unit}`);
  }

  return d;
}

/**
 * Get the difference between two dates
 * @param {Date|string|number} date1 - First date
 * @param {Date|string|number} date2 - Second date
 * @param {string} unit - Unit to return the difference in (days, hours, minutes, seconds, milliseconds)
 * @returns {number} The difference in the specified unit
 */
function dateDiff(date1, date2, unit = 'milliseconds') {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    throw new Error('Invalid date provided');
  }

  const diff = d1.getTime() - d2.getTime();
  
  const units = {
    milliseconds: 1,
    seconds: 1000,
    minutes: 1000 * 60,
    hours: 1000 * 60 * 60,
    days: 1000 * 60 * 60 * 24,
    weeks: 1000 * 60 * 60 * 24 * 7,
  };

  if (units[unit]) {
    return diff / units[unit];
  } else {
    throw new Error(`Unsupported unit: ${unit}`);
  }
}

/**
 * Format date to common preset formats
 */
const presetFormats = {
  iso: (date) => formatDate(date, 'YYYY-MM-DDTHH:mm:ss'),
  short: (date) => formatDate(date, 'MM/DD/YYYY'),
  long: (date) => formatDate(date, 'MMMM DD, YYYY'),
  time: (date) => formatDate(date, 'HH:mm:ss'),
  timeShort: (date) => formatDate(date, 'HH:mm'),
  datetime: (date) => formatDate(date, 'MM/DD/YYYY HH:mm:ss'),
  datetimeShort: (date) => formatDate(date, 'MM/DD/YYYY HH:mm'),
};

// Enhanced formatDate to support month names
function formatDateEnhanced(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided');
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthNamesShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const formats = {
    YYYY: d.getFullYear().toString(),
    YY: d.getFullYear().toString().slice(-2),
    MMMM: monthNames[d.getMonth()],
    MMM: monthNamesShort[d.getMonth()],
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    M: (d.getMonth() + 1).toString(),
    DD: String(d.getDate()).padStart(2, '0'),
    D: d.getDate().toString(),
    HH: String(d.getHours()).padStart(2, '0'),
    H: d.getHours().toString(),
    mm: String(d.getMinutes()).padStart(2, '0'),
    m: d.getMinutes().toString(),
    ss: String(d.getSeconds()).padStart(2, '0'),
    s: d.getSeconds().toString(),
    SSS: String(d.getMilliseconds()).padStart(3, '0'),
    A: d.getHours() >= 12 ? 'PM' : 'AM',
    a: d.getHours() >= 12 ? 'pm' : 'am',
    hh: String(d.getHours() % 12 || 12).padStart(2, '0'),
    h: (d.getHours() % 12 || 12).toString(),
  };

  return format.replace(/YYYY|YY|MMMM|MMM|MM?|DD?|HH?|mm?|ss?|SSS|A|a|hh?/g, match => formats[match] || match);
}

// Export functions for use in other modules
module.exports = {
  formatDate: formatDateEnhanced,
  getRelativeTime,
  parseDate,
  isValidDate,
  startOfDay,
  endOfDay,
  addTime,
  dateDiff,
  presetFormats,
};

// Example usage (uncomment to test):
/*
console.log('=== Date-Time Formatter Examples ===');

const now = new Date();
const testDate = new Date('2024-03-15T14:30:00');

console.log('Current time:', formatDateEnhanced(now, 'YYYY-MM-DD HH:mm:ss'));
console.log('Test date:', formatDateEnhanced(testDate, 'MMMM DD, YYYY at HH:mm'));
console.log('Relative time:', getRelativeTime(testDate));
console.log('Is valid date:', isValidDate('2024-13-45')); // false
console.log('Start of day:', startOfDay(now));
console.log('End of day:', endOfDay(now));
console.log('Add 5 days:', addTime(now, 5, 'days'));
console.log('Difference in hours:', dateDiff(now, testDate, 'hours'));

// Preset formats
console.log('ISO format:', presetFormats.iso(now));
console.log('Short format:', presetFormats.short(now));
console.log('Long format:', presetFormats.long(now));
*/
