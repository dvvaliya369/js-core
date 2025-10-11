// Test file for the button component
const { createButton } = require('./button.js');

console.log('Testing button component...\n');

// Test 1: Basic button creation
console.log('Test 1: Basic button creation');
const button1 = createButton('Click me!', () => console.log('Button 1 clicked!'));
console.log(`Button text: "${button1.textContent}"`);
console.log(`Button type: "${button1.type}"`);
console.log(`Button disabled: ${button1.disabled}`);
console.log('Expected: text="Click me!", type="button", disabled=false\n');

// Test 2: Button with options
console.log('Test 2: Button with options');
const button2 = createButton('Submit', () => console.log('Button 2 clicked!'), {
    className: 'btn btn-primary',
    id: 'submit-btn',
    type: 'submit',
    disabled: true,
    style: { backgroundColor: 'blue', color: 'white' }
});
console.log(`Button text: "${button2.textContent}"`);
console.log(`Button type: "${button2.type}"`);
console.log(`Button class: "${button2.className}"`);
console.log(`Button id: "${button2.id}"`);
console.log(`Button disabled: ${button2.disabled}`);
console.log(`Button background color: ${button2.style.backgroundColor}`);
console.log('Expected: text="Submit", type="submit", class="btn btn-primary", id="submit-btn", disabled=true, background=blue\n');

// Test 3: Button click event
console.log('Test 3: Button click event');
let clickCount = 0;
const button3 = createButton('Increment', () => clickCount++);
console.log('Simulating click...');
button3.click();
button3.click();
console.log(`Click count: ${clickCount}`);
console.log('Expected: 2\n');

console.log('All tests completed!');