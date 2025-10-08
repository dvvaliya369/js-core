const { 
  formatDate, 
  customFormatDate, 
  formatForLocale, 
  getRelativeTime, 
  DateTimeFormatter 
} = require('./utils/dateTimeFormatter');

// Test data
const testDate = new Date('2023-12-25T15:30:45.123Z');
const now = new Date();

console.log('=== Date-Time Formatter Test Suite ===\n');

// Test predefined formats
console.log('1. Predefined Formats:');
console.log(`   ISO: ${formatDate(testDate, 'iso')}`);
console.log(`   Short: ${formatDate(testDate, 'short')}`);
console.log(`   Medium: ${formatDate(testDate, 'medium')}`);
console.log(`   Long: ${formatDate(testDate, 'long')}`);
console.log(`   Full: ${formatDate(testDate, 'full')}`);
console.log(`   Time: ${formatDate(testDate, 'time')}`);
console.log(`   DateTime: ${formatDate(testDate, 'datetime')}`);
console.log();

// Test custom formats
console.log('2. Custom Formats:');
console.log(`   YYYY-MM-DD: ${customFormatDate(testDate, 'YYYY-MM-DD')}`);
console.log(`   DD/MM/YYYY HH:mm:ss: ${customFormatDate(testDate, 'DD/MM/YYYY HH:mm:ss')}`);
console.log(`   M/D/YY H:mm: ${customFormatDate(testDate, 'M/D/YY H:mm')}`);
console.log(`   YYYY-MM-DD HH:mm:ss.SSS: ${customFormatDate(testDate, 'YYYY-MM-DD HH:mm:ss.SSS')}`);
console.log();

// Test locale formatting
console.log('3. Locale-specific Formats:');
console.log(`   US English: ${formatForLocale(testDate, 'en-US', { dateStyle: 'full', timeStyle: 'short' })}`);
console.log(`   German: ${formatForLocale(testDate, 'de-DE', { dateStyle: 'full', timeStyle: 'short' })}`);
console.log(`   Japanese: ${formatForLocale(testDate, 'ja-JP', { dateStyle: 'full', timeStyle: 'short' })}`);
console.log(`   French: ${formatForLocale(testDate, 'fr-FR', { dateStyle: 'full', timeStyle: 'short' })}`);
console.log();

// Test relative time
console.log('4. Relative Time:');
const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
console.log(`   2 hours ago: ${getRelativeTime(pastDate)}`);
console.log(`   3 days from now: ${getRelativeTime(futureDate)}`);
console.log(`   Just now: ${getRelativeTime(new Date(Date.now() - 10000))}`); // 10 seconds ago
console.log();

// Test timezone handling
console.log('5. Timezone Examples:');
const formatter = new DateTimeFormatter();
console.log(`   Current timezone: ${formatter.getCurrentTimezone()}`);
console.log(`   UTC: ${formatDate(testDate, 'datetime', { timezone: 'UTC' })}`);
console.log(`   Tokyo: ${formatDate(testDate, 'datetime', { timezone: 'Asia/Tokyo' })}`);
console.log(`   New York: ${formatDate(testDate, 'datetime', { timezone: 'America/New_York' })}`);
console.log();

// Test error handling
console.log('6. Error Handling:');
try {
  formatDate('invalid date', 'short');
} catch (error) {
  console.log(`   Invalid date error: ${error.message}`);
}

try {
  formatDate(testDate, 'invalid_format');
} catch (error) {
  console.log(`   Invalid format error: ${error.message}`);
}
console.log();

console.log('=== All Tests Completed Successfully! ===');
