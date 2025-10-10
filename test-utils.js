// Test file to verify the debounce function works correctly
const { debounce, throttle } = require('./utils');

console.log('Testing debounce function...\n');

// Test 1: Basic debounce functionality
let counter = 0;
const incrementCounter = () => {
  counter++;
  console.log(`Counter: ${counter}`);
};

const debouncedIncrement = debounce(incrementCounter, 300);

console.log('Test 1: Basic debounce (should only increment once after rapid calls)');
debouncedIncrement(); // This will be cancelled
debouncedIncrement(); // This will be cancelled
debouncedIncrement(); // This will execute after 300ms

setTimeout(() => {
  console.log(`Final counter value: ${counter}\n`);
  
  // Test 2: Debounce with immediate flag
  console.log('Test 2: Debounce with immediate=true (should execute immediately, then debounce)');
  let immediateCounter = 0;
  const immediateIncrement = () => {
    immediateCounter++;
    console.log(`Immediate Counter: ${immediateCounter}`);
  };
  
  const immediateDebounced = debounce(immediateIncrement, 300, true);
  
  immediateDebounced(); // This will execute immediately
  immediateDebounced(); // This will be cancelled
  immediateDebounced(); // This will be cancelled
  
  setTimeout(() => {
    console.log(`Final immediate counter value: ${immediateCounter}\n`);
    
    // Test 3: Throttle function
    console.log('Test 3: Testing throttle function');
    let throttleCounter = 0;
    const throttleIncrement = () => {
      throttleCounter++;
      console.log(`Throttle Counter: ${throttleCounter}`);
    };
    
    const throttledIncrement = throttle(throttleIncrement, 200);
    
    // Rapid calls - should only execute every 200ms
    throttledIncrement(); // Executes immediately
    throttledIncrement(); // Throttled
    throttledIncrement(); // Throttled
    
    setTimeout(() => throttledIncrement(), 50);  // Throttled
    setTimeout(() => throttledIncrement(), 100); // Throttled
    setTimeout(() => throttledIncrement(), 250); // Executes (after 200ms cooldown)
    
    setTimeout(() => {
      console.log(`Final throttle counter value: ${throttleCounter}`);
      console.log('\nAll tests completed!');
    }, 500);
    
  }, 400);
  
}, 400);
