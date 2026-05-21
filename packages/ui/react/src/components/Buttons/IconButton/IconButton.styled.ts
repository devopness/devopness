import { styled, css } from 'styled-components'

import type { IconButtonProps } from '.'
import type { IconButtonVariant } from './IconButton.variants'
import {
  DEFAULT_ICON_SIZE,
  DEFAULT_PADDING,
  VARIANT_DEFAULTS,
} from './IconButton.variants'
import { getColor } from 'src/colors'

type StyledProps = {
  /**
   * IconButton props related to styling
   *
   * Adds a `$` prefix to the prop name to prevent it from being passed to the
   * underlying React node or rendered to the DOM element
   *
   * @see {@link https://styled-components.com/docs/api#transient-props | Styled Components - Transient props}
   */
  [Key in keyof Pick<
    IconButtonProps,
    'backgroundColor' | 'borderColor' | 'color' | 'padding' | 'size'
  > as `$${Key}`]: IconButtonProps[Key]
} & {
  $variant: IconButtonVariant
}

type ResolvedVariantStyle = {
  backgroundColor: string
  iconColor: string
  borderColor: string
  hoverBackgroundColor: string
  hoverBorderColor: string
  focusRingColor: string
}

const resolveVariantStyle = (
  variant: IconButtonVariant,
  overrides: {
    backgroundColor: StyledProps['$backgroundColor']
    borderColor: StyledProps['$borderColor']
    color: StyledProps['$color']
  }
): ResolvedVariantStyle => {
  const defaults = VARIANT_DEFAULTS[variant]
  const backgroundColor = getColor(
    overrides.backgroundColor ?? defaults.backgroundColor
  )
  const borderColor = getColor(overrides.borderColor ?? defaults.borderColor)
  const iconColor = getColor(overrides.color ?? defaults.iconColor)

  const isFilled = variant === 'primary'
  const hoverBackgroundColor = isFilled
    ? `color-mix(in srgb, ${backgroundColor} 90%, #000)`
    : `color-mix(in srgb, ${iconColor} 12%, white)`
  const hoverBorderColor =
    variant === 'outlined'
      ? `color-mix(in srgb, ${borderColor} 88%, #000)`
      : borderColor

  const focusRingColor =
    defaults.focusRingFrom === 'background' ? backgroundColor : iconColor

  return {
    backgroundColor,
    iconColor,
    borderColor,
    hoverBackgroundColor,
    hoverBorderColor,
    focusRingColor,
  }
}

const IconContent = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

const BORDER_WIDTH = 1

const BaseIconButton = styled.button<StyledProps>`
  ${({ $backgroundColor, $borderColor, $color, $padding, $size, $variant }) => {
    const iconSize = $size ?? DEFAULT_ICON_SIZE
    const padding = $padding ?? DEFAULT_PADDING
    const hasBorder = $variant === 'outlined'
    // Outer size grows by the border width so every variant keeps the same
    // visible padding around the icon (`box-sizing: border-box` would
    // otherwise eat 2px of content space on `outlined`).
    const borderOffset = hasBorder ? BORDER_WIDTH * 2 : 0
    const outerSize = iconSize + padding * 2 + borderOffset

    const resolved = resolveVariantStyle($variant, {
      backgroundColor: $backgroundColor,
      borderColor: $borderColor,
      color: $color,
    })

    return css`
      /** Base */
      cursor: pointer;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: ${outerSize}px;
      height: ${outerSize}px;
      padding: ${padding}px;
      margin: 0;
      background-color: ${resolved.backgroundColor};
      color: ${resolved.iconColor};
      border-color: ${resolved.borderColor};
      border-style: ${hasBorder ? 'solid' : 'none'};
      border-width: ${hasBorder ? `${BORDER_WIDTH}px` : '0'};
      border-radius: ${outerSize}px;
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease,
        filter 0.3s ease;

      &:hover:enabled {
        filter: brightness(75%);
      }

      @supports (background-color: color-mix(in srgb, red 50%, blue)) {
        &:hover:enabled {
          filter: none;
          background-color: ${resolved.hoverBackgroundColor};
          ${hasBorder &&
          css`
            border-color: ${resolved.hoverBorderColor};
          `}
        }
      }

      &:focus-visible {
        outline: 2px solid ${resolved.focusRingColor};
        outline-offset: 2px;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    `
  }}
`

export { BaseIconButton, IconContent, resolveVariantStyle }
