# Side Panel Component

A modern, responsive side panel component built with HTML, CSS, and JavaScript. Features smooth animations, mobile-responsive design, and accessibility support.

## Features

- ✨ Smooth slide-in/slide-out animations
- 📱 Fully responsive design (mobile-friendly)
- ♿ Accessibility features (keyboard navigation, focus management)
- 🎨 Modern, clean design with hover effects
- 🔧 Easy to customize and integrate
- 🌙 Theme support (light/dark mode ready)
- 📱 Mobile-optimized (full-width on small screens)

## Files

- `index.html` - Main HTML structure and demo content
- `style.css` - Complete CSS styling with animations and responsive design
- `script.js` - JavaScript functionality with advanced features
- `README.md` - This documentation file

## Usage

### Basic Setup

1. Include all three files in your project
2. Open `index.html` in a web browser
3. Click the hamburger menu (☰) to open the side panel

### Integration

To integrate into your existing project:

1. Copy the side panel HTML structure:
```html
<button class="panel-toggle" id="panelToggle">
    <span class="hamburger"></span>
</button>

<div class="overlay" id="overlay"></div>

<div class="side-panel" id="sidePanel">
    <!-- Panel content -->
</div>
```

2. Include the CSS and JavaScript files
3. Initialize the panel:
```javascript
const sidePanel = new SidePanel();
```

### Customization

#### Colors and Styling
Modify the CSS variables in `style.css`:
```css
:root {
    --panel-width: 320px;
    --panel-bg: white;
    --header-bg: #2c3e50;
    --text-color: #333;
}
```

#### Panel Content
Replace the navigation items in the HTML with your own content.

### JavaScript API

The SidePanel class provides several methods:

```javascript
// Open the panel
sidePanel.open();

// Close the panel
sidePanel.close();

// Toggle the panel
sidePanel.toggle();

// Get panel state
const state = sidePanel.getState();
console.log(state.isOpen); // true/false
```

### Utility Functions

Additional utility functions are available:

```javascript
// Add loading state to an element
PanelUtils.addLoadingState(element);

// Remove loading state
PanelUtils.removeLoadingState(element);

// Add notification badge
PanelUtils.addBadge(element, '5');

// Smooth scroll to section
PanelUtils.scrollToSection('about');
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- IE11+ (with some CSS fallbacks)

## Accessibility Features

- Keyboard navigation (Tab, Shift+Tab, Escape)
- Focus management
- Screen reader friendly
- High contrast support
- Touch-friendly controls

## Mobile Optimization

- Full-width panel on screens < 480px
- Touch-friendly button sizes
- Optimized animations for mobile
- Prevents background scrolling when open

## Animation Details

- Smooth 0.3s CSS transitions
- Transform-based animations for better performance
- Hamburger icon animation
- Hover effects on navigation items

## Customization Examples

### Change Panel Width
```css
.side-panel {
    width: 250px;
    left: -250px;
}
```

### Add Icons to Navigation
```html
<li><a href="#home"><i class="icon-home"></i> Home</a></li>
```

### Different Animation Timing
```css
.side-panel {
    transition: left 0.5s ease-in-out;
}
```

## Demo

Open `index.html` in your browser to see the side panel in action. The demo includes:

- Toggle functionality
- Sample navigation items
- Responsive behavior
- Smooth animations
- Social media links section

## License

This project is open source and available under the MIT License.
