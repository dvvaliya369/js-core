# Utils Package

A collection of commonly used utility functions for JavaScript/TypeScript projects.

## Functions

### `debounce(func, wait, immediate?)`

Creates a debounced function that delays invoking the provided function until after `wait` milliseconds have elapsed since the last time the debounced function was invoked.

**Parameters:**
- `func`: The function to debounce
- `wait`: The number of milliseconds to delay
- `immediate`: (optional) If true, trigger the function on the leading edge instead of trailing

**Example:**
```javascript
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

// Will only execute once after 300ms of no calls
debouncedSearch('hello');
debouncedSearch('hello world');
```

### `throttle(func, wait)`

Creates a throttled function that only invokes the provided function at most once per every `wait` milliseconds.

**Parameters:**
- `func`: The function to throttle
- `wait`: The number of milliseconds to throttle invocations to

**Example:**
```javascript
const throttledScroll = throttle(() => {
  console.log('Scroll event handled');
}, 100);

window.addEventListener('scroll', throttledScroll);
```

### `delay(ms)`

Delays execution for the specified number of milliseconds.

**Parameters:**
- `ms`: The number of milliseconds to delay

**Returns:** A promise that resolves after the delay

**Example:**
```javascript
await delay(1000); // Wait for 1 second
console.log('This runs after 1 second');
```

### `isDefined(value)`

Checks if a value is not null or undefined.

**Parameters:**
- `value`: The value to check

**Returns:** True if the value is not null or undefined

**Example:**
```javascript
const maybeString = getValue();
if (isDefined(maybeString)) {
  console.log(maybeString.toUpperCase());
}
```

### `once(func)`

Creates a function that can only be called once.

**Parameters:**
- `func`: The function to call only once

**Returns:** A function that can only be called once

**Example:**
```javascript
const initialize = once(() => {
  console.log('Initializing...');
});

initialize(); // Logs "Initializing..."
initialize(); // Does nothing
```

## Usage

### TypeScript
```typescript
import { debounce, throttle, delay } from './utils';
// or
import utils from './utils';
```

### JavaScript (ES6+)
```javascript
import { debounce, throttle, delay } from './utils/index.js';
// or
import utils from './utils/index.js';
```

### CommonJS
```javascript
const { debounce, throttle, delay } = require('./utils');
```

## Files

- `index.ts` - TypeScript version with full type definitions
- `index.js` - JavaScript version for plain JS projects
- `test.js` - Test file to verify functionality
- `README.md` - This documentation

## Testing

Run the test file to verify all functions work correctly:

```bash
node utils/test.js
```
