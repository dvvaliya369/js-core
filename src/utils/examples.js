/**
 * Example usage of Date-Time Formatter utilities
 */

const {
    formatDate,
    formatTime,
    formatDateTime,
    getRelativeTime,
    isValidDate,
    DATE_FORMATS
} = require('./dateTimeFormatter');

// Example usage
console.log('=== Date-Time Formatter Examples ===\n');

const now = new Date();
const pastDate = new Date('2023-06-15T14:30:00');
const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

// Basic date formatting
console.log('1. Basic Date Formatting:');
console.log('Short format:', formatDate(now));
console.log('Long format:', formatDate(now, { format: 'long' }));
console.log('ISO format:', formatDate(now, { format: 'iso' }));
console.log('Custom format:', formatDate(now, { 
    format: 'custom', 
    customFormat: 'DD/MM/YYYY' 
}));
console.log();

// Time formatting
console.log('2. Time Formatting:');
console.log('12-hour format:', formatTime(now));
console.log('24-hour format:', formatTime(now, { format: '24h' }));
console.log('With seconds:', formatTime(now, { includeSeconds: true }));
console.log();

// Date-time combination
console.log('3. Date-Time Combination:');
console.log('Default:', formatDateTime(now));
console.log('Long date + 24h time:', formatDateTime(now, {
    dateFormat: 'long',
    timeFormat: '24h'
}));
console.log();

// Relative time
console.log('4. Relative Time:');
console.log('Past date:', getRelativeTime(pastDate));
console.log('Future date:', getRelativeTime(futureDate));
console.log();

// Date validation
console.log('5. Date Validation:');
console.log('Valid date:', isValidDate('2023-12-25'));
console.log('Invalid date:', isValidDate('invalid-date'));
console.log();

// Custom patterns
console.log('6. Custom Patterns:');
console.log('Pattern YYYY-MM-DD HH:mm:', formatDate(now, {
    format: 'custom',
    customFormat: 'YYYY-MM-DD HH:mm'
}));
console.log('Pattern DD/MM/YY h:mm A:', formatDate(now, {
    format: 'custom',
    customFormat: 'DD/MM/YY h:mm A'
}));
console.log();

// Different locales
console.log('7. Different Locales:');
console.log('US locale:', formatDate(now, { locale: 'en-US' }));
console.log('UK locale:', formatDate(now, { locale: 'en-GB' }));
console.log('French locale:', formatDate(now, { locale: 'fr-FR' }));
console.log('German locale:', formatDate(now, { locale: 'de-DE' }));
