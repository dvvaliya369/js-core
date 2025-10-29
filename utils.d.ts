/**
 * Type definitions for utility functions
 */

/**
 * A debounced function that wraps the original function
 */
export interface DebouncedFunction<T extends (...args: any[]) => any> {
    /**
     * Calls the debounced function
     * @param args - Arguments to pass to the original function
     */
    (...args: Parameters<T>): void;
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @template T - The type of the function to debounce
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param immediate - If true, trigger the function on the leading edge instead of trailing
 * @returns The debounced function
 *
 * @example
 * ```typescript
 * const debouncedSave = debounce(saveData, 300);
 * debouncedSave(); // Will only execute after 300ms of no calls
 * ```
 *
 * @example
 * ```typescript
 * const debouncedImmediate = debounce(saveData, 300, true);
 * debouncedImmediate(); // Executes immediately, then debounces further calls
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate?: boolean
): DebouncedFunction<T>;

/**
 * Named exports
 */
export { debounce };
