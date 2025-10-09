/**
 * Utility Functions
 * A collection of useful utility functions for common tasks
 */

/**
 * Creates a debounced version of the provided function that delays its execution
 * until after the specified wait time has elapsed since the last time it was invoked.
 * 
 * This is useful for scenarios like:
 * - Search input fields (wait for user to stop typing)
 * - Resize event handlers
 * - Button click prevention
 * - API calls that should be rate-limited
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - If true, trigger the function on the leading edge instead of trailing
 * @returns {Function} The debounced function
 * 
 * @example
 * // Basic usage
 * const debouncedSearch = debounce((query) => {
 *   console.log('Searching for:', query);
 * }, 300);
 * 
 * // Usage with immediate execution
 * const debouncedSave = debounce(() => {
 *   console.log('Saving...');
 * }, 1000, true);
 * 
 * // In event handlers
 * window.addEventListener('resize', debounce(() => {
 *   console.log('Window resized');
 * }, 250));
 */
function debounce(func, wait, immediate = false) {
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
}

/**
 * Creates a throttled version of the provided function that only executes at most
 * once per specified time interval, regardless of how many times it's called.
 * 
 * Unlike debounce which delays execution until after a quiet period, throttle
 * ensures the function runs at regular intervals during continuous invocations.
 * 
 * This is useful for scenarios like:
 * - Scroll event handlers that need regular updates
 * - Mouse move tracking
 * - API calls that need consistent rate limiting
 * - Animation frame callbacks
 * - Progress indicators during continuous actions
 * 
 * @param {Function} func - The function to throttle
 * @param {number} limit - The number of milliseconds between executions
 * @param {Object} options - Optional configuration object
 * @param {boolean} options.leading - If true, execute on the leading edge (default: true)
 * @param {boolean} options.trailing - If true, execute on the trailing edge (default: true)
 * @returns {Function} The throttled function
 * 
 * @example
 * // Basic usage
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll position:', window.pageYOffset);
 * }, 100);
 * 
 * // Throttle with options
 * const throttledMouseMove = throttle((event) => {
 *   console.log('Mouse at:', event.clientX, event.clientY);
 * }, 50, { leading: true, trailing: false });
 * 
 * // API rate limiting
 * const throttledApiCall = throttle(() => {
 *   fetch('/api/data').then(response => response.json());
 * }, 1000);
 */
function throttle(func, limit, options = {}) {
  let inThrottle;
  let lastFunc;
  let lastRan;
  
  const { leading = true, trailing = true } = options;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      if (leading) {
        func.apply(this, args);
      }
      lastRan = Date.now();
      inThrottle = true;
    } else {
      if (trailing) {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    }
    
    setTimeout(() => {
      inThrottle = false;
    }, limit);
  };
}

