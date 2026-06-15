// Test file for debounce, throttle, and memoize utilities
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

        // ----------------------------------------------------------------
        // Test 3: Throttle — limits invocation rate
        // ----------------------------------------------------------------
        console.log('Test 3: Throttle — rate-limiting rapid calls');
        let throttleCounter = 0;
        const throttledFn = throttle(() => { throttleCounter++; }, 200);

        // Fire rapidly — only the first call should execute immediately (leading=true default)
        for (let i = 0; i < 10; i++) throttledFn();

        setTimeout(() => {
            console.log(`Throttle counter after 50ms: ${throttleCounter}`);
            console.log('Expected: 1 (leading invocation only so far)');
        }, 50);

        setTimeout(() => {
            console.log(`Throttle counter after 300ms: ${throttleCounter}`);
            console.log('Expected: 2 (leading + one trailing invocation)\n');

            // ----------------------------------------------------------------
            // Test 4: Throttle cancel — pending trailing call cleared
            // ----------------------------------------------------------------
            console.log('Test 4: Throttle cancel()');
            let cancelCounter = 0;
            const cancelThrottle = throttle(() => { cancelCounter++; }, 200);
            cancelThrottle(); // leading fires
            cancelThrottle(); // queues trailing
            cancelThrottle.cancel(); // cancel the trailing

            setTimeout(() => {
                console.log(`Cancel counter after 300ms: ${cancelCounter}`);
                console.log('Expected: 1 (trailing call was cancelled)\n');

                // ----------------------------------------------------------------
                // Test 5: Memoize — caches results
                // ----------------------------------------------------------------
                console.log('Test 5: Memoize — caches function results');
                let callCount = 0;
                const square = memoize((n) => {
                    callCount++;
                    return n * n;
                });

                console.log(`square(4) = ${square(4)}`);   // computes
                console.log(`square(4) = ${square(4)}`);   // from cache
                console.log(`square(5) = ${square(5)}`);   // computes
                console.log(`square(5) = ${square(5)}`);   // from cache
                console.log(`Underlying fn call count: ${callCount}`);
                console.log('Expected call count: 2 (each unique arg computed once)\n');

                // ----------------------------------------------------------------
                // Test 6: Memoize — cache can be cleared
                // ----------------------------------------------------------------
                console.log('Test 6: Memoize — clearing the cache');
                square.cache.clear();
                square(4); // re-computes after clear
                console.log(`Call count after cache clear + one call: ${callCount}`);
                console.log('Expected call count: 3 (one fresh computation after clear)\n');

                // ----------------------------------------------------------------
                // Test 7: Memoize — custom resolver
                // ----------------------------------------------------------------
                console.log('Test 7: Memoize with custom resolver (cache by first arg only)');
                let resolverCallCount = 0;
                const addFirst = memoize((a, b) => { resolverCallCount++; return a + b; }, (a) => a);
                addFirst(1, 10); // computes, key = 1
                addFirst(1, 99); // cached (same key=1), ignores second arg
                console.log(`Custom resolver call count: ${resolverCallCount}`);
                console.log('Expected: 1 (second call reused cached result keyed by first arg)\n');

                console.log('All tests completed.');
            }, 300);
        }, 300);

    }, 500);

}, 500);
