// Test the enhanced utils.js file
console.log('Testing Enhanced Utils.js Functions\n');

// Load the utils module
const utils = require('./utils.js');

// Test type checking utilities
console.log('=== TYPE CHECKING TESTS ===');
console.log('isType.string("hello"):', utils.isType.string("hello"));
console.log('isType.number(42):', utils.isType.number(42));
console.log('isType.array([1,2,3]):', utils.isType.array([1,2,3]));
console.log('isType.object({a:1}):', utils.isType.object({a:1}));
console.log('isType.empty(""):', utils.isType.empty(""));
console.log('isType.empty([]):', utils.isType.empty([]));
console.log();

// Test object utilities
console.log('=== OBJECT UTILITIES TESTS ===');
const original = { a: 1, b: { c: 2, d: [3, 4] } };
const cloned = utils.deepClone(original);
cloned.b.c = 999;
console.log('Original after clone modification:', JSON.stringify(original));
console.log('Cloned object:', JSON.stringify(cloned));

const merged = utils.deepMerge({a: 1, b: {x: 1}}, {b: {y: 2}, c: 3});
console.log('Deep merge result:', JSON.stringify(merged));

const nested = { user: { profile: { name: 'John', settings: { theme: 'dark' } } } };
console.log('Nested value (user.profile.name):', utils.getNestedValue(nested, 'user.profile.name'));
console.log('Nested value with default:', utils.getNestedValue(nested, 'user.profile.age', 25));
console.log();

// Test array utilities
console.log('=== ARRAY UTILITIES TESTS ===');
const duplicates = [1, 2, 2, 3, 3, 4];
console.log('Original array:', duplicates);
console.log('Unique array:', utils.uniqueArray(duplicates));

const toChunk = [1, 2, 3, 4, 5, 6, 7];
console.log('Array to chunk:', toChunk);
console.log('Chunked (size 3):', utils.chunkArray(toChunk, 3));
console.log();

// Test string utilities
console.log('=== STRING UTILITIES TESTS ===');
const testString = 'hello-world-test';
console.log('Original:', testString);
console.log('camelCase:', utils.toCamelCase(testString));
console.log('kebab-case:', utils.toKebabCase('helloWorldTest'));
console.log('Capitalize:', utils.capitalize('hello world'));
console.log('Truncate:', utils.truncate('This is a very long string', 15));
console.log();

// Test number utilities
console.log('=== NUMBER UTILITIES TESTS ===');
console.log('Random between 1-10:', utils.randomBetween(1, 10));
console.log('Clamp 150 (0-100):', utils.clamp(150, 0, 100));
console.log('Clamp -5 (0-100):', utils.clamp(-5, 0, 100));
console.log('Clamp 50 (0-100):', utils.clamp(50, 0, 100));
console.log();

// Test function utilities (simple test)
console.log('=== FUNCTION UTILITIES TESTS ===');
let counter = 0;
const increment = () => { counter++; console.log('Counter:', counter); };

// Test debounce (existing function)
const debouncedIncrement = utils.debounce(increment, 100);
console.log('Testing debounce (will increment after 100ms)...');
debouncedIncrement();
debouncedIncrement();
debouncedIncrement(); // Only this one should execute

// Test throttle
setTimeout(() => {
    console.log('\nTesting throttle...');
    counter = 0;
    const throttledIncrement = utils.throttle(increment, 100);
    throttledIncrement(); // Should execute
    throttledIncrement(); // Should be throttled
    throttledIncrement(); // Should be throttled
}, 200);

// Test async utilities
console.log('\n=== ASYNC UTILITIES TESTS ===');
async function testAsync() {
    console.log('Testing sleep function...');
    const start = Date.now();
    await utils.sleep(100);
    const end = Date.now();
    console.log(`Sleep completed in ${end - start}ms`);
    
    // Test retry function
    console.log('Testing retry function...');
    let attempts = 0;
    const flakyFunction = async () => {
        attempts++;
        if (attempts < 3) {
            throw new Error(`Attempt ${attempts} failed`);
        }
        return 'Success!';
    };
    
    try {
        const result = await utils.retry(flakyFunction, 3, 50);
        console.log('Retry result:', result);
        console.log('Total attempts:', attempts);
    } catch (error) {
        console.error('Retry failed:', error.message);
    }
}

setTimeout(testAsync, 500);

console.log('\n=== ALL TESTS SCHEDULED ===');
console.log('Check the output above and below for test results.');