/**
 * Formats a date object or timestamp into various human-readable string formats.
 * 
 * This utility provides a flexible way to format dates with common patterns
 * and localization support. It handles various input types and provides
 * sensible defaults for different use cases.
 * 
 * @param {Date|string|number} date - The date to format (Date object, ISO string, or timestamp)
 * @param {Object} options - Formatting options
 * @param {string} options.format - The format pattern to use
 *   - 'full': 'Monday, December 25, 2023 at 3:30 PM'
 *   - 'long': 'December 25, 2023 3:30 PM'
 *   - 'medium': 'Dec 25, 2023 3:30 PM'
 *   - 'short': '12/25/2023 3:30 PM'
 *   - 'date-only': '12/25/2023'
 *   - 'time-only': '3:30 PM'
 *   - 'iso': '2023-12-25T15:30:00.000Z'
 *   - 'relative': 'in 2 hours', '3 days ago'
 *   - 'custom': Use custom pattern with tokens
 * @param {string} options.locale - Locale for formatting (default: 'en-US')
 * @param {string} options.timezone - Timezone for formatting (default: local timezone)
 * @param {string} options.customPattern - Custom pattern when format is 'custom'
 *   Tokens: YYYY (year), MM (month), DD (day), HH (hour), mm (minute), ss (second)
 * @param {boolean} options.utc - If true, format in UTC (default: false)
 * @returns {string} The formatted date string
 * 
 * @example
 * const date = new Date('2023-12-25T15:30:45.123Z');
 * 
 * // Basic formats
 * formatDateTime(date, { format: 'full' });
 * // → 'Monday, December 25, 2023 at 3:30 PM'
 * 
 * formatDateTime(date, { format: 'short' });
 * // → '12/25/2023, 3:30 PM'
 * 
 * formatDateTime(date, { format: 'date-only' });
 * // → '12/25/2023'
 * 
 * formatDateTime(date, { format: 'time-only' });
 * // → '3:30 PM'
 * 
 * // Relative formatting
 * formatDateTime(new Date(Date.now() + 2 * 60 * 60 * 1000), { format: 'relative' });
 * // → 'in 2 hours'
 * 
 * formatDateTime(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), { format: 'relative' });
 * // → '3 days ago'
 * 
 * // Custom patterns
 * formatDateTime(date, { format: 'custom', customPattern: 'YYYY-MM-DD HH:mm' });
 * // → '2023-12-25 15:30'
 * 
 * // Different locales
 * formatDateTime(date, { format: 'long', locale: 'fr-FR' });
 * // → '25 décembre 2023 à 15:30'
 * 
 * formatDateTime(date, { format: 'long', locale: 'ja-JP' });
 * // → '2023年12月25日 15:30'
 * 
 * // With timezone
 * formatDateTime(date, { format: 'long', timezone: 'America/New_York' });
 * // → 'December 25, 2023 at 10:30 AM'
 */
function formatDateTime(date, options = {}) {
  // Default options
  const {
    format = 'medium',
    locale = 'en-US',
    timezone,
    customPattern,
    utc = false
  } = options;

  // Parse input date
  let dateObj;
  
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else {
    throw new Error('Invalid date input. Expected Date object, ISO string, or timestamp.');
  }

  // Validate date
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided.');
  }

  // Handle relative formatting
  if (format === 'relative') {
    return formatRelativeTime(dateObj, locale);
  }

  // Handle ISO format
  if (format === 'iso') {
    return utc ? dateObj.toISOString() : dateObj.toISOString();
  }

  // Handle custom pattern
  if (format === 'custom' && customPattern) {
    return formatWithCustomPattern(dateObj, customPattern, utc);
  }

  // Intl.DateTimeFormat options based on format
  const formatOptions = {
    'full': {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    },
    'long': {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    },
    'medium': {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    },
    'short': {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    },
    'date-only': {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    'time-only': {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }
  };

  // Get the appropriate options
  const intlOptions = formatOptions[format] || formatOptions.medium;

  // Add timezone if specified
  if (timezone) {
    intlOptions.timeZone = timezone;
  }

  // Format the date
  try {
    return new Intl.DateTimeFormat(locale, intlOptions).format(dateObj);
  } catch (error) {
    // Fallback to basic formatting if Intl fails
    return dateObj.toString();
  }
}

/**
 * Helper function to format relative time (e.g., "2 hours ago", "in 3 days")
 * @private
 */
