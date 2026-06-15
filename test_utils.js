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

// ---------------------------------------------------------------------------
// Throttle tests
// ---------------------------------------------------------------------------
setTimeout(() => {
    console.log('\n--- Testing throttle function ---\n');

    // Test 3: Basic throttling — multiple rapid calls within the window
    console.log('Test 3: Basic throttling (200 ms window)');
    let throttleCounter = 0;
    const throttledFn = throttle(() => {
        throttleCounter++;
        console.log(`  throttle fired — count: ${throttleCounter}`);
    }, 200);

    // All five calls happen within 50 ms; leading edge fires immediately,
    // trailing edge fires once more after the window expires.
    throttledFn(); // leading edge → fires
    throttledFn(); // within window → queued
    throttledFn(); // within window → queued
    throttledFn(); // within window → queued
    throttledFn(); // within window → queued

    setTimeout(() => {
        console.log(`  counter after 300 ms: ${throttleCounter} (expected: 2 — leading + trailing)`);
    }, 300);

    // Test 4: Leading-only mode — trailing call suppressed
    setTimeout(() => {
        console.log('\nTest 4: Leading-only throttle (no trailing call)');
        let leadingCounter = 0;
        const leadingOnly = throttle(() => {
            leadingCounter++;
            console.log(`  leading-only fired — count: ${leadingCounter}`);
        }, 200, { trailing: false });

        leadingOnly(); // fires immediately
        leadingOnly(); // suppressed
        leadingOnly(); // suppressed

        setTimeout(() => {
            console.log(`  counter after 300 ms: ${leadingCounter} (expected: 1)`);
        }, 300);
    }, 600);

    // Test 5: cancel() — pending trailing call should be cancelled
    setTimeout(() => {
        console.log('\nTest 5: throttle.cancel() cancels pending trailing call');
        let cancelCounter = 0;
        const cancellableFn = throttle(() => {
            cancelCounter++;
            console.log(`  cancellable fired — count: ${cancelCounter}`);
        }, 200);

        cancellableFn(); // leading edge fires
        cancellableFn(); // queued as trailing
        cancellableFn.cancel(); // cancel trailing

        setTimeout(() => {
            console.log(`  counter after 300 ms: ${cancelCounter} (expected: 1 — trailing was cancelled)`);
        }, 300);
    }, 1200);

}, 1500);
