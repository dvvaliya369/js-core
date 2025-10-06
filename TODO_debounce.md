# TODO: Add Debounce Function to Utils

## Task: Add a debounce function to the existing utils/clone.js file

### Steps:
- [x] Locate the utils file (src/utils/clone.js)
- [x] Review existing file structure and export pattern
- [ ] Implement debounce function with proper JSDoc documentation
- [ ] Add function to existing exports (both CommonJS and ES6)
- [ ] Test the implementation with example usage
- [ ] Verify the function works correctly

### Requirements:
- Follow existing code style and documentation patterns
- Include comprehensive JSDoc comments
- Support both CommonJS and ES6 exports
- Handle edge cases (invalid arguments, etc.)
- Provide clear example usage

### Implementation Details:
- Function should accept a callback function and delay time
- Should return a debounced version of the callback
- Should clear previous timeouts when called again within the delay period
- Should preserve `this` context and arguments when possible
