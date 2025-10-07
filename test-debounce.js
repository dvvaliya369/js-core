// Node.js test for debounce functionality
const { debounce, throttle, safeDebounce, isFunction } = require('./utils.js');

console.log('🧪 Testing Debounce Utility Functions\n');

// Test 1: Basic debounce functionality
console.log('Test 1: Basic Debounce');
let counter1 = 0;
const basicDebounce = debounce(() => {
    counter1++;
    console.log(`  ✓ Debounced function executed! Count: ${counter1}`);
}, 100);

// Call multiple times quickly
console.log('  Calling function 5 times quickly...');
for (let i = 0; i < 5; i++) {
    basicDebounce();
}

setTimeout(() => {
    console.log(`  Final count: ${counter1} (should be 1)\n`);
    
    // Test 2: Debounce with arguments
    console.log('Test 2: Debounce with Arguments');
    let lastMessage = '';
    const messageDebounce = debounce((message) => {
        lastMessage = message;
        console.log(`  ✓ Message received: ${message}`);
    }, 100);
    
    console.log('  Sending multiple messages...');
    messageDebounce('Hello');
    messageDebounce('Hello World');
    messageDebounce('Hello World!');
    
    setTimeout(() => {
        console.log(`  Final message: "${lastMessage}" (should be "Hello World!")\n`);
        
        // Test 3: Immediate debounce
        console.log('Test 3: Immediate Debounce');
        let immediateCounter = 0;
        const immediateDebounce = debounce(() => {
            immediateCounter++;
            console.log(`  ✓ Immediate execution! Count: ${immediateCounter}`);
        }, 200, true);
        
        console.log('  First call (should execute immediately):');
        immediateDebounce();
        
        console.log('  Subsequent calls (should be debounced):');
        setTimeout(() => immediateDebounce(), 50);
        setTimeout(() => immediateDebounce(), 100);
        
        setTimeout(() => {
            console.log(`  Final immediate count: ${immediateCounter} (should be 1)\n`);
            
            // Test 4: Throttle functionality
            console.log('Test 4: Throttle');
            let throttleCounter = 0;
            const testThrottle = throttle(() => {
                throttleCounter++;
                console.log(`  ✓ Throttled function executed! Count: ${throttleCounter}`);
            }, 100);
            
            console.log('  Calling throttled function multiple times...');
            testThrottle(); // Should execute immediately
            setTimeout(() => testThrottle(), 20); // Should be ignored
            setTimeout(() => testThrottle(), 40); // Should be ignored
            setTimeout(() => testThrottle(), 60); // Should be ignored
            setTimeout(() => testThrottle(), 80); // Should be ignored
            setTimeout(() => testThrottle(), 120); // Should execute (after 100ms throttle period)
            
            setTimeout(() => {
                console.log(`  Final throttle count: ${throttleCounter} (should be 2)\n`);
                
                // Test 5: Error handling
                console.log('Test 5: Error Handling');
                try {
                    safeDebounce('not a function', 100);
                    console.log('  ❌ Error handling failed');
                } catch (error) {
                    console.log(`  ✓ Caught expected error: ${error.message}`);
                }
                
                try {
                    safeDebounce(() => {}, -10);
                    console.log('  ❌ Error handling failed');
                } catch (error) {
                    console.log(`  ✓ Caught expected error: ${error.message}`);
                }
                
                // Test 6: isFunction utility
                console.log('\nTest 6: isFunction Utility');
                console.log(`  isFunction(() => {}): ${isFunction(() => {})} (should be true)`);
                console.log(`  isFunction('string'): ${isFunction('string')} (should be false)`);
                console.log(`  isFunction(123): ${isFunction(123)} (should be false)`);
                console.log(`  isFunction(null): ${isFunction(null)} (should be false)`);
                
                console.log('\n🎉 All tests completed!');
            }, 300);
        }, 250);
    }, 150);
}, 150);
