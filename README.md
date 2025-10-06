# Object Clone Utilities

A comprehensive JavaScript library for cloning objects, supporting both shallow and deep cloning with circular reference handling.

## Features

- **Shallow Clone**: Creates a new object with the same top-level properties
- **Deep Clone**: Recursively clones nested objects and arrays
- **Circular Reference Handling**: Prevents infinite loops when cloning objects with circular references
- **Multiple Data Types**: Supports Objects, Arrays, Date, RegExp, Map, Set, and primitive types
- **Universal Compatibility**: Works in both Node.js and browser environments

## Installation

Simply include the `clone.js` file in your project:

```javascript
// Node.js (CommonJS)
const { shallowClone, deepClone, clone } = require('./src/utils/clone.js');

// Browser (Global)
// Include the script tag, then access via window.CloneUtils
const { shallowClone, deepClone, clone } = window.CloneUtils;
```

## Usage

### Basic Examples

```javascript
const original = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'New York',
    zip: '10001'
  }
};

// Shallow clone - nested objects are shared
const shallow = shallowClone(original);
shallow.name = 'Jane';           // Original unchanged
shallow.address.city = 'Boston'; // Original is also changed!

// Deep clone - completely independent copy
const deep = deepClone(original);
deep.name = 'Bob';               // Original unchanged
deep.address.city = 'Chicago';   // Original unchanged

// Using the general clone function
const shallowCopy = clone(original, false); // Same as shallowClone
const deepCopy = clone(original, true);     // Same as deepClone
```

### Advanced Examples

```javascript
// Cloning arrays
const originalArray = [1, 2, [3, 4, [5, 6]]];
const deepArray = deepClone(originalArray);

// Cloning Date objects
const originalDate = new Date('2023-01-01');
const clonedDate = deepClone(originalDate);

// Cloning RegExp objects
const originalRegex = /test/gi;
const clonedRegex = deepClone(originalRegex);

// Cloning Map objects
const originalMap = new Map([
  ['key1', 'value1'],
  ['key2', { nested: 'object' }]
]);
const clonedMap = deepClone(originalMap);

// Cloning Set objects
const originalSet = new Set([1, 2, { id: 3 }]);
const clonedSet = deepClone(originalSet);

// Handling circular references
const circular = { name: 'test' };
circular.self = circular;
const clonedCircular = deepClone(circular); // Works without infinite loop
```

## API Reference

### `shallowClone(obj)`
Creates a shallow copy of the object. Nested objects and arrays are shared between original and clone.

**Parameters:**
- `obj` (any): The object to clone

**Returns:** A shallow copy of the object

### `deepClone(obj, visited?)`
Creates a deep copy of the object. All nested objects and arrays are recursively cloned.

**Parameters:**
- `obj` (any): The object to clone
- `visited` (WeakMap, optional): Internal parameter for circular reference tracking

**Returns:** A deep copy of the object

### `clone(obj, deep?)`
General-purpose clone function that can perform both shallow and deep cloning.

**Parameters:**
- `obj` (any): The object to clone
- `deep` (boolean, optional): If true, performs deep cloning. Default: false

**Returns:** A cloned copy of the object

## Supported Data Types

- **Primitives**: `null`, `undefined`, `number`, `string`, `boolean`
- **Objects**: Plain objects, with proper handling of nested structures
- **Arrays**: Including nested arrays
- **Built-in Objects**: `Date`, `RegExp`, `Map`, `Set`
- **Circular References**: Handled gracefully to prevent infinite loops

## Testing

Run the comprehensive test suite:

```bash
node test/clone.test.js
```

The test suite covers:
- All supported data types
- Shallow vs deep cloning behavior
- Circular reference handling
- Edge cases and error conditions

## Performance Considerations

- **Shallow Clone**: Very fast, only copies top-level properties
- **Deep Clone**: Slower for deeply nested objects, but handles complex structures
- **Circular References**: Uses WeakMap for efficient cycle detection
- **Memory**: Deep cloning creates completely independent copies, using more memory

## Browser Compatibility

Works in all modern browsers and Node.js environments. The library uses:
- ES6 spread operator (`...`)
- WeakMap for circular reference tracking
- Modern JavaScript features with fallbacks

## License

This code is part of the js-core project and follows the same licensing terms.
