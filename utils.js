/**
 * Utility Functions
 * A collection of useful utility functions for common tasks
 */

/**
 * Creates a debounced version of the provided function that delays its execution
 * until after the specified wait time has elapsed since the last time it was invoked.
 * 
 * This is useful for scenarios like:
 * - Search input fields (wait for user to stop typing)
 * - Resize event handlers
 * - Button click prevention
 * - API calls that should be rate-limited
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - If true, trigger the function on the leading edge instead of trailing
 * @returns {Function} The debounced function
 * 
 * @example
 * // Basic usage
 * const debouncedSearch = debounce((query) => {
 *   console.log('Searching for:', query);
 * }, 300);
 * 
 * // Usage with immediate execution
 * const debouncedSave = debounce(() => {
 *   console.log('Saving...');
 * }, 1000, true);
 * 
 * // In event handlers
 * window.addEventListener('resize', debounce(() => {
 *   console.log('Window resized');
 * }, 250));
 */
function debounce(func, wait, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(this, args);
  };
}

/**
 * Creates a throttled version of the provided function that only executes at most
 * once per specified time interval, regardless of how many times it's called.
 * 
 * Unlike debounce which delays execution until after a quiet period, throttle
 * ensures the function runs at regular intervals during continuous invocations.
 * 
 * This is useful for scenarios like:
 * - Scroll event handlers that need regular updates
 * - Mouse move tracking
 * - API calls that need consistent rate limiting
 * - Animation frame callbacks
 * - Progress indicators during continuous actions
 * 
 * @param {Function} func - The function to throttle
 * @param {number} limit - The number of milliseconds between executions
 * @param {Object} options - Optional configuration object
 * @param {boolean} options.leading - If true, execute on the leading edge (default: true)
 * @param {boolean} options.trailing - If true, execute on the trailing edge (default: true)
 * @returns {Function} The throttled function
 * 
 * @example
 * // Basic usage
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll position:', window.pageYOffset);
 * }, 100);
 * 
 * // Throttle with options
 * const throttledMouseMove = throttle((event) => {
 *   console.log('Mouse at:', event.clientX, event.clientY);
 * }, 50, { leading: true, trailing: false });
 * 
 * // API rate limiting
 * const throttledApiCall = throttle(() => {
 *   fetch('/api/data').then(response => response.json());
 * }, 1000);
 */
function throttle(func, limit, options = {}) {
  let inThrottle;
  let lastFunc;
  let lastRan;
  
  const { leading = true, trailing = true } = options;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      if (leading) {
        func.apply(this, args);
      }
      lastRan = Date.now();
      inThrottle = true;
    } else {
      if (trailing) {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    }
    
    setTimeout(() => {
      inThrottle = false;
    }, limit);
  };
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { debounce, throttle };
} else if (typeof exports !== 'undefined') {
  exports.debounce = debounce;
  exports.throttle = throttle;
} else if (typeof window !== 'undefined') {
  window.Utils = window.Utils || {};
  window.Utils.debounce = debounce;
  window.Utils.throttle = throttle;
}

/* 
 * Usage Examples:
 * 
 * // DEBOUNCE EXAMPLES:
 * // 1. Search input debouncing
 * const searchInput = document.getElementById('search');
 * const debouncedSearch = debounce((event) => {
 *   const query = event.target.value;
 *   // Make API call here
 *   fetch(`/api/search?q=${query}`)
 *     .then(response => response.json())
 *     .then(data => console.log(data));
 * }, 500);
 * 
 * searchInput.addEventListener('input', debouncedSearch);
 * 
 * // 2. Window resize handler
 * const handleResize = debounce(() => {
 *   console.log('Window dimensions:', window.innerWidth, window.innerHeight);
 *   // Recalculate layouts, update charts, etc.
 * }, 250);
 * 
 * window.addEventListener('resize', handleResize);
 * 
 * // 3. Button click prevention (immediate execution)
 * const submitButton = document.getElementById('submit');
 * const debouncedSubmit = debounce((event) => {
 *   // Prevent multiple rapid clicks
 *   console.log('Form submitted');
 *   // Submit form logic here
 * }, 2000, true);
 * 
 * submitButton.addEventListener('click', debouncedSubmit);
 * 
 * // 4. Scroll event optimization with debounce
 * const handleScrollDebounced = debounce(() => {
 *   const scrollPosition = window.pageYOffset;
 *   console.log('Scroll ended at position:', scrollPosition);
 *   // Update navigation after scrolling stops, load more content, etc.
 * }, 100);
 * 
 * window.addEventListener('scroll', handleScrollDebounced);
 * 
 * // THROTTLE EXAMPLES:
 * // 1. Scroll event with consistent updates
 * const throttledScrollHandler = throttle(() => {
 *   const scrollPercent = (window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100;
 *   console.log('Scroll progress:', Math.round(scrollPercent) + '%');
 *   // Update progress bar, parallax effects, etc.
 * }, 100);
 * 
 * window.addEventListener('scroll', throttledScrollHandler);
 * 
 * // 2. Mouse move tracking
 * const throttledMouseMove = throttle((event) => {
 *   console.log('Mouse coordinates:', event.clientX, event.clientY);
 *   // Update cursor effects, tooltips, etc.
 * }, 50);
 * 
 * document.addEventListener('mousemove', throttledMouseMove);
 * 
 * // 3. API calls with rate limiting
 * const throttledApiUpdate = throttle(() => {
 *   fetch('/api/live-data')
 *     .then(response => response.json())
 *     .then(data => {
 *       console.log('Live data updated:', data);
 *       // Update UI with fresh data
 *     });
 * }, 2000);
 * 
 * // Call this frequently, but API will only be hit every 2 seconds
 * setInterval(throttledApiUpdate, 100);
 * 
 * // 4. Button spam prevention with throttle
 * const likeButton = document.getElementById('like');
 * const throttledLike = throttle(() => {
 *   console.log('Like button clicked');
 *   // Send like to server, but limit to once per second
 *   fetch('/api/like', { method: 'POST' });
 * }, 1000);
 * 
 * likeButton.addEventListener('click', throttledLike);
 * 
 * // 5. Window resize with throttle (for continuous updates)
 * const throttledResize = throttle(() => {
 *   console.log('Window resizing...', window.innerWidth, window.innerHeight);
 *   // Update layouts continuously while resizing
 * }, 100);
 * 
 * window.addEventListener('resize', throttledResize);
 * 
 * // COMPARISON EXAMPLE: Debounce vs Throttle for scroll
 * // Use debounce when you want to act after scrolling stops
 * const scrollEndHandler = debounce(() => {
 *   console.log('User stopped scrolling');
 * }, 150);
 * 
 * // Use throttle when you want regular updates while scrolling
 * const scrollProgressHandler = throttle(() => {
 *   console.log('Scrolling in progress...');
 * }, 150);
 * 
 * window.addEventListener('scroll', scrollEndHandler);
 * window.addEventListener('scroll', scrollProgressHandler);
 */
