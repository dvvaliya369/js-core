/**
 * Type definitions for the debounce utility
 * @fileoverview TypeScript type definitions for debounce functions
 */

/**
 * Type definition for a debounced function
 */
export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => ReturnType<T> | undefined;
  pending: () => boolean;
}

/**
 * Options for debounce configuration
 */
export interface DebounceOptions {
  /** If true, trigger the function on the leading edge instead of trailing */
  leading?: boolean;
  /** If true, trigger the function on the trailing edge (default: true) */
  trailing?: boolean;
  /** Maximum time func is allowed to be delayed before it's invoked */
  maxWait?: number;
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds 
 * have elapsed since the last time the debounced function was invoked.
 */
declare function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: DebounceOptions
): DebouncedFunction<T>;

/**
 * Legacy support - maintains backward compatibility with the old function name
 * @deprecated Use `debounce` instead
 */
declare const deeeebounceee: typeof debounce;

export { debounce, deeeebounceee };
export default debounce;
