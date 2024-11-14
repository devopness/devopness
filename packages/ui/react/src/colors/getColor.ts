import get from 'lodash/get'

import type { Flatten, HexDigit, OpacityFromFloatToHex } from './types'

const colors = {
  amber: {
    800: '#a39015',
    500: '#fab01c',
    400: '#fdb762',
    300: '#fdd88e',
    200: '#fee2c0',
    150: '#feebc6',
    100: '#fff1e0',
    50: '#fff6ef',
    10: '#fffcf5',
  },
  black: '#000000',
  blue: {
    950: '#2e374e',
    800: '#2e364e',
    750: '#37436b',
    700: '#0064a5',
    600: '#016ee9',
    500: '#0496f5',
    400: '#96c7fe',
    300: '#b9daff',
    100: '#dcecff',
    50: '#e8f6ff',
    25: '#eef2ff',
  },
  brown: {
    400: '#b5a7a2',
    50: '#faf8f1',
  },
  cyan: {
    800: '#537e8c',
    400: '#00d7d7',
    300: '#02e0d1',
    200: '#e0f7fa',
    100: '#ebfafb',
    50: '#f6fffe',
  },
  fuchsia: {
    600: '#d000ff',
    10: '#fdf5ff',
  },
  gray: {
    900: '#42495a',
    800: '#828795',
    615: '#9198a5',
    600: '#9196a4',
    500: '#b0b3bc',
    400: '#afb8c9',
    300: '#bdc4d3',
    200: '#f3f7fe',
  },
  green: {
    800: '#57b261',
    600: '#0cd356',
    300: '#9eedbb',
    200: '#b6f2cc',
    150: '#cef6dd',
    125: '#effff1',
    100: '#edf9ee',
  },
  indigo: {
    100: '#f5f6ff',
    50: '#f6f8ff',
    10: '#f8faff',
  },
  orange: {
    700: '#f89532',
    600: '#ff8700',
    500: '#f8bf4d',
    400: '#fdba62',
    100: '#f6f4e7',
    50: '#fff6f0',
    10: '#fff9f0',
  },
  purple: {
    800: '#786efd',
    400: '#cac7fc',
    300: '#dfe4fd',
    275: '#dfe6ff',
    250: '#e6ecff',
    100: '#f2f1ff',
    50: '#f2f2fa',
  },
  red: {
    500: '#fd595c',
    450: '#ff6666',
    400: '#f67771',
    300: '#febdbe',
    200: '#fecdce',
    150: '#ffdede',
    100: '#ffe8e8',
    50: '#fff3f3',
  },
  slate: {
    600: '#4a526a',
    450: '#72798f',
    400: '#abb4c5',
    300: '#e3e8f9',
  },
  stone: {
    100: '#f6f6f6',
    50: '#edf2f3',
  },
  transparent: 'transparent',
  white: '#ffffff',
  yellow: {
    300: '#fff793',
  },
} as const

/**
 * Maps Color paths on format <color>.<shade> to its value in hex, based on colors object
 */
type ColorToHexMapper = Flatten<typeof colors>

/**
 * Lists all valid color codes, following format <color>.<shade>
 */
type Color = keyof ColorToHexMapper

/**
 * Gets the color' hex value
 *
 * @param name Color name on format <color>.<shade>
 */
const getColor = <TColor extends Color>(
  name: TColor
): ColorToHexMapper[TColor] =>
  get(colors, name) as unknown as ColorToHexMapper[TColor]

/**
 * Adds opacity suffix to colors
 *
 * @param color string in hexadecimal format #rrggbb
 *
 * @param opacity number in range 0.0 to 1.0
 *
 * This methods transform opacity from number to a hexadecimal (16) color alpha component, meaning
 * a number between 0 and ff (255) in base 16
 *
 * @returns color with added opacity information #rrggbbaa
 *
 * @example
 *
 * > getOpacity(#fff1e0, 0.5) // => #fff1e07f, 7f == 0.5
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/hex-color#a}
 */
const getOpacity = <
  HexColor extends ColorToHexMapper[Color],
  Opacity extends number,
>(
  color: HexColor,
  opacity: Opacity
) => {
  if (!color.startsWith('#')) return color as Exclude<HexColor, `#${string}`>

  return `${color}${(opacity * 255).toString(16).slice(0, 2)}` as `${Extract<HexColor, `#${string}`>}${Opacity extends keyof OpacityFromFloatToHex
    ? OpacityFromFloatToHex[Opacity]
    : `${HexDigit}${HexDigit}`}`
}

export type { Color }

export { getColor, getOpacity }
