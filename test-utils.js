import { debounce, throttle, delay } from './utils.js';

/**
 * Test file to verify the debounce function works correctly
 */

console.log('Testing debounce function...\n');

// Test 1: Basic debounce functionality
console.log('Test 1: Basic debounce');
let counter = 0;
const debouncedIncrement = debounce(() => {
  counter++;
  console.log(`Counter: ${counter}`);
}, 100);

// Call multiple times rapidly - should only execute once
debouncedIncrement();
debouncedIncrement();
debouncedIncrement();

// Wait and check result
setTimeout(() => {
  console.log(`Expected counter: 1, Actual counter: ${counter}\n`);
  
  // Test 2: Immediate execution
  console.log('Test 2: Immediate execution');
  let immediateCounter = 0;
  const immediateDebounce = debounce(() => {
    immediateCounter++;
    console.log(`Immediate counter: ${immediateCounter}`);
  }, 100, true);
  
  // Should execute immediately on first call
  immediateDebounce();
  immediateDebounce();
  immediateDebounce();
  
  setTimeout(() => {
    console.log(`Expected immediate counter: 1, Actual: ${immediateCounter}\n`);
    
    // Test 3: Function with arguments
    console.log('Test 3: Function with arguments');
    const debouncedGreeting = debounce((name, age) => {
      console.log(`Hello ${name}, you are ${age} years old!`);
    }, 50);
    
    debouncedGreeting('Alice', 25);
    debouncedGreeting('Bob', 30);
    debouncedGreeting('Charlie', 35); // Only this should execute
    
    setTimeout(() => {
      console.log('Debounce tests completed!');
    }, 100);
  }, 150);
}, 150);
