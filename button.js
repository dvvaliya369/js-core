/**
 * Creates a reusable button element with customizable properties.
 *
 * @param {Object} options - Configuration options for the button
 * @param {string} options.text - The text content of the button
 * @param {Function} [options.onClick] - The click event handler
 * @param {string} [options.className] - CSS class name(s) for styling
 * @param {string} [options.id] - ID attribute for the button
 * @param {boolean} [options.disabled=false] - Whether the button is disabled
 * @param {string} [options.type='button'] - The button type (button, submit, reset)
 * @returns {HTMLButtonElement} The created button element
 *
 * @example
 * const myButton = createButton({
 *     text: 'Click me!',
 *     onClick: () => console.log('Button clicked!'),
 *     className: 'btn btn-primary',
 *     id: 'my-button'
 * });
 * document.body.appendChild(myButton);
 */
const createButton = (options) => {
    const {
        text,
        onClick,
        className = '',
        id = '',
        disabled = false,
        type = 'button'
    } = options;

    const button = document.createElement('button');
    button.textContent = text;
    button.type = type;
    button.disabled = disabled;

    if (className) {
        button.className = className;
    }

    if (id) {
        button.id = id;
    }

    if (onClick && typeof onClick === 'function') {
        button.addEventListener('click', onClick);
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