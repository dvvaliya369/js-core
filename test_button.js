// Test file for the button component
const { createButton } = require('./button.js');

console.log('Testing createButton function...\n');

// Test 1: Basic button creation
console.log('Test 1: Basic button creation');
const basicButton = createButton('Click Me', () => console.log('Button clicked!'));
console.log(`Button text: ${basicButton.textContent}`);
console.log(`Button tagName: ${basicButton.tagName}`);
console.log(`Button type: ${basicButton.type}`);
console.log('Expected: text="Click Me", tagName="BUTTON", type="button"\n');

// Test 2: Button with options
console.log('Test 2: Button with options');
const styledButton = createButton('Styled Button', () => {}, {
    className: 'btn btn-primary',
    id: 'my-button',
    type: 'submit',
    disabled: true,
    style: { color: 'red', fontSize: '16px' }
});
console.log(`Button className: ${styledButton.className}`);
console.log(`Button id: ${styledButton.id}`);
console.log(`Button type: ${styledButton.type}`);
console.log(`Button disabled: ${styledButton.disabled}`);
console.log(`Button color: ${styledButton.style.color}`);
console.log(`Button fontSize: ${styledButton.style.fontSize}`);
console.log('Expected: className="btn btn-primary", id="my-button", type="submit", disabled=true, color="red", fontSize="16px"\n');

// Test 3: Click event
console.log('Test 3: Click event');
let clickCount = 0;
const eventButton = createButton('Event Button', () => clickCount++);
eventButton.click();
eventButton.click();
console.log(`Click count: ${clickCount}`);
console.log('Expected: 2\n');

console.log('All tests completed.');