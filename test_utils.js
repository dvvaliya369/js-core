// Test file for the improved debounce function
const { debounce, deeeebounceee } = require('./utils.js');

console.log('Testing improved debounce function...\n');

// Test 1: Basic debouncing with new function name
console.log('Test 1: Basic debouncing with new "debounce" function');
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
    
    // Test 2: Leading edge execution
    console.log('Test 2: Leading edge execution');
    let leadingCounter = 0;
    const leadingIncrement = () => {
        leadingCounter++;
        console.log(`Leading counter: ${leadingCounter}`);
    };
    
    const debouncedLeading = debounce(leadingIncrement, 300, { leading: true });
    
    console.log('Making rapid calls with leading=true...');
    debouncedLeading(); // Should execute immediately
    debouncedLeading(); // Should be debounced
    debouncedLeading(); // Should be debounced
    
    setTimeout(() => {
        console.log(`Final leading counter after 500ms: ${leadingCounter}`);
        console.log('Expected: 1 (leading execution, subsequent calls debounced)\n');
        
        // Test 3: Control methods
        console.log('Test 3: Control methods (cancel, flush, pending)');
        let controlCounter = 0;
        const controlIncrement = () => {
            controlCounter++;
            console.log(`Control counter: ${controlCounter}`);
            return `Result: ${controlCounter}`;
        };
        
        const debouncedControl = debounce(controlIncrement, 1000);
        
        // Test pending method
        console.log('Before call - pending:', debouncedControl.pending()); // false
        
        debouncedControl();
        console.log('After call - pending:', debouncedControl.pending()); // true
        
        // Test cancel method
        debouncedControl.cancel();
        console.log('After cancel - pending:', debouncedControl.pending()); // false
        
        // Test flush method
        debouncedControl();
        console.log('Before flush - pending:', debouncedControl.pending()); // true
        const result = debouncedControl.flush();
        console.log('Flush result:', result);
        console.log('After flush - pending:', debouncedControl.pending()); // false
        console.log(`Control counter after flush: ${controlCounter}`);
        
        // Test 4: Backward compatibility
        console.log('\nTest 4: Backward compatibility with old function name');
        let legacyCounter = 0;
        const legacyIncrement = () => {
            legacyCounter++;
            console.log(`Legacy counter: ${legacyCounter}`);
        };
        
        const legacyDebounced = deeeebounceee(legacyIncrement, 200);
        legacyDebounced();
        
        setTimeout(() => {
            console.log(`Final legacy counter: ${legacyCounter}`);
            console.log('Expected: 1 (backward compatibility works)\n');
            
            // Test 5: Max wait functionality
            console.log('Test 5: Max wait functionality');
            let maxWaitCounter = 0;
            const maxWaitIncrement = () => {
                maxWaitCounter++;
                console.log(`Max wait counter: ${maxWaitCounter} at ${Date.now()}`);
            };
            
            const debouncedMaxWait = debounce(maxWaitIncrement, 1000, { maxWait: 500 });
            
            const startTime = Date.now();
            console.log(`Starting max wait test at ${startTime}`);
            
            // Make calls every 100ms for 800ms - should trigger due to maxWait
            const interval = setInterval(() => {
                debouncedMaxWait();
                if (Date.now() - startTime > 800) {
                    clearInterval(interval);
                }
            }, 100);
            
            setTimeout(() => {
                console.log(`Max wait test completed. Counter: ${maxWaitCounter}`);
                console.log('Expected: 1 or 2 (function executed due to maxWait despite continuous calls)');
            }, 1200);
        }, 300);
    }, 500);
}, 500);
