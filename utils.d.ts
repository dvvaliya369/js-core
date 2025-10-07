/**
 * TypeScript type definitions for utility functions
 */

/**
 * Generic debounced function type
 */
export type DebouncedFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void;

/**
 * Generic throttled function type
 */
export type ThrottledFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void;

/**
 * Debounce function signature
 */
export declare function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  immediate?: boolean
): DebouncedFunction<T>;

/**
 * Throttle function signature
 */
export declare function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ThrottledFunction<T>;

/**
 * Safe debounce function signature with validation
 */
export declare function safeDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  immediate?: boolean
): DebouncedFunction<T>;

/**
 * Safe throttle function signature with validation
 */
export declare function safeThrottle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ThrottledFunction<T>;

/**
 * Type guard for function checking
 */
export declare function isFunction(value: unknown): value is Function;
