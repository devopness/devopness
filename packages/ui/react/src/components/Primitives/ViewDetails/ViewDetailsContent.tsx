import { ComponentType, CSSProperties, ElementType, ReactNode } from 'react'

import uniqueId from 'lodash/uniqueId'

import { CopyToClipboard } from '../CopyToClipboard'
import { ToggleContent } from '../ToggleContent'
import { Tooltip } from '../Tooltip'
import { Paragraph, Label, Text } from './ViewDetails.styled'
import { getColor } from 'src/colors'
import { ConditionalWrapper } from 'src/components/helpers'
import { isDefined } from 'src/components/type-guards'
import { Icon, iconLoader } from 'src/icons'
import { QuestionIcon, getTextContent } from 'src/utils'

const EMPTY_CONTENT = '—'

/** Props for the icon component */
type IconProps =
  | (Icon | Omit<string, Icon>)
  | {
      name: Omit<string, Icon>
      size?: number
      color?: string
      tooltip?: string
    }

/**
 * Props for the navigation component
 */
type NavigationComponentProps = {
  /** URL string for the navigation component */
  to: string | undefined
  /** Target attribute for the navigation component */
  target?: '_blank' | '_self' | undefined
  /** Node to render */
  children: ReactNode
  /** Indicates if the URL should be opened in a new tab */
  isExternalUrl?: boolean
  /** Style to apply to the navigation component */
  style?: CSSProperties
}

type DetailsContentProps = {
  /** Label for the detail item */
  label?: string
  /** Value for the detail item */
  value: ReactNode
  /** Icon to display alongside the label */
  icon?: IconProps
  /** URL string or props object for the navigation component */
  url?: string | Partial<NavigationComponentProps>
  /** If true, the URL is a resource within the application */
  isResourceUrl?: boolean
  /** If true, adds copy-to-clipboard functionality */
  isCopyToClipboard?: boolean
  /** If true, hides sensitive content */
  isHidden?: boolean
  /**
   * When true, long text will show an ellipsis
   * when it overflows the container and show
   * full content in tooltip on hover
   * @default false
   */
  shouldDisableTextWrap?: boolean
  /** Tooltip content to display */
  tooltip?:
    | string
    | {
        label?: string
        value?: string
      }
  statusIcon?: IconProps
  /**
   * Component to use for navigation links
   */
  navigationComponent?: ComponentType<NavigationComponentProps>
}

/**
 * Component to display a single detail row with optional icon, link, copy-to-clipboard, and tooltip.
 *
 * @example
 * ```tsx
 * <DetailsContent
 *   label="Username"
 *   value="johndoe"
 *   navigationComponent={NavigationLink}
 * />
 * ```
 */
const ViewDetailsContent = ({
  label,
  value,
  url,
  icon,
  isCopyToClipboard,
  isHidden,
  isResourceUrl = false,
  statusIcon,
  tooltip,
  shouldDisableTextWrap = false,
  navigationComponent,
}: DetailsContentProps) => {
  const isBoolean = typeof value === 'boolean'
  const formattedValue = (() => {
    if (isBoolean) return value ? 'Yes' : 'No'
    return value
  })()

  if (!navigationComponent && url) {
    throw new Error('navigationComponent must be provided when using URL')
  }

  const NavigationLink = navigationComponent as ElementType

  return (
    <ConditionalWrapper
      condition={typeof tooltip === 'string'}
      wrapper={(children) => (
        <Tooltip title={typeof tooltip === 'string' ? tooltip : undefined}>
          {children}
        </Tooltip>
      )}
    >
      <Paragraph>
        {isDefined(label) && (
          <Label className="translate">
            {label}
            {typeof tooltip === 'object' && isDefined(tooltip.label) && (
              <Tooltip
                title={tooltip.label}
                placement="right-start"
                styles={{
                  color: getColor('white'),
                }}
                style={{
                  padding: '0 2px',
                  height: '16px',
                }}
              >
                <QuestionIcon />
              </Tooltip>
            )}
            {isBoolean ? '?' : ':'}
          </Label>
        )}
        {isDefined(icon) && (
          <ConditionalWrapper
            condition={
              typeof icon === 'object' &&
              'tooltip' in icon &&
              isDefined(icon.tooltip)
            }
            wrapper={(children) => (
              <Tooltip
                title={
                  typeof icon === 'object' && 'tooltip' in icon
                    ? (icon.tooltip ?? '')
                    : ''
                }
              >
                {children}
              </Tooltip>
            )}
          >
            {typeof icon === 'string' && <>{iconLoader(icon as Icon)}</>}
            {typeof icon === 'object' && 'name' in icon && (
              <>{iconLoader(icon.name as Icon, icon.size, icon.color)}</>
            )}
          </ConditionalWrapper>
        )}
        <ToggleContent
          isSensitiveContent={isHidden}
          showWarning
          containerProps={{
            style: {
              width: '100%',
            },
          }}
        >
          {isDefined(url) ? (
            <NavigationLink
              target="_blank"
              style={{
                wordBreak: 'break-all',
                marginRight: 'auto',
              }}
              isExternalUrl={!isResourceUrl}
              to={typeof url === 'string' ? url : undefined}
              {...(typeof url === 'object' ? url : undefined)}
            >
              {value}
            </NavigationLink>
          ) : (
            <ConditionalWrapper
              condition={!!isCopyToClipboard && isDefined(formattedValue)}
              wrapper={(children) => (
                <CopyToClipboard id={uniqueId(label)}>
                  {children}
                </CopyToClipboard>
              )}
            >
              <Tooltip
                title={getTextContent(formattedValue)}
                enableOnlyWithEllipsisPoints
              >
                <Text
                  className="translate"
                  style={
                    shouldDisableTextWrap
                      ? {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }
                      : undefined
                  }
                >
                  {formattedValue ?? EMPTY_CONTENT}
                </Text>
              </Tooltip>
            </ConditionalWrapper>
          )}
        </ToggleContent>
        {isDefined(statusIcon) && (
          <ConditionalWrapper
            condition={
              typeof statusIcon === 'object' &&
              'tooltip' in statusIcon &&
              isDefined(statusIcon.tooltip)
            }
            wrapper={(children) => (
              <Tooltip
                title={
                  typeof statusIcon === 'object' && 'tooltip' in statusIcon
                    ? (statusIcon.tooltip ?? '')
                    : ''
                }
              >
                {children}
              </Tooltip>
            )}
          >
            {typeof statusIcon === 'string' && (
              <>{iconLoader(statusIcon as Icon)}</>
            )}
            {typeof statusIcon === 'object' && 'name' in statusIcon && (
              <>
                {iconLoader(
                  statusIcon.name as Icon,
                  statusIcon.size,
                  statusIcon.color
                )}
              </>
            )}
          </ConditionalWrapper>
        )}

        {typeof tooltip === 'object' && isDefined(tooltip.value) && (
          <Tooltip
            title={tooltip.value}
            placement="right-start"
            styles={{
              color: getColor('white'),
            }}
            style={{
              padding: '0 2px',
              height: '16px',
              overflow: 'visible',
            }}
          >
            <QuestionIcon />
          </Tooltip>
        )}
      </Paragraph>
    </ConditionalWrapper>
  )
}
export { ViewDetailsContent }
export type { IconProps, DetailsContentProps }
