// Test file for utility functions
const { 
    debounce, 
    generateUniqueId, 
    generateTimestampId, 
    generateShortId, 
    generateNanoId, 
    createUniqueIdGenerator 
} = require('./utils.js');

console.log('Testing utility functions...\n');

// Test 1: Basic debouncing
console.log('Test 1: Basic debouncing');
let counter = 0;
const incrementCounter = () => {
    counter++;
    console.log(`Counter: ${counter}`);
};

const debouncedIncrement = debounce(incrementCounter, 300);

// Rapid calls - should only execute once after 300ms
console.log('Making rapid calls...');
debouncedIncrement();
debouncedIncrement();
debouncedIncrement();
debouncedIncrement();

setTimeout(() => {
    console.log(`Final counter after 500ms: ${counter}`);
    console.log('Expected: 1 (only one execution after debounce delay)\n');
    
    // Test 2: Immediate execution
    console.log('Test 2: Immediate execution');
    let immediateCounter = 0;
    const immediateIncrement = () => {
        immediateCounter++;
        console.log(`Immediate counter: ${immediateCounter}`);
    };
    
    const debouncedImmediate = debounce(immediateIncrement, 300, true);
    
    console.log('Making rapid calls with immediate=true...');
    debouncedImmediate(); // Should execute immediately
    debouncedImmediate(); // Should be debounced
    debouncedImmediate(); // Should be debounced
    
    setTimeout(() => {
        console.log(`Final immediate counter after 500ms: ${immediateCounter}`);
        console.log('Expected: 1 (immediate execution, subsequent calls debounced)\n');
        
        // Test unique ID functions
        testUniqueIdFunctions();
    }, 500);
    
}, 500);

function testUniqueIdFunctions() {
    console.log('Test 3: UUID Generation');
    for (let i = 0; i < 5; i++) {
        console.log(`UUID ${i + 1}: ${generateUniqueId()}`);
    }
    
    console.log('\nTest 4: Timestamp-based IDs');
    for (let i = 0; i < 3; i++) {
        console.log(`Timestamp ID ${i + 1}: ${generateTimestampId('item')}`);
    }
    console.log(`No prefix: ${generateTimestampId()}`);
    
    console.log('\nTest 5: Short IDs');
    console.log(`Default (8 chars): ${generateShortId()}`);
    console.log(`12 chars: ${generateShortId(12)}`);
    console.log(`Numbers only (6 chars): ${generateShortId(6, true, false, false)}`);
    console.log(`Letters only (10 chars): ${generateShortId(10, false, true, true)}`);
    
    console.log('\nTest 6: Nano IDs');
    console.log(`Default (21 chars): ${generateNanoId()}`);
    console.log(`Short (10 chars): ${generateNanoId(10)}`);
    console.log(`Long (30 chars): ${generateNanoId(30)}`);
    
    console.log('\nTest 7: Collision Detection');
    const usedIds = new Set();
    const uniqueGenerator = createUniqueIdGenerator(() => generateShortId(2)); // Short IDs for testing collisions
    
    try {
        for (let i = 0; i < 5; i++) {
            const id = uniqueGenerator(usedIds);
            console.log(`Generated unique ID: ${id}`);
            usedIds.add(id);
        }
    } catch (error) {
        console.log(`Collision detection worked: ${error.message}`);
    }
    
    console.log('\nTest 8: Uniqueness Test');
    const generatedIds = new Set();
    const duplicates = [];
    
    // Generate 1000 IDs to test for duplicates
    for (let i = 0; i < 1000; i++) {
        const id = generateShortId();
        if (generatedIds.has(id)) {
            duplicates.push(id);
        } else {
            generatedIds.add(id);
        }
    }
    
    console.log(`Generated 1000 short IDs`);
    console.log(`Unique IDs: ${generatedIds.size}`);
    console.log(`Duplicates: ${duplicates.length}`);
    if (duplicates.length > 0) {
        console.log(`Duplicate IDs found: ${duplicates.slice(0, 5).join(', ')}${duplicates.length > 5 ? '...' : ''}`);
    }
}
