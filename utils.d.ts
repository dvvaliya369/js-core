// TypeScript declaration file for utils
export type DebouncedFunction<T extends (...args: any[]) => any> = {
    (...args: Parameters<T>): void;
    cancel: () => void;
    flush: (...args: Parameters<T>) => ReturnType<T> | undefined;
};

export type DebounceOptions = {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
};

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds 
 * have elapsed since the last time the debounced function was invoked.
 */
export declare function createDebouncedFunction<T extends (...args: any[]) => any>(
    func: T, 
    wait: number, 
    immediate?: boolean
): DebouncedFunction<T>;

/**
 * Legacy alias for backward compatibility
 * @deprecated Use createDebouncedFunction instead
 */
export declare function debounce<T extends (...args: any[]) => any>(
    func: T, 
    wait: number, 
    immediate?: boolean
): DebouncedFunction<T>;

/**
 * Advanced debounced function with more options
 */
export declare function advancedDebounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    options?: DebounceOptions
): DebouncedFunction<T>;
