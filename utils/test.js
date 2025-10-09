// Simple test file to verify the utility functions work correctly
import { debounce, throttle, delay, isDefined, once, clone } from './index.js';

console.log('Testing utility functions...\n');

// Test debounce function
console.log('1. Testing debounce function:');
let debounceCallCount = 0;
const debouncedFunction = debounce(() => {
  debounceCallCount++;
  console.log(`  Debounced function called! Count: ${debounceCallCount}`);
}, 100);

// Call multiple times quickly
debouncedFunction();
debouncedFunction();
debouncedFunction();
console.log('  Called debounced function 3 times quickly...');

// Wait and check result
setTimeout(() => {
  console.log(`  Expected: 1 call, Actual: ${debounceCallCount} calls\n`);

  // Test throttle function
  console.log('2. Testing throttle function:');
  let throttleCallCount = 0;
  const throttledFunction = throttle(() => {
    throttleCallCount++;
    console.log(`  Throttled function called! Count: ${throttleCallCount}`);
  }, 50);

  // Call multiple times quickly
  throttledFunction();
  setTimeout(() => throttledFunction(), 10);
  setTimeout(() => throttledFunction(), 20);
  setTimeout(() => throttledFunction(), 60); // This should trigger again
  
  setTimeout(() => {
    console.log(`  Expected: 2 calls, Actual: ${throttleCallCount} calls\n`);

    // Test other functions
    console.log('3. Testing other utility functions:');
    
    // Test isDefined
    console.log(`  isDefined(null): ${isDefined(null)}`); // false
    console.log(`  isDefined(undefined): ${isDefined(undefined)}`); // false
    console.log(`  isDefined(''): ${isDefined('')}`); // true
    console.log(`  isDefined(0): ${isDefined(0)}`); // true
    
    // Test once
    let onceCallCount = 0;
    const onceFunction = once(() => {
      onceCallCount++;
      console.log(`  Once function executed! Count: ${onceCallCount}`);
      return 'result';
    });
    
    const result1 = onceFunction();
    const result2 = onceFunction();
    console.log(`  Once function call count: ${onceCallCount} (should be 1)`);
    console.log(`  Results equal: ${result1 === result2} (should be true)\n`);

    // Test delay function
    console.log('4. Testing delay function...');
    const startTime = Date.now();
    delay(100).then(() => {
      const endTime = Date.now();
      const elapsed = endTime - startTime;
      console.log(`  Delay completed in ${elapsed}ms (should be ~100ms)\n`);
      
      // Test clone function
      console.log('5. Testing clone function:');
      
      // Test shallow clone
      const original = { a: 1, b: { c: 2 }, d: [3, 4] };
      const shallowClone = clone(original);
      console.log(`  Original: ${JSON.stringify(original)}`);
      console.log(`  Shallow clone: ${JSON.stringify(shallowClone)}`);
      
      // Modify shallow clone
      shallowClone.a = 999;
      shallowClone.b.c = 999; // This will affect original too
      console.log(`  After modifying shallow clone:`);
      console.log(`    Original.a: ${original.a} (should be 1)`);
      console.log(`    Original.b.c: ${original.b.c} (should be 999 - shared reference)`);
      
      // Test deep clone
      const originalForDeep = { a: 1, b: { c: 2 }, d: [3, { e: 4 }] };
      const deepClone = clone(originalForDeep, true);
      deepClone.a = 777;
      deepClone.b.c = 777;
      deepClone.d[1].e = 777;
      console.log(`  After modifying deep clone:`);
      console.log(`    Original.a: ${originalForDeep.a} (should be 1)`);
      console.log(`    Original.b.c: ${originalForDeep.b.c} (should be 2)`);
      console.log(`    Original.d[1].e: ${originalForDeep.d[1].e} (should be 4)`);
      
      // Test cloning different types
      const dateOriginal = new Date();
      const dateClone = clone(dateOriginal);
      console.log(`  Date clone works: ${dateClone instanceof Date && dateClone.getTime() === dateOriginal.getTime()}`);
      
      const arrayOriginal = [1, 2, { x: 3 }];
      const arrayClone = clone(arrayOriginal, true);
      arrayClone[2].x = 999;
      console.log(`  Array deep clone works: ${arrayOriginal[2].x === 3} (original unchanged)`);
      
      console.log('\nAll tests completed!');
    });

  }, 100);
}, 150);
