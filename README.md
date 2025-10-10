# Button Component

A comprehensive, accessible, and customizable React Button component built with TypeScript and modern CSS.

## Features

- ✅ **Multiple Variants**: Primary, Secondary, Outline, Ghost, Danger
- ✅ **Size Options**: Small, Medium, Large
- ✅ **Loading States**: Built-in spinner with smooth animations
- ✅ **Icon Support**: Start and end icons with proper spacing
- ✅ **Accessibility**: Full ARIA support and keyboard navigation
- ✅ **TypeScript**: Complete type safety with detailed interfaces
- ✅ **Responsive**: Mobile-first design with responsive breakpoints
- ✅ **Theming**: CSS custom properties for easy customization
- ✅ **Dark Mode**: Automatic dark theme support
- ✅ **Animations**: Smooth transitions and hover effects
- ✅ **Disabled States**: Proper disabled styling and behavior
- ✅ **Full Width**: Option for full-width buttons
- ✅ **Form Support**: Works with form submission and validation

## Installation

```bash
npm install button-component
# or
yarn add button-component
```

## Usage

### Basic Usage

```tsx
import React from 'react';
import Button from './Button';

function App() {
  return (
    <div>
      <Button variant="primary" onClick={() => console.log('Clicked!')}>
        Click Me
      </Button>
    </div>
  );
}
```

### With Icons

```tsx
import Button from './Button';

const HeartIcon = () => <svg>...</svg>;
const ArrowIcon = () => <svg>...</svg>;

function Example() {
  return (
    <div>
      <Button icon={<HeartIcon />}>Like</Button>
      <Button endIcon={<ArrowIcon />}>Continue</Button>
    </div>
  );
}
```

### Loading State

```tsx
import { useState } from 'react';
import Button from './Button';

function LoadingExample() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await someAsyncOperation();
    setLoading(false);
  };

  return (
    <Button loading={loading} onClick={handleClick}>
      {loading ? 'Saving...' : 'Save'}
    </Button>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Whether button is disabled |
| `loading` | `boolean` | `false` | Whether button is in loading state |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type attribute |
| `onClick` | `(event: React.MouseEvent<HTMLButtonElement>) => void` | - | Click handler |
| `children` | `React.ReactNode` | - | Button content |
| `className` | `string` | `''` | Additional CSS classes |
| `fullWidth` | `boolean` | `false` | Whether button takes full width |
| `icon` | `React.ReactNode` | - | Icon before text |
| `endIcon` | `React.ReactNode` | - | Icon after text |

## Variants

### Primary
The main call-to-action button with solid background.

```tsx
<Button variant="primary">Primary Button</Button>
```

### Secondary
Secondary action button with muted styling.

```tsx
<Button variant="secondary">Secondary Button</Button>
```

### Outline
Button with transparent background and colored border.

```tsx
<Button variant="outline">Outline Button</Button>
```

### Ghost
Minimal button with no background or border.

```tsx
<Button variant="ghost">Ghost Button</Button>
```

### Danger
For destructive actions with red styling.

```tsx
<Button variant="danger">Delete</Button>
```

## Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

## Styling

The component uses CSS custom properties for easy theming:

```css
:root {
  --btn-primary: #007bff;
  --btn-primary-hover: #0056b3;
  --btn-font-family: your-font-family;
  --btn-border-radius: 8px;
  /* ... more variables */
}
```

### Dark Mode

Dark mode is automatically applied based on the user's system preference:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --btn-primary: #0d6efd;
    /* ... dark theme variables */
  }
}
```

## Accessibility

The Button component includes comprehensive accessibility features:

- ✅ Proper ARIA attributes
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Focus indicators
- ✅ Disabled state handling
- ✅ Loading state announcements

## Examples

Check out the complete examples:

- **React Examples**: See `ButtonExamples.tsx`
- **HTML Demo**: Open `button-demo.html` in your browser

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

```bash
# Install dependencies
npm install

# Type checking
npm run type-check

# Build
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Your Name]

---

## File Structure

```
button-component/
├── Button.tsx              # Main component
├── Button.css              # Component styles
├── ButtonExamples.tsx      # React usage examples
├── ButtonExamples.css      # Example styles
├── button-demo.html        # HTML demo
├── package.json            # Package configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```
