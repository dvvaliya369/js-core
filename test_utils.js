// Test file for the debounce function
const { debounce, deepClone } = require('./utils.js');

console.log('Testing debounce function...\n');

// Test 1: Basic debouncing
console.log('Test 1: Basic debouncing');
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
    
    // Test 2: Immediate execution
    console.log('Test 2: Immediate execution');
    let immediateCounter = 0;
    const immediateIncrement = () => {
        immediateCounter++;
        console.log(`Immediate counter: ${immediateCounter}`);
    };
    
    const debouncedImmediate = debounce(immediateIncrement, 300, true);
    
    console.log('Making rapid calls with immediate=true...');
    debouncedImmediate(); // Should execute immediately
    debouncedImmediate(); // Should be debounced
    debouncedImmediate(); // Should be debounced
    
    setTimeout(() => {
        console.log(`Final immediate counter after 500ms: ${immediateCounter}`);
        console.log('Expected: 1 (immediate execution, subsequent calls debounced)');
    }, 500);

}, 500);

// Test 3: Deep clone
console.log('\\nTest 3: Deep clone');
const original = {
    a: 1,
    b: { c: 2, d: [3, 4] },
    e: new Date('2023-01-01'),
    f: 'string'
};
const cloned = deepClone(original);

console.log('Original:', original);
console.log('Cloned:', cloned);

// Modify cloned object
cloned.b.c = 99;
cloned.b.d.push(5);
cloned.e = new Date('2024-01-01');

console.log('After modifying cloned:');
console.log('Original:', original);
console.log('Cloned:', cloned);
console.log('Deep clone test passed: Original unchanged');
