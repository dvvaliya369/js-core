const { formatDateTime, debounce } = require('./utils.js');

// Test formatDateTime function
console.log('Testing formatDateTime function:');
const testDate = new Date('2025-10-09T18:30:45Z');
console.log('Default format:', formatDateTime(testDate));
console.log('Custom format (YYYY/MM/DD):', formatDateTime(testDate, 'YYYY/MM/DD'));
console.log('Custom format (DD-MM-YYYY HH:mm):', formatDateTime(testDate, 'DD-MM-YYYY HH:mm'));

// Test debounce function
console.log('\nTesting debounce function:');

let counter = 0;
const incrementCounter = () => {
  counter++;
  console.log(`Counter: ${counter}`);
};

const debouncedIncrement = debounce(incrementCounter, 300);

console.log('Calling debounced function multiple times rapidly...');
debouncedIncrement();
debouncedIncrement();
debouncedIncrement();
debouncedIncrement();

setTimeout(() => {
  console.log('Final counter value after debounce delay:', counter);
}, 400);

// Test debounce with arguments
console.log('\nTesting debounce with arguments:');
const greet = (name, greeting = 'Hello') => {
  console.log(`${greeting}, ${name}!`);
};

const debouncedGreet = debounce(greet, 200);
debouncedGreet('Alice', 'Hi');
debouncedGreet('Bob', 'Hey');
debouncedGreet('Charlie', 'Greetings');

setTimeout(() => {
  console.log('Tests completed!');
}, 500);
