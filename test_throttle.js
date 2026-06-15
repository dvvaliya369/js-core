/**
 * Tests for throttle utility (throttle.js)
 *
 * Run with:  node test_throttle.js
 *
 * Uses the same lightweight manual-test style as test_utils.js so no external
 * test runner is required.
 */

const { throttle } = require('./throttle');

// ---------------------------------------------------------------------------
// Minimal test harness (mirrors test_utils.js style)
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  PASS: ${message}`);
        passed++;
    } else {
        console.error(`  FAIL: ${message}`);
        failed++;
    }
}

function describe(suiteName, fn) {
    console.log(`\n${suiteName}`);
    fn();
}

// ---------------------------------------------------------------------------
// Helper — advance fake time by manipulating Date.now via a simple wrapper.
// We monkey-patch Date.now so the throttle clock follows our control.
// ---------------------------------------------------------------------------

let fakeNow = 0;
const realDateNow = Date.now;

function useFakeTime(startMs = 0) {
    fakeNow = startMs;
    Date.now = () => fakeNow;
}

function advanceTime(ms) {
    fakeNow += ms;
}

function restoreTime() {
    Date.now = realDateNow;
}

// ---------------------------------------------------------------------------
// Test suites
// ---------------------------------------------------------------------------

describe('throttle — basic invocation (leading + trailing, default)', () => {
    useFakeTime(0);

    let callCount = 0;
    const fn = throttle(() => { callCount++; }, 100);

    // First call at t=0 should fire immediately (leading edge).
    fn();
    assert(callCount === 1, 'fires on the leading edge (t=0)');

    // Call again while still inside the 100 ms window.
    advanceTime(50);
    fn();
    assert(callCount === 1, 'does not fire again while inside the wait window (t=50)');

    // Simulate the trailing timer firing at t=100.
    advanceTime(50); // now at t=100
    // Directly trigger the trailing edge by advancing past the window and calling once more.
    advanceTime(1);  // t=101
    fn();
    assert(callCount === 2, 'fires again after the wait window has elapsed (t=101)');

    fn.cancel();
    restoreTime();
});

describe('throttle — leading: false (trailing only)', () => {
    useFakeTime(0);

    let callCount = 0;
    const fn = throttle(() => { callCount++; }, 100, { leading: false, trailing: true });

    // First call at t=0 should NOT fire immediately (leading disabled).
    fn();
    assert(callCount === 0, 'does NOT fire on the leading edge when leading=false');

    // A second call at t=0 while still in the same window should also not fire.
    fn();
    assert(callCount === 0, 'still does not fire on a second call inside the window');

    // Advance past the wait window and call again.
    // Because leading=false, the new call starts a fresh window but does NOT
    // fire immediately — it schedules a trailing call.
    // We use .flush() to synchronously deliver that trailing call.
    advanceTime(101);
    fn();                // starts a new window (leading=false, so no immediate fire)
    fn.flush();          // synchronously deliver the scheduled trailing call
    assert(callCount === 1, 'fires via flush() after the wait window has elapsed (leading=false)');

    fn.cancel();
    restoreTime();
});

describe('throttle — trailing: false (leading only)', () => {
    useFakeTime(0);

    let callCount = 0;
    const fn = throttle(() => { callCount++; }, 100, { leading: true, trailing: false });

    fn();
    assert(callCount === 1, 'fires immediately on leading edge (trailing=false)');

    advanceTime(50);
    fn(); // inside window — should be ignored entirely
    assert(callCount === 1, 'call inside window is ignored (trailing=false)');

    advanceTime(51); // t=101 — past the window
    fn();
    assert(callCount === 2, 'fires again after full window when trailing=false');

    fn.cancel();
    restoreTime();
});

describe('throttle — .cancel() suppresses pending trailing call', () => {
    useFakeTime(0);

    let callCount = 0;
    const fn = throttle(() => { callCount++; }, 100 );

    fn(); // leading fires → callCount = 1
    advanceTime(50);
    fn(); // schedules trailing for t=100

    fn.cancel(); // discard the trailing call
    advanceTime(60); // t=110 — would have been inside trailing window

    assert(callCount === 1, '.cancel() prevents the trailing invocation');

    restoreTime();
});

describe('throttle — .flush() forces immediate trailing invocation', () => {
    useFakeTime(0);

    let callCount = 0;
    const fn = throttle(() => { callCount++; }, 100);

    fn(); // leading fires → callCount = 1
    advanceTime(50);
    fn(); // inside window — schedules trailing

    fn.flush(); // force it now
    assert(callCount === 2, '.flush() immediately invokes the pending trailing call');

    restoreTime();
});

describe('throttle — passes correct arguments to the wrapped function', () => {
    useFakeTime(0);

    const received = [];
    const fn = throttle((...args) => { received.push(args); }, 100);

    fn(1, 2, 3);
    assert(
        received.length === 1 && received[0][0] === 1 && received[0][1] === 2 && received[0][2] === 3,
        'passes all arguments to the wrapped function'
    );

    fn.cancel();
    restoreTime();
});

describe('throttle — return value', () => {
    useFakeTime(0);

    let counter = 0;
    const fn = throttle(() => ++counter, 100);

    const r1 = fn(); // leading → counter becomes 1
    assert(r1 === 1, 'returns the result of the first invocation');

    advanceTime(101);
    const r2 = fn(); // next window → counter becomes 2
    assert(r2 === 2, 'returns the result of the next invocation after the wait');

    fn.cancel();
    restoreTime();
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${'─'.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
    process.exit(1);
}
