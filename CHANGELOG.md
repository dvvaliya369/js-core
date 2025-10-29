# Changelog

## [Unreleased] - 2025-10-29

### Added
- **TypeScript Support**: Added comprehensive TypeScript type definitions in `utils.d.ts`
  - Generic type parameter for type-safe function signatures
  - Proper typing for all parameters (func, wait, immediate)
  - DebouncedFunction interface for better type inference
  - JSDoc documentation in type definitions
  
- **TypeScript Test File**: Created `test_types.ts` demonstrating TypeScript usage examples

### Changed
- **Improved Code Clarity**: Refactored debounce function to use arrow function syntax
  - Changed from `function executedFunction(...args)` to `(...args) => {}`
  - Improved readability and modern JavaScript practices
  - Maintained backward compatibility with existing code
  
- **Updated Documentation**: Enhanced README.md with TypeScript usage examples

### Technical Details
- All existing tests pass successfully
- Backward compatible with existing JavaScript code
- Supports both CommonJS and ES6 module systems
- Works in both Node.js and browser environments

### Migration Guide
No breaking changes. Existing code will continue to work without modifications.

For TypeScript users, simply import the function:
```typescript
import { debounce } from './utils';
```

The type definitions will be automatically picked up by TypeScript.
