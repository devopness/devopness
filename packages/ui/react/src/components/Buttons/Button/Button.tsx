'use client'

import type { ButtonHTMLAttributes } from 'react'

import { BaseButton, ContentIcon, Label } from './Button.styled'
import { getColor } from 'src/colors'
import type { Icon } from 'src/icons'
import { iconLoader } from 'src/icons'

const DEFAULT_ICON_SIZE = 16

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Customize background color */
  backgroundColor?: string
  /** Customize border color */
  borderColor?: string
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
  /** Icon name */
  icon?: Icon
  /**
   * By default the icon color is primary, use this prop to customize "iconColor"
   */
  iconColor?: ReturnType<typeof getColor>
  /**
   * By default the icon component is 16px high, use this prop to customize "iconSize"
   */
  iconSize?: number
  /** Enable button loading animation */
  loading?: boolean
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
   * With the property "revertOrientation" it is possible to change the positioning of
   * the elements inside the button as "icon" or "loading"
   */
  revertOrientation?: boolean
  /**
   * By default the button component is 34px high, the "typeSize" property contains
   * the "medium" variation that changes to 27px
   */
  typeSize?: 'default' | 'medium' | 'auto'
}

const getLoadingColor = (buttonType?: string) => {
  switch (buttonType) {
    case 'borderless':
    case 'outlinedSecondary':
    case 'outlinedAuxiliary':
      return getColor('purple.800')
    default:
      return getColor('white')
  }
}

type IconProps = Pick<
  ButtonProps,
  'loading' | 'icon' | 'iconSize' | 'buttonType' | 'iconColor'
>

const Icon = ({
  loading: isLoading,
  icon,
  iconSize,
  buttonType,
  iconColor,
}: IconProps) => {
  const noDefinedIcons = !isLoading && !icon
  if (noDefinedIcons) return <></>

  return (
    <ContentIcon
      data-testid="button-icon"
      $iconSize={iconSize ?? DEFAULT_ICON_SIZE}
      /**
       * Icon is safe to use non-null assertion because this component only renders
       * when either isLoading or icon prop is defined, as checked by noDefinedIcons
       */
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      aria-label={isLoading ? 'loading' : `${icon!} icon`}
    >
      {iconLoader(
        isLoading ? 'loading' : icon,
        iconSize ?? DEFAULT_ICON_SIZE,
        isLoading ? getLoadingColor(buttonType) : iconColor
      )}
    </ContentIcon>
  )
}

/** Primary UI component for user interaction */
const Button = ({
  backgroundColor,
  borderColor,
  buttonType,
  children,
  color,
  disabled,
  icon,
  iconColor,
  iconSize,
  loading: isLoading,
  noIconMargin,
  noMargin,
  noPadding,
  noPointerEvents,
  revertOrientation = false,
  tabIndex,
  type,
  typeSize = 'default',
  ...props
}: ButtonProps) => (
  <BaseButton
    data-testid="button"
    $backgroundColor={backgroundColor}
    $borderColor={borderColor}
    $buttonType={buttonType}
    $color={color}
    $noIconMargin={noIconMargin}
    $noMargin={noMargin}
    $noPadding={noPadding}
    $noPointerEvents={noPointerEvents}
    $revertOrientation={revertOrientation}
    $typeSize={typeSize}
    disabled={disabled}
    tabIndex={tabIndex}
    type={type}
    {...props}
  >
    <Icon
      loading={isLoading}
      icon={icon}
      iconSize={iconSize}
      buttonType={buttonType}
      iconColor={iconColor}
    />
    {children && (
      <Label
        data-testid="button-label"
        className="translate"
      >
        {children}
      </Label>
    )}
  </BaseButton>
)

export { Button }
export type { ButtonProps }
