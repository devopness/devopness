import type { Color } from 'src/colors'

type IconButtonVariant = 'primary' | 'ghost' | 'outlined'

type VariantDefaults = {
  backgroundColor: Color
  borderColor: Color
  iconColor: Color
  /**
   * Which resolved color drives the `:focus-visible` ring.
   *
   * - `background`: filled variants — outline matches the fill so it stays
   *   visible against a white page.
   * - `icon`: variants without a filled background — outline matches the
   *   icon/border color and inherits any consumer override.
   */
  focusRingFrom: 'background' | 'icon'
}

const DEFAULT_ICON_SIZE = 28
const DEFAULT_PADDING = 6
const DEFAULT_VARIANT: IconButtonVariant = 'primary'

const VARIANT_DEFAULTS: Record<IconButtonVariant, VariantDefaults> = {
  primary: {
    backgroundColor: 'purple.800',
    borderColor: 'transparent',
    iconColor: 'white',
    focusRingFrom: 'background',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    iconColor: 'purple.800',
    focusRingFrom: 'icon',
  },
  outlined: {
    backgroundColor: 'transparent',
    borderColor: 'purple.800',
    iconColor: 'purple.800',
    focusRingFrom: 'icon',
  },
}

export type { IconButtonVariant, VariantDefaults }
export { DEFAULT_ICON_SIZE, DEFAULT_PADDING, DEFAULT_VARIANT, VARIANT_DEFAULTS }
