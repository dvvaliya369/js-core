// Test file for utils.js functions
const { debounce, throttle, formatDateTime } = require('./utils.js');

console.log('=== Testing formatDateTime Function ===\n');

// Test with current date
const now = new Date();
console.log('Current date tests:');
console.log('- Full format:', formatDateTime(now, { format: 'full' }));
console.log('- Long format:', formatDateTime(now, { format: 'long' }));
console.log('- Medium format:', formatDateTime(now, { format: 'medium' }));
console.log('- Short format:', formatDateTime(now, { format: 'short' }));
console.log('- Date only:', formatDateTime(now, { format: 'date-only' }));
console.log('- Time only:', formatDateTime(now, { format: 'time-only' }));
console.log('- ISO format:', formatDateTime(now, { format: 'iso' }));

// Test relative formatting
console.log('\nRelative time tests:');
const future = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
const past = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
console.log('- Future (2 hours):', formatDateTime(future, { format: 'relative' }));
console.log('- Past (3 days):', formatDateTime(past, { format: 'relative' }));

// Test custom patterns
console.log('\nCustom pattern tests:');
const testDate = new Date('2023-12-25T15:30:45.123Z');
console.log('- YYYY-MM-DD HH:mm:ss:', formatDateTime(testDate, { 
  format: 'custom', 
  customPattern: 'YYYY-MM-DD HH:mm:ss' 
}));
console.log('- DD/MM/YYYY:', formatDateTime(testDate, { 
  format: 'custom', 
  customPattern: 'DD/MM/YYYY' 
}));

// Test different input types
console.log('\nInput type tests:');
const isoString = '2023-12-25T15:30:45.123Z';
const unixTimestamp = 1703519445123;
console.log('- From Date object:', formatDateTime(testDate, { format: 'medium' }));
console.log('- From ISO string:', formatDateTime(isoString, { format: 'medium' }));
console.log('- From timestamp:', formatDateTime(unixTimestamp, { format: 'medium' }));

// Test error handling
console.log('\nError handling test:');
try {
  console.log(formatDateTime('invalid-date', { format: 'long' }));
} catch (error) {
  console.log('- Caught error:', error.message);
}

console.log('\n=== All formatDateTime tests completed ===');
