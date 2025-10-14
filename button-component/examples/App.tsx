import React, { useState } from 'react';
import { Button } from '../src/Button';

function App() {
  const [loading, setLoading] = useState(false);

  const handleAsyncAction = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Button Component Examples</h1>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2>Variants</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Sizes</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>States</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <Button disabled>Disabled</Button>
          <Button loading={loading} onClick={handleAsyncAction}>
            {loading ? 'Loading...' : 'Click to Load'}
          </Button>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>With Icons (using emoji)</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <Button variant="primary">
            ✓ Save
          </Button>
          <Button variant="danger">
            🗑️ Delete
          </Button>
          <Button variant="outline">
            📁 Open
          </Button>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Custom Styling</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <Button 
            variant="primary" 
            style={{ borderRadius: '9999px' }}
          >
            Rounded
          </Button>
          <Button 
            variant="outline" 
            className="custom-button"
            style={{ 
              borderRadius: '0',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          >
            Custom Style
          </Button>
        </div>
      </section>
    </div>
  );
}

export default App;
