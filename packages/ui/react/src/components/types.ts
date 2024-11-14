/**
 * Unwrap<T>
 *
 * Construct a type with the all properties of T without intersections.
 * This makes the hover overlay and the story generated type description more readable.
 *
 * @example Both types below are equivalent
 *
 * type Intersected = { a: string; } & { b: number; } & { c: boolean; }
 * //   ^? { a: string; } & { b: number; } & { c: boolean; }
 * type UnwrappedIntersected = Unwrap<Intersected>
 * //   ^? { a: string; b: number; c: boolean; }
 *
 * @example Both types below are equivalent
 *
 * type PickFromTwoTypes = Pick<Intersected, 'a' | 'b'> & Pick<Intersected, 'c'>
 * //   ^? Pick<Intersected, 'a' | 'b'> & Pick<Intersected, 'c'>
 * type UnwrappedPickFromTwoTypes = Unwrap<PickFromTwoTypes>
 * //   ^? { a: string; b: number; c: boolean; }
 *
 * Code obtained from Total TypeScript: https://www.totaltypescript.com/concepts/the-prettify-helper
 * Source code from mattpocock @ https://github.com/mattpocock
 */
type Unwrap<T> = {
  [K in keyof T]: T[K]
} & {}

export type { Unwrap }
