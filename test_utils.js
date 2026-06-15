// Test file for debounce, throttle, and memoize functions
const { debounce, throttle, memoize } = require('./utils.js');

console.log('Testing debounce function...\n');

// Test 1: Basic debouncing
console.log('Test 1: Basic debouncing');
let counter = 0;
const incrementCounter = () => {
    counter++;
    console.log(`Counter: ${counter}`);
};

const debouncedIncrement = debounce(incrementCounter, 300);

// Rapid calls - should only execute once after 300ms
console.log('Making rapid calls...');
debouncedIncrement();
debouncedIncrement();
debouncedIncrement();
debouncedIncrement();

setTimeout(() => {
    console.log(`Final counter after 500ms: ${counter}`);
    console.log('Expected: 1 (only one execution after debounce delay)\n');
    
    // Test 2: Immediate execution
    console.log('Test 2: Immediate execution');
    let immediateCounter = 0;
    const immediateIncrement = () => {
        immediateCounter++;
        console.log(`Immediate counter: ${immediateCounter}`);
    };
    
    const debouncedImmediate = debounce(immediateIncrement, 300, true);
    
    console.log('Making rapid calls with immediate=true...');
    debouncedImmediate(); // Should execute immediately
    debouncedImmediate(); // Should be debounced
    debouncedImmediate(); // Should be debounced
    
    setTimeout(() => {
        console.log(`Final immediate counter after 500ms: ${immediateCounter}`);
        console.log('Expected: 1 (immediate execution, subsequent calls debounced)\n');

        // ─── throttle tests ───────────────────────────────────────────────────
        console.log('Test 3: Throttle — rate-limiting rapid calls');
        let throttleCount = 0;
        const onThrottle = () => {
            throttleCount++;
        };
        const throttled = throttle(onThrottle, 200);

        // Fire 5 calls in rapid succession (synchronous, so < 200 ms apart)
        throttled();
        throttled();
        throttled();
        throttled();
        throttled();

        setTimeout(() => {
            // The first call should have fired immediately; a trailing call fires after ~200 ms
            console.log(`Throttle count after 300ms: ${throttleCount}`);
            console.log('Expected: 2 (one immediate + one trailing call)\n');

            console.log('Test 4: Throttle — cancel() prevents trailing call');
            let cancelCount = 0;
            const throttled2 = throttle(() => { cancelCount++; }, 300);

            throttled2(); // fires immediately
            throttled2(); // queued as trailing
            throttled2.cancel(); // cancel the trailing call

            setTimeout(() => {
                console.log(`Cancel count after 400ms: ${cancelCount}`);
                console.log('Expected: 1 (trailing call was cancelled)\n');

                // ─── memoize tests ────────────────────────────────────────────
                console.log('Test 5: Memoize — caches results for repeated calls');
                let callCount = 0;
                const expensiveAdd = (a, b) => {
                    callCount++;
                    return a + b;
                };
                const memoAdd = memoize(expensiveAdd);

                const r1 = memoAdd(2, 3); // computed
                const r2 = memoAdd(2, 3); // cached
                const r3 = memoAdd(4, 5); // computed (new args)

                console.log(`Results: ${r1}, ${r2}, ${r3}`);
                console.log(`Actual calls to expensiveAdd: ${callCount}`);
                console.log('Expected results: 5, 5, 9');
                console.log('Expected call count: 2 (third call hit cache)\n');

                console.log('Test 6: Memoize — clear() empties the cache');
                memoAdd.clear();
                const r4 = memoAdd(2, 3); // re-computed after clear
                console.log(`Result after clear: ${r4}`);
                console.log(`Total calls after clear: ${callCount}`);
                console.log('Expected: 3 (one more real call after cache was cleared)');

                console.log('\nAll tests completed.');
            }, 400);
        }, 300);
    }, 500);

}, 500);
