# js-core
A code repo for JS Basics

## Utils

This repository includes a comprehensive set of utilities in the `utils/` directory.

### Date-Time Formatter

A powerful date and time formatting utility with the following features:

- **Multiple format types**: ISO, short, medium, long, full, time, and datetime formats
- **Custom format strings**: Use tokens like `YYYY-MM-DD HH:mm:ss` for custom patterns
- **Timezone support**: Format dates in any timezone
- **Locale support**: Format dates according to different locales
- **Relative time**: Get human-readable relative time strings (e.g., "2 hours ago")
- **Error handling**: Comprehensive validation and error messages

#### Quick Example

```javascript
const { formatDate, customFormatDate } = require('./utils');

const date = new Date();
console.log(formatDate(date, 'medium')); // Oct 8, 2024
console.log(customFormatDate(date, 'YYYY-MM-DD')); // 2024-10-08
```

See `utils/README.md` for complete documentation and examples.
