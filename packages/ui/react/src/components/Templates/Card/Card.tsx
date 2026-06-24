import {
  StyledAddCta,
  StyledAddCtaButton,
  StyledAddCtaLink,
  StyledAvatar,
  StyledContainer,
  StyledFooter,
  StyledFooterLabel,
  StyledHeader,
  StyledIndicator,
  StyledLetterAvatar,
  StyledSubtitle,
  StyledTitle,
} from './Card.styled'
import type { Color } from 'src/colors'
import { Button } from 'src/components/Buttons/Button'
import type { IconProps } from 'src/components/Primitives/Icon'
import { Icon } from 'src/components/Primitives/Icon'
import type { LinkProps } from 'src/components/Primitives/Link'
import { Link } from 'src/components/Primitives/Link'
import type { TooltipProps } from 'src/components/Primitives/Tooltip'
import { Tooltip } from 'src/components/Primitives/Tooltip'

type CardProps = React.PropsWithChildren<{
  /**
   * Props for the avatar wrapper
   */
  avatarProps: {
    backgroundColor: Color
  }
  /**
   * Array of footer items to be rendered at the bottom of the card
   */
  footer?: {
    /**
     * Icon to display next to the label
     */
    icon?: IconProps['name'] | IconProps
    /**
     * Text to display in the footer item
     */
    label?:
      | string
      | {
          content: string
          style?: React.CSSProperties
        }
    /**
     * Tooltip text to show on hover
     */
    tooltip?: string | Omit<TooltipProps, 'children'>
    /**
     * URL to navigate to when footer item is clicked
     */
    url?: LinkProps['to'] | Omit<LinkProps, 'style'>
  }[]
  /**
   * Props for the header
   */
  headerProps?: {
    backgroundColor?: Color
    borderBottomColor?: Color
  }
  /**
   * Icon to display in the card
   */
  icon?: IconProps['name'] | IconProps
  /**
   * Unique identifier for the card
   */
  id?: string
  /**
   * Indicator to display in the card
   */
  indicator?: React.ReactNode
  /**
   * Path (or config object) for the add CTA button.
   * When an object is provided, supports the same props as `url` plus:
   * - `disabled`: renders the button as disabled instead of navigating
   * - `disabledTooltip`: tooltip message shown when disabled
   */
  addUrl?:
    | string
    | (Omit<LinkProps, 'style'> & {
        disabled?: boolean
        disabledTooltip?: string
      })
  /**
   * Subtitle to display in the card
   */
  subtitle?: string
  /**
   * Title to display in the card
   */
  title: string
  /**
   * Props for the title
   */
  titleProps?: Pick<React.HTMLProps<HTMLSpanElement>, 'style'>
  /**
   * URL to navigate to when card is clicked
   */
  url?: LinkProps['to'] | Omit<LinkProps, 'style'>
}>

/**
 * Renders an indicator for the card
 */
const Indicator = ({ indicator }: Pick<CardProps, 'indicator'>) => {
  if (indicator === undefined) return undefined

  if (typeof indicator === 'number' && indicator > 99) {
    return <StyledIndicator>+99</StyledIndicator>
  }

  return <StyledIndicator>{indicator}</StyledIndicator>
}

const DEFAULT_ICON_COLOR = 'white' satisfies Color
const DEFAULT_FOOTER_ICON_COLOR = 'gray.615' satisfies Color
const DEFAULT_ICON_SIZE = 23

/**
 * A flexible and customizable card component for displaying content
 * with a consistent, structured layout.
 *
 * @example
 * // Basic usage
 * <Card
 *   title="Environment"
 *   subtitle="Overview of current environments"
 *   avatarProps={{ backgroundColor: 'blue.500' }}
 *   icon="cubes"
 * />
 *
 * @example
 * // Card with footer and navigation
 * <Card
 *   title="Teams"
 *   url="/teams"
 *   footer={[
 *     {
 *       label: 'View All',
 *       url: '/teams'
 *     }
 *   ]}
 * />
 */
