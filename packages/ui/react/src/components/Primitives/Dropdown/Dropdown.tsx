import React from 'react'

import type { PopoverOrigin } from '@mui/material/Popover'
import Popover from '@mui/material/Popover'
import { useTheme } from '@mui/material/styles'
import type { InjectedProps as PopupStateProps } from 'material-ui-popup-state'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'

import {
  MenuContainer,
  MenuOption,
  Text,
  ClickableContainer,
  ContentBadge,
} from './Dropdown.styled'
import type { Color } from 'src/colors'
import type { ButtonProps } from 'src/components/Buttons'
import { Button } from 'src/components/Buttons'
import { ConditionalWrapper } from 'src/components/helpers'
import type { IconProps } from 'src/components/Primitives/Icon'
import { Icon } from 'src/components/Primitives/Icon'
import type { LinkProps } from 'src/components/Primitives/Link'
import { Link } from 'src/components/Primitives/Link'
import type { TooltipProps } from 'src/components/Primitives/Tooltip'
import { Tooltip } from 'src/components/Primitives/Tooltip'
import type { Unwrap } from 'src/components/types'

const DEFAULT_BUTTON_ICON_SIZE = 10
const DEFAULT_ICON_MARGIN = 10

type DropdownOptionIcon = Unwrap<
  IconProps & Pick<React.CSSProperties, 'backgroundColor'>
> & { icon: true }

type DropdownOptionLetter = Unwrap<
  Pick<React.CSSProperties, 'backgroundColor' | 'color'>
> & {
  icon?: never
}

type DropdownOption = {
  /**
   * Background Color to use when option is active
   */
  activeBackgroundColor?: Color
  /**
   * Option Badge configuration
   *
   * An option badge can be an icon or the label's first letter
   */
  badge?: DropdownOptionIcon | DropdownOptionLetter
  /**
   * Add separator from previous options
   */
  brokenSequence?: boolean
  /**
   * Label text color
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/color}
   */
  color?: Color
  /**
   * Highlight option
   */
  isActive?: boolean
  /**
   * Disables option
   */
  isDisabled?: boolean
  /**
   * Option description
   */
  label?: string
  /**
   * Link properties
   *
   * @see {Link}
   */
  linkProps?: LinkProps
  /**
   * Event handler called when this option is clicked.
   */
  onClick?: () => null
  /**
   * Tooltip's title
   *
   * @see {Tooltip}
   */
  tooltip?: TooltipProps['title']
  /**
   * Transforms label to a Link and point user to this url
   *
   * @see {Link}
   */
  url?: string
}

type DropdownSharedProps = {
  /**
   * This is the point on the anchor where the popover's
   * `anchorEl` will attach to. This is not used when the
   * anchorReference is 'anchorPosition'.
   *
   * Options:
   * vertical: [top, center, bottom];
   * horizontal: [left, center, right].
   *
   * help: https://mui.com/material-ui/react-popover/#anchor-playground
   */
  anchorOrigin?: PopoverOrigin
  /**
   * The unique id to identify the dropdown anchor element.
   */
  id: string
  /**
   * Event handler called when a dropdown option is selected.
   *
   * This prop can be overriden using option.onClick
   *
   * @see {DropdownOption}
   */
  onSelect?: (itemClicked: DropdownOption) => void
  /**
   * Event handler called when the dropdown is opened or closed.
   */
  onToggle?: (popupState: PopupStateProps) => void
  /**
   * Options listed in the Dropdown menu popup.
   *
   * @see {DropdownOption}
   */
  options: DropdownOption[] | undefined
  /**
   * Tooltip's title
   *
   * @see {Tooltip}
   */
  tooltip?: TooltipProps['title']
  /**
   * This is the point on the popover which
   * will attach to the anchor's origin.
   *
   * Options:
   * vertical: [top, center, bottom, x(px)];
   * horizontal: [left, center, right, x(px)].
   *
   * @see {@link https://mui.com/material-ui/react-popover/#anchor-playground}
   */
  transformOrigin?: PopoverOrigin
}

