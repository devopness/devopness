import { HTMLAttributes } from 'react'

import { getColor, getOpacity } from 'src/colors'
import type { Color } from 'src/colors'
import { Icon as IconName, iconLoader } from 'src/icons'

type IconProps = {
  /**
   * Defines which icon to render from Devopness UI Icons
   *
   * @see iconLoader
   */
  name: IconName | undefined
  /** Defines element height and width */
  size?: number
  /**
   * Defines element foreground/fill color
   *
   * https://developer.mozilla.org/en-US/docs/Web/CSS/color
   * https://developer.mozilla.org/en-US/docs/Web/CSS/fill
   *
   * @see {getColor}
   */
  color?: Color
  /**
   * Defines the degree to which content behind an element is hidden; is a number in the range 0.0 to 1.0
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/opacity}
   */
  opacity?: number
  /**
   * Defines a string value that labels the current element
   *
   * Uses name as fallback, if prop is undefined
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label}
   */
  ariaLabel?: HTMLAttributes<HTMLOrSVGImageElement>['aria-label']
}

/** Color to be used when IconProps.color is undefined */
const COLOR_FALLBACK = 'purple.800' satisfies Color

/** Represents 100% opacity in range 0.0 to 1.0 */
const OPACITY_FULL = 1.0 // => '100%'

/**
 * Loads icon from iconLoader
 *
 * @see {@link src/icons/iconLoader.tsx:iconLoader}
 */
const Icon = (props: IconProps) => {
  const colorHex = getColor(props.color ?? COLOR_FALLBACK)

  return iconLoader(
    props.name,
    props.size,
    props.opacity !== undefined
      ? getOpacity(colorHex, props.opacity)
      : colorHex,
    OPACITY_FULL,
    props.ariaLabel ?? props.name
  )
}

export type { IconProps }
export { Icon }
