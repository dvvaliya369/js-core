/**
 * Example Usage of DateTimeFormatter
 */

// Import the formatter (in Node.js)
const DateTimeFormatter = require('./datetime-formatter.js');

// Create formatter instance
const formatter = new DateTimeFormatter({
    timezone: 'UTC',
    locale: 'en-US'
});

console.log('=== Date-Time Formatter Examples ===\n');

// Example 1: Basic formatting with different patterns
console.log('1. Basic Formatting Examples:');
const now = new Date();
console.log(`Current time: ${now}`);
console.log(`ISO format: ${formatter.format(now, 'ISO')}`);
console.log(`US format: ${formatter.format(now, 'US_DATETIME')}`);
console.log(`European format: ${formatter.format(now, 'EU_DATETIME')}`);
console.log(`Readable format: ${formatter.format(now, 'READABLE_LONG')}`);
console.log(`Custom format: ${formatter.format(now, 'YYYY-MM-DD [at] HH:mm:ss')}`);
console.log('');

// Example 2: Different input types
console.log('2. Different Input Types:');
const timestamp = 1640995200000; // January 1, 2022
console.log(`From timestamp: ${formatter.format(timestamp, 'READABLE')}`);
console.log(`From ISO string: ${formatter.format('2022-01-01T00:00:00Z', 'US_DATE')}`);
console.log(`From Date object: ${formatter.format(new Date('2022-01-01'), 'EU_DATE')}`);
console.log('');

// Example 3: Timezone conversions
console.log('3. Timezone Examples:');
const utcTime = new Date('2022-01-01T12:00:00Z');
console.log(`UTC time: ${formatter.format(utcTime, 'READABLE_LONG', { timezone: 'UTC' })}`);
console.log(`New York time: ${formatter.format(utcTime, 'READABLE_LONG', { timezone: 'America/New_York' })}`);
console.log(`Tokyo time: ${formatter.format(utcTime, 'READABLE_LONG', { timezone: 'Asia/Tokyo' })}`);
console.log(`London time: ${formatter.format(utcTime, 'READABLE_LONG', { timezone: 'Europe/London' })}`);
console.log('');

// Example 4: Relative time
console.log('4. Relative Time Examples:');
const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
console.log(`2 hours ago: ${formatter.getRelativeTime(pastDate)}`);
console.log(`3 days from now: ${formatter.getRelativeTime(futureDate)}`);
console.log('');

// Example 5: Custom formats
console.log('5. Custom Format Examples:');
formatter.addCustomFormat('CUSTOM_LOG', 'YYYY-MM-DD HH:mm:ss.sss [UTC]');
formatter.addCustomFormat('FILENAME', 'YYYY-MM-DD_HHmmss');
console.log(`Log format: ${formatter.format(now, 'CUSTOM_LOG')}`);
console.log(`Filename format: ${formatter.format(now, 'FILENAME')}`);
console.log('');

// Example 6: Validation
console.log('6. Validation Examples:');
console.log(`Valid date: ${formatter.isValidDate('2022-01-01')} (true)`);
console.log(`Invalid date: ${formatter.isValidDate('invalid-date')} (false)`);
console.log(`Valid timestamp: ${formatter.isValidDate(1640995200000)} (true)`);
console.log('');

// Example 7: Available formats
console.log('7. Available Formats:');
const availableFormats = formatter.getAvailableFormats();
availableFormats.forEach(format => {
    try {
        console.log(`${format}: ${formatter.format(now, format)}`);
    } catch (error) {
        console.log(`${format}: Error - ${error.message}`);
    }
});
console.log('');

// Example 8: Time-only formatting
console.log('8. Time-Only Examples:');
console.log(`24-hour time: ${formatter.format(now, 'TIME_24')}`);
console.log(`12-hour time: ${formatter.format(now, 'TIME_12')}`);
console.log(`Short time: ${formatter.format(now, 'TIME_SHORT')}`);
console.log('');

// Example 9: Date arithmetic examples
console.log('9. Date Comparison Examples:');
const date1 = new Date('2022-01-01');
const date2 = new Date('2022-01-15');
console.log(`Date 1: ${formatter.format(date1, 'READABLE')}`);
console.log(`Date 2: ${formatter.format(date2, 'READABLE')}`);
console.log(`Relative to Date 1: ${formatter.getRelativeTime(date1, date2)}`);
console.log('');

// Example 10: Error handling
console.log('10. Error Handling Examples:');
try {
    formatter.format(null, 'ISO');
} catch (error) {
    console.log(`Null input error: ${error.message}`);
}

try {
    formatter.format('invalid-date', 'ISO');
} catch (error) {
    console.log(`Invalid date error: ${error.message}`);
}
console.log('');

console.log('=== All Examples Completed ===');
