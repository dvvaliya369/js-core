/**
 * Debounce Function Usage Examples
 * Demonstrates how to use the debounce utility function
 */

const { debounce } = require('./dateTimeFormatter');

// Example 1: Basic debounce usage
console.log('Example 1: Basic debounce usage');
console.log('===============================');

const searchFunction = (query) => {
    console.log(`Searching for: ${query}`);
};

const debouncedSearch = debounce(searchFunction, 500);

// Simulate rapid calls - only the last one should execute
console.log('Rapid calls (only last should execute after 500ms):');
debouncedSearch('a');
debouncedSearch('ap');
debouncedSearch('app');
debouncedSearch('apple');

setTimeout(() => {
    console.log('\n--- After 600ms ---\n');
    
    // Example 2: Debounce with immediate execution
    console.log('Example 2: Immediate execution (leading edge)');
    console.log('============================================');
    
    const logFunction = (message) => {
        console.log(`Log: ${message}`);
    };
    
    const immediateDebounced = debounce(logFunction, 300, { immediate: true });
    
    console.log('Rapid calls with immediate=true (first should execute immediately):');
    immediateDebounced('First call');
    immediateDebounced('Second call');
    immediateDebounced('Third call');
    
    setTimeout(() => {
        console.log('\n--- After another 400ms ---\n');
        
        // Example 3: Using debounce utility methods
        console.log('Example 3: Utility methods');
        console.log('=========================');
        
        const utilityFunction = (data) => {
            console.log(`Processing: ${data}`);
        };
        
        const utilityDebounced = debounce(utilityFunction, 1000);
        
        utilityDebounced('data1');
        console.log('Is pending?', utilityDebounced.pending()); // true
        
        // Cancel the pending execution
        utilityDebounced.cancel();
        console.log('After cancel - Is pending?', utilityDebounced.pending()); // false
        
        // Schedule another execution and force it immediately
        utilityDebounced('data2');
        console.log('Forcing execution with flush()...');
        utilityDebounced.flush();
        console.log('Is pending after flush?', utilityDebounced.pending()); // false
        
    }, 400);
    
}, 600);

// Example 4: Practical use case - Form validation
setTimeout(() => {
    console.log('\n--- After 1200ms ---\n');
    console.log('Example 4: Practical use case - Form validation');
    console.log('===============================================');
    
    const validateEmail = (email) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        console.log(`Validating email: ${email} - ${isValid ? 'Valid' : 'Invalid'}`);
        return isValid;
    };
    
    const debouncedValidation = debounce(validateEmail, 250);
    
    // Simulate typing in an email field
    const emailInputs = ['u', 'us', 'use', 'user', 'user@', 'user@ex', 'user@example.com'];
    
    emailInputs.forEach((input, index) => {
        setTimeout(() => {
            debouncedValidation(input);
        }, index * 50); // Simulate fast typing
    });
    
}, 1200);

// Example 5: Error handling
setTimeout(() => {
    console.log('\n--- After 1800ms ---\n');
    console.log('Example 5: Error handling');
    console.log('=========================');
    
    try {
        // This should throw an error
        debounce('not a function', 100);
    } catch (error) {
        console.log('Expected error:', error.message);
    }
    
    try {
        // This should throw an error
        debounce(() => {}, -100);
    } catch (error) {
        console.log('Expected error:', error.message);
    }
    
}, 1800);
