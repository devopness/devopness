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
    ? O extends infer _ // eslint-disable-line @typescript-eslint/no-unused-vars
      ? { [K in keyof O]: O[K] }
      : never
    : never

/**
 * Maps opacity values in range [begin=0,end=1,step=0.1] to Hexadecimal
 */
type OpacityFromFloatToHex = {
  0: '00'
  0.1: '19'
  0.2: '33'
  0.3: '4c'
  0.4: '66'
  0.5: '7f'
  0.6: '99'
  0.7: 'b2'
  0.8: 'cc'
  0.9: 'e5'
  1: 'ff'
}

/** Represents a digit of a Hexadecimal value, base 16 */
type HexDigit =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'

export type { Flatten, OpacityFromFloatToHex, HexDigit }
