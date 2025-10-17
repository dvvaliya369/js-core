// Test file for utility functions
const { debounce, throttle, generateId, generateShortId } = require('./utils.js');

console.log('=== Testing Utility Functions ===\n');

// Test debounce function
console.log('1. Testing debounce function:');
let debounceCounter = 0;
const debouncedFunc = debounce(() => {
    debounceCounter++;
    console.log(`   Debounced function called: ${debounceCounter}`);
}, 100);

// Call multiple times quickly
debouncedFunc();
debouncedFunc();
debouncedFunc();
console.log('   Called debounced function 3 times quickly - should only execute once after delay\n');

// Test throttle function
setTimeout(() => {
    console.log('2. Testing throttle function:');
    let throttleCounter = 0;
    const throttledFunc = throttle(() => {
        throttleCounter++;
        console.log(`   Throttled function called: ${throttleCounter}`);
    }, 100);

    // Call multiple times
    throttledFunc();
    throttledFunc();
    throttledFunc();
    console.log('   Called throttled function 3 times - should execute immediately, then wait\n');

    // Test ID generation functions after throttle test
    setTimeout(() => {
        console.log('3. Testing ID generation functions:\n');

        // Test generateId with default options
        console.log('   Default generateId():');
        for (let i = 0; i < 5; i++) {
            console.log(`   ${generateId()}`);
        }

        console.log('\n   UUID format:');
        for (let i = 0; i < 3; i++) {
            console.log(`   ${generateId({ type: 'uuid' })}`);
        }

        console.log('\n   Numeric IDs (length 6):');
        for (let i = 0; i < 3; i++) {
            console.log(`   ${generateId({ type: 'numeric', length: 6 })}`);
        }

        console.log('\n   Alphabetic uppercase (length 10):');
        for (let i = 0; i < 3; i++) {
            console.log(`   ${generateId({ type: 'alphabetic', length: 10, uppercase: true })}`);
        }

        console.log('\n   Hex IDs (length 12):');
        for (let i = 0; i < 3; i++) {
            console.log(`   ${generateId({ type: 'hex', length: 12 })}`);
        }

        console.log('\n   With prefix and suffix:');
        for (let i = 0; i < 3; i++) {
            console.log(`   ${generateId({ prefix: 'user_', suffix: '_temp', length: 8 })}`);
        }

        console.log('\n   With timestamp:');
        for (let i = 0; i < 3; i++) {
            console.log(`   ${generateId({ timestamp: true, length: 6 })}`);
        }

        console.log('\n   generateShortId():');
        for (let i = 0; i < 5; i++) {
            console.log(`   ${generateShortId()}`);
        }

        console.log('\n   generateShortId(6):');
        for (let i = 0; i < 3; i++) {
            console.log(`   ${generateShortId(6)}`);
        }

        // Test uniqueness
        console.log('\n4. Testing uniqueness:');
        const ids = new Set();
        const testCount = 1000;

        for (let i = 0; i < testCount; i++) {
            ids.add(generateId());
        }

        console.log(`   Generated ${testCount} IDs, ${ids.size} unique (${ids.size === testCount ? 'PASS' : 'FAIL'})`);

        // Test short ID uniqueness
        const shortIds = new Set();
        for (let i = 0; i < testCount; i++) {
            shortIds.add(generateShortId());
        }

        console.log(`   Generated ${testCount} short IDs, ${shortIds.size} unique (${shortIds.size === testCount ? 'PASS' : 'FAIL'})`);

        // Test error handling
        console.log('\n5. Testing error handling:');
        try {
            generateId({ type: 'invalid' });
            console.log('   ERROR: Should have thrown an error for invalid type');
        } catch (error) {
            console.log(`   ✓ Correctly threw error: ${error.message}`);
        }

        console.log('\n=== All Tests Complete ===');
    }, 200);
}, 200);
