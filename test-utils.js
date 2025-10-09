/**
 * Test file for utils.js debounce function
 */

// Import the debounce function (Node.js environment)
const { debounce } = require('./utils.js');

console.log('Testing debounce function...\n');

// Test 1: Basic debouncing
console.log('Test 1: Basic debouncing (500ms delay)');
let callCount = 0;
const basicTest = debounce(() => {
  callCount++;
  console.log(`  Function called! Call count: ${callCount}`);
}, 500);

// Rapid calls - only the last one should execute after 500ms
console.log('  Making rapid calls...');
basicTest();
basicTest();
basicTest();
basicTest();

setTimeout(() => {
  console.log('  Expected: 1 call after 500ms\n');
  
  // Test 2: Immediate execution
  console.log('Test 2: Immediate execution');
  let immediateCount = 0;
  const immediateTest = debounce(() => {
    immediateCount++;
    console.log(`  Immediate function called! Count: ${immediateCount}`);
  }, 1000, true);
  
  console.log('  Making calls with immediate=true...');
  immediateTest(); // Should execute immediately
  immediateTest(); // Should be debounced
  immediateTest(); // Should be debounced
  
  setTimeout(() => {
    console.log('  Expected: 1 immediate call, then debounced\n');
    
    // Test 3: Arguments preservation
    console.log('Test 3: Arguments preservation');
    const argsTest = debounce((name, age) => {
      console.log(`  Hello ${name}, you are ${age} years old`);
    }, 300);
    
    argsTest('Alice', 25);
    argsTest('Bob', 30); // This should override the previous call
    
    setTimeout(() => {
      console.log('  Expected: Only Bob\'s call should execute\n');
      
      // Test 4: Context preservation
      console.log('Test 4: Context preservation');
      const testObj = {
        name: 'TestObject',
        greet: debounce(function(message) {
          console.log(`  ${this.name} says: ${message}`);
        }, 200)
      };
      
      testObj.greet('Hello World!');
      
      setTimeout(() => {
        console.log('  Expected: TestObject says: Hello World!\n');
        console.log('All tests completed!');
      }, 250);
    }, 350);
  }, 1100);
}, 600);
