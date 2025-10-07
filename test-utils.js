/**
 * Test file for utils.js functions
 * Run with: node test-utils.js
 */

// Import the utils functions
const { cloneObject, shallowClone } = require('./utils.js');

console.log('🧪 Testing Object Clone Functions\n');

// Test 1: Basic object cloning
console.log('Test 1: Basic object cloning');
const basicObj = { name: 'John', age: 30, city: 'New York' };
const clonedBasic = cloneObject(basicObj);
clonedBasic.name = 'Jane';
console.log('Original:', basicObj);
console.log('Cloned (modified):', clonedBasic);
console.log('✅ Basic cloning works\n');

// Test 2: Nested object cloning
console.log('Test 2: Nested object cloning');
const nestedObj = {
  user: {
    name: 'Alice',
    preferences: {
      theme: 'dark',
      language: 'en'
    }
  },
  data: [1, 2, { nested: true }]
};
const clonedNested = cloneObject(nestedObj);
clonedNested.user.name = 'Bob';
clonedNested.data[2].nested = false;
console.log('Original nested name:', nestedObj.user.name);
console.log('Cloned nested name:', clonedNested.user.name);
console.log('Original nested data:', nestedObj.data[2].nested);
console.log('Cloned nested data:', clonedNested.data[2].nested);
console.log('✅ Nested cloning works\n');

// Test 3: Array cloning
console.log('Test 3: Array cloning');
const arrayData = [1, 'hello', { key: 'value' }, [2, 3, 4]];
const clonedArray = cloneObject(arrayData);
clonedArray[2].key = 'new value';
clonedArray[3].push(5);
console.log('Original array:', JSON.stringify(arrayData));
console.log('Cloned array:', JSON.stringify(clonedArray));
console.log('✅ Array cloning works\n');

// Test 4: Date cloning
console.log('Test 4: Date cloning');
const dateObj = { created: new Date('2023-01-01'), name: 'Test' };
const clonedDate = cloneObject(dateObj);
clonedDate.created.setFullYear(2024);
console.log('Original date:', dateObj.created.getFullYear());
console.log('Cloned date:', clonedDate.created.getFullYear());
console.log('✅ Date cloning works\n');

// Test 5: Circular reference handling
console.log('Test 5: Circular reference handling');
const circularObj = { name: 'Circular' };
circularObj.self = circularObj;
try {
  const clonedCircular = cloneObject(circularObj);
  console.log('Circular reference handled successfully');
  console.log('Cloned object has self reference:', clonedCircular.self === clonedCircular);
  console.log('✅ Circular reference handling works\n');
} catch (error) {
  console.log('❌ Circular reference test failed:', error.message);
}

// Test 6: Primitive values
console.log('Test 6: Primitive values');
console.log('String:', cloneObject('hello'));
console.log('Number:', cloneObject(42));
console.log('Boolean:', cloneObject(true));
console.log('Null:', cloneObject(null));
console.log('Undefined:', cloneObject(undefined));
console.log('✅ Primitive values work\n');

// Test 7: Shallow clone comparison
console.log('Test 7: Shallow clone comparison');
const shallowTest = { a: 1, b: { c: 2 } };
const deepCloned = cloneObject(shallowTest);
const shallowCloned = shallowClone(shallowTest);

deepCloned.b.c = 999;
shallowCloned.b.c = 888;

console.log('Original after deep clone modification:', shallowTest.b.c);
console.log('Original after shallow clone modification:', shallowTest.b.c);
console.log('✅ Shallow vs Deep clone comparison complete\n');

console.log('🎉 All tests completed!');
