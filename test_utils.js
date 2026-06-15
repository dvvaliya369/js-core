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

        // ── Throttle Tests ────────────────────────────────────────────────────────

        console.log('\n--- Testing throttle function ---\n');

        // Test 3: Basic throttling (leading edge)
        console.log('Test 3: Basic throttling — rapid calls should fire at most once per 300ms');
        let throttleCounter = 0;
        const throttledIncrement = throttle(() => {
            throttleCounter++;
            console.log(`  Throttle counter: ${throttleCounter}`);
        }, 300);

        console.log('Making 5 rapid calls...');
        throttledIncrement(); // fires immediately (leading)
        throttledIncrement(); // ignored (within window)
        throttledIncrement(); // ignored (within window)
        throttledIncrement(); // ignored (within window)
        throttledIncrement(); // schedules trailing call

        setTimeout(() => {
            console.log(`Throttle counter after 500ms: ${throttleCounter}`);
            console.log('Expected: 2 (1 leading + 1 trailing)\n');

            // Test 4: Trailing-edge disabled
            console.log('Test 4: Throttle with trailing=false — only leading call should fire');
            let leadingOnlyCounter = 0;
            const leadingThrottle = throttle(() => {
                leadingOnlyCounter++;
                console.log(`  Leading-only counter: ${leadingOnlyCounter}`);
            }, 300, { trailing: false });

            leadingThrottle(); // fires immediately
            leadingThrottle(); // ignored
            leadingThrottle(); // ignored

            setTimeout(() => {
                console.log(`Leading-only counter after 500ms: ${leadingOnlyCounter}`);
                console.log('Expected: 1 (only the leading call fired)\n');

                // Test 5: Calls spaced further apart than wait should each fire
                console.log('Test 5: Calls spaced 400ms apart (wait=300ms) — each should fire');
                let spacedCounter = 0;
                const spacedThrottle = throttle(() => {
                    spacedCounter++;
                    console.log(`  Spaced counter: ${spacedCounter}`);
                }, 300);

                spacedThrottle(); // fires immediately
                setTimeout(() => {
                    spacedThrottle(); // fires (400ms later, past the 300ms window)
                    setTimeout(() => {
                        console.log(`Spaced counter after 900ms: ${spacedCounter}`);
                        console.log('Expected: 2 (each call was outside the wait window)');
                        console.log('\nAll throttle tests complete.');
                    }, 500);
                }, 400);

            }, 500);
        }, 500);

    }, 500);

}, 500);
