const { 
  formatDateTime, 
  getRelativeTime, 
  isLeapYear, 
  getDaysInMonth, 
  parseDate 
} = require('./utils');

// Test the formatDateTime function
console.log('=== DateTime Formatter Tests ===\n');

const testDate = new Date('2025-10-07T15:01:59.123Z');
console.log('Test date:', testDate.toISOString());
console.log();

// Test preset formats
console.log('Preset Formats:');
console.log('iso:', formatDateTime(testDate, 'iso'));
console.log('short:', formatDateTime(testDate, 'short'));
console.log('medium:', formatDateTime(testDate, 'medium'));
console.log('long:', formatDateTime(testDate, 'long'));
console.log('full:', formatDateTime(testDate, 'full'));
console.log('time:', formatDateTime(testDate, 'time'));
console.log('date:', formatDateTime(testDate, 'date'));
console.log();

// Test custom formats
console.log('Custom Formats:');
console.log('YYYY-MM-DD:', formatDateTime(testDate, 'YYYY-MM-DD'));
console.log('MM/DD/YYYY:', formatDateTime(testDate, 'MM/DD/YYYY'));
console.log('DD-MM-YYYY HH:mm:ss:', formatDateTime(testDate, 'DD-MM-YYYY HH:mm:ss'));
console.log('MMMM D, YYYY:', formatDateTime(testDate, 'MMMM D, YYYY'));
console.log();

// Test with different timezones
console.log('Timezone Tests:');
console.log('UTC:', formatDateTime(testDate, 'medium', { timezone: 'UTC' }));
console.log('New York:', formatDateTime(testDate, 'medium', { timezone: 'America/New_York' }));
console.log('Tokyo:', formatDateTime(testDate, 'medium', { timezone: 'Asia/Tokyo' }));
console.log();

// Test relative time
console.log('Relative Time Tests:');
const now = new Date();
const oneHourAgo = new Date(now.getTime() - 3600000);
const oneDayFromNow = new Date(now.getTime() + 86400000);
console.log('1 hour ago:', getRelativeTime(oneHourAgo));
console.log('In 1 day:', getRelativeTime(oneDayFromNow));
console.log();

// Test utility functions
console.log('Utility Function Tests:');
console.log('Is 2024 a leap year?', isLeapYear(2024));
console.log('Is 2025 a leap year?', isLeapYear(2025));
console.log('Days in February 2024:', getDaysInMonth(2024, 2));
console.log('Days in February 2025:', getDaysInMonth(2025, 2));
console.log();

// Test date parsing
console.log('Date Parsing Tests:');
try {
  console.log('Parse "2025-10-07":', parseDate('2025-10-07'));
  console.log('Parse "10/07/2025":', parseDate('10/07/2025'));
  console.log('Parse "10-07-2025":', parseDate('10-07-2025'));
} catch (error) {
  console.error('Parsing error:', error.message);
}

console.log('\n=== All tests completed ===');