function formatRelativeTime(date, locale = 'en-US') {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  // Use Intl.RelativeTimeFormat if available
  if (typeof Intl !== 'undefined' && Intl.RelativeTimeFormat) {
    try {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
      
      if (Math.abs(diffYears) >= 1) {
        return rtf.format(diffYears, 'year');
      } else if (Math.abs(diffMonths) >= 1) {
        return rtf.format(diffMonths, 'month');
      } else if (Math.abs(diffWeeks) >= 1) {
        return rtf.format(diffWeeks, 'week');
      } else if (Math.abs(diffDays) >= 1) {
        return rtf.format(diffDays, 'day');
      } else if (Math.abs(diffHours) >= 1) {
        return rtf.format(diffHours, 'hour');
      } else if (Math.abs(diffMinutes) >= 1) {
        return rtf.format(diffMinutes, 'minute');
      } else {
        return rtf.format(diffSeconds, 'second');
      }
    } catch (error) {
      // Fall through to manual formatting
    }
  }

  // Manual relative time formatting as fallback
  const abs = Math.abs;
  const isPast = diffMs < 0;
  const suffix = isPast ? ' ago' : '';
  const prefix = isPast ? '' : 'in ';

  if (abs(diffYears) >= 1) {
    return `${prefix}${abs(diffYears)} year${abs(diffYears) !== 1 ? 's' : ''}${suffix}`;
  } else if (abs(diffMonths) >= 1) {
    return `${prefix}${abs(diffMonths)} month${abs(diffMonths) !== 1 ? 's' : ''}${suffix}`;
  } else if (abs(diffWeeks) >= 1) {
    return `${prefix}${abs(diffWeeks)} week${abs(diffWeeks) !== 1 ? 's' : ''}${suffix}`;
  } else if (abs(diffDays) >= 1) {
    return `${prefix}${abs(diffDays)} day${abs(diffDays) !== 1 ? 's' : ''}${suffix}`;
  } else if (abs(diffHours) >= 1) {
    return `${prefix}${abs(diffHours)} hour${abs(diffHours) !== 1 ? 's' : ''}${suffix}`;
  } else if (abs(diffMinutes) >= 1) {
    return `${prefix}${abs(diffMinutes)} minute${abs(diffMinutes) !== 1 ? 's' : ''}${suffix}`;
  } else {
    return isPast ? 'just now' : 'in a moment';
  }
}

/**
 * Helper function to format with custom pattern
 * @private
 */
function formatWithCustomPattern(date, pattern, utc = false) {
  const d = utc ? new Date(date.getTime() + (date.getTimezoneOffset() * 60000)) : date;
  
  const tokens = {
    'YYYY': utc ? d.getUTCFullYear() : d.getFullYear(),
    'MM': String((utc ? d.getUTCMonth() : d.getMonth()) + 1).padStart(2, '0'),
    'DD': String(utc ? d.getUTCDate() : d.getDate()).padStart(2, '0'),
    'HH': String(utc ? d.getUTCHours() : d.getHours()).padStart(2, '0'),
    'mm': String(utc ? d.getUTCMinutes() : d.getMinutes()).padStart(2, '0'),
    'ss': String(utc ? d.getUTCSeconds() : d.getSeconds()).padStart(2, '0')
  };

  let formatted = pattern;
  Object.keys(tokens).forEach(token => {
    formatted = formatted.replace(new RegExp(token, 'g'), tokens[token]);
  });

  return formatted;
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { debounce, throttle, formatDateTime };
} else if (typeof exports !== 'undefined') {
  exports.debounce = debounce;
  exports.throttle = throttle;
  exports.formatDateTime = formatDateTime;
} else if (typeof window !== 'undefined') {
  window.Utils = window.Utils || {};
  window.Utils.debounce = debounce;
  window.Utils.throttle = throttle;
  window.Utils.formatDateTime = formatDateTime;
}

