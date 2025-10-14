# Button Component

A flexible and customizable React Button component with TypeScript support.

## Features

- ✅ **Multiple Variants**: Primary, Secondary, Danger, Outline
- ✅ **Three Sizes**: Small, Medium, Large
- ✅ **Loading State**: Built-in spinner and loading indicator
- ✅ **Disabled State**: Proper accessibility and visual feedback
- ✅ **TypeScript Support**: Full type definitions included
- ✅ **Customizable**: Easy to style with CSS classes and inline styles
- ✅ **Accessible**: Proper ARIA attributes and keyboard navigation
- ✅ **Dark Mode**: CSS prefers-color-scheme support

## Installation

```bash
npm install button-component
```

## Basic Usage

```tsx
import { Button } from 'button-component';

function App() {
  return (
    <div>
      <Button variant="primary" size="medium">
        Click me!
      </Button>
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'outline'` | `'primary'` | Visual variant of the button |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the button |
| `loading` | `boolean` | `false` | Whether the button is in loading state |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `className` | `string` | `''` | Additional CSS class names |
| `children` | `React.ReactNode` | - | Button content |
| `...props` | `ButtonHTMLAttributes` | - | All other standard button props |

## Examples

### Variants

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button variant="outline">Outline</Button>
```

### Sizes

```tsx
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>
```

### Loading State

```tsx
const [loading, setLoading] = useState(false);

<Button 
  loading={loading} 
  onClick={() => setLoading(true)}
>
  {loading ? 'Loading...' : 'Click to Load'}
</Button>
```

### With Icons

```tsx
<Button variant="primary">
  ✓ Save
</Button>
<Button variant="danger">
  🗑️ Delete
</Button>
```

### Custom Styling

```tsx
<Button 
  variant="primary" 
  className="my-custom-button"
  style={{ borderRadius: '20px' }}
>
  Custom Button
</Button>
```

## CSS Classes

The component uses BEM-style CSS classes that you can override:

- `.btn` - Base button class
- `.btn--primary`, `.btn--secondary`, `.btn--danger`, `.btn--outline` - Variant classes
- `.btn--small`, `.btn--medium`, `.btn--large` - Size classes
- `.btn--loading` - Loading state class
- `.btn--disabled` - Disabled state class

## Customization

You can override the default styles by importing your own CSS after the component CSS:

```css
.btn--primary {
  background-color: #your-color;
}

.btn--large {
  padding: 1rem 2rem;
}
```

## TypeScript Support

The component comes with full TypeScript definitions:

```tsx
import { Button, ButtonProps, ButtonVariant, ButtonSize } from 'button-component';

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

## Accessibility

The Button component follows accessibility best practices:

- Proper focus management with visible focus indicators
- Disabled state handling with `aria-disabled`
- Loading state with appropriate `aria-label`
- Semantic HTML button element
- Keyboard navigation support

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- CSS custom properties support recommended

## License

MIT
