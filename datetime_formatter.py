#!/usr/bin/env python3
"""
Date Time Formatter Utility

A comprehensive utility for formatting dates and times in various formats.
Supports multiple regional formats, custom patterns, and conversion between formats.
"""

import datetime
from typing import Optional, Dict, List


class DateTimeFormatter:
    """A utility class for formatting dates and times in various formats."""
    
    # Predefined format patterns
    FORMATS = {
        'iso': '%Y-%m-%d %H:%M:%S',
        'iso_date': '%Y-%m-%d',
        'iso_time': '%H:%M:%S',
        'us': '%m/%d/%Y %I:%M:%S %p',
        'us_date': '%m/%d/%Y',
        'us_time': '%I:%M:%S %p',
        'european': '%d/%m/%Y %H:%M:%S',
        'european_date': '%d/%m/%Y',
        'european_time': '%H:%M:%S',
        'long': '%A, %B %d, %Y at %I:%M:%S %p',
        'short': '%b %d, %Y %I:%M %p',
        'compact': '%Y%m%d_%H%M%S',
        'readable': '%B %d, %Y - %H:%M',
        'filename_safe': '%Y-%m-%d_%H-%M-%S',
        'rfc2822': '%a, %d %b %Y %H:%M:%S %z',
        'timestamp': None  # Special case for Unix timestamp
    }
    
    def __init__(self):
        """Initialize the DateTimeFormatter."""
        self.current_time = datetime.datetime.now()
    
    def get_current_time(self, format_name: str = 'iso') -> str:
        """
        Get the current date and time in the specified format.
        
        Args:
            format_name: The name of the format to use (from FORMATS dict)
            
        Returns:
            Formatted current date and time string
        """
        if format_name == 'timestamp':
            return str(int(self.current_time.timestamp()))
        
        format_pattern = self.FORMATS.get(format_name, self.FORMATS['iso'])
        return self.current_time.strftime(format_pattern)
    
    def format_datetime(self, dt: datetime.datetime, format_name: str = 'iso') -> str:
        """
        Format a datetime object using the specified format.
        
        Args:
            dt: The datetime object to format
            format_name: The name of the format to use
            
        Returns:
            Formatted date and time string
        """
        if format_name == 'timestamp':
            return str(int(dt.timestamp()))
        
        format_pattern = self.FORMATS.get(format_name, self.FORMATS['iso'])
        return dt.strftime(format_pattern)
    
    def parse_and_format(self, date_string: str, input_format: str, 
                        output_format: str = 'iso') -> str:
        """
        Parse a date string and convert it to a different format.
        
        Args:
            date_string: The input date string
            input_format: The format of the input string (strftime pattern)
            output_format: The desired output format name
            
        Returns:
            Reformatted date string
        """
        try:
            dt = datetime.datetime.strptime(date_string, input_format)
            return self.format_datetime(dt, output_format)
        except ValueError as e:
            return f"Error parsing date: {e}"
    
    def get_available_formats(self) -> Dict[str, str]:
        """
        Get all available format names and their patterns.
        
        Returns:
            Dictionary mapping format names to their patterns
        """
        return {name: pattern for name, pattern in self.FORMATS.items() 
                if pattern is not None}
    
    def custom_format(self, dt: Optional[datetime.datetime] = None, 
                     pattern: str = '%Y-%m-%d %H:%M:%S') -> str:
        """
        Format a datetime using a custom strftime pattern.
        
        Args:
            dt: The datetime object (uses current time if None)
            pattern: Custom strftime pattern
            
        Returns:
            Formatted date string
        """
        if dt is None:
            dt = self.current_time
        return dt.strftime(pattern)
    
    def format_examples(self) -> List[str]:
        """
        Generate examples of all available formats using current time.
        
        Returns:
            List of formatted examples
        """
        examples = []
        for format_name in self.FORMATS:
            formatted = self.get_current_time(format_name)
            examples.append(f"{format_name:15}: {formatted}")
        return examples


def main():
    """Main function to demonstrate the DateTimeFormatter."""
    formatter = DateTimeFormatter()
    
    print("=" * 60)
    print("DATE TIME FORMATTER UTILITY")
    print("=" * 60)
    print()
    
    # Current time in all formats
    print("CURRENT DATE/TIME IN ALL FORMATS:")
    print("-" * 40)
    for example in formatter.format_examples():
        print(example)
    
    print()
    print("CUSTOM FORMAT EXAMPLES:")
    print("-" * 40)
    
    # Custom format examples
    custom_formats = [
        ('%A, %B %d, %Y', 'Full weekday and month'),
        ('%y-%m-%d', 'Short year format'),
        ('%d-%b-%Y %H:%M', 'Day-Month-Year with 24h time'),
        ('%I:%M %p on %m/%d', 'Time with AM/PM and short date'),
        ('Week %U of %Y', 'Week number of year'),
        ('%j days into %Y', 'Day of year')
    ]
    
    for pattern, description in custom_formats:
        formatted = formatter.custom_format(pattern=pattern)
        print(f"{description:30}: {formatted}")
    
    print()
    print("FORMAT CONVERSION EXAMPLE:")
    print("-" * 40)
    
    # Example of converting between formats
    sample_date = "2023-12-25 15:30:45"
    print(f"Original (ISO format): {sample_date}")
    
    conversions = [
        ('us', 'US format'),
        ('european', 'European format'),
        ('long', 'Long format'),
        ('compact', 'Compact format')
    ]
    
    for format_name, description in conversions:
        converted = formatter.parse_and_format(
            sample_date, '%Y-%m-%d %H:%M:%S', format_name
        )
        print(f"{description:20}: {converted}")


if __name__ == "__main__":
    main()
