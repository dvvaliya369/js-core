# Date-Time Formatter Utilities

A comprehensive JavaScript utility library for formatting, parsing, and manipulating dates and times.

## Features

- **Format dates** to various common formats with custom format strings
- **Parse different date formats** into Date objects
- **Relative time formatting** (e.g., "2 hours ago", "in 5 minutes")
- **Date validation** to check if dates are valid
- **Date arithmetic** (add/subtract time, calculate differences)
- **Start/end of day** utilities
- **Preset formatting functions** for common use cases

## Installation

Simply require the module in your JavaScript project:

```javascript
const {
  formatDate,
  getRelativeTime,
  parseDate,
  isValidDate,
  startOfDay,
  endOfDay,
  addTime,
  dateDiff,
  presetFormats,
} = require('./utils/dateFormatter');
```

## Usage Examples

### Format Dates

```javascript
const now = new Date();

// Basic formatting
formatDate(now, 'YYYY-MM-DD');           // "2025-10-07"
formatDate(now, 'MM/DD/YYYY');           // "10/07/2025"
formatDate(now, 'MMMM DD, YYYY');        // "October 07, 2025"
formatDate(now, 'HH:mm:ss');             // "13:43:37"
formatDate(now, 'hh:mm A');              // "01:43 PM"

// Full datetime
formatDate(now, 'YYYY-MM-DD HH:mm:ss');  // "2025-10-07 13:43:37"
```

### Relative Time

```javascript
const pastDate = new Date('2024-03-15');
const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000);

getRelativeTime(pastDate);     // "1 year ago"
getRelativeTime(futureDate);   // "in 2 hours"
```

### Date Validation

```javascript
isValidDate('2024-03-15');     // true
isValidDate('2024-13-45');     // false
isValidDate(new Date());       // true
isValidDate('not a date');     // false
```

### Date Arithmetic

```javascript
const now = new Date();

// Add time
addTime(now, 5, 'days');       // 5 days from now
addTime(now, 3, 'hours');      // 3 hours from now
addTime(now, -2, 'weeks');     // 2 weeks ago

// Calculate differences
dateDiff(new Date(), pastDate, 'days');    // Number of days difference
dateDiff(futureDate, now, 'minutes');      // Number of minutes difference
```

### Start/End of Day

```javascript
const now = new Date();

startOfDay(now);   // Today at 00:00:00.000
endOfDay(now);     // Today at 23:59:59.999
```

### Preset Formats

```javascript
const now = new Date();

presetFormats.iso(now);         // "2025-10-07T13:43:37"
presetFormats.short(now);       // "10/07/2025"
presetFormats.time(now);        // "13:43:37"
presetFormats.datetime(now);    // "10/07/2025 13:43:37"
```

## Format String Tokens

| Token | Description | Example |
|-------|-------------|---------|
| YYYY  | 4-digit year | 2025 |
| YY    | 2-digit year | 25 |
| MMMM  | Full month name | October |
| MMM   | Short month name | Oct |
| MM    | Month (01-12) | 10 |
| M     | Month (1-12) | 10 |
| DD    | Day with leading zero | 07 |
| D     | Day without leading zero | 7 |
| HH    | Hour 24-hour format | 13 |
| H     | Hour 24-hour format (no leading zero) | 13 |
| hh    | Hour 12-hour format | 01 |
| h     | Hour 12-hour format (no leading zero) | 1 |
| mm    | Minutes with leading zero | 43 |
| m     | Minutes without leading zero | 43 |
| ss    | Seconds with leading zero | 37 |
| s     | Seconds without leading zero | 37 |
| SSS   | Milliseconds | 123 |
| A     | AM/PM | PM |
| a     | am/pm | pm |

## API Reference

### `formatDate(date, format)`
Format a date according to the specified format string.
- **date**: `Date|string|number` - The date to format
- **format**: `string` - The format string (default: 'YYYY-MM-DD')
- **Returns**: `string` - The formatted date string

### `getRelativeTime(date, baseDate)`
Get a human-readable relative time string.
- **date**: `Date|string|number` - The date to compare
- **baseDate**: `Date|string|number` - The base date (default: current time)
- **Returns**: `string` - Relative time string

### `parseDate(dateString)`
Parse a date string into a Date object.
- **dateString**: `string` - The date string to parse
- **Returns**: `Date` - The parsed Date object

### `isValidDate(date)`
Check if a date is valid.
- **date**: `Date|string|number` - The date to validate
- **Returns**: `boolean` - True if the date is valid

### `startOfDay(date)`
Get the start of day (00:00:00.000) for a given date.
- **date**: `Date|string|number` - The date
- **Returns**: `Date` - Date object set to start of day

### `endOfDay(date)`
Get the end of day (23:59:59.999) for a given date.
- **date**: `Date|string|number` - The date
- **Returns**: `Date` - Date object set to end of day

### `addTime(date, amount, unit)`
Add or subtract time from a date.
- **date**: `Date|string|number` - The base date
- **amount**: `number` - The amount to add (negative to subtract)
- **unit**: `string` - The unit (years, months, days, hours, minutes, seconds, milliseconds)
- **Returns**: `Date` - New Date object with added time

### `dateDiff(date1, date2, unit)`
Calculate the difference between two dates.
- **date1**: `Date|string|number` - First date
- **date2**: `Date|string|number` - Second date
- **unit**: `string` - Unit for the result (default: 'milliseconds')
- **Returns**: `number` - The difference in the specified unit

## Testing

Run the test suite to verify all functionality:

```bash
node utils/test_dateFormatter.js
```

## License

This utility is part of the js-core project and is available for use in your JavaScript applications.
