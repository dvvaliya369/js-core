# <span style="color:red">JS Core Utilities</span>

A collection of JavaScript utility functions for common programming tasks.

## Features

### Debounce Function

The `debounce` function delays the execution of a function until after a specified wait time has passed since the last time it was invoked. This is useful for limiting the rate at which a function can fire, such as in search inputs or resize events.

#### Usage

**JavaScript:**
```javascript
const { debounce } = require('./utils.js');

// Basic usage
const debouncedSave = debounce(saveData, 300);
debouncedSave(); // Will execute after 300ms of no further calls

// Immediate execution
const debouncedImmediate = debounce(saveData, 300, true);
debouncedImmediate(); // Executes immediately, then debounces further calls
```

**TypeScript:**
```typescript
import { debounce } from './utils';

// TypeScript will infer the correct types
const debouncedSave = debounce((data: string) => {
    console.log(data);
}, 300);

debouncedSave('Hello'); // Type-safe!
```

#### Parameters

- `func` (function): The function to debounce
- `wait` (number): The number of milliseconds to delay
- `immediate` (boolean, optional): If true, trigger the function on the leading edge instead of trailing

#### Returns

A debounced version of the input function.

## Installation

Clone the repository and include `utils.js` in your project.

## Testing

Run the test file to verify the debounce function:

```bash
node test_utils.js
```

## License

This project is open source. Feel free to use and modify as needed.