const { debounce } = require('./utils');

// Test the debounce function
console.log('Testing debounce function...\n');

// Test 1: Basic debounce functionality
console.log('Test 1: Basic debounce functionality');
let callCount = 0;
function testFunction(message) {
  callCount++;
  console.log(`Called: ${message} (call #${callCount})`);
}

const debouncedFn = debounce(testFunction, 300);

// These calls should be debounced - only the last one should execute
debouncedFn('First call');
debouncedFn('Second call');
debouncedFn('Third call');
debouncedFn('Final call');

setTimeout(() => {
  console.log(`Total calls made: ${callCount}\n`);
  
  // Test 2: Immediate execution
  console.log('Test 2: Immediate execution');
  callCount = 0;
  
  const immediateDebouncedFn = debounce(testFunction, 300, { immediate: true });
  
  // First call should execute immediately, subsequent calls should be debounced
  immediateDebouncedFn('Immediate first call');
  immediateDebouncedFn('Immediate second call');
  immediateDebouncedFn('Immediate third call');
  
  setTimeout(() => {
    console.log(`Total calls made with immediate: ${callCount}\n`);
    
    // Test 3: Cancel functionality
    console.log('Test 3: Cancel functionality');
    callCount = 0;
    
    const cancelableFn = debounce(testFunction, 500);
    
    cancelableFn('This should be cancelled');
    setTimeout(() => {
      cancelableFn.cancel();
      console.log(`Calls after cancel: ${callCount}`);
      
      // Test 4: Flush functionality
      console.log('\nTest 4: Flush functionality');
      callCount = 0;
      
      const flushableFn = debounce(testFunction, 500);
      flushableFn('This should be flushed immediately');
      flushableFn.flush();
      console.log(`Calls after flush: ${callCount}`);
      
      // Test 5: Pending check
      console.log('\nTest 5: Pending check');
      const pendingFn = debounce(testFunction, 300);
      
      console.log(`Pending before call: ${pendingFn.pending()}`);
      pendingFn('Pending test');
      console.log(`Pending after call: ${pendingFn.pending()}`);
      
      setTimeout(() => {
        console.log(`Pending after execution: ${pendingFn.pending()}`);
        
        console.log('\nAll debounce tests completed!');
      }, 400);
      
    }, 100);
  }, 400);
}, 400);
