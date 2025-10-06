/**
 * Test suite for object clone utilities
 * Run with: node test/clone.test.js
 */

const { shallowClone, deepClone, clone } = require('../src/utils/clone.js');

// Simple test assertion helper
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Test failed: ${message}`);
  }
  console.log(`✓ ${message}`);
}

function runTests() {
  console.log('Running Clone Utility Tests...\n');

  // Test primitive types
  console.log('=== Testing Primitive Types ===');
  assert(shallowClone(null) === null, 'Shallow clone handles null');
  assert(shallowClone(undefined) === undefined, 'Shallow clone handles undefined');
  assert(shallowClone(42) === 42, 'Shallow clone handles numbers');
  assert(shallowClone('hello') === 'hello', 'Shallow clone handles strings');
  assert(shallowClone(true) === true, 'Shallow clone handles booleans');

  assert(deepClone(null) === null, 'Deep clone handles null');
  assert(deepClone(undefined) === undefined, 'Deep clone handles undefined');
  assert(deepClone(42) === 42, 'Deep clone handles numbers');
  assert(deepClone('hello') === 'hello', 'Deep clone handles strings');
  assert(deepClone(true) === true, 'Deep clone handles booleans');

  // Test arrays
  console.log('\n=== Testing Arrays ===');
  const originalArray = [1, 2, [3, 4]];
  const shallowArray = shallowClone(originalArray);
  const deepArray = deepClone(originalArray);

  assert(Array.isArray(shallowArray), 'Shallow clone creates array');
  assert(shallowArray !== originalArray, 'Shallow clone creates new array reference');
  assert(shallowArray[2] === originalArray[2], 'Shallow clone shares nested array reference');

  assert(Array.isArray(deepArray), 'Deep clone creates array');
  assert(deepArray !== originalArray, 'Deep clone creates new array reference');
  assert(deepArray[2] !== originalArray[2], 'Deep clone creates new nested array reference');
  assert(JSON.stringify(deepArray) === JSON.stringify(originalArray), 'Deep clone preserves array content');

  // Test objects
  console.log('\n=== Testing Objects ===');
  const originalObject = {
    name: 'John',
    age: 30,
    address: {
      city: 'New York',
      zip: '10001'
    }
  };

  const shallowObject = shallowClone(originalObject);
  const deepObject = deepClone(originalObject);

  assert(typeof shallowObject === 'object', 'Shallow clone creates object');
  assert(shallowObject !== originalObject, 'Shallow clone creates new object reference');
  assert(shallowObject.address === originalObject.address, 'Shallow clone shares nested object reference');

  assert(typeof deepObject === 'object', 'Deep clone creates object');
  assert(deepObject !== originalObject, 'Deep clone creates new object reference');
  assert(deepObject.address !== originalObject.address, 'Deep clone creates new nested object reference');
  assert(deepObject.name === originalObject.name, 'Deep clone preserves primitive values');
  assert(deepObject.address.city === originalObject.address.city, 'Deep clone preserves nested values');

  // Test Date objects
  console.log('\n=== Testing Date Objects ===');
  const originalDate = new Date('2023-01-01');
  const shallowDate = shallowClone(originalDate);
  const deepDate = deepClone(originalDate);

  assert(shallowDate instanceof Date, 'Shallow clone creates Date object');
  assert(shallowDate !== originalDate, 'Shallow clone creates new Date reference');
  assert(shallowDate.getTime() === originalDate.getTime(), 'Shallow clone preserves Date value');

  assert(deepDate instanceof Date, 'Deep clone creates Date object');
  assert(deepDate !== originalDate, 'Deep clone creates new Date reference');
  assert(deepDate.getTime() === originalDate.getTime(), 'Deep clone preserves Date value');

  // Test RegExp objects
  console.log('\n=== Testing RegExp Objects ===');
  const originalRegex = /test/gi;
  const shallowRegex = shallowClone(originalRegex);
  const deepRegex = deepClone(originalRegex);

  assert(shallowRegex instanceof RegExp, 'Shallow clone creates RegExp object');
  assert(shallowRegex !== originalRegex, 'Shallow clone creates new RegExp reference');
  assert(shallowRegex.source === originalRegex.source, 'Shallow clone preserves RegExp source');
  assert(shallowRegex.flags === originalRegex.flags, 'Shallow clone preserves RegExp flags');

  assert(deepRegex instanceof RegExp, 'Deep clone creates RegExp object');
  assert(deepRegex !== originalRegex, 'Deep clone creates new RegExp reference');
  assert(deepRegex.source === originalRegex.source, 'Deep clone preserves RegExp source');
  assert(deepRegex.flags === originalRegex.flags, 'Deep clone preserves RegExp flags');

  // Test Map objects
  console.log('\n=== Testing Map Objects ===');
  const originalMap = new Map([['key1', 'value1'], ['key2', { nested: 'object' }]]);
  const shallowMap = shallowClone(originalMap);
  const deepMap = deepClone(originalMap);

  assert(shallowMap instanceof Map, 'Shallow clone creates Map object');
  assert(shallowMap !== originalMap, 'Shallow clone creates new Map reference');
  assert(shallowMap.get('key2') === originalMap.get('key2'), 'Shallow clone shares Map values');

  assert(deepMap instanceof Map, 'Deep clone creates Map object');
  assert(deepMap !== originalMap, 'Deep clone creates new Map reference');
  assert(deepMap.get('key2') !== originalMap.get('key2'), 'Deep clone creates new Map values');
  assert(deepMap.get('key2').nested === originalMap.get('key2').nested, 'Deep clone preserves nested Map values');

  // Test Set objects
  console.log('\n=== Testing Set Objects ===');
  const originalSet = new Set([1, 2, { nested: 'object' }]);
  const shallowSet = shallowClone(originalSet);
  const deepSet = deepClone(originalSet);

  assert(shallowSet instanceof Set, 'Shallow clone creates Set object');
  assert(shallowSet !== originalSet, 'Shallow clone creates new Set reference');
  assert(shallowSet.size === originalSet.size, 'Shallow clone preserves Set size');

  assert(deepSet instanceof Set, 'Deep clone creates Set object');
  assert(deepSet !== originalSet, 'Deep clone creates new Set reference');
  assert(deepSet.size === originalSet.size, 'Deep clone preserves Set size');

  // Test circular references (deep clone only)
  console.log('\n=== Testing Circular References ===');
  const circular = { name: 'circular' };
  circular.self = circular;

  const deepCircular = deepClone(circular);
  assert(deepCircular !== circular, 'Deep clone handles circular references');
  assert(deepCircular.self === deepCircular, 'Deep clone preserves circular structure');
  assert(deepCircular.name === 'circular', 'Deep clone preserves circular object values');

  // Test general clone function
  console.log('\n=== Testing General Clone Function ===');
  const testObj = { a: 1, b: { c: 2 } };
  const shallowResult = clone(testObj, false);
  const deepResult = clone(testObj, true);

  assert(shallowResult !== testObj, 'Clone function creates new reference (shallow)');
  assert(shallowResult.b === testObj.b, 'Clone function shares nested reference (shallow)');

  assert(deepResult !== testObj, 'Clone function creates new reference (deep)');
  assert(deepResult.b !== testObj.b, 'Clone function creates new nested reference (deep)');

  console.log('\n🎉 All tests passed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  try {
    runTests();
  } catch (error) {
    console.error('❌', error.message);
    process.exit(1);
  }
}
