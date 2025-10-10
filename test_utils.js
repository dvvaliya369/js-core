// Test file for the improved debounce function
const { debounce, deeeebounceee } = require('./utils.js');

console.log('Testing improved debounce function...\n');

// Test 1: Basic debouncing with new function
console.log('Test 1: Basic debouncing with new debounce() function');
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
        
        // Test 3: Cancel functionality
        console.log('Test 3: Cancel functionality');
        let cancelCounter = 0;
        const cancelIncrement = () => {
            cancelCounter++;
            console.log(`Cancel counter: ${cancelCounter}`);
        };
        
        const debouncedCancel = debounce(cancelIncrement, 300);
        
        console.log('Making calls then canceling...');
        debouncedCancel();
        debouncedCancel();
        debouncedCancel.cancel(); // Should prevent execution
        
        setTimeout(() => {
            console.log(`Final cancel counter after 500ms: ${cancelCounter}`);
            console.log('Expected: 0 (calls were canceled)\n');
            
            // Test 4: Flush functionality
            console.log('Test 4: Flush functionality');
            let flushCounter = 0;
            const flushIncrement = () => {
                flushCounter++;
                console.log(`Flush counter: ${flushCounter}`);
            };
            
            const debouncedFlush = debounce(flushIncrement, 1000); // Long delay
            
            console.log('Making calls then flushing immediately...');
            debouncedFlush();
            debouncedFlush();
            debouncedFlush.flush(); // Should execute immediately
            
            console.log(`Flush counter after flush: ${flushCounter}`);
            console.log('Expected: 1 (flushed immediately)\n');
            
            // Test 5: Backward compatibility
            console.log('Test 5: Backward compatibility test');
            let legacyCounter = 0;
            const legacyIncrement = () => {
                legacyCounter++;
                console.log(`Legacy counter: ${legacyCounter}`);
            };
            
            const debouncedLegacy = deeeebounceee(legacyIncrement, 300, true);
            
            console.log('Testing legacy function (should show deprecation warning)...');
            debouncedLegacy();
            debouncedLegacy();
            debouncedLegacy();
            
            setTimeout(() => {
                console.log(`Final legacy counter after 500ms: ${legacyCounter}`);
                console.log('Expected: 1 (legacy function still works)');
                console.log('\n✅ All tests completed!');
            }, 500);
        }, 500);
    }, 500);
}, 500);
