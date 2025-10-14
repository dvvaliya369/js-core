"""
Python Date-Time Formatter
Comprehensive date-time formatting utility with timezone support
"""

from datetime import datetime, timezone, timedelta
import re
from typing import Union, Optional, Dict, Any

try:
    import pytz
    HAS_PYTZ = True
except ImportError:
    pytz = None
    HAS_PYTZ = False


class DateTimeFormatter:
    """
    Comprehensive Date-Time Formatter for Python
    Supports multiple input/output formats and timezone handling
    """
    
    def __init__(self, default_timezone: str = 'UTC', default_locale: str = 'en_US'):
        self.default_timezone = default_timezone
        self.default_locale = default_locale
        
        # Predefined format patterns
        self.formats = {
            # ISO formats
            'ISO': '%Y-%m-%dT%H:%M:%S.%fZ',
            'ISO_DATE': '%Y-%m-%d',
            'ISO_TIME': '%H:%M:%S',
            
            # US formats
            'US_DATE': '%m/%d/%Y',
            'US_DATETIME': '%m/%d/%Y %H:%M:%S',
            'US_SHORT': '%m/%d/%y',
            
            # European formats
            'EU_DATE': '%d/%m/%Y',
            'EU_DATETIME': '%d/%m/%Y %H:%M:%S',
            
            # Readable formats
            'READABLE': '%B %d, %Y',
            'READABLE_LONG': '%A, %B %d, %Y at %H:%M:%S',
            'READABLE_SHORT': '%b %d, %Y',
            
            # Time formats
            'TIME_12': '%I:%M:%S %p',
            'TIME_24': '%H:%M:%S',
            'TIME_SHORT': '%H:%M',
            
            # Common patterns
            'LOG_FORMAT': '%Y-%m-%d %H:%M:%S',
            'FILENAME': '%Y-%m-%d_%H%M%S'
        }

    def parse_input(self, input_date: Union[str, int, float, datetime]) -> datetime:
        """Parse input date from various formats"""
        if input_date is None:
            raise ValueError("Input date is required")

        # If already a datetime object
        if isinstance(input_date, datetime):
            return input_date

        # If it's a timestamp (number)
        if isinstance(input_date, (int, float)):
            # Assume seconds if < 1e12, otherwise milliseconds
            if input_date > 1e12:
                return datetime.fromtimestamp(input_date / 1000, tz=timezone.utc)
            else:
                return datetime.fromtimestamp(input_date, tz=timezone.utc)

        # If it's a string
        if isinstance(input_date, str):
            # Try parsing as ISO string first
            try:
                return datetime.fromisoformat(input_date.replace('Z', '+00:00'))
            except ValueError:
                pass
            
            # Try parsing as timestamp
            try:
                timestamp = float(input_date)
                if timestamp > 1e12:
                    return datetime.fromtimestamp(timestamp / 1000, tz=timezone.utc)
                else:
                    return datetime.fromtimestamp(timestamp, tz=timezone.utc)
            except ValueError:
                pass
            
            # Try common date formats
            common_formats = [
                '%Y-%m-%d %H:%M:%S',
                '%Y-%m-%d',
                '%m/%d/%Y',
                '%d/%m/%Y',
                '%m-%d-%Y',
                '%d-%m-%Y'
            ]
            
            for fmt in common_formats:
                try:
                    return datetime.strptime(input_date, fmt)
                except ValueError:
                    continue

        raise ValueError(f"Unable to parse date: {input_date}")

    def format(self, input_date: Union[str, int, float, datetime], 
               pattern: str = 'ISO', 
               timezone_name: Optional[str] = None) -> str:
        """Format date according to pattern"""
        try:
            date = self.parse_input(input_date)
            target_timezone = timezone_name or self.default_timezone
            
            # Convert to target timezone if specified
            if target_timezone and target_timezone != 'local':
                if HAS_PYTZ and pytz:
                    tz = pytz.timezone(target_timezone)
                    if date.tzinfo is None:
                        date = date.replace(tzinfo=timezone.utc)
                    date = date.astimezone(tz)
                else:
                    # Fallback for systems without pytz
                    if target_timezone == 'UTC' and date.tzinfo is None:
                        date = date.replace(tzinfo=timezone.utc)

            # Get the pattern string
            format_pattern = self.formats.get(pattern, pattern)
            
            # Handle special cases
            if pattern == 'UNIX':
                return str(int(date.timestamp()))
            elif pattern == 'UNIX_MS':
                return str(int(date.timestamp() * 1000))
            
            return date.strftime(format_pattern)
            
        except Exception as error:
            raise ValueError(f"Formatting failed: {str(error)}")

    def convert_timezone(self, input_date: Union[str, int, float, datetime], 
                        to_timezone: str) -> datetime:
        """Convert date to specified timezone"""
        date = self.parse_input(input_date)
        
        if not HAS_PYTZ or not pytz:
            # Simple UTC conversion if pytz not available
            if to_timezone == 'UTC':
                return date.replace(tzinfo=timezone.utc)
            else:
                return date  # Return as-is if can't convert
        
        # Convert using pytz
        if date.tzinfo is None:
            date = date.replace(tzinfo=timezone.utc)
        
        target_tz = pytz.timezone(to_timezone)
        return date.astimezone(target_tz)

    def get_available_formats(self) -> list:
        """Get list of available format names"""
        return list(self.formats.keys())

    def add_custom_format(self, name: str, pattern: str):
        """Add a custom format pattern"""
        self.formats[name] = pattern

    def is_valid_date(self, input_date: Union[str, int, float, datetime]) -> bool:
        """Validate if input can be parsed as a date"""
        try:
            self.parse_input(input_date)
            return True
        except (ValueError, TypeError):
            return False

    def get_relative_time(self, input_date: Union[str, int, float, datetime], 
                         base_date: Optional[datetime] = None) -> str:
        """Get relative time description (e.g., '2 hours ago')"""
        date = self.parse_input(input_date)
        base = base_date or datetime.now(timezone.utc)
        
        if isinstance(base, datetime) and base.tzinfo is None:
            base = base.replace(tzinfo=timezone.utc)
        if date.tzinfo is None:
            date = date.replace(tzinfo=timezone.utc)
        
        diff = base - date
        total_seconds = abs(diff.total_seconds())
        
        is_future = diff.total_seconds() < 0
        suffix = 'from now' if is_future else 'ago'
        
        if total_seconds < 60:
            return 'just now'
        elif total_seconds < 3600:  # Less than 1 hour
            minutes = int(total_seconds // 60)
            return f"{minutes} minute{'s' if minutes != 1 else ''} {suffix}"
        elif total_seconds < 86400:  # Less than 1 day
            hours = int(total_seconds // 3600)
            return f"{hours} hour{'s' if hours != 1 else ''} {suffix}"
        elif total_seconds < 604800:  # Less than 1 week
            days = int(total_seconds // 86400)
            return f"{days} day{'s' if days != 1 else ''} {suffix}"
        elif total_seconds < 2592000:  # Less than ~1 month
            weeks = int(total_seconds // 604800)
            return f"{weeks} week{'s' if weeks != 1 else ''} {suffix}"
        elif total_seconds < 31536000:  # Less than 1 year
            months = int(total_seconds // 2592000)
            return f"{months} month{'s' if months != 1 else ''} {suffix}"
        else:
            years = int(total_seconds // 31536000)
            return f"{years} year{'s' if years != 1 else ''} {suffix}"

    def format_duration(self, seconds: Union[int, float]) -> str:
        """Format duration in seconds to human readable format"""
        if seconds < 0:
            return f"-{self.format_duration(abs(seconds))}"
        
        units = [
            ('year', 31536000),
            ('month', 2592000),
            ('week', 604800),
            ('day', 86400),
            ('hour', 3600),
            ('minute', 60),
            ('second', 1)
        ]
        
        parts = []
        for unit_name, unit_seconds in units:
            if seconds >= unit_seconds:
                value = int(seconds // unit_seconds)
                seconds = seconds % unit_seconds
                parts.append(f"{value} {unit_name}{'s' if value != 1 else ''}")
        
        if not parts:
            return "0 seconds"
        
        if len(parts) == 1:
            return parts[0]
        elif len(parts) == 2:
            return f"{parts[0]} and {parts[1]}"
        else:
            return f"{', '.join(parts[:-1])}, and {parts[-1]}"


# Example usage and testing
if __name__ == "__main__":
    formatter = DateTimeFormatter()
    
    print("=== Python Date-Time Formatter Examples ===\n")
    
    # Basic examples
    now = datetime.now()
    print("1. Basic Formatting:")
    print(f"Current time: {now}")
    print(f"ISO format: {formatter.format(now, 'ISO')}")
    print(f"US format: {formatter.format(now, 'US_DATETIME')}")
    print(f"Readable: {formatter.format(now, 'READABLE_LONG')}")
    print()
    
    # Different inputs
    print("2. Different Input Types:")
    timestamp = 1640995200  # Jan 1, 2022
    print(f"From timestamp: {formatter.format(timestamp, 'READABLE')}")
    print(f"From ISO string: {formatter.format('2022-01-01T12:00:00Z', 'US_DATE')}")
    print()
    
    # Relative time
    print("3. Relative Time:")
    past_time = datetime.now() - timedelta(hours=2)
    future_time = datetime.now() + timedelta(days=3)
    print(f"2 hours ago: {formatter.get_relative_time(past_time)}")
    print(f"3 days from now: {formatter.get_relative_time(future_time)}")
    print()
    
    # Available formats
    print("4. Available Formats:")
    for fmt in formatter.get_available_formats():
        try:
            result = formatter.format(now, fmt)
            print(f"{fmt}: {result}")
        except Exception as e:
            print(f"{fmt}: Error - {e}")
    print()
    
    # Validation
    print("5. Validation:")
    print(f"Valid date: {formatter.is_valid_date('2022-01-01')}")
    print(f"Invalid date: {formatter.is_valid_date('invalid')}")
    print()
    
    # Duration formatting
    print("6. Duration Formatting:")
    print(f"3661 seconds: {formatter.format_duration(3661)}")
    print(f"90000 seconds: {formatter.format_duration(90000)}")
    print()
    
    print("=== Examples Complete ===")
