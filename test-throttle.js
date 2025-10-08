const { throttle, throttleAdvanced } = require('./utils.js');

// Test 1: Basic throttle function
console.log('Testing basic throttle function...');
let callCount = 0;

const throttledFunction = throttle(() => {
  callCount++;
  console.log(`Throttled function called ${callCount} times`);
}, 100);

// Call the throttled function multiple times rapidly
console.log('Calling throttled function 5 times rapidly...');
for (let i = 0; i < 5; i++) {
  throttledFunction();
}

setTimeout(() => {
  console.log('After 50ms:');
  throttledFunction();
  
  setTimeout(() => {
    console.log('After 150ms:');
    throttledFunction();
    
    setTimeout(() => {
      console.log('After 300ms:');
      throttledFunction();
      
      console.log('\n--- Test completed ---');
      console.log(`Total calls executed: ${callCount}`);
      console.log('Expected: 3 calls (immediate, after 150ms, after 300ms)');
    }, 150);
  }, 100);
}, 50);

// Test 2: Advanced throttle with trailing edge disabled
setTimeout(() => {
  console.log('\nTesting advanced throttle with trailing disabled...');
  let advancedCallCount = 0;
  
  const advancedThrottled = throttleAdvanced(() => {
    advancedCallCount++;
    console.log(`Advanced throttled function called ${advancedCallCount} times`);
  }, 100, { trailing: false });
  
  // Call multiple times
  for (let i = 0; i < 3; i++) {
    advancedThrottled();
  }
  
  setTimeout(() => {
    console.log(`Advanced throttle calls: ${advancedCallCount} (expected: 1)`);
  }, 200);
}, 1000);
