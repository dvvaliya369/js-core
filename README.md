# Enhanced Debounce Utilities

This package provides enhanced debounce utilities with TypeScript support and improved functionality.

## Features

- ✅ **TypeScript Support**: Full type definitions and generic type support
- ✅ **Arrow Functions**: Modern JavaScript syntax for better clarity
- ✅ **Enhanced Functionality**: Cancel and flush methods for better control
- ✅ **Multiple Variants**: Basic, advanced, and legacy support
- ✅ **Backward Compatibility**: Maintains compatibility with existing code

## Installation

No installation needed - just copy the files to your project.

## Usage

### Basic Usage (New Recommended API)

```javascript
const { createDebouncedFunction } = require('./utils');

const debouncedSave = createDebouncedFunction(saveData, 300);
debouncedSave(); // Will only execute after 300ms of no calls

// Cancel pending execution
debouncedSave.cancel();

// Flush (execute immediately)
debouncedSave.flush();
```

### TypeScript Usage

```typescript
import { createDebouncedFunction, DebouncedFunction } from './utils';

const saveData = (data: string): void => {
  console.log('Saving:', data);
};

const debouncedSave: DebouncedFunction<typeof saveData> = 
  createDebouncedFunction(saveData, 300);

debouncedSave('test data');
```

### Advanced Options

```javascript
const { advancedDebounce } = require('./utils');

const debouncedFn = advancedDebounce(myFunction, 300, {
  leading: true,     // Execute on leading edge
  trailing: false,   // Don't execute on trailing edge
  maxWait: 1000     // Maximum time to wait before execution
});
```

### Legacy Support

```javascript
// Still works for backward compatibility
const { debounce } = require('./utils');
const debouncedFn = debounce(myFunction, 300);
```

## API Reference

### createDebouncedFunction(func, wait, immediate?)

Creates a debounced function with enhanced features.

**Parameters:**
- `func`: Function to debounce
- `wait`: Delay in milliseconds
- `immediate?`: Execute on leading edge (default: false)

**Returns:** DebouncedFunction with `cancel()` and `flush()` methods

### advancedDebounce(func, wait, options?)

Advanced debounce with more configuration options.

**Options:**
- `leading?`: Execute on leading edge
- `trailing?`: Execute on trailing edge (default: true)
- `maxWait?`: Maximum delay before execution

### DebouncedFunction Methods

- `cancel()`: Cancel pending execution
- `flush(...args)`: Execute immediately with optional arguments

## Migration Guide

### From v1.x

```javascript
// Old way
const debouncedFn = debounce(myFunc, 300);

// New way (recommended)
const debouncedFn = createDebouncedFunction(myFunc, 300);

// Both work, but createDebouncedFunction provides better clarity
```

## Changes from Previous Version

1. **Renamed main function**: `debounce` → `createDebouncedFunction` for clarity
2. **Added TypeScript support**: Full type definitions
3. **Enhanced with arrow functions**: Modern syntax for better readability
4. **Added cancel/flush methods**: Better control over execution
5. **Advanced debounce variant**: More configuration options
6. **Maintained backward compatibility**: Old `debounce` function still works

## Examples

See `test_utils_improved.js` for comprehensive examples of all features.

## License

MIT
