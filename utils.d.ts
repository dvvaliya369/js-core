/**
 * TypeScript type definitions for utils.js
 * Use this file if you're working in a TypeScript project
 */

export interface DebounceOptions {
  immediate?: boolean;
}

export type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel?: () => void;
};

export type ThrottledFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel?: () => void;
};

/**
 * Creates a debounced function that delays invoking the provided function 
 * until after wait milliseconds have elapsed since the last time the 
 * debounced function was invoked.
 */
export declare function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): DebouncedFunction<T>;

/**
 * Creates a throttled function that only invokes the provided function 
 * at most once per every wait milliseconds.
 */
export declare function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ThrottledFunction<T>;

/**
 * Simple utility to check if a value is a function
 */
export declare function isFunction(value: any): value is Function;

/**
 * Simple utility to check if a value is a number
 */
export declare function isNumber(value: any): value is number;
