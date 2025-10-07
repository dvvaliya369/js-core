# Utils.js - Date Time Formatter

A comprehensive JavaScript utility library for date and time formatting with support for multiple formats, timezones, and localization.

## Features

- **Multiple preset formats**: ISO, short, medium, long, full, time-only, date-only
- **Custom format strings**: Support for YYYY-MM-DD, MM/DD/YYYY, and other patterns
- **Timezone support**: Format dates in any timezone
- **Localization**: Support for different locales
- **Relative time formatting**: "2 hours ago", "in 3 days", etc.
- **Utility functions**: Leap year detection, days in month, date parsing
- **Error handling**: Robust input validation and error messages

## Installation

Simply include the `utils.js` file in your project:

```javascript
const { formatDateTime, getRelativeTime, isLeapYear, getDaysInMonth, parseDate } = require('./utils');
```

Or for ES6 modules:
```javascript
import { formatDateTime, getRelativeTime, isLeapYear, getDaysInMonth, parseDate } from './utils.js';
```

## Usage

### Basic Date Formatting

```javascript
const date = new Date('2025-10-07T15:01:59.123Z');

// Preset formats
formatDateTime(date, 'iso')     // "2025-10-07T15:01:59.123Z"
formatDateTime(date, 'short')   // "10/7/2025"
formatDateTime(date, 'medium')  // "Oct 7, 2025, 3:01:59 PM"
formatDateTime(date, 'long')    // "October 7, 2025 at 3:01:59 PM UTC"
formatDateTime(date, 'full')    // "Tuesday, October 7, 2025 at 3:01:59 PM Coordinated Universal Time"
formatDateTime(date, 'time')    // "3:01:59 PM"
formatDateTime(date, 'date')    // "October 7, 2025"
```

### Custom Format Strings

```javascript
formatDateTime(date, 'YYYY-MM-DD')           // "2025-10-07"
formatDateTime(date, 'MM/DD/YYYY')           // "10/07/2025"
formatDateTime(date, 'DD-MM-YYYY HH:mm:ss')  // "07-10-2025 15:01:59"
formatDateTime(date, 'MMMM D, YYYY')         // "October 7, 2025"
```

### Timezone Support

```javascript
const options = { timezone: 'America/New_York', locale: 'en-US' };
formatDateTime(date, 'medium', options)  // "Oct 7, 2025, 11:01:59 AM"

// Different timezones
formatDateTime(date, 'medium', { timezone: 'Asia/Tokyo' })    // "Oct 8, 2025, 12:01:59 AM"
formatDateTime(date, 'medium', { timezone: 'Europe/London' }) // "Oct 7, 2025, 4:01:59 PM"
```

### Relative Time

```javascript
const oneHourAgo = new Date(Date.now() - 3600000);
const oneDayFromNow = new Date(Date.now() + 86400000);

getRelativeTime(oneHourAgo)    // "1 hour ago"
getRelativeTime(oneDayFromNow) // "in 1 day"
```

### Utility Functions

```javascript
// Check leap year
isLeapYear(2024)  // true
isLeapYear(2025)  // false

// Get days in month
getDaysInMonth(2024, 2)  // 29 (February in leap year)
getDaysInMonth(2025, 2)  // 28 (February in non-leap year)

// Parse date strings
parseDate('2025-10-07')   // Date object
parseDate('10/07/2025')   // Date object
parseDate('10-07-2025')   // Date object
```

## API Reference

### formatDateTime(date, format, options)

Formats a date according to the specified format.

**Parameters:**
- `date` (Date|string|number): Date object, ISO string, or timestamp
- `format` (string): Format type ('iso', 'short', 'medium', 'long', 'full', 'time', 'date') or custom format string
- `options` (Object): Optional formatting options
  - `timezone` (string): Timezone (default: 'UTC')
  - `locale` (string): Locale (default: 'en-US')

### getRelativeTime(date, baseDate, locale)

Returns relative time string.

**Parameters:**
- `date` (Date|string|number): Date to compare
- `baseDate` (Date|string|number): Base date for comparison (default: current time)
- `locale` (string): Locale for formatting (default: 'en-US')

### isLeapYear(year)

Checks if a year is a leap year.

**Parameters:**
- `year` (number): Year to check

### getDaysInMonth(year, month)

Returns the number of days in a specific month.

**Parameters:**
- `year` (number): Year
- `month` (number): Month (1-12)

### parseDate(dateString)

Parses various date string formats into a Date object.

**Parameters:**
- `dateString` (string): Date string to parse

## Custom Format Tokens

| Token | Description | Example |
|-------|-------------|---------|
| YYYY  | 4-digit year | 2025 |
| YY    | 2-digit year | 25 |
| MMMM  | Full month name | October |
| MMM   | Short month name | Oct |
| MM    | 2-digit month | 10 |
| M     | Month | 10 |
| DD    | 2-digit day | 07 |
| D     | Day | 7 |
| HH    | 2-digit hour (24h) | 15 |
| H     | Hour (24h) | 15 |
| mm    | 2-digit minute | 01 |
| m     | Minute | 1 |
| ss    | 2-digit second | 59 |
| s     | Second | 59 |

## Error Handling

The library includes comprehensive error handling:
- Invalid date inputs throw descriptive errors
- Unsupported date string formats are handled gracefully
- Timezone and locale validation

## Testing

Run the test suite:

```bash
node test-utils.js
```

The test suite covers:
- All preset formats
- Custom format strings
- Timezone conversions
- Relative time calculations
- Utility functions
- Date parsing
- Error scenarios

## Browser Compatibility

This library uses modern JavaScript features:
- `Intl.DateTimeFormat` for internationalization
- `Intl.RelativeTimeFormat` for relative time
- Modern browser support required (ES6+)

For older browser support, consider using polyfills or transpiling with Babel.

## License

This utility library is provided as-is for educational and development purposes.