const Card = ({ children, ...props }: CardProps) => (
  <StyledContainer
    $disableMinHeight={!props.footer && !children}
    id={props.id}
  >
    <StyledHeader
      data-testid="card-header"
      $backgroundColor={props.headerProps?.backgroundColor}
      $borderBottomColor={props.headerProps?.borderBottomColor}
      $hasAddCta={!!props.addUrl}
      $hideBorder={!props.footer && !children}
    >
      <StyledAvatar $backgroundColor={props.avatarProps.backgroundColor}>
        {typeof props.icon === 'object' && (
          <Icon
            {...props.icon}
            color={props.icon.color ?? DEFAULT_ICON_COLOR}
            size={props.icon.size ?? DEFAULT_ICON_SIZE}
          />
        )}
        {typeof props.icon === 'string' && (
          <Icon
            name={props.icon}
            color={DEFAULT_ICON_COLOR}
            size={DEFAULT_ICON_SIZE}
          />
        )}
        {!props.icon && (
          <StyledLetterAvatar>
            {props.title.charAt(0).toUpperCase()}
          </StyledLetterAvatar>
        )}
      </StyledAvatar>
      <div style={{ gridArea: 'title', minWidth: 0 }}>
        <Tooltip
          title={props.title}
          enableOnlyWithEllipsisPoints
        >
          {props.url ? (
            <Link
              hideExternalUrlIcon
              hideUnderline
              {...(typeof props.url === 'object' ? props.url : undefined)}
              to={typeof props.url === 'object' ? props.url.to : props.url}
            >
              <StyledTitle {...props.titleProps}>{props.title}</StyledTitle>
            </Link>
          ) : (
            <StyledTitle {...props.titleProps}>{props.title}</StyledTitle>
          )}
        </Tooltip>
        {props.subtitle && <StyledSubtitle>{props.subtitle}</StyledSubtitle>}
      </div>
      <Indicator indicator={props.indicator} />
      {props.addUrl &&
        (() => {
          const addUrl = props.addUrl!

          if (typeof addUrl === 'string') {
            return (
              <StyledAddCta>
                <StyledAddCtaLink
                  hideExternalUrlIcon
                  hideUnderline
                  target="_self"
                  to={addUrl}
                >
                  <Icon
                    name="add"
                    size={24}
                  />
                </StyledAddCtaLink>
              </StyledAddCta>
            )
          }

          const { disabled, disabledTooltip, ...linkProps } = addUrl

          return (
            <StyledAddCta>
              <Tooltip title={disabled ? (disabledTooltip ?? '') : ''}>
                {disabled ? (
                  <StyledAddCtaButton
                    aria-label="add"
                    disabled
                    type="button"
                  >
                    <Icon
                      name="add"
                      size={24}
                    />
                  </StyledAddCtaButton>
                ) : (
                  <StyledAddCtaLink
                    hideExternalUrlIcon
                    hideUnderline
                    target="_self"
                    {...linkProps}
                  >
                    <Icon
                      name="add"
                      size={24}
                    />
                  </StyledAddCtaLink>
                )}
              </Tooltip>
            </StyledAddCta>
          )
        })()}
    </StyledHeader>
    {children}
    {props.footer && (
      <StyledFooter
        data-testid="card-footer"
        $showBorder={!!children}
        className={props.footer.length === 1 ? 'only-child' : undefined}
      >
        {props.footer.map((footer, index) => (
          <Tooltip
            key={`footer-${String(index)}`}
            {...(typeof footer.tooltip === 'object'
              ? footer.tooltip
              : undefined)}
            title={
              typeof footer.tooltip === 'object'
                ? footer.tooltip.title
                : footer.tooltip
            }
          >
            <Link
              hideExternalUrlIcon
              hideUnderline
              style={{
                alignItems: 'center',
                display: 'flex',
                gap: '0.5rem',
                marginRight: 'auto',
              }}
              {...(typeof footer.url === 'object' ? footer.url : undefined)}
              to={typeof footer.url === 'object' ? footer.url.to : footer.url}
            >
              {typeof footer.icon === 'object' && (
                <Icon
                  {...footer.icon}
                  color={footer.icon.color ?? DEFAULT_FOOTER_ICON_COLOR}
                />
              )}
              {typeof footer.icon === 'string' && (
                <Icon
                  name={footer.icon}
                  color={DEFAULT_FOOTER_ICON_COLOR}
                />
              )}
              <Button
                buttonType="borderless"
                noPadding
              >
                {typeof footer.label === 'object' && (
                  <StyledFooterLabel {...footer.label}>
                    {footer.label.content}
                  </StyledFooterLabel>
                )}
                {typeof footer.label === 'string' && (
                  <StyledFooterLabel>{footer.label}</StyledFooterLabel>
                )}
              </Button>
            </Link>
          </Tooltip>
        ))}
      </StyledFooter>
    )}
  </StyledContainer>
)

export type { CardProps }
export { Card }
