import React, { useState } from 'react';
import Button from './Button';
import './ButtonExamples.css';

// Example icons (using simple SVGs)
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
  </svg>
);

const ButtonExamples: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="button-examples">
      <h1>Button Component Examples</h1>
      
      <section className="example-section">
        <h2>Basic Variants</h2>
        <div className="button-group">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </section>

      <section className="example-section">
        <h2>Sizes</h2>
        <div className="button-group">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="example-section">
        <h2>With Icons</h2>
        <div className="button-group">
          <Button icon={<HeartIcon />}>Like</Button>
          <Button variant="outline" icon={<DownloadIcon />}>Download</Button>
          <Button variant="ghost" endIcon={<ArrowRightIcon />}>Continue</Button>
          <Button variant="primary" icon={<HeartIcon />} endIcon={<ArrowRightIcon />}>
            Love & Continue
          </Button>
        </div>
      </section>

      <section className="example-section">
        <h2>States</h2>
        <div className="button-group">
          <Button disabled>Disabled</Button>
          <Button 
            loading={loading}
            onClick={handleLoadingDemo}
            variant="primary"
          >
            {loading ? 'Loading...' : 'Click to Load'}
          </Button>
          <Button loading variant="secondary">Always Loading</Button>
        </div>
      </section>

      <section className="example-section">
        <h2>Full Width</h2>
        <div className="button-group button-group--vertical">
          <Button fullWidth variant="primary">Full Width Primary</Button>
          <Button fullWidth variant="outline">Full Width Outline</Button>
        </div>
      </section>

      <section className="example-section">
        <h2>Interactive Demo</h2>
        <div className="interactive-demo">
          <Button 
            variant="primary" 
            onClick={() => alert('Button clicked!')}
            icon={<HeartIcon />}
          >
            Click Me!
          </Button>
          <Button 
            variant="danger" 
            onClick={() => confirm('Are you sure?')}
          >
            Confirm Action
          </Button>
        </div>
      </section>

      <section className="example-section">
        <h2>Form Buttons</h2>
        <form className="demo-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div className="button-group">
            <Button type="submit" variant="primary">Submit</Button>
            <Button type="reset" variant="secondary">Reset</Button>
            <Button type="button" variant="ghost">Cancel</Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ButtonExamples;
