# JavaScript Core Utilities

A comprehensive collection of common utility functions for JavaScript development, including object manipulation, function optimization, and more.

## 🚀 Features

This library provides essential utility functions that are commonly needed in JavaScript projects:

- **Deep Object Cloning** - Create complete copies of complex nested objects
- **Shallow Cloning** - Quick copying for simple objects and arrays  
- **Function Debouncing** - Delay function execution until after a period of inactivity
- **Function Throttling** - Limit function execution frequency to improve performance

## 📦 Installation

### Browser Usage

Include the `utils.js` file in your HTML:

```html
<script src="path/to/utils.js"></script>
<script>
  // Functions available under window.Utils
  const cloned = window.Utils.cloneObject(myObject);
</script>
```

### Node.js Usage

```javascript
const { cloneObject, shallowClone, debounce, throttle } = require('./utils');

// Use the functions
const cloned = cloneObject(myObject);
```

## 📚 Available Functions

### `cloneObject(obj, visited?)`

Creates a deep clone of an object, handling nested objects, arrays, dates, and circular references.

```javascript
const original = { 
  name: 'John', 
  hobbies: ['reading', 'coding'], 
  date: new Date(),
  nested: { value: 42 }
};

const cloned = cloneObject(original);
cloned.hobbies.push('swimming');
console.log(original.hobbies); // ['reading', 'coding'] - original unchanged
```

**Features:**
- Handles circular references
- Supports Date and RegExp objects
- Works with nested arrays and objects
- Preserves all enumerable properties

### `shallowClone(obj)`

Creates a shallow copy of an object or array for simple cloning needs.

```javascript
const original = { name: 'John', age: 30 };
const cloned = shallowClone(original);

const arr = [1, 2, 3];
const clonedArr = shallowClone(arr);
```

### `debounce(func, delay, immediate?)`

Creates a debounced function that delays execution until after a specified period of inactivity.

```javascript
// Basic usage - delays execution until 300ms of inactivity
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

// Execute immediately on first call, then debounce
const debouncedClick = debounce(() => {
  console.log('Button clicked!');
}, 1000, true);

// Control methods
debouncedSearch.cancel(); // Cancel pending execution
debouncedSearch.flush();  // Execute immediately
```

**Perfect for:** Search inputs, resize handlers, API calls

### `throttle(func, delay, options?)`

Creates a throttled function that limits execution to at most once per specified time period.

```javascript
// Basic usage - limits to once per 1000ms
const throttledScroll = throttle(() => {
  console.log('Scroll event handled');
}, 1000);

// Execute only on leading edge
const throttledClick = throttle(() => {
  console.log('Button clicked!');
}, 500, { leading: true, trailing: false });

// Execute only on trailing edge  
const throttledInput = throttle((value) => {
  console.log('Input value:', value);
}, 300, { leading: false, trailing: true });

// Control methods
throttledScroll.cancel(); // Cancel pending execution
throttledScroll.flush();  // Execute immediately if pending
```

**Options:**
- `leading` (default: true) - Execute on the leading edge
- `trailing` (default: true) - Execute on the trailing edge

**Perfect for:** Scroll handlers, mouse movement, button clicks

## 🔄 Debounce vs Throttle

### When to use **Debounce**:
- **Search suggestions** - Wait until user stops typing
- **Form validation** - Validate after user finishes input
- **API calls** - Prevent excessive requests
- **Window resize** - Execute only after resizing stops

### When to use **Throttle**:
- **Scroll events** - Limit scroll handler frequency  
- **Mouse movement** - Reduce mousemove event frequency
- **Button clicks** - Prevent double-clicks
- **Animation frames** - Control animation updates

## 🛠️ Development

### Testing

Run the test suite:

```bash
node test-utils.js
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - feel free to use in your projects!

## 🤝 Support

If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.
