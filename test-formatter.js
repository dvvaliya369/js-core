#!/usr/bin/env node

/**
 * Test Suite for Date-Time Formatter
 * Run with: node test-formatter.js
 */

const DateTimeFormatter = require('./datetime-formatter.js');

class TestSuite {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async run() {
        console.log('🧪 Running Date-Time Formatter Tests\n');
        
        for (const test of this.tests) {
            try {
                await test.testFn();
                console.log(`✅ ${test.name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ ${test.name}`);
                console.log(`   Error: ${error.message}\n`);
                this.failed++;
            }
        }
        
        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message || 'Values not equal'}: expected '${expected}', got '${actual}'`);
        }
    }
}

// Create test suite
const suite = new TestSuite();
const formatter = new DateTimeFormatter();

// Test 1: Basic formatting
suite.test('Basic ISO formatting', () => {
    const date = new Date('2023-01-01T12:00:00.000Z');
    const result = formatter.format(date, 'ISO');
    suite.assert(result.includes('2023-01-01'), 'Should contain correct date');
});

// Test 2: Input parsing
suite.test('Parse timestamp input', () => {
    const timestamp = 1672574400000; // 2023-01-01T12:00:00.000Z
    const result = formatter.format(timestamp, 'ISO_DATE');
    suite.assertEqual(result, '2023-01-01', 'Should parse timestamp correctly');
});

// Test 3: Custom format
suite.test('Custom format pattern', () => {
    const date = new Date('2023-01-01T12:30:45.000Z');
    const result = formatter.format(date, 'YYYY-MM-DD HH:mm:ss');
    suite.assert(result.match(/2023-01-01 \d{2}:\d{2}:\d{2}/), 'Should match custom pattern');
});

// Test 4: Validation
suite.test('Date validation - valid', () => {
    suite.assert(formatter.isValidDate('2023-01-01'), 'Should validate correct date');
    suite.assert(formatter.isValidDate(1672574400000), 'Should validate timestamp');
    suite.assert(formatter.isValidDate(new Date()), 'Should validate Date object');
});

suite.test('Date validation - invalid', () => {
    suite.assert(!formatter.isValidDate('invalid-date'), 'Should reject invalid date');
    suite.assert(!formatter.isValidDate(null), 'Should reject null');
});

// Test 5: Relative time
suite.test('Relative time - past', () => {
    const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
    const result = formatter.getRelativeTime(pastDate);
    suite.assert(result.includes('hour') && result.includes('ago'), 'Should show hours ago');
});

suite.test('Relative time - future', () => {
    const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days future
    const result = formatter.getRelativeTime(futureDate);
    suite.assert(result.includes('day') && result.includes('from now'), 'Should show days from now');
});

// Test 6: Available formats
suite.test('Available formats', () => {
    const formats = formatter.getAvailableFormats();
    suite.assert(Array.isArray(formats), 'Should return array');
    suite.assert(formats.includes('ISO'), 'Should include ISO format');
    suite.assert(formats.includes('READABLE'), 'Should include READABLE format');
});

// Test 7: Custom format addition
suite.test('Add custom format', () => {
    formatter.addCustomFormat('TEST_FORMAT', 'YYYY/MM/DD');
    const formats = formatter.getAvailableFormats();
    suite.assert(formats.includes('TEST_FORMAT'), 'Should include custom format');
    
    const date = new Date('2023-01-01T12:00:00.000Z');
    const result = formatter.format(date, 'TEST_FORMAT');
    suite.assert(result.includes('2023/01/01'), 'Should format with custom pattern');
});

// Test 8: Error handling
suite.test('Error handling - null input', () => {
    try {
        formatter.format(null, 'ISO');
        suite.assert(false, 'Should throw error for null input');
    } catch (error) {
        suite.assert(error.message.includes('Input date is required'), 'Should have meaningful error');
    }
});

suite.test('Error handling - invalid date string', () => {
    try {
        formatter.format('not-a-date', 'ISO');
        suite.assert(false, 'Should throw error for invalid date');
    } catch (error) {
        suite.assert(error.message.includes('Unable to parse'), 'Should have parsing error');
    }
});

// Test 9: Different time formats
suite.test('12-hour time format', () => {
    const date = new Date('2023-01-01T13:30:00.000Z'); // 1:30 PM
    const result = formatter.format(date, 'TIME_12');
    // Note: Result may vary based on timezone, so just check format
    suite.assert(result.includes(':') && (result.includes('AM') || result.includes('PM')), 
                'Should format as 12-hour time');
});

// Test 10: Edge cases
suite.test('Edge case - leap year', () => {
    const leapDate = new Date('2024-02-29T12:00:00.000Z');
    const result = formatter.format(leapDate, 'ISO_DATE');
    suite.assertEqual(result, '2024-02-29', 'Should handle leap year correctly');
});

suite.test('Edge case - end of year', () => {
    const endYear = new Date('2023-12-31T23:59:59.999Z');
    const result = formatter.format(endYear, 'US_DATE');
    suite.assert(result.includes('12/31/2023'), 'Should handle end of year');
});

// Test 11: Multiple input types
suite.test('Multiple input types', () => {
    const timestamp = 1672574400000; // 2023-01-01T12:00:00.000Z
    const dateObj = new Date(timestamp);
    const isoString = '2023-01-01T12:00:00.000Z';
    
    const result1 = formatter.format(timestamp, 'ISO_DATE');
    const result2 = formatter.format(dateObj, 'ISO_DATE');
    const result3 = formatter.format(isoString, 'ISO_DATE');
    
    suite.assertEqual(result1, '2023-01-01', 'Timestamp should work');
    suite.assertEqual(result2, '2023-01-01', 'Date object should work');
    suite.assertEqual(result3, '2023-01-01', 'ISO string should work');
});

// Test 12: Format consistency
suite.test('Format consistency across calls', () => {
    const date = new Date('2023-06-15T14:30:25.123Z');
    
    const result1 = formatter.format(date, 'READABLE');
    const result2 = formatter.format(date, 'READABLE');
    
    suite.assertEqual(result1, result2, 'Multiple calls should return same result');
});

// Run the tests
suite.run().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
});
