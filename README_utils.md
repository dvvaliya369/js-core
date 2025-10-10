# Utils

A utility module containing common JavaScript functions for performance optimization.

## Functions

### `debounce(func, wait, immediate)`

Creates a debounced version of a function that delays invoking the original function until after `wait` milliseconds have elapsed since the last time the debounced function was invoked.

**Parameters:**
- `func` (Function): The function to debounce
- `wait` (number): The number of milliseconds to delay
- `immediate` (boolean, optional): Whether to trigger the function on the leading edge instead of trailing

**Returns:** Function - The debounced function

**Example:**
```javascript
const { debounce } = require('./utils');

const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

// Will only execute once, 300ms after the last call
debouncedSearch('hello');
debouncedSearch('world'); // Cancels previous call
```

### `throttle(func, wait)`

Creates a throttled version of a function that only invokes the original function at most once per every `wait` milliseconds.

**Parameters:**
- `func` (Function): The function to throttle
- `wait` (number): The number of milliseconds to throttle invocations to

**Returns:** Function - The throttled function

**Example:**
```javascript
const { throttle } = require('./utils');

const throttledScroll = throttle(() => {
  console.log('Scroll event handled');
}, 100);

// Will execute at most once every 100ms
window.addEventListener('scroll', throttledScroll);
```

## Usage

### CommonJS
```javascript
const { debounce, throttle } = require('./utils');
```

### ES6 Modules
```javascript
import { debounce, throttle } from './utils.js';
```

## Testing

Run the test file to verify functionality:
```bash
node test-utils.js
```
