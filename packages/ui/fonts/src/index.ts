import get from 'lodash/get'

const fonts = {
  roboto: 'Roboto',
  montserrat: 'Montserrat',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
} as const

/**
 * Lists all valid font codes
 */
type Font = keyof typeof fonts

/**
 * Gets the font' CSS Font Family list
 */
const getFont = <TFont extends Font>(name: TFont): (typeof fonts)[TFont] =>
  get(fonts, name) as (typeof fonts)[TFont]

export type { Font }

export { getFont }
