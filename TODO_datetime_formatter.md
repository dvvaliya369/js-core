# TODO: Add DateTime Formatter Function to Utils

## Plan
1. [x] Determine the project language/framework (JavaScript, Python, TypeScript, etc.)
2. [x] Create a utils directory/file structure
3. [x] Implement datetime formatter function with multiple format options
4. [x] Add comprehensive documentation
5. [x] Include unit tests (if applicable)
6. [x] Update any relevant documentation

## Steps to Complete
- [x] Check project structure and determine language
- [x] Create utils.js/utils.py/utils.ts file 
- [x] Implement formatDateTime function with options for:
  - ISO format
  - Human readable format
  - Custom format strings
  - Timezone handling
- [x] Add JSDoc/docstring documentation
- [x] Test the implementation
- [x] Mark task complete

## COMPLETED ✅

The datetime formatter utility has been successfully implemented with the following features:

### Files Created:
1. `utils.js` - Main utility file with all datetime formatting functions
2. `test-utils.js` - Comprehensive test suite
3. `README_utils.md` - Complete documentation

### Functions Implemented:
- `formatDateTime()` - Main formatting function with preset and custom formats
- `getRelativeTime()` - Relative time strings ("2 hours ago", "in 3 days")
- `isLeapYear()` - Check if year is leap year
- `getDaysInMonth()` - Get number of days in a month
- `parseDate()` - Parse various date string formats

### Features:
- ✅ Multiple preset formats (iso, short, medium, long, full, time, date)
- ✅ Custom format strings with tokens (YYYY-MM-DD, etc.)
- ✅ Timezone support for all major timezones
- ✅ Locale support for internationalization
- ✅ Comprehensive error handling
- ✅ JSDoc documentation for all functions
- ✅ Full test coverage
- ✅ README with usage examples
