/**
 * Throttle Function Usage Examples
 * Demonstrates various ways to use the throttle function
 */

const { throttle } = require('./dateTimeFormatter');

/**
 * Example 1: Basic throttling - API call throttling
 */
function basicThrottleExample() {
    console.log('=== Basic Throttle Example ===');
    
    // Simulate an API call
    const apiCall = (data) => {
        console.log(`API called with: ${data} at ${new Date().toLocaleTimeString()}`);
        return `Response for ${data}`;
    };

    // Create throttled version - maximum one call per 2 seconds
    const throttledApiCall = throttle(apiCall, 2000);

    // Simulate rapid calls
    console.log('Making rapid API calls...');
    throttledApiCall('request-1');
    throttledApiCall('request-2');
    throttledApiCall('request-3');
    
    setTimeout(() => throttledApiCall('request-4'), 500);
    setTimeout(() => throttledApiCall('request-5'), 1000);
    setTimeout(() => throttledApiCall('request-6'), 2500);
    setTimeout(() => throttledApiCall('request-7'), 3000);
}

/**
 * Example 2: Scroll event throttling
 */
function scrollThrottleExample() {
    console.log('\n=== Scroll Event Throttle Example ===');
    
    let scrollCount = 0;
    const handleScroll = () => {
        scrollCount++;
        console.log(`Scroll handler called ${scrollCount} times`);
    };

    // Throttle scroll events to execute at most once every 100ms
    const throttledScroll = throttle(handleScroll, 100);

    // Simulate rapid scroll events
    console.log('Simulating rapid scroll events...');
    for (let i = 0; i < 10; i++) {
        setTimeout(() => throttledScroll(), i * 10); // Every 10ms
    }
    
    // One more after the throttle period
    setTimeout(() => throttledScroll(), 200);
}

/**
 * Example 3: Throttle with leading and trailing options
 */
function throttleOptionsExample() {
    console.log('\n=== Throttle Options Example ===');
    
    const logMessage = (message) => {
        console.log(`${message} at ${new Date().toLocaleTimeString()}.${Date.now() % 1000}`);
    };

    // Only leading edge (immediate execution, then silence)
    const leadingOnly = throttle(() => logMessage('Leading only'), 1000, { 
        leading: true, 
        trailing: false 
    });

    // Only trailing edge (wait, then execute once)
    const trailingOnly = throttle(() => logMessage('Trailing only'), 1000, { 
        leading: false, 
        trailing: true 
    });

    // Both leading and trailing (default)
    const bothEdges = throttle(() => logMessage('Both edges'), 1000);

    console.log('Testing different throttle options...');
    
    // Test leading only
    console.log('\nLeading only:');
    leadingOnly();
    leadingOnly();
    leadingOnly();
    
    setTimeout(() => {
        console.log('\nTrailing only:');
        trailingOnly();
        trailingOnly();
        trailingOnly();
    }, 1500);

    setTimeout(() => {
        console.log('\nBoth edges:');
        bothEdges();
        bothEdges();
        bothEdges();
    }, 3000);
}

/**
 * Example 4: Throttle utility methods
 */
function throttleUtilityMethodsExample() {
    console.log('\n=== Throttle Utility Methods Example ===');
    
    const expensiveOperation = (data) => {
        console.log(`Expensive operation executed with: ${data}`);
        return `Result: ${data}`;
    };

    const throttledOperation = throttle(expensiveOperation, 2000);

    console.log('Testing utility methods...');
    
    // Test pending method
    console.log('Is pending:', throttledOperation.pending()); // false
    
    throttledOperation('test-1');
    console.log('Is pending after first call:', throttledOperation.pending()); // true
    
    // Test flush method
    setTimeout(() => {
        console.log('Flushing throttled function...');
        const result = throttledOperation.flush();
        console.log('Flush result:', result);
        console.log('Is pending after flush:', throttledOperation.pending());
    }, 1000);

    // Test cancel method
    setTimeout(() => {
        console.log('\nTesting cancel...');
        throttledOperation('test-2');
        console.log('Is pending:', throttledOperation.pending());
        
        setTimeout(() => {
            throttledOperation.cancel();
            console.log('Cancelled. Is pending:', throttledOperation.pending());
        }, 500);
    }, 3000);
}

/**
 * Example 5: Throttle vs Debounce comparison
 */
function throttleVsDebounceExample() {
    console.log('\n=== Throttle vs Debounce Comparison ===');
    
    const { debounce } = require('./dateTimeFormatter');
    
    let throttleCount = 0;
    let debounceCount = 0;
    
    const throttledFunction = throttle(() => {
        throttleCount++;
        console.log(`Throttled function called ${throttleCount} times`);
    }, 1000);

    const debouncedFunction = debounce(() => {
        debounceCount++;
        console.log(`Debounced function called ${debounceCount} times`);
    }, 1000);

    console.log('Calling both functions rapidly...');
    
    // Call both functions rapidly
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            throttledFunction();
            debouncedFunction();
        }, i * 200);
    }

    // Summary after all calls
    setTimeout(() => {
        console.log('\n--- Final Results ---');
        console.log(`Throttle executed: ${throttleCount} times`);
        console.log(`Debounce executed: ${debounceCount} times`);
        console.log('\nThrottle: Executes at regular intervals during rapid calls');
        console.log('Debounce: Waits for calm period, then executes once');
    }, 3000);
}

/**
 * Example 6: Real-world use case - Button click throttling
 */
function buttonClickThrottleExample() {
    console.log('\n=== Button Click Throttle Example ===');
    
    let clickCount = 0;
    let processedCount = 0;
    
    const processFormSubmit = () => {
        processedCount++;
        console.log(`Form submitted! (Processing count: ${processedCount})`);
        console.log('Sending data to server...');
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('Server response received');
                resolve('success');
            }, 500);
        });
    };

    // Throttle form submissions to prevent double-submission
    const throttledSubmit = throttle(processFormSubmit, 2000);

    // Simulate rapid button clicks
    console.log('Simulating rapid form submission attempts...');
    
    const simulateClick = () => {
        clickCount++;
        console.log(`Button clicked ${clickCount} times`);
        throttledSubmit();
    };

    // Rapid clicks
    simulateClick();
    setTimeout(simulateClick, 100);
    setTimeout(simulateClick, 200);
    setTimeout(simulateClick, 300);
    
    // Click after throttle period
    setTimeout(simulateClick, 2500);
    
    setTimeout(() => {
        console.log(`\nSummary: ${clickCount} clicks, ${processedCount} submissions processed`);
    }, 3000);
}

// Run examples
if (require.main === module) {
    console.log('Running throttle examples...\n');
    
    basicThrottleExample();
    
    setTimeout(() => scrollThrottleExample(), 4000);
    setTimeout(() => throttleOptionsExample(), 6000);
    setTimeout(() => throttleUtilityMethodsExample(), 10000);
    setTimeout(() => throttleVsDebounceExample(), 16000);
    setTimeout(() => buttonClickThrottleExample(), 20000);
    
    console.log('\n--- All examples will complete in ~25 seconds ---');
}

module.exports = {
    basicThrottleExample,
    scrollThrottleExample,
    throttleOptionsExample,
    throttleUtilityMethodsExample,
    throttleVsDebounceExample,
    buttonClickThrottleExample
};
