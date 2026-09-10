import 'vitest'

import { type TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare module 'vitest' {
  interface Assertion<
    R extends void | Promise<void> = void,
    T = unknown,
  > extends TestingLibraryMatchers<any, T> {}

  interface AsymmetricMatchersContaining
    extends TestingLibraryMatchers<any, any> {}
}
