# TODO: Add Object Clone Function to Utils File

## Task Overview
Add an object clone function to a utils file for the js-core repository.

## Steps
- [x] 1. Check if utils file exists in the repository
- [x] 2. Create utils.js file if it doesn't exist
- [x] 3. Implement a comprehensive object clone function that handles:
  - [x] Primitive values (string, number, boolean, null, undefined)
  - [x] Objects and nested objects
  - [x] Arrays and nested arrays
  - [x] Date objects
  - [x] RegExp objects
  - [x] Handle circular references (optional but good practice)
- [x] 4. Add proper JSDoc comments for documentation
- [x] 5. Export the function for use in other modules
- [x] 6. Test the implementation with various data types
- [x] 7. Create comprehensive test file
- [x] 8. Verify all tests pass

## Implementation Notes
- Use deep cloning approach to handle nested objects and arrays
- Consider performance and edge cases
- Make it compatible with CommonJS and ES modules if possible
