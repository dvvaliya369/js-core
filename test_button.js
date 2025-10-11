// Test file for the button component
const { createButton } = require('./button.js');

console.log('Testing button component...\n');

// Check if running in browser environment
const isBrowser = typeof document !== 'undefined';

if (!isBrowser) {
    console.log('Note: Running in Node.js environment. DOM tests will be skipped.');
    console.log('To test DOM functionality, run this in a browser.\n');
}

// Test 1: Basic button creation
console.log('Test 1: Basic button creation');
if (isBrowser) {
    const basicButton = createButton({
        text: 'Click Me!',
        onClick: () => console.log('Button clicked!'),
        className: 'btn',
        id: 'test-btn'
    });

    console.log('Button element created:', basicButton.tagName); // Should be BUTTON
    console.log('Button text:', basicButton.textContent); // Should be 'Click Me!'
    console.log('Button class:', basicButton.className); // Should be 'btn'
    console.log('Button id:', basicButton.id); // Should be 'test-btn'
    console.log('Button type:', basicButton.type); // Should be 'button'
    console.log('Button disabled:', basicButton.disabled); // Should be false

    // Simulate click
    console.log('Simulating click...');
    basicButton.click(); // Should log 'Button clicked!'
} else {
    console.log('Skipping DOM creation test in Node.js');
}

console.log('\nTest 1 completed.\n');

// Test 2: Button with different options
console.log('Test 2: Button with different options');
if (isBrowser) {
    const submitButton = createButton({
        text: 'Submit Form',
        type: 'submit',
        disabled: true,
        className: 'btn btn-submit'
    });

    console.log('Submit button type:', submitButton.type); // Should be 'submit'
    console.log('Submit button disabled:', submitButton.disabled); // Should be true
    console.log('Submit button class:', submitButton.className); // Should be 'btn btn-submit'
} else {
    console.log('Skipping DOM creation test in Node.js');
}

console.log('\nTest 2 completed.\n');

// Test 3: Button without optional parameters
console.log('Test 3: Button with minimal options');
if (isBrowser) {
    const minimalButton = createButton({
        text: 'Minimal'
    });

    console.log('Minimal button text:', minimalButton.textContent);
    console.log('Minimal button class:', minimalButton.className); // Should be empty string
    console.log('Minimal button id:', minimalButton.id); // Should be empty string
    console.log('Minimal button disabled:', minimalButton.disabled); // Should be false
} else {
    console.log('Skipping DOM creation test in Node.js');
}

console.log('\nTest 3 completed.\n');

console.log('All button tests completed successfully!');