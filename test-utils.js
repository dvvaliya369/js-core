// Test file for utils.js
const { debounce, throttle, isFunction, isNumber } = require('./utils.js');

console.log('🧪 Testing Utils Functions...\n');

// Test 1: Basic debounce functionality
console.log('1. Testing basic debounce:');
let debounceCounter = 0;
const debouncedIncrement = debounce(() => {
  debounceCounter++;
  console.log(`   Debounced function called! Counter: ${debounceCounter}`);
}, 100);

// Call multiple times quickly - should only execute once after delay
debouncedIncrement();
debouncedIncrement();
debouncedIncrement();

setTimeout(() => {
  console.log(`   Final counter after 200ms: ${debounceCounter}\n`);
}, 200);

// Test 2: Debounce with immediate execution
setTimeout(() => {
  console.log('2. Testing debounce with immediate execution:');
  let immediateCounter = 0;
  const immediateDebounced = debounce(() => {
    immediateCounter++;
    console.log(`   Immediate debounced function called! Counter: ${immediateCounter}`);
  }, 100, true);

  // Should execute immediately on first call
  immediateDebounced();
  immediateDebounced(); // Should be ignored
  immediateDebounced(); // Should be ignored

  setTimeout(() => {
    console.log(`   Final immediate counter: ${immediateCounter}\n`);
  }, 150);
}, 300);

// Test 3: Throttle functionality
setTimeout(() => {
  console.log('3. Testing throttle:');
  let throttleCounter = 0;
  const throttledIncrement = throttle(() => {
    throttleCounter++;
    console.log(`   Throttled function called! Counter: ${throttleCounter}`);
  }, 50);

  // Call multiple times - should execute immediately, then throttle
  throttledIncrement();
  throttledIncrement();
  throttledIncrement();

  setTimeout(() => {
    console.log(`   Final throttle counter: ${throttleCounter}\n`);
  }, 100);
}, 500);

// Test 4: Utility functions
setTimeout(() => {
  console.log('4. Testing utility functions:');
  console.log(`   isFunction(debounce): ${isFunction(debounce)}`);
  console.log(`   isFunction('string'): ${isFunction('string')}`);
  console.log(`   isNumber(42): ${isNumber(42)}`);
  console.log(`   isNumber('42'): ${isNumber('42')}`);
  console.log(`   isNumber(NaN): ${isNumber(NaN)}`);
  console.log('\n✅ All tests completed!');
}, 700);
