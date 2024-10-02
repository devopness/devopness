import type { ButtonHTMLAttributes } from 'react'

import { BaseButton, ContentLoading, ContentIcon, Label } from './styled'
import { getColor } from 'src/colors/getColor'
import type { Icon } from 'src/icons/iconLoader'
import { iconLoader } from 'src/icons/iconLoader'

const DEFAULT_ICON_SIZE = 16
const MIN_LOADING_ICON_SIZE = 2
const LOADING_ICON_SIZE_RATIO = 8

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * By default the button component is 34px high, the "typeSize" property contains
   * the "medium" variation that changes to 27px
   */
  typeSize?: 'default' | 'medium' | 'auto'
  /** Icon name */
  icon?: Icon
  /** Enable button loading animation */
  loading?: boolean
  /**
   * With the property "revertOrientation" it is possible to change the positioning of
   * the elements inside the button as "icon" or "loading"
   */
  revertOrientation?: boolean
  /** Predefined style variations for the button */
  buttonType?:
    | 'borderless'
    | 'outlinedSecondary'
    | 'outlinedAuxiliary'
    | 'Default'
  /** `Warning`: This property overrides the style defined by the `buttonType` property!
   *
   * Customize elements color
   */
  color?: string
  /** `Warning`: This property overrides the style defined by the `buttonType` property!
   *
   * Customize background color
   */
  backgroundColor?: string
  /** `Warning`: This property overrides the style defined by the `buttonType` property!
   *
   * Customize border color
   */
  borderColor?: string
  /**
   * The button component has a 15px margin on its sides, to remove activate the "noMargin" property
   */
  noMargin?: boolean
  /**
   * The button component has a 10px margin on its sides, to remove activate the "noIconMargin" property
   */
  noIconMargin?: boolean
  /**
   * The button component has a 15px padding on its sides, to remove activate the "noPadding" property
   */
  noPadding?: boolean
  /**
   * It should be true if the button is wrapped in a tooltip
   */
  noPointerEvents?: boolean
  /**
   * By default the icon component is 16px high, use this prop to customize "iconSize"
   */
  iconSize?: number
  /**
   * By default the icon color is primary, use this prop to customize "iconColor"
   */
  iconColor?: ReturnType<typeof getColor>
}

const getTextColor = (buttonType?: string) => {
  switch (buttonType) {
    case 'borderless':
    case 'outlinedSecondary':
    case 'outlinedAuxiliary':
      return getColor('purple.800')
    default:
      return getColor('white')
  }
}

/** Primary UI component for user interaction */
const Button = ({
  type,
  typeSize = 'default',
  buttonType,
  color,
  backgroundColor,
  borderColor,
  disabled,
  onClick,
  tabIndex,
  loading,
  icon,
  children,
  revertOrientation = false,
  noMargin,
  noIconMargin,
  noPointerEvents,
  iconSize,
  iconColor,
  ...props
}: ButtonProps) => {
  const handleLoadingAndIcons = ({
    noIconMargin = false,
    revertOrientation = false,
  }) => {
    if (loading) {
      return (
        <ContentLoading
          data-testid="loading"
          revertOrientation={revertOrientation}
          iconSize={iconSize ?? DEFAULT_ICON_SIZE}
        >
          {iconLoader(
            'loading',
            Math.max(
              (iconSize ?? DEFAULT_ICON_SIZE) / LOADING_ICON_SIZE_RATIO,
              MIN_LOADING_ICON_SIZE
            ),
            getTextColor(buttonType)
          )}
        </ContentLoading>
      )
    }

    if (icon) {
      return (
        <ContentIcon
          data-testid="icon"
          revertOrientation={revertOrientation}
          noIconMargin={noIconMargin}
          iconSize={iconSize ?? DEFAULT_ICON_SIZE}
        >
          {iconLoader(icon, iconSize ?? DEFAULT_ICON_SIZE, iconColor)}
        </ContentIcon>
      )
    }
  }

  return (
    <BaseButton
      data-testid="button"
      size={typeSize}
      buttonType={buttonType}
      reversed={revertOrientation}
      noPointerEvents={noPointerEvents}
      custom={{
        color: color,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
      }}
      noMargin={noMargin}
      disabled={disabled}
      type={type}
      onClick={(event) => {
        if (onClick) {
          onClick(event)
        }
      }}
      tabIndex={tabIndex}
      {...props}
    >
      {(!!loading || !!icon) &&
        handleLoadingAndIcons({ noIconMargin, revertOrientation })}
      {children && <Label className="translate">{children}</Label>}
    </BaseButton>
  )
}

export type { ButtonProps }
export { Button }
