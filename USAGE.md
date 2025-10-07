# Usage Examples for Utils.js

## Basic Debounce Usage

```javascript
// Import the debounce function
const { debounce } = require('./utils.js');

// Example 1: Search input debouncing
const searchInput = document.getElementById('search');
const performSearch = (query) => {
  console.log('Searching for:', query);
  // API call logic here
};

const debouncedSearch = debounce((event) => {
  performSearch(event.target.value);
}, 300);

searchInput.addEventListener('input', debouncedSearch);
```

```javascript
// Example 2: Window resize handling
const handleResize = () => {
  console.log('Window resized to:', window.innerWidth, 'x', window.innerHeight);
  // Layout recalculation logic here
};

const debouncedResize = debounce(handleResize, 250);
window.addEventListener('resize', debouncedResize);
```

```javascript
// Example 3: Button click protection (with immediate execution)
const saveButton = document.getElementById('save');
const saveData = () => {
  console.log('Saving data...');
  // Save logic here
};

const debouncedSave = debounce(saveData, 1000, true);
saveButton.addEventListener('click', debouncedSave);
```

## Browser Usage (without modules)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Debounce Example</title>
  <script src="utils.js"></script>
</head>
<body>
  <input type="text" id="search" placeholder="Type to search...">
  <script>
    const searchInput = document.getElementById('search');
    const performSearch = (query) => {
      console.log('Searching for:', query);
    };

    const debouncedSearch = Utils.debounce((event) => {
      performSearch(event.target.value);
    }, 300);

    searchInput.addEventListener('input', debouncedSearch);
  </script>
</body>
</html>
```
