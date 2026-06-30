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
 * Gets a spacing token value by path (e.g. `button.paddingX`, `inset.md`).
 */
const getSpacing = <TSpacing extends Spacing>(
  name: TSpacing
): Flatten<typeof spacing>[TSpacing] => get(spacing, name)

export type { Spacing }

export { getSpacing, spacing }
