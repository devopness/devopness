import React from 'react'

import { FlexContainer } from '../FlexContainer'
import {
  ContentIcon,
  DetailContentInformation,
  DetailContentValue,
  PrefixWrapper,
} from './Review.styled'
import { ConditionalWrapper } from 'src/components/helpers'
import { Icon, iconLoader } from 'src/icons'

type ReviewProps = {
  /** Content text or JSX element */
  content: string | React.JSX.Element
  /** Make content bold
   * @default false
   */
  isBoldFontWeight?: boolean
  /** Optional icon to display */
  icon?: Icon | Omit<string, Icon>
  /** Background color for the icon */
  iconBackgroundColor?: string
  /** Icon color */
  iconColor?: string
  /** Icon size in pixels */
  iconSize?: number
  /** Optional prefix before the label */
  prefix?: string
  /** Background color for the review box */
  backgroundColor?: string
  /** Apply margin for prefix
   * @default true
   */
  hasPrefixMargin?: boolean
  /** Show icon after label instead of before
   * @default false
   */
  isIconAfterLabel?: boolean
}

/**
 * Review component displays a label/value pair with optional icon and prefix.
 *
 * @example
 * ```jsx
 * <Review
 *   content="Status: Approved"
 *   icon="check"
 *   prefix="Info"
 *   backgroundColor="#f5f5f5"
 * />
 * ```
 */

const Review = ({
  content,
  icon,
  iconBackgroundColor = 'transparent',
  iconColor,
  iconSize = 16,
  isBoldFontWeight = false,
  prefix,
  backgroundColor,
  hasPrefixMargin = true,
  isIconAfterLabel = false,
}: ReviewProps) => {
  const splitContent =
    typeof content === 'string' && isIconAfterLabel
      ? content.split(/:(.*)/s)
      : null
  const labelContent = splitContent ? splitContent[0] + ':' : content
  const valueContent = splitContent ? splitContent[1]?.trim() : ''

  return (
    <DetailContentInformation
      backgroundColor={backgroundColor}
      noIcon={!icon}
      isIconAfterLabel={isIconAfterLabel}
    >
      {!isIconAfterLabel && icon && (
        <ContentIcon backgroundColor={iconBackgroundColor}>
          {iconLoader(icon as Icon, iconSize, iconColor)}
        </ContentIcon>
      )}
      <FlexContainer
        gap="5px"
        align="center"
      >
        <DetailContentValue isBoldFontWeight={isBoldFontWeight}>
          <ConditionalWrapper
            wrapper={() => (
              <PrefixWrapper showMarginRight={hasPrefixMargin}>
                <DetailContentValue isBoldFontWeight>
                  {prefix}
                </DetailContentValue>
              </PrefixWrapper>
            )}
            condition={Boolean(prefix)}
          >
            {null}
          </ConditionalWrapper>
          {labelContent}
        </DetailContentValue>
        {isIconAfterLabel && icon && (
          <ContentIcon backgroundColor={iconBackgroundColor}>
            {iconLoader(icon as Icon, iconSize, iconColor)}
          </ContentIcon>
        )}
        {valueContent && (
          <DetailContentValue>{valueContent}</DetailContentValue>
        )}
      </FlexContainer>
    </DetailContentInformation>
  )
}

export type { ReviewProps }
export { Review }
