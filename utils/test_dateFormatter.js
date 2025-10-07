const {
  formatDate,
  getRelativeTime,
  parseDate,
  isValidDate,
  startOfDay,
  endOfDay,
  addTime,
  dateDiff,
  presetFormats,
} = require('./dateFormatter');

// Test suite for date formatter utilities
console.log('=== Date-Time Formatter Test Suite ===\n');

try {
  const now = new Date();
  const testDate = new Date('2024-03-15T14:30:00');
  const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now

  console.log('1. Format Date Tests:');
  console.log('   Current time (default):', formatDate(now));
  console.log('   Current time (custom):', formatDate(now, 'YYYY-MM-DD HH:mm:ss'));
  console.log('   Test date (long):', formatDate(testDate, 'MMMM DD, YYYY') + ' at ' + formatDate(testDate, 'HH:mm'));
  console.log('   Test date (short):', formatDate(testDate, 'MM/DD/YY'));
  console.log('   With 12-hour format:', formatDate(testDate, 'hh:mm A'));

  console.log('\n2. Relative Time Tests:');
  console.log('   Test date relative to now:', getRelativeTime(testDate));
  console.log('   Future date relative to now:', getRelativeTime(futureDate));
  console.log('   Now relative to test date:', getRelativeTime(now, testDate));

  console.log('\n3. Date Validation Tests:');
  console.log('   Valid date (2024-03-15):', isValidDate('2024-03-15'));
  console.log('   Invalid date (2024-13-45):', isValidDate('2024-13-45'));
  console.log('   Valid Date object:', isValidDate(new Date()));
  console.log('   Invalid input (string):', isValidDate('not a date'));

  console.log('\n4. Start/End of Day Tests:');
  console.log('   Start of today:', startOfDay(now));
  console.log('   End of today:', endOfDay(now));
  console.log('   Start of test date:', startOfDay(testDate));

  console.log('\n5. Add Time Tests:');
  console.log('   Add 5 days to now:', formatDate(addTime(now, 5, 'days')));
  console.log('   Add 3 hours to test date:', formatDate(addTime(testDate, 3, 'hours'), 'YYYY-MM-DD HH:mm'));
  console.log('   Subtract 2 weeks from now:', formatDate(addTime(now, -2, 'weeks')));

  console.log('\n6. Date Difference Tests:');
  console.log('   Difference in days (now - testDate):', Math.round(dateDiff(now, testDate, 'days')));
  console.log('   Difference in hours (now - testDate):', Math.round(dateDiff(now, testDate, 'hours')));
  console.log('   Difference in minutes (future - now):', Math.round(dateDiff(futureDate, now, 'minutes')));

  console.log('\n7. Preset Formats Tests:');
  console.log('   ISO format:', presetFormats.iso(now));
  console.log('   Short format:', presetFormats.short(now));
  console.log('   Time format:', presetFormats.time(now));
  console.log('   DateTime format:', presetFormats.datetime(now));

  console.log('\n8. Parse Date Tests:');
  const dateStrings = [
    '2024-03-15',
    '2024-03-15T14:30:00',
    '03/15/2024',
  ];

  dateStrings.forEach(dateStr => {
    try {
      const parsed = parseDate(dateStr);
      console.log(`   "${dateStr}" -> ${formatDate(parsed, 'YYYY-MM-DD HH:mm:ss')}`);
    } catch (error) {
      console.log(`   "${dateStr}" -> Error: ${error.message}`);
    }
  });

  console.log('\n✅ All tests completed successfully!');

} catch (error) {
  console.error('❌ Test failed:', error.message);
}
