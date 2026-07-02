/**
 * Centralized spacing tokens for `ui-react`.
 *
 * Keep these values in one place so button and layout spacing stay consistent
 * without scattering magic numbers through component styles.
 */
import get from 'lodash/get'

import type { Flatten } from 'src/colors/types'

const spacing = {
  button: {
    paddingX: '15px',
    paddingY: '5px',
    iconGap: '10px',
  },
  inset: {
    md: '15px',
  },
} as const

type Spacing = keyof Flatten<typeof spacing>

/**
 * Looks up a spacing token by dot-path (for example `button.paddingX`).
 */
const getSpacing = <TSpacing extends Spacing>(
  name: TSpacing
): Flatten<typeof spacing>[TSpacing] =>
  get(spacing, name) as Flatten<typeof spacing>[TSpacing]

export type { Spacing }

export { getSpacing, spacing }
