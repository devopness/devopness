'use client'

import type { ButtonHTMLAttributes } from 'react'

import { BaseIconButton, IconContent } from './IconButton.styled'
import type { IconButtonVariant } from './IconButton.variants'
import {
  DEFAULT_ICON_SIZE,
  DEFAULT_VARIANT,
  VARIANT_DEFAULTS,
} from './IconButton.variants'
import type { Color } from 'src/colors'
import { Icon } from 'src/components/Primitives/Icon'
import type { Icon as IconName } from 'src/icons'

type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'color'
> & {
  /**
   * Custom background color token.
   *
   * Works on every variant — when set on `ghost` or `outlined` it tints the
   * normally transparent background. Falls back to the variant default.
   */
  backgroundColor?: Color
  /**
   * Custom border color token.
   *
   * Only `outlined` actually renders a border. Setting this on `primary` or
   * `ghost` has no visual effect. Falls back to the variant default.
   */
  borderColor?: Color
  /**
   * Custom icon color token.
   *
   * Also drives the `:focus-visible` ring on `ghost` and `outlined` so the
   * focus indicator inherits any color override. Falls back to the variant
   * default.
   */
  color?: Color
  /** Icon name from the Devopness icon set */
  name: IconName
  /**
   * Padding around the icon, in pixels.
   *
   * Final button size is `size + 2 * padding`.
   *
   * @default 6
   */
  padding?: number
  /**
   * Icon size in pixels.
   *
   * @default 28
   */
  size?: number
  /**
   * Visual variant.
   *
   * - `primary`: filled purple circle, white icon — for primary actions
   * - `ghost`: no background or border, just the icon, hover dims it —
   *   for inline/quiet actions like help, avatar, navigation
   * - `outlined`: circular border, purple icon — for secondary actions
   *   that still need a visible affordance
   *
   * @default 'primary'
   */
  variant?: IconButtonVariant
  /**
   * Accessible label. Required for icon-only buttons. The label is announced
   * by the button itself — the inner icon is marked `aria-hidden` so AT
   * tools don't announce both.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label}
   */
  'aria-label': string
}

const IconButton = ({
  backgroundColor,
  borderColor,
  color,
  name,
  padding,
  size = DEFAULT_ICON_SIZE,
  type = 'button',
  variant = DEFAULT_VARIANT,
  ...props
}: IconButtonProps) => {
  const resolvedIconColor = color ?? VARIANT_DEFAULTS[variant].iconColor

  return (
    <BaseIconButton
      data-testid="icon-button"
      $backgroundColor={backgroundColor}
      $borderColor={borderColor}
      $color={color}
      $padding={padding}
      $size={size}
      $variant={variant}
      type={type}
      {...props}
    >
      <IconContent
        data-testid="icon-button-content"
        aria-hidden="true"
      >
        <Icon
          name={name}
          size={size}
          color={resolvedIconColor}
        />
      </IconContent>
    </BaseIconButton>
  )
}

export { IconButton }
export type { IconButtonProps, IconButtonVariant }
