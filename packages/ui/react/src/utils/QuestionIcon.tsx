import { styled } from 'styled-components'

import { getColor } from 'src/colors'
import { IconComponent as Icon } from 'src/components'

const HELP_ICON_SIZE = 13

/**
 * Wrapper component that provides hover interaction styles for the question icon
 */
const HoverableIconWrapper = styled.div`
  & > svg {
    transition: fill 0.2s ease-out;
    cursor: pointer;

    &:hover {
      fill: ${getColor('blue.800')};
    }
  }
`

/**
 * QuestionIcon component that displays a help icon with hover interaction.
 * Used to indicate additional information or help is available.
 * @returns A question mark icon that changes color on hover
 */
const QuestionIcon = () => (
  <HoverableIconWrapper>
    <Icon
      name="help"
      size={HELP_ICON_SIZE}
      color="slate.400"
    />
  </HoverableIconWrapper>
)

export { QuestionIcon }
