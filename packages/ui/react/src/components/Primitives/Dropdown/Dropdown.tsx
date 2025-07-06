import React from 'react'

import type { PopoverOrigin } from '@mui/material/Popover'
import Popover from '@mui/material/Popover'
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
  onClick?: () => void | Promise<void>
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
  onSelect?: (itemClicked: DropdownOption) => void | Promise<void>
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
  const handleDropdownOptionClick = async (
    option: DropdownOption,
    onSelect: DropdownProps['onSelect'],
    popupState: PopupStateProps,
    event: React.MouseEvent
  ) => {
    if (option.isDisabled) return

    const isExternalUrl = option.url?.startsWith('http')

    if (!isExternalUrl) {
      event.preventDefault()
      event.stopPropagation()
    }

    try {
      /**
       * We use Promise.resolve() here to handle both sync and async callbacks (onClick/onSelect),
       * which are typed as `void | Promise<void>`.
       *
       * This makes the component flexible and reusable, allowing consumers to implement
       * either a simple sync action (e.g. logging, UI updates) or an async one (e.g. API call).
       *
       * By using Promise.resolve(), we ensure any value is treated as a Promise,
       * which simplifies the logic and avoids errors in runtime while maintaining type safety.
       */
      if (option.onClick) {
        await Promise.resolve(option.onClick())
      } else if (onSelect) {
        await Promise.resolve(onSelect(option))
      }
    } catch (error) {
      console.error('Dropdown option click error:', error)
    } finally {
      popupState.close()
    }
  }

  return (
    <PopupState
      variant="popover"
      popupId="demo-popup-popover"
    >
      {(popupState: PopupStateProps) => {
        if (popupState.anchorEl) {
          onToggle?.(popupState)
        }

        return (
          <React.Fragment>
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
                  style: {
                    marginTop: '10px',
                    backgroundColor: '#FFF',
                    width: '200px',
                    borderRadius: '8px',
                    boxShadow: '0 0 30px 0px rgba(0,0,0,0.15)',
                  },
                },
              }}
              {...bindPopover(popupState)}
              {...props}
            >
              {props.options && (
                <MenuContainer id={props.id}>
                  {props.options.map((option, index) => (
                    <Tooltip
                      title={option.tooltip ?? ''}
                      key={index}
                    >
                      {option.url ? (
                        <Link
                          to={option.url}
                          hideUnderline
                          {...option.linkProps}
                          style={{
                            display: 'block',
                            marginRight: 'auto',
                            ...option.linkProps?.style,
                          }}
                        >
                          <MenuOption
                            id={`option_${index.toString()}`}
                            disabled={option.isDisabled}
                            key={`option${index.toString()}`}
                            $isActive={option.isActive}
                            $activeBackgroundColor={
                              option.activeBackgroundColor
                            }
                            $brokenSequence={option.brokenSequence}
                            onClick={(event) => {
                              if (!option.url?.startsWith('http')) {
                                void handleDropdownOptionClick(
                                  option,
                                  onSelect,
                                  popupState,
                                  event
                                )
                              }
                            }}
                          >
                            {option.badge && (
                              <ContentBadge
                                data-testid={`option-${index.toString()}-badge`}
                                $backgroundColor={option.badge.backgroundColor}
                              >
                                {option.badge.icon ? (
                                  <Icon
                                    {...option.badge}
                                    size={option.badge.size ?? 12}
                                  />
                                ) : (
                                  option.label?.at(0)
                                )}
                              </ContentBadge>
                            )}
                            {option.label && (
                              <Tooltip
                                title={option.label}
                                enableOnlyWithEllipsisPoints
                              >
                                <Text $color={option.color}>
                                  {option.label}
                                </Text>
                              </Tooltip>
                            )}
                          </MenuOption>
                        </Link>
                      ) : (
                        <MenuOption
                          id={`option_${index.toString()}`}
                          disabled={option.isDisabled}
                          key={`option${index.toString()}`}
                          $isActive={option.isActive}
                          $activeBackgroundColor={option.activeBackgroundColor}
                          $brokenSequence={option.brokenSequence}
                          onClick={(event) =>
                            void handleDropdownOptionClick(
                              option,
                              onSelect,
                              popupState,
                              event
                            )
                          }
                        >
                          {option.badge && (
                            <ContentBadge
                              data-testid={`option-${index.toString()}-badge`}
                              $backgroundColor={option.badge.backgroundColor}
                            >
                              {option.badge.icon ? (
                                <Icon
                                  {...option.badge}
                                  size={option.badge.size ?? 12}
                                />
                              ) : (
                                option.label?.at(0)
                              )}
                            </ContentBadge>
                          )}
                          {option.label && (
                            <Tooltip
                              title={option.label}
                              enableOnlyWithEllipsisPoints
                            >
                              <Text $color={option.color}>{option.label}</Text>
                            </Tooltip>
                          )}
                        </MenuOption>
                      )}
                    </Tooltip>
                  ))}
                </MenuContainer>
              )}
            </Popover>
          </React.Fragment>
        )
      }}
    </PopupState>
  )
}

export type { DropdownOption, DropdownProps }
export { Dropdown }
