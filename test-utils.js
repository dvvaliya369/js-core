/**
 * Test file for utils.js debounce function
 */

// Import the debounce function (assuming Node.js environment)
const { debounce, throttle } = require('./utils.js');

console.log('🧪 Testing debounce function...\n');

// Test 1: Basic debounce functionality
console.log('Test 1: Basic debounce functionality');
let callCount = 0;
const testFunction = () => {
  callCount++;
  console.log(`Function called! Count: ${callCount}`);
};

const debouncedTest = debounce(testFunction, 300);

// Call the debounced function multiple times quickly
console.log('Calling debounced function 5 times quickly...');
debouncedTest();
debouncedTest();
debouncedTest();
debouncedTest();
debouncedTest();

setTimeout(() => {
  console.log(`Expected: 1 call, Actual: ${callCount} calls`);
  console.log(callCount === 1 ? '✅ Test 1 PASSED' : '❌ Test 1 FAILED');
  
  // Test 2: Debounce with immediate execution
  console.log('\nTest 2: Debounce with immediate execution');
  let immediateCallCount = 0;
  const immediateTestFunction = () => {
    immediateCallCount++;
    console.log(`Immediate function called! Count: ${immediateCallCount}`);
  };
  
  const immediateDebouncedTest = debounce(immediateTestFunction, 300, true);
  
  console.log('Calling immediate debounced function 3 times quickly...');
  immediateDebouncedTest();
  immediateDebouncedTest();
  immediateDebouncedTest();
  
  setTimeout(() => {
    console.log(`Expected: 1 call, Actual: ${immediateCallCount} calls`);
    console.log(immediateCallCount === 1 ? '✅ Test 2 PASSED' : '❌ Test 2 FAILED');
    
    // Test 3: Multiple separate calls with delay
    console.log('\nTest 3: Multiple separate calls with proper delay');
    let delayedCallCount = 0;
    const delayedTestFunction = () => {
      delayedCallCount++;
      console.log(`Delayed function called! Count: ${delayedCallCount}`);
    };
    
    const delayedDebouncedTest = debounce(delayedTestFunction, 200);
    
    delayedDebouncedTest();
    setTimeout(() => delayedDebouncedTest(), 300); // This should execute
    setTimeout(() => delayedDebouncedTest(), 600); // This should execute
    
    setTimeout(() => {
      console.log(`Expected: 3 calls, Actual: ${delayedCallCount} calls`);
      console.log(delayedCallCount === 3 ? '✅ Test 3 PASSED' : '❌ Test 3 FAILED');
      
      console.log('\n🎉 All tests completed!');
    }, 1000);
  }, 400);
}, 400);
