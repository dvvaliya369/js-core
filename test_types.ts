/**
 * TypeScript test file to validate type definitions
 * This file demonstrates proper usage of the debounce function with TypeScript
 */

import { debounce } from './utils';

// Test 1: Basic function with no parameters
const simpleFunc = () => {
    console.log('Simple function called');
};
const debouncedSimple = debounce(simpleFunc, 300);
debouncedSimple();

// Test 2: Function with parameters
const funcWithParams = (name: string, age: number) => {
    console.log(`Name: ${name}, Age: ${age}`);
};
const debouncedWithParams = debounce(funcWithParams, 300);
debouncedWithParams('John', 30);

// Test 3: Function with immediate flag
const immediateFunc = (message: string) => {
    console.log(message);
};
const debouncedImmediate = debounce(immediateFunc, 300, true);
debouncedImmediate('Immediate execution');

// Test 4: Function with return value (note: debounced functions don't return values)
const funcWithReturn = (x: number, y: number): number => {
    return x + y;
};
const debouncedWithReturn = debounce(funcWithReturn, 300);
debouncedWithReturn(5, 10);

// Test 5: Complex function signature
interface User {
    id: number;
    name: string;
}

const saveUser = (user: User, callback?: () => void) => {
    console.log('Saving user:', user);
    if (callback) callback();
};

const debouncedSaveUser = debounce(saveUser, 500);
debouncedSaveUser({ id: 1, name: 'Alice' });
debouncedSaveUser({ id: 2, name: 'Bob' }, () => console.log('Saved!'));

console.log('TypeScript type definitions are valid!');
