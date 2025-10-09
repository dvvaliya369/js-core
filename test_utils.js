/**
 * Simple test file to verify the utility functions work correctly
 */

// Import the utility functions (Node.js style)
const { cloneObject, shallowClone } = require('./utils.js');

console.log('🔧 Testing cloneObject function...');

// Test 1: Basic object cloning
console.log('\n1. Basic object cloning:');
const original = { a: 1, b: { c: 2, d: [3, 4] } };
const cloned = cloneObject(original);

cloned.b.c = 999;
cloned.b.d[0] = 777;

console.log('Original object b.c:', original.b.c);  // Should be 2
console.log('Cloned object b.c:', cloned.b.c);      // Should be 999
console.log('Original object b.d[0]:', original.b.d[0]);  // Should be 3
console.log('Cloned object b.d[0]:', cloned.b.d[0]);      // Should be 777

// Test 2: Date cloning
console.log('\n2. Date object cloning:');
const originalDate = new Date('2023-12-25');
const clonedDate = cloneObject(originalDate);

clonedDate.setFullYear(2024);

console.log('Original date year:', originalDate.getFullYear()); // Should be 2023
console.log('Cloned date year:', clonedDate.getFullYear());     // Should be 2024

// Test 3: Array cloning
console.log('\n3. Array cloning:');
const originalArray = [1, [2, 3], { a: 4 }];
const clonedArray = cloneObject(originalArray);

clonedArray[1][0] = 999;
clonedArray[2].a = 888;

console.log('Original array [1][0]:', originalArray[1][0]);  // Should be 2
console.log('Cloned array [1][0]:', clonedArray[1][0]);      // Should be 999
console.log('Original array [2].a:', originalArray[2].a);    // Should be 4
console.log('Cloned array [2].a:', clonedArray[2].a);        // Should be 888

// Test 4: Map and Set cloning
console.log('\n4. Map and Set cloning:');
const originalMap = new Map([['key1', 'value1'], ['key2', { nested: 'object' }]]);
const clonedMap = cloneObject(originalMap);

clonedMap.get('key2').nested = 'modified';
clonedMap.set('key3', 'new value');

console.log('Original map key2.nested:', originalMap.get('key2').nested);  // Should be 'object'
console.log('Cloned map key2.nested:', clonedMap.get('key2').nested);      // Should be 'modified'
console.log('Original map has key3:', originalMap.has('key3'));            // Should be false
console.log('Cloned map has key3:', clonedMap.has('key3'));                // Should be true

const originalSet = new Set([1, { a: 2 }]);
const clonedSet = cloneObject(originalSet);
const originalSetObject = Array.from(originalSet)[1];
const clonedSetObject = Array.from(clonedSet)[1];

clonedSetObject.a = 999;

console.log('Original set object.a:', originalSetObject.a);  // Should be 2
console.log('Cloned set object.a:', clonedSetObject.a);      // Should be 999

// Test 5: Circular reference handling
console.log('\n5. Circular reference handling:');
const circular = { name: 'test' };
circular.self = circular;
const clonedCircular = cloneObject(circular);

console.log('Circular reference preserved:', clonedCircular.self === clonedCircular);  // Should be true
console.log('Different objects:', clonedCircular !== circular);  // Should be true

console.log('\n🔧 Testing shallowClone function...');

// Test 6: Shallow clone vs deep clone
console.log('\n6. Shallow clone behavior:');
const shallowOriginal = { a: 1, b: { c: 2 } };
const shallowCloned = shallowClone(shallowOriginal);

shallowCloned.a = 999;        // Should not affect original
shallowCloned.b.c = 777;      // Should affect original (shared reference)

console.log('Original a:', shallowOriginal.a);      // Should be 1
console.log('Shallow cloned a:', shallowCloned.a);  // Should be 999
console.log('Original b.c:', shallowOriginal.b.c);  // Should be 777 (affected)
console.log('Shallow cloned b.c:', shallowCloned.b.c);  // Should be 777

console.log('\n✅ All tests completed!');
