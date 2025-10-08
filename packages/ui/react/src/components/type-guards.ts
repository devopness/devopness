import { memo } from 'react'

/**
 * Checks if the given data is defined (i.e. it is not null or undefined).
 *
 * @template T The type of the data.
 * @param data The data to check.
 * @returns {boolean} True if the data is defined, false otherwise.
 *
 * @example
 * isDefined(5); // true
 * isDefined(null); // false
 */
function isDefined<T>(data: T | null | undefined): data is T {
  return typeof data !== 'undefined' && data !== null
}

const typedMemo: <T>(c: T) => T = memo

export { isDefined, typedMemo }
