# Date-Time Formatter Utils

A comprehensive utility library for formatting dates and times in JavaScript.

## Features

- **Multiple Format Types**: Short, long, ISO, and custom date formats
- **Time Formatting**: 12-hour and 24-hour time formats with optional seconds
- **Combined Date-Time**: Format date and time together with customizable separators
- **Relative Time**: Display relative time strings (e.g., "2 hours ago", "in 3 days")
- **Custom Patterns**: Use custom format patterns like `YYYY-MM-DD HH:mm:ss`
- **Locale Support**: Format dates according to different locales
- **Timezone Support**: Handle different timezones
- **Date Validation**: Check if a date value is valid

## Installation

Simply import the utility functions:

```javascript
// CommonJS
const { formatDate, formatTime, formatDateTime } = require('./utils/dateTimeFormatter');

// ES6 Modules
import { formatDate, formatTime, formatDateTime } from './utils/dateTimeFormatter.js';
```

## API Reference

### `formatDate(date, options)`

Formats a date object or string into a readable format.

**Parameters:**
- `date` (Date|string|number): The date to format
- `options` (Object): Formatting options
  - `format` (string): Format type - 'short', 'long', 'iso', 'custom' (default: 'short')
  - `customFormat` (string): Custom format pattern (required when format is 'custom')
  - `locale` (string): Locale string (default: 'en-US')
  - `timezone` (string): Timezone (default: local timezone)

**Examples:**
```javascript
formatDate(new Date()); // "10/8/2023"
formatDate(new Date(), { format: 'long' }); // "Sunday, October 8, 2023"
formatDate(new Date(), { format: 'custom', customFormat: 'YYYY-MM-DD' }); // "2023-10-08"
```

### `formatTime(date, options)`

Formats time from a date object.

**Parameters:**
- `date` (Date|string|number): The date to extract time from
- `options` (Object): Formatting options
  - `format` (string): Format type - '12h' or '24h' (default: '12h')
  - `includeSeconds` (boolean): Whether to include seconds (default: false)
  - `locale` (string): Locale string (default: 'en-US')
  - `timezone` (string): Timezone (default: local timezone)

**Examples:**
```javascript
formatTime(new Date()); // "10:24 PM"
formatTime(new Date(), { format: '24h' }); // "22:24"
formatTime(new Date(), { includeSeconds: true }); // "10:24:46 PM"
```

### `formatDateTime(date, options)`

Formats date and time together.

**Parameters:**
- `date` (Date|string|number): The date to format
- `options` (Object): Formatting options
  - `dateFormat` (string): Date format type (default: 'short')
  - `timeFormat` (string): Time format type (default: '12h')
  - `separator` (string): Separator between date and time (default: ' ')
  - `locale` (string): Locale string (default: 'en-US')
  - `timezone` (string): Timezone (default: local timezone)

**Examples:**
```javascript
formatDateTime(new Date()); // "10/8/2023 10:24 PM"
formatDateTime(new Date(), { dateFormat: 'long', timeFormat: '24h' }); 
// "Sunday, October 8, 2023 22:24"
```

### `getRelativeTime(date, baseDate, locale)`

Get relative time string.

**Parameters:**
- `date` (Date|string|number): The date to compare
- `baseDate` (Date|string|number): Base date for comparison (default: now)
- `locale` (string): Locale string (default: 'en-US')

**Examples:**
```javascript
getRelativeTime(new Date(Date.now() - 2 * 60 * 60 * 1000)); // "2 hours ago"
getRelativeTime(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)); // "in 3 days"
```

### `isValidDate(date)`

Check if a date is valid.

**Parameters:**
- `date` (any): Value to check

**Examples:**
```javascript
isValidDate('2023-12-25'); // true
isValidDate('invalid-date'); // false
```

## Custom Format Patterns

When using `format: 'custom'`, you can use these pattern tokens:

- `YYYY` - 4-digit year
- `YY` - 2-digit year
- `MM` - 2-digit month (01-12)
- `M` - Month without leading zero (1-12)
- `DD` - 2-digit day (01-31)
- `D` - Day without leading zero (1-31)
- `HH` - 2-digit hour in 24-hour format (00-23)
- `H` - Hour in 24-hour format without leading zero (0-23)
- `hh` - 2-digit hour in 12-hour format (01-12)
- `h` - Hour in 12-hour format without leading zero (1-12)
- `mm` - 2-digit minutes (00-59)
- `m` - Minutes without leading zero (0-59)
- `ss` - 2-digit seconds (00-59)
- `s` - Seconds without leading zero (0-59)
- `A` - AM/PM
- `a` - am/pm

**Examples:**
```javascript
formatDate(new Date(), { format: 'custom', customFormat: 'YYYY-MM-DD HH:mm:ss' });
// "2023-10-08 22:24:46"

formatDate(new Date(), { format: 'custom', customFormat: 'DD/MM/YY h:mm A' });
// "08/10/23 10:24 PM"
```

## Predefined Format Constants

The library includes common format patterns:

```javascript
const { DATE_FORMATS } = require('./utils/dateTimeFormatter');

console.log(DATE_FORMATS.US_SHORT); // "MM/DD/YYYY"
console.log(DATE_FORMATS.EU_SHORT); // "DD/MM/YYYY"
console.log(DATE_FORMATS.ISO_DATE); // "YYYY-MM-DD"
console.log(DATE_FORMATS.ISO_DATETIME); // "YYYY-MM-DD HH:mm:ss"
```

## Error Handling

All functions validate input dates and throw descriptive errors for invalid inputs:

```javascript
try {
    formatDate('invalid-date');
} catch (error) {
    console.error(error.message); // "Invalid date provided"
}
```

## Browser Compatibility

This utility uses modern JavaScript features:
- `Intl.DateTimeFormat` (supported in all modern browsers)
- `Intl.RelativeTimeFormat` (supported in modern browsers, may need polyfill for older versions)

For older browser support, consider using polyfills or date libraries like moment.js or date-fns.

## Running Examples

To see the utility in action:

```bash
node src/utils/examples.js
```
