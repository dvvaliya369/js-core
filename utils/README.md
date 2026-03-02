# Debounce Utility Functions

A comprehensive collection of debounce utility functions for JavaScript and TypeScript projects.

## Overview

This utils directory contains robust debounce implementations that help control the rate of function execution, particularly useful for:

- Search input handling
- API call optimization
- Scroll event management
- Resize event handling
- Button click prevention
- Form validation

## Files Structure

```
utils/
├── debounce.js     # JavaScript implementation
├── debounce.ts     # TypeScript implementation with full type safety
├── index.js        # JavaScript exports
└── index.ts        # TypeScript exports
```

## Available Functions

### 1. `debounce(func, delay)`

The standard debounce function that delays execution until after the specified delay period has passed since the last invocation.

**Usage:**
```javascript
import { debounce } from './utils/index.js';

const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

// Only the last call will execute after 300ms
debouncedSearch('h');
debouncedSearch('he');
debouncedSearch('hello'); // This one executes
```

### 2. `debounceWithCancel(func, delay)`

Returns an object with both the debounced function and a cancel method to manually cancel pending execution.

**Usage:**
```javascript
import { debounceWithCancel } from './utils/index.js';

const { debounced, cancel } = debounceWithCancel((data) => {
  console.log('Processing:', data);
}, 500);

debounced('test');
cancel(); // Cancels the pending execution
```

### 3. `debounceImmediate(func, delay)`

Executes immediately on the first call, then debounces subsequent calls. Perfect for scenarios where you want immediate feedback.

**Usage:**
```javascript
import { debounceImmediate } from './utils/index.js';

const debouncedLog = debounceImmediate((msg) => {
  console.log(msg);
}, 1000);

debouncedLog('First call'); // Executes immediately
debouncedLog('Second call'); // Debounced
```

## TypeScript Support

All functions include full TypeScript support with:
- Generic type parameters
- Proper parameter and return type inference
- `ThisParameterType` preservation
- Comprehensive JSDoc documentation

## Common Use Cases

### Search Input Debouncing
```javascript
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((query) => {
  // Make API call
  fetch(`/api/search?q=${query}`);
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

### Window Resize Handling
```javascript
const debouncedResize = debounce(() => {
  console.log('Window resized to:', window.innerWidth, window.innerHeight);
}, 250);

window.addEventListener('resize', debouncedResize);
```

### Form Validation
```javascript
const { debounced: debouncedValidate, cancel } = debounceWithCancel((field, value) => {
  validateField(field, value);
}, 500);

// Cancel validation if user moves to different field
formField.addEventListener('blur', cancel);
formField.addEventListener('input', (e) => {
  debouncedValidate(e.target.name, e.target.value);
});
```

## Testing

Run the example to see all functions in action:
```bash
npm run example
```

## Features

- ✅ Preserves function context (`this` binding)
- ✅ Handles multiple arguments correctly
- ✅ Memory efficient (cleans up timeouts)
- ✅ TypeScript support with full type safety
- ✅ Comprehensive JSDoc documentation
- ✅ Multiple debounce strategies
- ✅ ES6+ module support
