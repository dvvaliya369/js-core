import { debounce, debounceAsync, debounceImmediate } from './debounce';

// Test the basic debounce function
console.log('Testing basic debounce...');
let callCount = 0;
const debouncedFunction = debounce(() => {
  callCount++;
  console.log(`Debounced function called! Count: ${callCount}`);
}, 100);

// These calls should result in only one execution
debouncedFunction();
debouncedFunction();
debouncedFunction();

setTimeout(() => {
  console.log(`Final call count: ${callCount} (should be 1)`);
}, 200);

// Test debounce with arguments
console.log('\nTesting debounce with arguments...');
const debouncedSearch = debounce((query: string) => {
  console.log(`Searching for: "${query}"`);
}, 150);

debouncedSearch('hello');
debouncedSearch('hello world');
debouncedSearch('final query'); // Only this should execute

// Test immediate debounce
setTimeout(() => {
  console.log('\nTesting immediate debounce...');
  let immediateCallCount = 0;
  const immediateDebounced = debounceImmediate(() => {
    immediateCallCount++;
    console.log(`Immediate debounced called! Count: ${immediateCallCount}`);
  }, 100, true);

  // First call should execute immediately, subsequent calls debounced
  immediateDebounced(); // Should execute immediately
  immediateDebounced(); // Should be debounced
  immediateDebounced(); // Should be debounced

  setTimeout(() => {
    console.log(`Immediate final count: ${immediateCallCount} (should be 1)`);
  }, 200);
}, 300);

// Test async debounce
setTimeout(async () => {
  console.log('\nTesting async debounce...');
  
  const mockAsyncFunction = async (id: number): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return `Result for ID: ${id}`;
  };

  const debouncedAsync = debounceAsync(mockAsyncFunction, 100);

  try {
    // These should cancel each other out except the last one
    const promise1 = debouncedAsync(1);
    const promise2 = debouncedAsync(2);
    const promise3 = debouncedAsync(3);

    promise1.catch(() => console.log('Promise 1 cancelled'));
    promise2.catch(() => console.log('Promise 2 cancelled'));
    
    const result = await promise3;
    console.log('Async result:', result);
  } catch (error) {
    console.error('Async error:', error);
  }
}, 600);

console.log('Test script loaded. Check output in 1-2 seconds...');
