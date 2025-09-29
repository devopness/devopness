import { ComponentPropsWithoutRef } from 'react'

import { Button } from 'src/components/Buttons'
import type { Icon } from 'src/icons'

/**
 * Props for the `ToggleContentButton` component.
 */
type ToggleContentButtonProps = ComponentPropsWithoutRef<typeof Button> & {
  /** Whether the content is currently visible
   * @default false
   */
  showContent?: boolean
  /** Optional props when hiding the content */
  hideContentProps?: {
    text?: string
    icon?: Icon
  }
  /** Optional props when revealing the content */
  revealContentProps?: {
    text?: string
    icon?: Icon
  }
}

/**
 * Button to toggle visibility of sensitive content.
 */
const ToggleContentButton = ({
  showContent = false,
  hideContentProps,
  revealContentProps,
  ...props
}: ToggleContentButtonProps) => {
  const buttonIcon =
    props.icon ??
    (showContent
      ? (hideContentProps?.icon ?? 'eyeClosed')
      : (revealContentProps?.icon ?? 'eyeOpen'))
  const buttonText = showContent
    ? (hideContentProps?.text ?? 'hide value')
    : (revealContentProps?.text ?? 'reveal value')

  return (
    <Button
      type="button"
      typeSize="auto"
      buttonType="borderless"
      noPadding
      {...props}
      icon={buttonIcon}
    >
      {buttonText}
    </Button>
  )
}

export { ToggleContentButton }
export type { ToggleContentButtonProps }
