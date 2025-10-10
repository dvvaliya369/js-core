import { debounce, deeeebounceee, DebounceOptions, DebouncedFunction } from './utils';

/**
 * TypeScript test file for the debounce function
 */

console.log('Testing TypeScript debounce function...\n');

// Test 1: Basic usage with type inference
const basicHandler = (message: string, count: number): void => {
  console.log(`Message: ${message}, Count: ${count}`);
};

const debouncedHandler: DebouncedFunction<typeof basicHandler> = debounce(basicHandler, 300);

// Test type safety - these should work
debouncedHandler('Hello', 1);
debouncedHandler('World', 2);

// Test 2: Function with return value
const computeSum = (a: number, b: number): number => {
  console.log(`Computing: ${a} + ${b} = ${a + b}`);
  return a + b;
};

const debouncedCompute = debounce(computeSum, 500);
const result = debouncedCompute(5, 3); // result is void due to debouncing

// Test 3: Using options with proper typing
const searchHandler = (query: string): Promise<string[]> => {
  console.log(`Searching for: ${query}`);
  return Promise.resolve([`Result for ${query}`]);
};

const options: DebounceOptions = {
  leading: true,
  trailing: false,
  maxWait: 1000
};

const debouncedSearch = debounce(searchHandler, 300, options);

// Test 4: Control methods
const controlHandler = (data: any): string => {
  console.log('Processing data:', data);
  return `Processed: ${JSON.stringify(data)}`;
};

const debouncedControl = debounce(controlHandler, 1000);

// Test pending
console.log('Before call - pending:', debouncedControl.pending());

debouncedControl({ test: true });
console.log('After call - pending:', debouncedControl.pending());

// Test cancel
debouncedControl.cancel();
console.log('After cancel - pending:', debouncedControl.pending());

// Test flush
debouncedControl({ test: 'flush' });
const flushResult = debouncedControl.flush();
console.log('Flush result:', flushResult);

// Test 5: Backward compatibility
const legacyHandler = (value: string): void => {
  console.log('Legacy handler called with:', value);
};

const legacyDebounced = deeeebounceee(legacyHandler, 200);
legacyDebounced('legacy test');

console.log('TypeScript tests completed successfully!');

export { debouncedHandler, debouncedSearch, debouncedControl };
