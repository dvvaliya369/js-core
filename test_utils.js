// Test file for the debounce and throttle functions
const { debounce, throttle } = require('./utils.js');

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
        console.log('Expected: 1 (immediate execution, subsequent calls debounced)');
    }, 500);

}, 500);

// ─── Throttle tests (start after debounce tests complete) ───────────────────
setTimeout(() => {
    console.log('\n--- Testing throttle function ---\n');

    // Test 3: Basic throttling — fires on leading edge, then once more on trailing
    console.log('Test 3: Basic throttling (leading + trailing)');
    let throttleCounter = 0;
    const incrementThrottle = () => {
        throttleCounter++;
        console.log(`Throttle counter: ${throttleCounter}`);
    };

    const throttledIncrement = throttle(incrementThrottle, 300);

    console.log('Making rapid calls over 150ms...');
    throttledIncrement(); // fires immediately (leading edge)
    throttledIncrement();
    throttledIncrement();

    setTimeout(() => {
        console.log(`Counter at 400ms: ${throttleCounter}`);
        console.log('Expected: 2 (one leading, one trailing)\n');
    }, 400);

    // Test 4: Leading-edge only (no trailing call)
    setTimeout(() => {
        console.log('Test 4: Leading-edge only (trailing=false)');
        let leadingCounter = 0;
        const incrementLeading = () => {
            leadingCounter++;
            console.log(`Leading-only counter: ${leadingCounter}`);
        };

        const throttledLeading = throttle(incrementLeading, 300, { trailing: false });

        console.log('Making rapid calls...');
        throttledLeading(); // fires immediately
        throttledLeading();
        throttledLeading();

        setTimeout(() => {
            console.log(`Counter after 400ms: ${leadingCounter}`);
            console.log('Expected: 1 (only leading edge fires)\n');
        }, 400);
    }, 600);

    // Test 5: cancel() prevents the trailing call
    setTimeout(() => {
        console.log('Test 5: cancel() prevents trailing invocation');
        let cancelCounter = 0;
        const incrementCancel = () => {
            cancelCounter++;
            console.log(`Cancel test counter: ${cancelCounter}`);
        };

        const throttledCancel = throttle(incrementCancel, 300);
        throttledCancel(); // leading fires
        throttledCancel(); // queues trailing
        throttledCancel.cancel(); // cancels the queued trailing call

        setTimeout(() => {
            console.log(`Counter after cancel + 400ms: ${cancelCounter}`);
            console.log('Expected: 1 (trailing was cancelled)\n');
        }, 400);
    }, 1200);

    // Test 6: flush() forces the trailing call immediately
    setTimeout(() => {
        console.log('Test 6: flush() forces immediate trailing invocation');
        let flushCounter = 0;
        const incrementFlush = () => {
            flushCounter++;
            console.log(`Flush test counter: ${flushCounter}`);
        };

        const throttledFlush = throttle(incrementFlush, 300);
        throttledFlush(); // leading fires
        throttledFlush(); // queues trailing

        setTimeout(() => {
            throttledFlush.flush(); // forces trailing immediately
            setTimeout(() => {
                console.log(`Counter after flush: ${flushCounter}`);
                console.log('Expected: 2 (leading + flushed trailing)');
            }, 50);
        }, 100);
    }, 1800);

}, 1200);
