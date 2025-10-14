/**
 * Comprehensive Date-Time Formatter
 * Supports multiple input/output formats and timezone handling
 */

class DateTimeFormatter {
    constructor(options = {}) {
        this.defaultTimezone = options.timezone || 'UTC';
        this.defaultLocale = options.locale || 'en-US';
        
        // Predefined format patterns
        this.formats = {
            // ISO formats
            'ISO': 'YYYY-MM-DDTHH:mm:ss.sssZ',
            'ISO_DATE': 'YYYY-MM-DD',
            'ISO_TIME': 'HH:mm:ss',
            
            // US formats
            'US_DATE': 'MM/DD/YYYY',
            'US_DATETIME': 'MM/DD/YYYY HH:mm:ss',
            'US_SHORT': 'M/D/YY',
            
            // European formats
            'EU_DATE': 'DD/MM/YYYY',
            'EU_DATETIME': 'DD/MM/YYYY HH:mm:ss',
            
            // Readable formats
            'READABLE': 'MMMM DD, YYYY',
            'READABLE_LONG': 'dddd, MMMM DD, YYYY at HH:mm:ss',
            'READABLE_SHORT': 'MMM DD, YYYY',
            
            // Time formats
            'TIME_12': 'hh:mm:ss A',
            'TIME_24': 'HH:mm:ss',
            'TIME_SHORT': 'HH:mm',
            
            // Timestamps
            'UNIX': 'X',
            'UNIX_MS': 'x'
        };
    }

    /**
     * Parse input date from various formats
     */
    parseInput(input) {
        if (!input) {
            throw new Error('Input date is required');
        }

        // If already a Date object
        if (input instanceof Date) {
            return input;
        }

        // If it's a timestamp (number)
        if (typeof input === 'number') {
            return new Date(input);
        }

        // If it's a string
        if (typeof input === 'string') {
            // Try parsing as ISO string first
            const isoDate = new Date(input);
            if (!isNaN(isoDate.getTime())) {
                return isoDate;
            }
            
            // Try parsing as timestamp
            const timestamp = parseInt(input);
            if (!isNaN(timestamp)) {
                // Assume milliseconds if > 1e12, otherwise seconds
                return new Date(timestamp > 1e12 ? timestamp : timestamp * 1000);
            }
        }

        throw new Error(`Unable to parse date: ${input}`);
    }

    /**
     * Format date according to pattern
     */
    format(input, pattern = 'ISO', options = {}) {
        try {
            const date = this.parseInput(input);
            const timezone = options.timezone || this.defaultTimezone;
            const locale = options.locale || this.defaultLocale;

            // Get the pattern string
            const formatPattern = this.formats[pattern] || pattern;

            // Use Intl.DateTimeFormat for timezone-aware formatting
            if (timezone !== 'local') {
                return this.formatWithTimezone(date, formatPattern, timezone, locale);
            }

            return this.formatWithPattern(date, formatPattern);
        } catch (error) {
            throw new Error(`Formatting failed: ${error.message}`);
        }
    }

