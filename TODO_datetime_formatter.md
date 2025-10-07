# TODO: Add Date-Time Formatter Function

## Plan
1. ✅ Analyze existing utils.js structure and patterns
2. ✅ Design the formatDateTime function with various format options
3. ✅ Add comprehensive JSDoc documentation with examples
4. ✅ Implement the function with support for:
   - Common date formats (ISO, US, European, etc.)
   - Time formats (12-hour, 24-hour)
   - Custom format strings
   - Timezone handling
   - Relative time formatting
5. ✅ Add the function to module exports
6. ✅ Test the implementation
7. ✅ Update demo.html to showcase the new function

## Function Requirements
- ✅ Support multiple predefined format options
- ✅ Allow custom format strings
- ✅ Handle timezone conversions
- ✅ Provide locale-aware formatting
- ✅ Include comprehensive examples in documentation

## Completed Features
- **Main Function**: `formatDateTime(date, format, options)`
- **Predefined Formats**: iso, short, medium, long, full, date-only, time-only, timestamp, relative
- **Custom Format Tokens**: YYYY, YY, MMMM, MMM, MM, M, DD, Do, D, dddd, ddd, HH, H, hh, h, mm, m, ss, s, SSS, A, a
- **Helper Functions**: formatCustomDateTime, getOrdinalSuffix, getRelativeTime
- **Options Support**: locale and timezone configuration
- **Error Handling**: Proper validation and error messages
- **Demo Integration**: Interactive demo with live examples and various options
