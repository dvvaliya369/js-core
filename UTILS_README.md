# Utils.js Documentation

## Throttle Functions

This utility file provides two throttle functions to help control the rate at which functions are executed.

### `throttle(func, limit)`

A basic throttle function that limits the rate at which a function can fire.

**Parameters:**
- `func` (Function): The function to throttle
- `limit` (number): The minimum time in milliseconds between function calls

**Returns:** 
- (Function): The throttled function

**Example:**
```javascript
const throttledScroll = throttle(() => {
  console.log('Scroll event fired');
}, 100);

window.addEventListener('scroll', throttledScroll);
```

### `throttleAdvanced(func, limit, options)`

An advanced throttle function with leading and trailing edge options.

**Parameters:**
- `func` (Function): The function to throttle
- `limit` (number): The minimum time in milliseconds between function calls
- `options` (Object): Configuration options
  - `leading` (boolean): Execute on the leading edge (default: true)
  - `trailing` (boolean): Execute on the trailing edge (default: true)

**Returns:** 
- (Function): The throttled function

**Example:**
```javascript
const throttledResize = throttleAdvanced(() => {
  console.log('Window resized');
}, 250, { leading: true, trailing: false });

window.addEventListener('resize', throttledResize);
```

## Usage

### Node.js
```javascript
const { throttle, throttleAdvanced } = require('./utils.js');
```

### Browser
```html
<script src="utils.js"></script>
<script>
  const throttledFunction = throttle(myFunction, 100);
</script>
```

## Use Cases

- **Scroll events**: Limit scroll event handlers to improve performance
- **Resize events**: Throttle window resize handlers
- **Search input**: Control API calls while user types
- **Button clicks**: Prevent rapid clicking and multiple submissions
- **Mouse move events**: Reduce the frequency of mousemove handlers