    /**
     * Format with timezone support
     */
    formatWithTimezone(date, pattern, timezone, locale) {
        // For complex patterns, we'll use a custom approach
        if (pattern.includes('YYYY') || pattern.includes('MM') || pattern.includes('DD')) {
            return this.formatWithPattern(date, pattern, timezone);
        }

        // For simpler cases, use Intl.DateTimeFormat
        const formatter = new Intl.DateTimeFormat(locale, {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        return formatter.format(date);
    }

    /**
     * Format with custom pattern
     */
    formatWithPattern(date, pattern, timezone = null) {
        // Convert to target timezone if specified
        let targetDate = date;
        if (timezone && timezone !== 'local') {
            targetDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
        }

        const tokens = {
            'YYYY': () => targetDate.getFullYear().toString(),
            'YY': () => targetDate.getFullYear().toString().slice(-2),
            'MMMM': () => targetDate.toLocaleDateString('en-US', { month: 'long' }),
            'MMM': () => targetDate.toLocaleDateString('en-US', { month: 'short' }),
            'MM': () => (targetDate.getMonth() + 1).toString().padStart(2, '0'),
            'M': () => (targetDate.getMonth() + 1).toString(),
            'DD': () => targetDate.getDate().toString().padStart(2, '0'),
            'D': () => targetDate.getDate().toString(),
            'dddd': () => targetDate.toLocaleDateString('en-US', { weekday: 'long' }),
            'ddd': () => targetDate.toLocaleDateString('en-US', { weekday: 'short' }),
            'HH': () => targetDate.getHours().toString().padStart(2, '0'),
            'H': () => targetDate.getHours().toString(),
            'hh': () => {
                const hours = targetDate.getHours() % 12 || 12;
                return hours.toString().padStart(2, '0');
            },
            'h': () => (targetDate.getHours() % 12 || 12).toString(),
            'mm': () => targetDate.getMinutes().toString().padStart(2, '0'),
            'm': () => targetDate.getMinutes().toString(),
            'ss': () => targetDate.getSeconds().toString().padStart(2, '0'),
            's': () => targetDate.getSeconds().toString(),
            'sss': () => targetDate.getMilliseconds().toString().padStart(3, '0'),
            'A': () => targetDate.getHours() >= 12 ? 'PM' : 'AM',
            'a': () => targetDate.getHours() >= 12 ? 'pm' : 'am',
            'X': () => Math.floor(targetDate.getTime() / 1000).toString(),
            'x': () => targetDate.getTime().toString(),
            'Z': () => {
                const offset = -targetDate.getTimezoneOffset();
                const hours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
                const minutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
                return (offset >= 0 ? '+' : '-') + hours + ':' + minutes;
            }
        };

        let result = pattern;
        
        // Handle literal text in brackets first (like [at], [UTC])
        const literalRegex = /\[([^\]]+)\]/g;
        const literals = [];
        let literalIndex = 0;
        result = result.replace(literalRegex, (match, literal) => {
            const placeholder = `__LITERAL_${literalIndex++}__`;
            literals.push(literal);
            return placeholder;
        });
        
        // Sort tokens by length (longest first) to avoid partial replacements
        const sortedTokens = Object.keys(tokens).sort((a, b) => b.length - a.length);
        
        for (const token of sortedTokens) {
            const regex = new RegExp(token, 'g');
            result = result.replace(regex, tokens[token]());
        }

        // Restore literal text
        literals.forEach((literal, index) => {
            result = result.replace(`__LITERAL_${index}__`, literal);
        });

        return result;
    }

    /**
     * Get available format patterns
     */
    getAvailableFormats() {
        return Object.keys(this.formats);
    }

    /**
     * Add custom format pattern
     */
    addCustomFormat(name, pattern) {
        this.formats[name] = pattern;
    }

    /**
     * Convert between timezones
     */
    convertTimezone(input, fromTimezone, toTimezone) {
        const date = this.parseInput(input);
        
        // Convert to target timezone
        const targetTime = new Date(date.toLocaleString('en-US', { 
            timeZone: toTimezone 
        }));
        
        return targetTime;
    }

    /**
     * Get timezone offset
     */
    getTimezoneOffset(timezone = null) {
        const date = new Date();
        if (!timezone || timezone === 'local') {
            return date.getTimezoneOffset();
        }
        
        // Calculate offset for specific timezone
        const localTime = date.getTime();
        const targetTime = new Date(date.toLocaleString('en-US', { 
            timeZone: timezone 
        })).getTime();
        
        return (localTime - targetTime) / (1000 * 60);
    }

    /**
     * Validate date input
     */
    isValidDate(input) {
        try {
            const date = this.parseInput(input);
            return !isNaN(date.getTime());
        } catch {
            return false;
        }
    }

    /**
     * Get relative time (e.g., "2 hours ago")
     */
    getRelativeTime(input, baseDate = new Date()) {
        const date = this.parseInput(input);
        const base = this.parseInput(baseDate);
        
        const diffMs = base.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        const diffWeek = Math.floor(diffDay / 7);
        const diffMonth = Math.floor(diffDay / 30);
        const diffYear = Math.floor(diffDay / 365);

        if (Math.abs(diffSec) < 60) return 'just now';
        if (Math.abs(diffMin) < 60) return `${Math.abs(diffMin)} minute${Math.abs(diffMin) !== 1 ? 's' : ''} ${diffMin > 0 ? 'ago' : 'from now'}`;
        if (Math.abs(diffHour) < 24) return `${Math.abs(diffHour)} hour${Math.abs(diffHour) !== 1 ? 's' : ''} ${diffHour > 0 ? 'ago' : 'from now'}`;
        if (Math.abs(diffDay) < 7) return `${Math.abs(diffDay)} day${Math.abs(diffDay) !== 1 ? 's' : ''} ${diffDay > 0 ? 'ago' : 'from now'}`;
        if (Math.abs(diffWeek) < 4) return `${Math.abs(diffWeek)} week${Math.abs(diffWeek) !== 1 ? 's' : ''} ${diffWeek > 0 ? 'ago' : 'from now'}`;
        if (Math.abs(diffMonth) < 12) return `${Math.abs(diffMonth)} month${Math.abs(diffMonth) !== 1 ? 's' : ''} ${diffMonth > 0 ? 'ago' : 'from now'}`;
        return `${Math.abs(diffYear)} year${Math.abs(diffYear) !== 1 ? 's' : ''} ${diffYear > 0 ? 'ago' : 'from now'}`;
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DateTimeFormatter;
} else if (typeof window !== 'undefined') {
    window.DateTimeFormatter = DateTimeFormatter;
}
