# <span style="color:red">JS Core Utilities</span>

A collection of JavaScript utility functions for common programming tasks.

## Features

### Debounce Function

The `debounce` function delays the execution of a function until after a specified wait time has passed since the last time it was invoked. This is useful for limiting the rate at which a function can fire, such as in search inputs or resize events.

#### Usage

```javascript
const { debounce } = require('./utils.js');

// Basic usage
const debouncedSave = debounce(saveData, 300);
debouncedSave(); // Will execute after 300ms of no further calls

// Immediate execution
const debouncedImmediate = debounce(saveData, 300, true);
debouncedImmediate(); // Executes immediately, then debounces further calls
```

#### Parameters

- `func` (function): The function to debounce
- `wait` (number): The number of milliseconds to delay
- `immediate` (boolean, optional): If true, trigger the function on the leading edge instead of trailing

#### Returns

A debounced version of the input function.

---

### Throttle Function

The `throttle` function ensures that a function is invoked **at most once per `wait` milliseconds**, no matter how frequently it is called. Unlike `debounce`, which waits for a quiet period, `throttle` guarantees regular execution at a fixed rate — ideal for scroll/resize handlers, game loops, and rate-limited API calls.

The returned throttled function also exposes two utility methods:
- **`.cancel()`** — cancels any pending trailing invocation
- **`.flush()`** — forces any pending trailing invocation to fire immediately

#### Usage

```javascript
const { throttle } = require('./utils.js');

// Basic usage — fires on both leading and trailing edges
const throttledScroll = throttle(onScroll, 200);
window.addEventListener('scroll', throttledScroll);

// Leading edge only — fires once and ignores calls for the next 200ms
const throttledClick = throttle(handleClick, 200, { trailing: false });

// Cancel a pending trailing call
throttledScroll.cancel();

// Force the pending trailing call to execute immediately
throttledScroll.flush();
```

#### Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `func` | function | — | The function to throttle |
| `wait` | number | — | Minimum milliseconds between invocations |
| `options.leading` | boolean | `true` | Invoke on the leading edge of the wait interval |
| `options.trailing` | boolean | `true` | Invoke on the trailing edge of the wait interval |

#### Returns

A throttled function with `.cancel()` and `.flush()` methods.

#### When to use `throttle` vs `debounce`

| Scenario | Use |
|---|---|
| Search input — fire after the user stops typing | `debounce` |
| Window resize — update layout at most every 100ms | `throttle` |
| Button click — prevent double-submit | `debounce` with `immediate: true` |
| Scroll handler — animate at a steady rate | `throttle` |
| API polling — limit to N calls per second | `throttle` |

## Installation

Clone the repository and include `utils.js` in your project.

## Testing

Run the test file to verify both utility functions:

```bash
node test_utils.js
```

## License

This project is open source. Feel free to use and modify as needed.