/* 
 * Usage Examples:
 * 
 * // DEBOUNCE EXAMPLES:
 * // 1. Search input debouncing
 * const searchInput = document.getElementById('search');
 * const debouncedSearch = debounce((event) => {
 *   const query = event.target.value;
 *   // Make API call here
 *   fetch(`/api/search?q=${query}`)
 *     .then(response => response.json())
 *     .then(data => console.log(data));
 * }, 500);
 * 
 * searchInput.addEventListener('input', debouncedSearch);
 * 
 * // 2. Window resize handler
 * const handleResize = debounce(() => {
 *   console.log('Window dimensions:', window.innerWidth, window.innerHeight);
 *   // Recalculate layouts, update charts, etc.
 * }, 250);
 * 
 * window.addEventListener('resize', handleResize);
 * 
 * // 3. Button click prevention (immediate execution)
 * const submitButton = document.getElementById('submit');
 * const debouncedSubmit = debounce((event) => {
 *   // Prevent multiple rapid clicks
 *   console.log('Form submitted');
 *   // Submit form logic here
 * }, 2000, true);
 * 
 * submitButton.addEventListener('click', debouncedSubmit);
 * 
 * // 4. Scroll event optimization with debounce
 * const handleScrollDebounced = debounce(() => {
 *   const scrollPosition = window.pageYOffset;
 *   console.log('Scroll ended at position:', scrollPosition);
 *   // Update navigation after scrolling stops, load more content, etc.
 * }, 100);
 * 
 * window.addEventListener('scroll', handleScrollDebounced);
 * 
 * // THROTTLE EXAMPLES:
 * // 1. Scroll event with consistent updates
 * const throttledScrollHandler = throttle(() => {
 *   const scrollPercent = (window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100;
 *   console.log('Scroll progress:', Math.round(scrollPercent) + '%');
 *   // Update progress bar, parallax effects, etc.
 * }, 100);
 * 
 * window.addEventListener('scroll', throttledScrollHandler);
 * 
 * // 2. Mouse move tracking
 * const throttledMouseMove = throttle((event) => {
 *   console.log('Mouse coordinates:', event.clientX, event.clientY);
 *   // Update cursor effects, tooltips, etc.
 * }, 50);
 * 
 * document.addEventListener('mousemove', throttledMouseMove);
 * 
 * // 3. API calls with rate limiting
 * const throttledApiUpdate = throttle(() => {
 *   fetch('/api/live-data')
 *     .then(response => response.json())
 *     .then(data => {
 *       console.log('Live data updated:', data);
 *       // Update UI with fresh data
 *     });
 * }, 2000);
 * 
 * // Call this frequently, but API will only be hit every 2 seconds
 * setInterval(throttledApiUpdate, 100);
 * 
 * // 4. Button spam prevention with throttle
 * const likeButton = document.getElementById('like');
 * const throttledLike = throttle(() => {
 *   console.log('Like button clicked');
 *   // Send like to server, but limit to once per second
 *   fetch('/api/like', { method: 'POST' });
 * }, 1000);
 * 
 * likeButton.addEventListener('click', throttledLike);
 * 
 * // 5. Window resize with throttle (for continuous updates)
 * const throttledResize = throttle(() => {
 *   console.log('Window resizing...', window.innerWidth, window.innerHeight);
 *   // Update layouts continuously while resizing
 * }, 100);
 * 
 * window.addEventListener('resize', throttledResize);
 * 
 * // COMPARISON EXAMPLE: Debounce vs Throttle for scroll
 * // Use debounce when you want to act after scrolling stops
 * const scrollEndHandler = debounce(() => {
 *   console.log('User stopped scrolling');
 * }, 150);
 * 
 * // Use throttle when you want regular updates while scrolling
 * const scrollProgressHandler = throttle(() => {
 *   console.log('Scrolling in progress...');
 * }, 150);
 * 
 * window.addEventListener('scroll', scrollEndHandler);
 * window.addEventListener('scroll', scrollProgressHandler);
 * 
 * // FORMATDATETIME EXAMPLES:
 * // 1. Display formatted timestamps
 * const timestamp = new Date('2023-12-25T15:30:45.123Z');
 * 
 * // Different format options
 * console.log('Full:', formatDateTime(timestamp, { format: 'full' }));
 * // → 'Monday, December 25, 2023 at 3:30 PM'
 * 
 * console.log('Long:', formatDateTime(timestamp, { format: 'long' }));
 * // → 'December 25, 2023 at 3:30 PM'
 * 
 * console.log('Medium:', formatDateTime(timestamp, { format: 'medium' }));
 * // → 'Dec 25, 2023, 3:30 PM'
 * 
 * console.log('Short:', formatDateTime(timestamp, { format: 'short' }));
 * // → '12/25/2023, 3:30 PM'
 * 
 * console.log('Date only:', formatDateTime(timestamp, { format: 'date-only' }));
 * // → '12/25/2023'
 * 
 * console.log('Time only:', formatDateTime(timestamp, { format: 'time-only' }));
 * // → '3:30 PM'
 * 
 * // 2. Relative time formatting
 * const future = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
 * const past = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
 * 
 * console.log('Future:', formatDateTime(future, { format: 'relative' }));
 * // → 'in 2 hours'
 * 
 * console.log('Past:', formatDateTime(past, { format: 'relative' }));
 * // → '3 days ago'
 * 
 * // 3. Custom formatting patterns
 * console.log('Custom:', formatDateTime(timestamp, { 
 *   format: 'custom', 
 *   customPattern: 'YYYY-MM-DD HH:mm:ss' 
 * }));
 * // → '2023-12-25 15:30:45'
 * 
 * console.log('Log format:', formatDateTime(timestamp, { 
 *   format: 'custom', 
 *   customPattern: '[YYYY-MM-DD HH:mm:ss]' 
 * }));
 * // → '[2023-12-25 15:30:45]'
 * 
 * // 4. Different locales
 * console.log('French:', formatDateTime(timestamp, { format: 'long', locale: 'fr-FR' }));
 * // → '25 décembre 2023 à 15:30'
 * 
 * console.log('German:', formatDateTime(timestamp, { format: 'long', locale: 'de-DE' }));
 * // → '25. Dezember 2023 um 15:30'
 * 
 * console.log('Japanese:', formatDateTime(timestamp, { format: 'long', locale: 'ja-JP' }));
 * // → '2023年12月25日 15:30'
 * 
 * // 5. Timezone conversion
 * console.log('New York:', formatDateTime(timestamp, { 
 *   format: 'long', 
 *   timezone: 'America/New_York' 
 * }));
 * // → 'December 25, 2023 at 10:30 AM'
 * 
 * console.log('Tokyo:', formatDateTime(timestamp, { 
 *   format: 'long', 
 *   timezone: 'Asia/Tokyo' 
 * }));
 * // → 'December 26, 2023 at 12:30 AM'
 * 
 * // 6. Working with different input types
 * const now = new Date();
 * const isoString = '2023-12-25T15:30:45.123Z';
 * const unixTimestamp = 1703519445123;
 * 
 * console.log('From Date object:', formatDateTime(now, { format: 'medium' }));
 * console.log('From ISO string:', formatDateTime(isoString, { format: 'medium' }));
 * console.log('From timestamp:', formatDateTime(unixTimestamp, { format: 'medium' }));
 * 
 * // 7. Error handling example
 * try {
 *   console.log(formatDateTime('invalid-date', { format: 'long' }));
 * } catch (error) {
 *   console.error('Date formatting error:', error.message);
 * }
 * 
 * // 8. Practical use cases in applications
 * 
 * // Blog post timestamps
 * const blogPost = {
 *   title: 'My Blog Post',
 *   createdAt: new Date('2023-12-25T15:30:45.123Z'),
 *   updatedAt: new Date('2023-12-26T10:15:30.456Z')
 * };
 * 
 * const postElement = document.createElement('article');
 * postElement.innerHTML = `
 *   <h2>${blogPost.title}</h2>
 *   <p>Posted: ${formatDateTime(blogPost.createdAt, { format: 'relative' })}</p>
 *   <p>Last updated: ${formatDateTime(blogPost.updatedAt, { format: 'long' })}</p>
 * `;
 * 
 * // Chat message timestamps
 * const messages = [
 *   { text: 'Hello!', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
 *   { text: 'How are you?', timestamp: new Date(Date.now() - 3 * 60 * 1000) },
 *   { text: 'Good, thanks!', timestamp: new Date(Date.now() - 1 * 60 * 1000) }
 * ];
 * 
 * messages.forEach(message => {
 *   console.log(`${formatDateTime(message.timestamp, { format: 'time-only' })}: ${message.text}`);
 * });
 * 
 * // Event scheduling with timezones
 * const event = {
 *   title: 'Team Meeting',
 *   startTime: new Date('2023-12-25T15:30:00Z')
 * };
 * 
 * // Show event time in different timezones
 * const timezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];
 * timezones.forEach(tz => {
 *   console.log(`${tz}: ${formatDateTime(event.startTime, { 
 *     format: 'long', 
 *     timezone: tz 
 *   })}`);
 * });
 * 
 * // Log file formatting
 * const logMessage = (level, message) => {
 *   const timestamp = formatDateTime(new Date(), { 
 *     format: 'custom', 
 *     customPattern: 'YYYY-MM-DD HH:mm:ss' 
 *   });
 *   console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
 * };
 * 
 * logMessage('info', 'Application started');
 * logMessage('error', 'Database connection failed');
 * logMessage('debug', 'Processing user request');
 */
