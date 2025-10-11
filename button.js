/**
 * Reusable Button Component
 */

/**
 * Creates a reusable button element with customizable properties.
 *
 * @param {string} text - The text content of the button
 * @param {function} onClick - The click event handler function
 * @param {object} [options={}] - Optional configuration object
 * @param {string} [options.className=''] - CSS class name(s) for styling
 * @param {string} [options.id=''] - ID attribute for the button
 * @param {string} [options.type='button'] - Button type attribute
 * @param {boolean} [options.disabled=false] - Whether the button is disabled
 * @param {object} [options.style={}] - Inline styles object
 * @returns {HTMLButtonElement} The created button element
 *
 * @example
 * const myButton = createButton('Click me!', () => console.log('Button clicked!'), {
 *   className: 'btn btn-primary',
 *   id: 'my-btn',
 *   disabled: false
 * });
 * document.body.appendChild(myButton);
 */
const createButton = (text, onClick, options = {}) => {
    const button = document.createElement('button');

    // Set basic properties
    button.textContent = text;
    button.type = options.type || 'button';

    // Apply optional attributes
    if (options.className) button.className = options.className;
    if (options.id) button.id = options.id;
    if (options.disabled) button.disabled = options.disabled;

    // Apply inline styles if provided
    if (options.style) {
        Object.assign(button.style, options.style);
    }

    // Add click event listener
    button.addEventListener('click', onClick);

    return button;
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = { createButton };
} else if (typeof exports !== 'undefined') {
    // ES6 modules (for environments that support it)
    exports.createButton = createButton;
}

// Also make available globally if in browser
if (typeof window !== 'undefined') {
    window.createButton = createButton;
}