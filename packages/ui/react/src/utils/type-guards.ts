import React from 'react'

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Unwrap<T>
 *
 * Construct a type with the all properties of T without intersections.
 * This makes the hover overlay more readable.
 *
 * @example Both types below are equivalent
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

/**
 * Convert plural string literal to singular, removing suffix 's'
 */
type Singularize<S extends string> = S extends `${infer Singular}s`
  ? Singular
  : never

/**
 * Convert {snake, kebab}-case string literal to camelCase
 */
type CamelCase<S extends string> =
  S extends `${infer Head}${'_' | '-'}${infer Tail}`
    ? `${Head}${CamelCase<Capitalize<Tail>>}`
    : S

type GlobalStringExtensions = {
  /** Converts all the alphabetic characters in a string to uppercase. */
  toUpperCase<T extends string>(this: T): Uppercase<T>
  /** Converts all the alphabetic characters in a string to lowercase. */
  toLowerCase<T extends string>(this: T): Lowercase<T>
}

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-object-type
  interface String extends GlobalStringExtensions {}
}

/**
 * Convert kebab-case string literal to snake_case
 */
type SnakeCase<S extends string> = S extends `${infer Head}-${infer Tail}`
  ? `${Head}_${SnakeCase<Tail>}`
  : S

/**
 * Convert snake_case string literal to kebab-case
 */
type KebabCase<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}-${KebabCase<Tail>}`
  : S

type TypeGuardReadonlyArray<T> = readonly T[] & {
  includes(searchElement: unknown, fromIndex?: number): searchElement is T
}

function isDefined<T>(data: T | void | null | undefined): data is T {
  return typeof data !== 'undefined' && data !== null
}

function isObjectKeyValidator<
  T extends Record<string, unknown>,
  K extends keyof T,
>(object: T) {
  return (key: K | Omit<string, K> | undefined): key is K =>
    (key as string) in object
}

function isValidAction(id: number | null | undefined): id is number {
  return isDefined(id) && id > 0
}

/**
 * Check if resource id value is a valid Devopness Resource ID
 */
const isValidResourceId = isValidAction

/**
 * Use failWhenUndefined() to assert state which your program assumes to be true
 */
function failWhenUndefined(value: boolean, message?: string): asserts value
function failWhenUndefined<T>(
  value: T | null | undefined,
  message?: string
): asserts value is T
function failWhenUndefined(value: unknown, message?: string) {
  if (value === false || value === null || typeof value === 'undefined') {
    throw new Error(message)
  }
}

const typedMemo: <T>(c: T) => T = React.memo

/**
 * Array.pop() for types
 *
 * @example
 *
 * Pop<['a', 'b', 'c']>
 * // ^? ['a', 'b']
 *
 * Code obtained from StackOverflow: https://stackoverflow.com/a/72299265
 * Source code from alex-wayne @ https://stackoverflow.com/users/62076/alex-wayne
 */
type Pop<T extends unknown[]> = T extends [
  ...infer U,
  unknown,
]
  ? U
  : never

/**
 * Flatten an object while retaining types for all paths
 *
 * The mapped type keys are useful to work with loadash.get
 *
 * Examples:
 *
 * Flatten<{ red: 'red', green: { 50: 'light-green' }}>
 * // ^? { red: 'red', 'green.50': 'light-green' }
 *
 * @see {@link https://docs-lodash.com/v4/get/}
 *
 * Code obtained from StackOverflow: https://stackoverflow.com/a/66620803
 * Source code from jcalz @ https://stackoverflow.com/users/2887218/jcalz
 */
type Flatten<T extends object> = object extends T
  ? object
  : {
        [K in keyof T]-?: (
          x: NonNullable<T[K]> extends infer V
            ? V extends object
              ? V extends readonly unknown[]
                ? Pick<T, K>
                : Flatten<V> extends infer FV
                  ? {
                      [P in keyof FV as `${Extract<K, string | number>}.${Extract<
                        P,
                        string | number
                      >}`]: FV[P]
                    }
                  : never
              : Pick<T, K>
            : never
        ) => void
      } extends Record<keyof T, (y: infer O) => void>
    ? { [K in keyof O]: O[K] }
    : never

export type {
  TypeGuardReadonlyArray,
  WithOptional,
  Singularize,
  CamelCase,
  SnakeCase,
  KebabCase,
  Pop,
  Flatten,
  Unwrap,
}
export {
  isDefined,
  isObjectKeyValidator,
  isValidAction,
  isValidResourceId,
  failWhenUndefined,
  typedMemo,
}
