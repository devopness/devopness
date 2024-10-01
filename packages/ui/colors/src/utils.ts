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

export type {
  Flatten
}
