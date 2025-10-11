/**
 * Utility functions
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds 
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @param {function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} [immediate=false] - If true, trigger the function on the leading edge instead of trailing
 * @returns {function} The debounced function
 * 
 * @example
 * const debouncedSave = debounce(saveData, 300);
 * debouncedSave(); // Will only execute after 300ms of no calls
 */
const debounce = (func, wait, immediate = false) => {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        
        const callNow = immediate && !timeout;
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(this, args);
    };
};

/**
 * Creates a reusable button element with customizable options.
 *
 * @param {Object} options - Configuration options for the button
 * @param {string} [options.text] - The text content of the button
 * @param {string} [options.className] - CSS class name(s) for styling
 * @param {function} [options.onClick] - Click event handler function
 * @param {string} [options.id] - ID attribute for the button
 * @param {boolean} [options.disabled=false] - Whether the button is disabled
 * @param {string} [options.type='button'] - Button type attribute
 * @returns {HTMLButtonElement} The created button element
 *
 * @example
 * const myButton = createButton({
 *     text: 'Click me',
 *     className: 'btn btn-primary',
 *     onClick: () => console.log('Button clicked!'),
 *     id: 'my-btn'
 * });
 * document.body.appendChild(myButton);
 */
const createButton = (options = {}) => {
    const button = document.createElement('button');

    if (options.text) {
        button.textContent = options.text;
    }

    if (options.className) {
        button.className = options.className;
    }

    if (options.onClick && typeof options.onClick === 'function') {
        button.addEventListener('click', options.onClick);
    }

    if (options.id) {
        button.id = options.id;
    }

    if (options.disabled) {
        button.disabled = true;
    }

    if (options.type) {
        button.type = options.type;
    } else {
        button.type = 'button';
    }

    return button;
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = { debounce, createButton };
} else if (typeof exports !== 'undefined') {
    // ES6 modules (for environments that support it)
    exports.debounce = debounce;
    exports.createButton = createButton;
}

// Also make available globally if in browser
if (typeof window !== 'undefined') {
    window.debounce = debounce;
    window.createButton = createButton;
}
