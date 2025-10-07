# Debounce Utils

A comprehensive debounce utility library with TypeScript support.

## Installation

Simply import the functions from the utils directory:

```typescript
import { debounce, debounceAsync, debounceImmediate } from './utils';
```

## Functions

### `debounce<T>(func: T, delay: number)`

Creates a debounced version of a function that delays its execution until after a specified delay has passed since the last time it was invoked.

**Parameters:**
- `func`: The function to debounce
- `delay`: The delay in milliseconds

**Example:**
```typescript
const debouncedSearch = debounce((query: string) => {
  console.log('Searching for:', query);
}, 300);

// Will only execute once after 300ms of no calls
debouncedSearch('hello');
debouncedSearch('hello world'); // This will be the final call
```

### `debounceAsync<T>(func: T, delay: number)`

Creates a debounced version of an async function that returns a Promise. Only the last invocation within the delay period will resolve. Previous pending promises will be rejected with a cancellation error.

**Parameters:**
- `func`: The async function to debounce
- `delay`: The delay in milliseconds

**Example:**
```typescript
const debouncedFetch = debounceAsync(async (url: string) => {
  const response = await fetch(url);
  return response.json();
}, 500);

// Only the last call will complete, others will be cancelled
debouncedFetch('/api/users/1').catch(() => console.log('Cancelled'));
debouncedFetch('/api/users/2').then(data => console.log('Success:', data));
```

### `debounceImmediate<T>(func: T, delay: number, immediate?: boolean)`

Creates a debounced version of a function with immediate execution option. If immediate is true, the function will be called immediately on the first invocation, then debounced for subsequent calls.

**Parameters:**
- `func`: The function to debounce
- `delay`: The delay in milliseconds
- `immediate`: Whether to execute immediately on first call (default: false)

**Example:**
```typescript
const immediateDebounced = debounceImmediate(() => {
  console.log('Called immediately on first invocation');
}, 300, true);

immediateDebounced(); // Executes immediately
immediateDebounced(); // Debounced
immediateDebounced(); // Debounced
```

## Use Cases

- **Search input**: Debounce API calls while user is typing
- **Button clicks**: Prevent multiple rapid clicks
- **Window resize**: Debounce expensive layout calculations
- **Auto-save**: Debounce save operations while user is editing
- **API requests**: Prevent excessive API calls

## Testing

Run the test file to see all functions in action:

```bash
npx tsc utils/test.ts --target es2020 --module commonjs --outDir ./dist
node dist/test.js
```
