/**
 * Reusable Button Component
 */

/**
 * Creates a reusable button element with customizable options.
 *
 * @param {string} text - The text content of the button
 * @param {function} onClick - The click event handler function
 * @param {object} [options={}] - Optional configuration object
 * @param {string} [options.className] - CSS class name for styling
 * @param {string} [options.id] - ID attribute for the button
 * @param {string} [options.type='button'] - Button type attribute
 * @param {boolean} [options.disabled=false] - Whether the button is disabled
 * @param {object} [options.style] - Inline styles object
 * @returns {HTMLButtonElement} The created button element
 *
 * @example
 * const myButton = createButton('Click me!', () => console.log('Button clicked!'), {
 *   className: 'btn btn-primary',
 *   id: 'my-btn'
 * });
 * document.body.appendChild(myButton);
 */
const createButton = (text, onClick, options = {}) => {
    const button = document.createElement('button');

    // Set text content
    button.textContent = text;

    // Add click event listener
    if (onClick && typeof onClick === 'function') {
        button.addEventListener('click', onClick);
    }

    // Apply options
    if (options.className) {
        button.className = options.className;
    }

    if (options.id) {
        button.id = options.id;
    }

    if (options.type) {
        button.type = options.type;
    } else {
        button.type = 'button'; // Default type
    }

    if (options.disabled) {
        button.disabled = options.disabled;
    }

    if (options.style && typeof options.style === 'object') {
        Object.assign(button.style, options.style);
    }

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