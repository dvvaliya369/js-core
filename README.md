# Debounce Utility - Improved Version

A modern, TypeScript-compatible debounce utility with enhanced features and improved clarity.

## 🚀 Features

- ✅ **TypeScript Support**: Full type definitions with generic type safety
- ✅ **Arrow Functions**: Modern JavaScript syntax for better clarity
- ✅ **Enhanced API**: Added `cancel()` and `flush()` methods
- ✅ **Flexible Options**: Support for both leading and trailing edge execution
- ✅ **Backward Compatibility**: Legacy function still available with deprecation warning
- ✅ **Multiple Module Systems**: CommonJS, ES6, and browser global support

## 📦 Installation

```bash
npm install debounce-utility
```

## 🔧 Usage

### Basic Usage (JavaScript)

```javascript
import { debounce } from './utils.js';
// or
const { debounce } = require('./utils.js');

// Basic debouncing
const debouncedSave = debounce(saveData, 300);
debouncedSave(); // Will only execute after 300ms of no calls

// Leading edge execution
const debouncedSearch = debounce(searchFunction, 500, { leading: true });
debouncedSearch(); // Executes immediately, then debounces subsequent calls
```

### TypeScript Usage

```typescript
import { debounce, DebouncedFunction } from './utils.ts';

interface User {
  id: number;
  name: string;
}

const saveUser = (user: User, comment: string): void => {
  console.log(`Saving user ${user.name} with comment: ${comment}`);
};

// Type-safe debounced function
const debouncedSaveUser: DebouncedFunction<typeof saveUser> = debounce(saveUser, 300);

debouncedSaveUser({ id: 1, name: 'John' }, 'Updated profile');
```

### Advanced Features

```javascript
const debouncedFn = debounce(myFunction, 1000);

// Cancel pending execution
debouncedFn.cancel();

// Execute immediately (flush)
debouncedFn.flush();

// Configure execution timing
const leadingDebounce = debounce(fn, 300, { leading: true, trailing: false });
```

## 🏗️ API Reference

### `debounce(func, wait, options?)`

Creates a debounced function that delays execution.

**Parameters:**
- `func` - The function to debounce
- `wait` - The number of milliseconds to delay
- `options` - Configuration object (optional)
  - `leading` - Execute on the leading edge (default: `false`)
  - `trailing` - Execute on the trailing edge (default: `true`)

**Returns:** A debounced function with additional methods:
- `cancel()` - Cancel pending execution
- `flush()` - Execute immediately if pending

### TypeScript Types

```typescript
type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
};

interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
}
```

## 🔄 Migration from Legacy Version

The old `deeeebounceee` function is still available but deprecated:

```javascript
// OLD (deprecated)
const debounced = deeeebounceee(func, 300, true);

// NEW (recommended)
const debounced = debounce(func, 300, { leading: true });
```

## 🧪 Testing

Run the test suite:

```bash
# JavaScript tests
npm test

# TypeScript tests  
npm run test:ts
```

## 📈 Improvements Made

1. **Renamed Function**: `deeeebounceee` → `debounce` for better clarity
2. **TypeScript Support**: Added comprehensive type definitions
3. **Arrow Functions**: Modernized syntax for better readability
4. **Enhanced API**: Added `cancel()` and `flush()` methods
5. **Flexible Options**: Replaced boolean `immediate` with options object
6. **Better Documentation**: Comprehensive JSDoc comments and examples
7. **Backward Compatibility**: Legacy function remains available

## 📄 License

MIT License