type DropdownVariationButtonProps = DropdownSharedProps & {
  /**
   * Anchors dropdown to Button
   *
   * @see {Button}
   */
  anchorType: 'button'
  /**
   * Button properties
   *
   * @see {Button}
   */
  buttonProps?: ButtonProps
  content?: never
  /**
   * Hide dropdown arrow icon
   */
  hideDropdownIcon?: boolean
  /**
   * Hide dropdown label text
   */
  hideLabel?: boolean
  /**
   * Button label
   *
   * Default value: 'Open Popover'
   */
  label?: string | React.JSX.Element
}

type DropdownVariationContainerProps = DropdownSharedProps & {
  /**
   * Anchors dropdown to React.ReactNode content element
   *
   * @see {React.ReactNode}
   */
  anchorType: 'content'
  /**
   * Element to be used as anchor, to toggle dropdown when clicked.
   */
  content: React.ReactNode
}

type DropdownProps =
  | DropdownVariationContainerProps
  | DropdownVariationButtonProps

type ElementAnchorProps = {
  popupState: PopupStateProps
  popupTrigger: object
} & Pick<DropdownProps, 'anchorType'> &
  Pick<
    DropdownVariationButtonProps,
    'buttonProps' | 'hideDropdownIcon' | 'hideLabel' | 'label' | 'tooltip'
  > &
  Pick<DropdownVariationContainerProps, 'content'>

const ElementAnchor = ({
  buttonProps,
  content,
  popupState,
  popupTrigger,
  tooltip,
  ...props
}: ElementAnchorProps) => {
  if (props.anchorType === 'content') {
    return <ClickableContainer {...popupTrigger}>{content}</ClickableContainer>
  }

  const dropdownIcon = popupState.isOpen ? 'arrowUp' : 'arrowDown'

  return (
    <ConditionalWrapper
      condition={!!tooltip}
      wrapper={(children) => <Tooltip title={tooltip}>{children}</Tooltip>}
    >
      <Button
        data-testid="dropdown-button"
        noMargin
        aria-describedby="dropdown-button"
        aria-haspopup="true"
        noIconMargin={!!buttonProps?.icon}
        typeSize="medium"
        {...buttonProps}
        icon={!props.hideDropdownIcon ? dropdownIcon : undefined}
        {...popupTrigger}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: DEFAULT_ICON_MARGIN,
          }}
        >
          <Icon
            name={buttonProps?.icon}
            size={buttonProps?.iconSize ?? DEFAULT_BUTTON_ICON_SIZE}
          />
          {!props.hideLabel ? (props.label ?? 'Open Popover') : null}
        </div>
      </Button>
    </ConditionalWrapper>
  )
}

/**
 * Display a menu with a list of options
 */
const Dropdown = ({
  anchorType,
  content,
  onSelect,
  onToggle,
  ...props
}: DropdownProps) => {
  const theme = useTheme()

  return (
    <PopupState variant="popover" popupId="demo-popup-popover">
      {(popupState: PopupStateProps) => {
        if (popupState.anchorEl) {
          onToggle?.(popupState)
        }

        return (
          <>
            <ElementAnchor
              {...props}
              popupTrigger={{ ...bindTrigger(popupState) }}
              popupState={popupState}
              content={content}
              anchorType={anchorType}
            />
            <Popover
              slotProps={{
                paper: {
                  sx: {
                    mt: theme.spacing(1.25),
                    bgcolor: theme.palette.background.paper,
                    width: 200,
                    borderRadius: 2,
                    boxShadow: theme.shadows[4],
                  },
                  role: 'menu',
                  id: props.id,
                  'aria-labelledby': props.id,
                },
              }}
              {...bindPopover(popupState)}
              {...props}
            >
              {props.options && (
                <MenuContainer id={props.id}>
                  {/* renderização das opções */}
                </MenuContainer>
              )}
            </Popover>
          </>
        )
      }}
    </PopupState>
  )
}


export type { DropdownOption, DropdownProps }
export { Dropdown }
