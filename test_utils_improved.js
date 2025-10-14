// Test file for the improved debounce functions
const { createDebouncedFunction, debounce, advancedDebounce } = require('./utils_improved.js');

console.log('Testing improved debounce functions...\n');

// Test 1: Basic debouncing with new function name
console.log('Test 1: Basic debouncing with createDebouncedFunction');
let counter = 0;
const incrementCounter = () => {
    counter++;
    console.log(`Counter: ${counter}`);
    return counter;
};

const debouncedIncrement = createDebouncedFunction(incrementCounter, 300);

// Rapid calls - should only execute once after 300ms
console.log('Making rapid calls...');
debouncedIncrement();
debouncedIncrement();
debouncedIncrement();
debouncedIncrement();

setTimeout(() => {
    console.log(`Final counter after 500ms: ${counter}`);
    console.log('Expected: 1 (only one execution after debounce delay)\n');
    
    // Test 2: Cancel functionality
    console.log('Test 2: Cancel functionality');
    let cancelCounter = 0;
    const cancelIncrement = () => {
        cancelCounter++;
        console.log(`Cancel counter: ${cancelCounter}`);
        return cancelCounter;
    };
    
    const debouncedCancel = createDebouncedFunction(cancelIncrement, 300);
    
    console.log('Making calls then cancelling...');
    debouncedCancel();
    debouncedCancel();
    
    setTimeout(() => {
        debouncedCancel.cancel();
        console.log('Cancelled debounced function');
        
        setTimeout(() => {
            console.log(`Cancel counter after 500ms: ${cancelCounter}`);
            console.log('Expected: 0 (function was cancelled)\n');
            
            // Test 3: Flush functionality
            console.log('Test 3: Flush functionality');
            let flushCounter = 0;
            const flushIncrement = () => {
                flushCounter++;
                console.log(`Flush counter: ${flushCounter}`);
                return flushCounter;
            };
            
            const debouncedFlush = createDebouncedFunction(flushIncrement, 300);
            
            console.log('Making calls then flushing...');
            debouncedFlush();
            debouncedFlush();
            
            setTimeout(() => {
                const result = debouncedFlush.flush();
                console.log(`Flush result: ${result}`);
                console.log(`Flush counter: ${flushCounter}`);
                console.log('Expected: 1 (function was flushed immediately)\n');
                
                // Test 4: Advanced debounce with options
                console.log('Test 4: Advanced debounce with leading edge');
                let advancedCounter = 0;
                const advancedIncrement = () => {
                    advancedCounter++;
                    console.log(`Advanced counter: ${advancedCounter}`);
                    return advancedCounter;
                };
                
                const debouncedAdvanced = advancedDebounce(advancedIncrement, 300, {
                    leading: true,
                    trailing: false
                });
                
                console.log('Making rapid calls with leading edge...');
                debouncedAdvanced();
                debouncedAdvanced();
                debouncedAdvanced();
                
                setTimeout(() => {
                    console.log(`Final advanced counter: ${advancedCounter}`);
                    console.log('Expected: 1 (immediate execution on leading edge, no trailing execution)');
                }, 500);
                
            }, 100);
            
        }, 400);
        
    }, 100);
    
}, 500);
