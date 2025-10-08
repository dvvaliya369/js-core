# Date-Time Formatter Usage Examples

## Quick Start

```javascript
// Import the utility functions
const { formatDate, customFormatDate, formatForLocale, getRelativeTime } = require('./utils');

// Basic usage
const date = new Date();
console.log(formatDate(date, 'short')); // 10/8/24
console.log(formatDate(date, 'medium')); // Oct 8, 2024
console.log(customFormatDate(date, 'YYYY-MM-DD')); // 2024-10-08
```

## Available Format Types

### Predefined Formats
- `'iso'` - ISO 8601 format (2023-12-25T15:30:45.123Z)
- `'short'` - Short date format (12/25/23)
- `'medium'` - Medium date format (Dec 25, 2023)
- `'long'` - Long date format (December 25, 2023)
- `'full'` - Full date format (Monday, December 25, 2023)
- `'time'` - Time only (3:30:45 PM)
- `'datetime'` - Date and time (Dec 25, 2023, 3:30 PM)

### Custom Format Tokens
- `YYYY` - 4-digit year (2023)
- `YY` - 2-digit year (23)
- `MM` - 2-digit month (12)
- `M` - Month without leading zero (12)
- `DD` - 2-digit day (25)
- `D` - Day without leading zero (25)
- `HH` - 24-hour format hour (15)
- `H` - 24-hour format hour without leading zero (15)
- `mm` - Minutes with leading zero (30)
- `m` - Minutes without leading zero (30)
- `ss` - Seconds with leading zero (45)
- `s` - Seconds without leading zero (45)
- `SSS` - Milliseconds (123)

## Advanced Examples

### Timezone Handling
```javascript
const { DateTimeFormatter } = require('./utils');

const formatter = new DateTimeFormatter();

// Format for different timezones
const date = new Date();
console.log(formatter.format(date, 'datetime', { timezone: 'UTC' }));
console.log(formatter.format(date, 'datetime', { timezone: 'Asia/Tokyo' }));
console.log(formatter.format(date, 'datetime', { timezone: 'America/New_York' }));
```

### Locale-Specific Formatting
```javascript
const date = new Date();

// Different locales
console.log(formatForLocale(date, 'en-US', { dateStyle: 'full' }));
console.log(formatForLocale(date, 'de-DE', { dateStyle: 'full' }));
console.log(formatForLocale(date, 'ja-JP', { dateStyle: 'full' }));
```

### Relative Time
```javascript
const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

console.log(getRelativeTime(pastDate)); // "2 hours ago"
console.log(getRelativeTime(futureDate)); // "in 3 days"
```

### Custom Format Patterns
```javascript
const date = new Date();

// Various custom formats
console.log(customFormatDate(date, 'YYYY-MM-DD')); // 2024-10-08
console.log(customFormatDate(date, 'DD/MM/YYYY HH:mm:ss')); // 08/10/2024 22:09:37
console.log(customFormatDate(date, 'M/D/YY H:mm')); // 10/8/24 22:09
console.log(customFormatDate(date, 'YYYY-MM-DD HH:mm:ss.SSS')); // 2024-10-08 22:09:37.123
```

## Error Handling

The formatter includes comprehensive error handling:

```javascript
try {
  formatDate('invalid date', 'short');
} catch (error) {
  console.log(error.message); // "Invalid date provided"
}

try {
  formatDate(new Date(), 'invalid_format');
} catch (error) {
  console.log(error.message); // "Unknown format type: invalid_format"
}
```

## Class-based Usage

For more advanced scenarios, use the `DateTimeFormatter` class directly:

```javascript
const { DateTimeFormatter } = require('./utils');

const formatter = new DateTimeFormatter();

// Set default timezone and locale
formatter.setDefaultTimezone('America/New_York');
formatter.setDefaultLocale('en-US');

// Get available timezones
console.log(formatter.getAvailableTimezones());

// Get current timezone
console.log(formatter.getCurrentTimezone());
```
