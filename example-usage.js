// Example usage demonstrations
import { debounce, debounceWithCancel, debounceImmediate } from './utils/index.js';

// Example 1: Basic debounce for search functionality
console.log('=== Basic Debounce Example ===');
const searchFunction = (query) => {
  console.log(`Searching for: "${query}"`);
};

const debouncedSearch = debounce(searchFunction, 300);

// Simulate rapid user typing - only the last call will execute
debouncedSearch('h');
debouncedSearch('he');
debouncedSearch('hel');
debouncedSearch('hell');
debouncedSearch('hello');

// Example 2: Debounce with cancel functionality
console.log('\n=== Debounce with Cancel Example ===');
const processData = (data) => {
  console.log(`Processing: ${data}`);
};

const { debounced: debouncedProcess, cancel } = debounceWithCancel(processData, 500);

debouncedProcess('important data');
// Cancel before it executes
setTimeout(() => {
  cancel();
  console.log('Cancelled the pending operation');
}, 200);

// Example 3: Debounce with immediate execution
console.log('\n=== Debounce Immediate Example ===');
const logMessage = (message) => {
  console.log(`Message: ${message}`);
};

const debouncedImmediate = debounceImmediate(logMessage, 1000);

// First call executes immediately
debouncedImmediate('First call - immediate');
// Subsequent calls are debounced
debouncedImmediate('Second call - debounced');
debouncedImmediate('Third call - debounced');

console.log('\n=== Example completed ===');
console.log('Note: Some outputs may appear after a delay due to debouncing.');
