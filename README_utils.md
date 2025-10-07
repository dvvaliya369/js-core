# Utils Library with Debounce Function

A comprehensive utility library featuring debounce and throttle functions with TypeScript support.

## Features

- **Debounce Function**: Delays function execution until after a specified delay has elapsed since the last invocation
- **Throttle Function**: Limits function execution to at most once per specified time period
- **Immediate Debounce**: Option to trigger function on the leading edge instead of trailing edge
- **TypeScript Support**: Full type definitions included
- **Error Handling**: Safe versions with parameter validation
- **CommonJS/ES6 Compatibility**: Works in both Node.js and browser environments

## Files Created

- `utils.js` - Main utility functions with comprehensive JSDoc comments
- `utils.d.ts` - TypeScript type definitions  
- `test-debounce.js` - Node.js test suite
- `test-debounce.html` - Interactive browser test page

## Usage Examples

### Basic Debounce
```javascript
import { debounce } from './utils.js';

// Debounce search function to avoid excessive API calls
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

debouncedSearch('hello');       // Will be cancelled
debouncedSearch('hello world'); // Will be cancelled  
debouncedSearch('hello world!'); // Will execute after 300ms
```

### Immediate Debounce
```javascript
// Execute immediately on first call, then debounce
const debouncedImmediate = debounce(() => {
  console.log('Executed!');
}, 1000, true);

debouncedImmediate(); // Executes immediately
debouncedImmediate(); // Ignored (debounced)
```

### Throttle
```javascript
import { throttle } from './utils.js';

// Throttle scroll event to once every 100ms
const throttledScroll = throttle(() => {
  console.log('Scroll handled');
}, 100);

window.addEventListener('scroll', throttledScroll);
```

### With Error Handling
```javascript
import { safeDebounce } from './utils.js';

try {
  const safeDebouncedFn = safeDebounce(myFunction, 500);
} catch (error) {
  console.error('Invalid parameters:', error.message);
}
```

## Testing

### Node.js Tests
```bash
node test-debounce.js
```

### Browser Tests
Open `test-debounce.html` in a web browser to test interactively with:
- Search input debouncing
- Button click debouncing  
- Immediate debounce behavior
- Mouse move throttling

## API Reference

### `debounce(func, delay, immediate?)`
- **func**: Function to debounce
- **delay**: Delay in milliseconds
- **immediate**: Execute on leading edge (optional, default: false)
- **Returns**: Debounced function

### `throttle(func, limit)`  
- **func**: Function to throttle
- **limit**: Time limit in milliseconds
- **Returns**: Throttled function

### `safeDebounce(func, delay, immediate?)`
- Same as `debounce` but with parameter validation

### `safeThrottle(func, limit)`
- Same as `throttle` but with parameter validation

All tests pass successfully! ✅
