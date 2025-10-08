/**
 * Date-Time Formatter Utility
 * 
 * A comprehensive utility for formatting dates and times with various options
 * including timezone support, custom formats, and locale-specific formatting.
 */

class DateTimeFormatter {
  constructor() {
    this.defaultLocale = 'en-US';
    this.defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  /**
   * Formats a date using predefined format types
   * @param {Date|string|number} date - The date to format
   * @param {string} formatType - The format type (iso, short, medium, long, full, time, datetime)
   * @param {Object} options - Additional formatting options
   * @returns {string} Formatted date string
   */
  format(date, formatType = 'medium', options = {}) {
    const dateObj = this._parseDate(date);
    if (!dateObj) {
      throw new Error('Invalid date provided');
    }

    const {
      locale = this.defaultLocale,
      timezone = this.defaultTimezone,
      ...additionalOptions
    } = options;

    switch (formatType.toLowerCase()) {
      case 'iso':
        return dateObj.toISOString();
      
      case 'short':
        return new Intl.DateTimeFormat(locale, {
          dateStyle: 'short',
          timeZone: timezone,
          ...additionalOptions
        }).format(dateObj);
      
      case 'medium':
        return new Intl.DateTimeFormat(locale, {
          dateStyle: 'medium',
          timeZone: timezone,
          ...additionalOptions
        }).format(dateObj);
      
      case 'long':
        return new Intl.DateTimeFormat(locale, {
          dateStyle: 'long',
          timeZone: timezone,
          ...additionalOptions
        }).format(dateObj);
      
      case 'full':
        return new Intl.DateTimeFormat(locale, {
          dateStyle: 'full',
          timeZone: timezone,
          ...additionalOptions
        }).format(dateObj);
      
      case 'time':
        return new Intl.DateTimeFormat(locale, {
          timeStyle: 'medium',
          timeZone: timezone,
          ...additionalOptions
        }).format(dateObj);
      
      case 'datetime':
        return new Intl.DateTimeFormat(locale, {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: timezone,
          ...additionalOptions
        }).format(dateObj);
      
      default:
        throw new Error(`Unknown format type: ${formatType}`);
    }
  }

  /**
   * Formats a date using a custom format string
   * @param {Date|string|number} date - The date to format
   * @param {string} formatString - Custom format string (e.g., 'YYYY-MM-DD HH:mm:ss')
   * @param {Object} options - Additional formatting options
   * @returns {string} Formatted date string
   */
  customFormat(date, formatString, options = {}) {
    const dateObj = this._parseDate(date);
    if (!dateObj) {
      throw new Error('Invalid date provided');
    }

    const { timezone = this.defaultTimezone } = options;
    
    // Create a date in the specified timezone
    const zonedDate = new Date(dateObj.toLocaleString('en-US', { timeZone: timezone }));
    
    const tokens = {
      'YYYY': zonedDate.getFullYear().toString(),
      'YY': zonedDate.getFullYear().toString().slice(-2),
      'MM': (zonedDate.getMonth() + 1).toString().padStart(2, '0'),
      'M': (zonedDate.getMonth() + 1).toString(),
      'DD': zonedDate.getDate().toString().padStart(2, '0'),
      'D': zonedDate.getDate().toString(),
      'HH': zonedDate.getHours().toString().padStart(2, '0'),
      'H': zonedDate.getHours().toString(),
      'mm': zonedDate.getMinutes().toString().padStart(2, '0'),
      'm': zonedDate.getMinutes().toString(),
      'ss': zonedDate.getSeconds().toString().padStart(2, '0'),
      's': zonedDate.getSeconds().toString(),
      'SSS': zonedDate.getMilliseconds().toString().padStart(3, '0')
    };

    let result = formatString;
    Object.entries(tokens).forEach(([token, value]) => {
      result = result.replace(new RegExp(token, 'g'), value);
    });

    return result;
  }

  /**
   * Formats a date for a specific locale
   * @param {Date|string|number} date - The date to format
   * @param {string} locale - The locale code (e.g., 'en-US', 'de-DE', 'ja-JP')
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted date string
   */
  formatForLocale(date, locale, options = {}) {
    const dateObj = this._parseDate(date);
    if (!dateObj) {
      throw new Error('Invalid date provided');
    }

    return new Intl.DateTimeFormat(locale, {
      timeZone: this.defaultTimezone,
      ...options
    }).format(dateObj);
  }

  /**
   * Gets relative time string (e.g., "2 hours ago", "in 3 days")
   * @param {Date|string|number} date - The date to compare
   * @param {Date|string|number} baseDate - The base date to compare against (defaults to now)
   * @param {string} locale - The locale for the relative format
   * @returns {string} Relative time string
   */
  getRelativeTime(date, baseDate = new Date(), locale = this.defaultLocale) {
    const dateObj = this._parseDate(date);
    const baseDateObj = this._parseDate(baseDate);
    
    if (!dateObj || !baseDateObj) {
      throw new Error('Invalid date provided');
    }

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const diffInMs = dateObj.getTime() - baseDateObj.getTime();
    const diffInSeconds = Math.round(diffInMs / 1000);
    const diffInMinutes = Math.round(diffInSeconds / 60);
    const diffInHours = Math.round(diffInMinutes / 60);
    const diffInDays = Math.round(diffInHours / 24);

    if (Math.abs(diffInDays) >= 1) {
      return rtf.format(diffInDays, 'day');
    } else if (Math.abs(diffInHours) >= 1) {
      return rtf.format(diffInHours, 'hour');
    } else if (Math.abs(diffInMinutes) >= 1) {
      return rtf.format(diffInMinutes, 'minute');
    } else {
      return rtf.format(diffInSeconds, 'second');
    }
  }

  /**
   * Parses various date input formats into a Date object
   * @param {Date|string|number} dateInput - The input to parse
   * @returns {Date|null} Parsed Date object or null if invalid
   * @private
   */
  _parseDate(dateInput) {
    if (dateInput instanceof Date) {
      return isNaN(dateInput.getTime()) ? null : dateInput;
    }
    
    if (typeof dateInput === 'string' || typeof dateInput === 'number') {
      const parsed = new Date(dateInput);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    
    return null;
  }

  /**
   * Get available timezones
   * @returns {string[]} Array of timezone identifiers
   */
  getAvailableTimezones() {
    return Intl.supportedValuesOf('timeZone');
  }

  /**
   * Get current timezone
   * @returns {string} Current timezone identifier
   */
  getCurrentTimezone() {
    return this.defaultTimezone;
  }

  /**
   * Set default timezone
   * @param {string} timezone - Timezone identifier
   */
  setDefaultTimezone(timezone) {
    this.defaultTimezone = timezone;
  }

  /**
   * Set default locale
   * @param {string} locale - Locale identifier
   */
  setDefaultLocale(locale) {
    this.defaultLocale = locale;
  }
}

// Create a singleton instance for easy usage
const dateTimeFormatter = new DateTimeFormatter();

// Export both the class and singleton instance
module.exports = {
  DateTimeFormatter,
  dateTimeFormatter,
  // Convenience functions using the singleton
  formatDate: (date, formatType, options) => dateTimeFormatter.format(date, formatType, options),
  customFormatDate: (date, formatString, options) => dateTimeFormatter.customFormat(date, formatString, options),
  formatForLocale: (date, locale, options) => dateTimeFormatter.formatForLocale(date, locale, options),
  getRelativeTime: (date, baseDate, locale) => dateTimeFormatter.getRelativeTime(date, baseDate, locale)
};
