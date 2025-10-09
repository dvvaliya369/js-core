# TODO: Add DateTime Formatter Function

## Task: Add a datetime formatter function to the utils file

### Steps:
- [x] Review existing utils file structure
- [x] Design datetime formatter function with various format options
- [x] Add comprehensive JSDoc documentation
- [x] Add function to both JavaScript and TypeScript versions
- [x] Include usage examples
- [x] Update exports in both files
- [x] Test the function works as expected

### Requirements:
- [x] Function should support common datetime formats
- [x] Should handle Date objects and timestamp numbers
- [x] Should include timezone support options  
- [x] Should be well-documented with examples
- [x] Should follow the existing code style and patterns

### Progress:
- [x] Reviewed existing utils structure
- [x] Implement datetime formatter in JavaScript version
- [x] Implement datetime formatter in TypeScript version
- [x] Update exports
- [x] Test functionality

## ✅ Task Completed Successfully!

The `formatDateTime` function has been successfully added to both JavaScript and TypeScript versions of the utils file with:

- Support for multiple input types (Date, number, string)
- Flexible format string with common tokens (yyyy, MM, dd, HH, mm, ss, SSS)
- Timezone and locale support via options parameter
- Comprehensive error handling for invalid dates
- Detailed JSDoc documentation with examples
- Proper TypeScript types and interfaces
- Full integration with existing export structure

### Test Results:
- ✅ Default format works: `2025-10-09 19:13:46`
- ✅ Custom formats work: `MM/dd/yyyy`, `yyyy-MM-dd`, `HH:mm:ss`
- ✅ Milliseconds support: `.SSS`
- ✅ Timestamp input works
- ✅ Timezone support works
