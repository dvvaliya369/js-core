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

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { debounce };
} else if (typeof exports !== 'undefined') {
  exports.debounce = debounce;
} else if (typeof window !== 'undefined') {
  window.Utils = window.Utils || {};
  window.Utils.debounce = debounce;
}

/* 
 * Usage Examples:
 * 
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
 * // 4. Scroll event optimization
 * const handleScroll = debounce(() => {
 *   const scrollPosition = window.pageYOffset;
 *   console.log('Scroll position:', scrollPosition);
 *   // Update navigation, load more content, etc.
 * }, 100);
 * 
 * window.addEventListener('scroll', handleScroll);
 */
