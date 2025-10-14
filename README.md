# Date-Time Formatter

A comprehensive date-time formatting utility available in both JavaScript and Python, supporting multiple input/output formats, timezone handling, and various utility functions.

## Features

- **Multiple Input Formats**: ISO strings, timestamps, Date objects, and more
- **Multiple Output Formats**: Predefined patterns and custom formats
- **Timezone Support**: Convert between timezones and handle timezone-aware formatting
- **Relative Time**: Get human-readable relative time descriptions
- **Validation**: Check if input dates are valid
- **Extensible**: Add custom format patterns
- **Cross-Platform**: Available in both JavaScript and Python

## Quick Start

### JavaScript

```javascript
const formatter = new DateTimeFormatter();

// Basic formatting
const now = new Date();
console.log(formatter.format(now, 'ISO')); // 2023-12-01T12:00:00.000Z
console.log(formatter.format(now, 'READABLE')); // December 01, 2023

// With timezone
console.log(formatter.format(now, 'READABLE_LONG', { 
    timezone: 'America/New_York' 
}));
```

### Python

```python
from datetime_formatter import DateTimeFormatter

formatter = DateTimeFormatter()

# Basic formatting
from datetime import datetime
now = datetime.now()
print(formatter.format(now, 'ISO'))  # 2023-12-01T12:00:00.000000Z
print(formatter.format(now, 'READABLE'))  # December 01, 2023
```

## Available Formats

| Format | Description | Example Output |
|--------|-------------|----------------|
| `ISO` | ISO 8601 format | `2023-12-01T12:00:00.000Z` |
| `ISO_DATE` | ISO date only | `2023-12-01` |
| `ISO_TIME` | ISO time only | `12:00:00` |
| `US_DATE` | US date format | `12/01/2023` |
| `US_DATETIME` | US date and time | `12/01/2023 12:00:00` |
| `EU_DATE` | European date format | `01/12/2023` |
| `EU_DATETIME` | European date and time | `01/12/2023 12:00:00` |
| `READABLE` | Human readable date | `December 01, 2023` |
| `READABLE_LONG` | Long readable format | `Friday, December 01, 2023 at 12:00:00` |
| `TIME_12` | 12-hour time | `12:00:00 PM` |
| `TIME_24` | 24-hour time | `12:00:00` |
| `UNIX` | Unix timestamp | `1701432000` |
| `UNIX_MS` | Unix timestamp (ms) | `1701432000000` |

## API Reference

### Constructor Options

```javascript
const formatter = new DateTimeFormatter({
    timezone: 'UTC',        // Default timezone
    locale: 'en-US'         // Default locale
});
```

### Methods

#### `format(input, pattern, options)`

Format a date according to the specified pattern.

**Parameters:**
- `input`: Date to format (Date object, timestamp, or string)
- `pattern`: Format pattern name or custom pattern string
- `options`: Optional formatting options
  - `timezone`: Target timezone
  - `locale`: Target locale

**Returns:** Formatted date string

#### `parseInput(input)`

Parse various input formats into a Date object.

**Parameters:**
- `input`: Date input (string, number, or Date object)

**Returns:** Date object

#### `getRelativeTime(input, baseDate)`

Get relative time description.

**Parameters:**
- `input`: Date to compare
- `baseDate`: Base date for comparison (defaults to now)

**Returns:** Relative time string (e.g., "2 hours ago")

#### `convertTimezone(input, toTimezone)`

Convert date to specified timezone.

**Parameters:**
- `input`: Date to convert
- `toTimezone`: Target timezone

**Returns:** Converted Date object

#### `isValidDate(input)`

Check if input can be parsed as a valid date.

**Parameters:**
- `input`: Input to validate

**Returns:** Boolean indicating validity

#### `addCustomFormat(name, pattern)`

Add a custom format pattern.

**Parameters:**
- `name`: Format name
- `pattern`: Format pattern string

#### `getAvailableFormats()`

Get list of available format names.

**Returns:** Array of format names

## Custom Patterns

