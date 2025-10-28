# JavaScript Core Utilities & Toast Component

A JavaScript project featuring utility functions and a modern toast notification component with a beautiful demo interface.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Components](#components)
- [Utility Functions](#utility-functions)
- [Usage Examples](#usage-examples)
- [Testing](#testing)
- [Browser Support](#browser-support)

## ✨ Features

- **Toast Notification System**: Modern, animated toast messages with multiple types (success, error, warning, info)
- **Debounce Utility**: Performance optimization function for rate-limiting function calls
- **Responsive Design**: Mobile-friendly interface with smooth animations
- **Zero Dependencies**: Pure vanilla JavaScript implementation
- **Multiple Module Systems**: Supports CommonJS, ES6 modules, and browser globals

## 📁 Project Structure

```
/vercel/sandbox/
├── index.html              # Demo page for toast component
├── script.js               # Toast manager implementation
├── styles.css              # Styling for toast component and demo
├── utils.js                # Utility functions (debounce)
├── test_utils.js           # Test suite for utility functions
├── TODO_utils_debounce.md  # Development notes
└── README.md               # This file
```

## 🚀 Getting Started

### Option 1: Open Directly in Browser

Simply open `index.html` in your web browser to see the toast component demo.

### Option 2: Use a Local Server

For a better development experience, use a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## 🎨 Components

### Toast Notification System

A fully-featured toast notification system with the following capabilities:

#### Features:
- **4 Toast Types**: Success, Error, Warning, Info
- **Auto-dismiss**: Configurable duration with visual progress bar
- **Manual Close**: Click the × button to dismiss
- **Smooth Animations**: Slide-in and slide-out effects
- **Stacking**: Multiple toasts stack vertically
- **Responsive**: Adapts to mobile screens

#### Toast Manager API:

```javascript
// Initialize (already done in script.js)
const toastManager = new ToastManager();

// Show toast with type and message
toastManager.showToast('success', 'Operation completed!', 5000);

// Convenience methods
toastManager.success('Success message');
toastManager.error('Error message');
toastManager.warning('Warning message');
toastManager.info('Info message');

// Remove specific toast
toastManager.removeToast(toastId);

// Remove all toasts
toastManager.removeAllToasts();
```

#### Global Function:

```javascript
// Simple global function for quick usage
showToast('success', 'Hello World!', 3000);
```

## 🛠️ Utility Functions

### Debounce Function

Delays function execution until after a specified wait time has elapsed since the last invocation. Perfect for optimizing performance on frequent events like scrolling, resizing, or typing.

#### Syntax:

```javascript
debounce(func, wait, immediate)
```

#### Parameters:

- `func` (Function): The function to debounce
- `wait` (Number): Milliseconds to delay
- `immediate` (Boolean, optional): If true, trigger on leading edge instead of trailing

#### Examples:

```javascript
// Basic usage - trailing edge (default)
const debouncedSearch = debounce(searchFunction, 300);
inputElement.addEventListener('input', debouncedSearch);

// Immediate execution - leading edge
const debouncedSave = debounce(saveFunction, 500, true);
saveButton.addEventListener('click', debouncedSave);

// Window resize handler
const handleResize = debounce(() => {
    console.log('Window resized!');
}, 250);
window.addEventListener('resize', handleResize);
```

## 💡 Usage Examples

### Using Toast in Your Project

Include the files in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Your content -->
    
    <!-- Toast Container -->
    <div id="toast-container" class="toast-container"></div>
    
    <script src="script.js"></script>
    <script>
        // Your code
        showToast('success', 'Welcome to the app!');
    </script>
</body>
</html>
```

### Using Debounce in Node.js

```javascript
const { debounce } = require('./utils.js');

const processData = (data) => {
    console.log('Processing:', data);
};

const debouncedProcess = debounce(processData, 300);

// Rapid calls - only last one executes after 300ms
debouncedProcess('data1');
debouncedProcess('data2');
debouncedProcess('data3');
```

### Using Debounce in Browser

```html
<script src="utils.js"></script>
<script>
    const handleInput = debounce((e) => {
        console.log('Input value:', e.target.value);
    }, 300);
    
    document.querySelector('input').addEventListener('input', handleInput);
</script>
```

## 🧪 Testing

Run the utility function tests:

```bash
node test_utils.js
```

Expected output:
- Test 1: Basic debouncing (trailing edge)
- Test 2: Immediate execution (leading edge)

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Code Quality

- **Clean Code**: Well-commented and documented
- **ES6+**: Modern JavaScript syntax
- **Modular**: Reusable components and utilities
- **Accessible**: ARIA labels and keyboard support
- **Responsive**: Mobile-first design approach

## 🎯 Use Cases

### Toast Component:
- Form submission feedback
- API response notifications
- User action confirmations
- Error handling and alerts
- Real-time updates

### Debounce Utility:
- Search input optimization
- Window resize handlers
- Scroll event listeners
- Auto-save functionality
- API call rate limiting

## 📄 License

This project is open source and available for educational and commercial use.

## 🤝 Contributing

Feel free to fork, modify, and use this code in your projects. Contributions and improvements are welcome!

---

**Made with ❤️ using Vanilla JavaScript**
