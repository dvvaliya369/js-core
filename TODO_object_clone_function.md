# TODO: Object Clone Function

## Task Overview
Add an object clone function to the existing utils file that can perform both shallow and deep cloning of objects.

## Steps
- [x] Examine existing utils file
- [x] Implement object clone function with both shallow and deep clone capabilities
- [x] Add comprehensive JSDoc documentation
- [x] Add examples in documentation
- [x] Update the default export
- [x] Add tests for the clone function
- [x] Update TypeScript version as well
- [x] Test all functionality

## Requirements
- [x] Support both shallow and deep cloning
- [x] Handle various data types (objects, arrays, dates, functions, primitives)
- [x] Avoid circular reference issues in deep cloning
- [x] Provide clear documentation and examples
- [x] Follow existing code style and patterns

## Implementation Details
- [x] Use recursive approach for deep cloning
- [x] Handle edge cases like null, undefined, functions
- [x] Support Date objects, Arrays, and plain objects
- [x] Include option parameter to choose between shallow/deep cloning

## ✅ TASK COMPLETED SUCCESSFULLY

The object clone function has been successfully implemented in both JavaScript and TypeScript versions with:

### Features:
- **Shallow cloning**: Creates a new object with copied properties (nested objects remain shared)
- **Deep cloning**: Recursively clones all nested objects and arrays
- **Type support**: Handles primitives, objects, arrays, dates, functions, and RegExp
- **Circular reference detection**: Throws error when circular references are detected in deep cloning
- **TypeScript generics**: Preserves type information in TypeScript version

### Test Results:
All tests passed successfully, confirming:
- Shallow clone behavior (shared nested references)
- Deep clone behavior (independent nested objects) 
- Date object cloning
- Array cloning with nested objects
- Primitive value handling