You can create custom format patterns using these tokens:

| Token | Description | Example |
|-------|-------------|---------|
| `YYYY` | 4-digit year | `2023` |
| `YY` | 2-digit year | `23` |
| `MMMM` | Full month name | `December` |
| `MMM` | Short month name | `Dec` |
| `MM` | 2-digit month | `12` |
| `M` | Month number | `12` |
| `DD` | 2-digit day | `01` |
| `D` | Day number | `1` |
| `HH` | 24-hour format hour | `13` |
| `hh` | 12-hour format hour | `01` |
| `mm` | Minutes | `30` |
| `ss` | Seconds | `45` |
| `sss` | Milliseconds | `123` |
| `A` | AM/PM | `PM` |
| `Z` | Timezone offset | `+05:00` |

Example:
```javascript
formatter.addCustomFormat('CUSTOM', 'YYYY-MM-DD [at] HH:mm:ss');
console.log(formatter.format(new Date(), 'CUSTOM'));
// Output: 2023-12-01 at 12:00:00
```

## Timezone Support

The formatter supports timezone conversion using standard timezone identifiers:

```javascript
const utcTime = new Date('2023-12-01T12:00:00Z');

// Convert to different timezones
console.log(formatter.format(utcTime, 'READABLE_LONG', { 
    timezone: 'America/New_York' 
}));
console.log(formatter.format(utcTime, 'READABLE_LONG', { 
    timezone: 'Europe/London' 
}));
console.log(formatter.format(utcTime, 'READABLE_LONG', { 
    timezone: 'Asia/Tokyo' 
}));
```

## Error Handling

The formatter includes comprehensive error handling:

```javascript
try {
    formatter.format('invalid-date', 'ISO');
} catch (error) {
    console.error('Formatting error:', error.message);
}

// Check validity before formatting
if (formatter.isValidDate(userInput)) {
    const formatted = formatter.format(userInput, 'ISO');
} else {
    console.error('Invalid date input');
}
```

## Examples

### Basic Usage

```javascript
const formatter = new DateTimeFormatter();
const now = new Date();

// Different format examples
console.log(formatter.format(now, 'ISO'));           // 2023-12-01T12:00:00.000Z
console.log(formatter.format(now, 'US_DATE'));       // 12/01/2023
console.log(formatter.format(now, 'READABLE'));      // December 01, 2023
console.log(formatter.format(now, 'TIME_12'));       // 12:00:00 PM
```

### Working with Timestamps

```javascript
const timestamp = 1701432000000; // Milliseconds
const unixTime = 1701432000;     // Seconds

console.log(formatter.format(timestamp, 'READABLE'));
console.log(formatter.format(unixTime, 'READABLE'));
```

### Relative Time

```javascript
const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days

console.log(formatter.getRelativeTime(pastDate));   // "2 hours ago"
console.log(formatter.getRelativeTime(futureDate)); // "3 days from now"
```

### Custom Formats for Logging

```javascript
formatter.addCustomFormat('LOG', 'YYYY-MM-DD HH:mm:ss.sss');
formatter.addCustomFormat('FILENAME', 'YYYY-MM-DD_HHmmss');

console.log(formatter.format(now, 'LOG'));          // 2023-12-01 12:00:00.123
console.log(formatter.format(now, 'FILENAME'));     // 2023-12-01_120000
```

## Installation and Setup

### JavaScript
1. Include the `datetime-formatter.js` file in your project
2. Use in Node.js: `const DateTimeFormatter = require('./datetime-formatter.js');`
3. Use in browser: Include via script tag, access via `window.DateTimeFormatter`

### Python
1. Ensure you have Python 3.6+
2. Install optional dependency: `pip install pytz` (for enhanced timezone support)
3. Import: `from datetime_formatter import DateTimeFormatter`

## Dependencies

### JavaScript
- No external dependencies
- Works in Node.js and modern browsers

### Python
- Built-in `datetime` module
- Optional: `pytz` for enhanced timezone support

## License

This date-time formatter is provided as-is for educational and development purposes.
