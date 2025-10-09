// Test file for utils.js deepClone function
const { deepClone } = require('./utils.js');

console.log('Testing deepClone function...\n');

// Test 1: Primitive values
console.log('Test 1: Primitive values');
console.log('deepClone(42):', deepClone(42));
console.log('deepClone("hello"):', deepClone("hello"));
console.log('deepClone(true):', deepClone(true));
console.log('deepClone(null):', deepClone(null));
console.log('deepClone(undefined):', deepClone(undefined));
console.log('');

// Test 2: Simple object
console.log('Test 2: Simple object');
const simpleObj = { a: 1, b: 2, c: 'test' };
const clonedSimple = deepClone(simpleObj);
console.log('Original:', simpleObj);
console.log('Cloned:', clonedSimple);
clonedSimple.a = 999;
console.log('After modifying clone.a to 999:');
console.log('Original:', simpleObj);
console.log('Cloned:', clonedSimple);
console.log('');

// Test 3: Nested object
console.log('Test 3: Nested object');
const nestedObj = { 
  a: 1, 
  b: { 
    c: 2, 
    d: { 
      e: 3 
    } 
  },
  f: 'test'
};
const clonedNested = deepClone(nestedObj);
console.log('Original:', JSON.stringify(nestedObj));
console.log('Cloned:', JSON.stringify(clonedNested));
clonedNested.b.d.e = 999;
console.log('After modifying clone.b.d.e to 999:');
console.log('Original:', JSON.stringify(nestedObj));
console.log('Cloned:', JSON.stringify(clonedNested));
console.log('');

// Test 4: Array
console.log('Test 4: Array');
const array = [1, 2, [3, 4, [5, 6]], { a: 7 }];
const clonedArray = deepClone(array);
console.log('Original:', JSON.stringify(array));
console.log('Cloned:', JSON.stringify(clonedArray));
clonedArray[2][2][0] = 999;
clonedArray[3].a = 888;
console.log('After modifying clone:');
console.log('Original:', JSON.stringify(array));
console.log('Cloned:', JSON.stringify(clonedArray));
console.log('');

// Test 5: Date object
console.log('Test 5: Date object');
const dateObj = { created: new Date('2023-01-01'), name: 'test' };
const clonedDate = deepClone(dateObj);
console.log('Original date:', dateObj.created);
console.log('Cloned date:', clonedDate.created);
console.log('Are dates equal?', dateObj.created.getTime() === clonedDate.created.getTime());
console.log('Are dates the same object?', dateObj.created === clonedDate.created);
console.log('');

// Test 6: Circular reference protection
console.log('Test 6: Circular reference protection');
const circularObj = { a: 1 };
circularObj.self = circularObj;
const clonedCircular = deepClone(circularObj);
console.log('Original has circular reference:', circularObj.self === circularObj);
console.log('Clone has circular reference:', clonedCircular.self === clonedCircular);
console.log('Clone is different object:', clonedCircular !== circularObj);
console.log('');

console.log('All tests completed successfully! ✅');
