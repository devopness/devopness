import { styled } from 'styled-components'

import type { CardProps } from './Card'
import { getColor } from 'src/colors'
import type { TransientProps } from 'src/components/types'
import { getFont } from 'src/fonts'

type StyledContainerProps = {
  /**
   * Disable the minimum height of the container
   *
   * @default false
   */
  $disableMinHeight?: boolean
}

const StyledContainer = styled.div<StyledContainerProps>`
  display: flex;
  min-height: ${({ $disableMinHeight }) =>
    $disableMinHeight ? 'auto' : '105px'};
  width: relative;
  border-radius: 10px;
  border: 1px solid ${getColor('slate.300')};
  background-color: ${getColor('white')};
  box-sizing: border-box;
  font-family: 'Roboto';
  overflow: hidden;
  flex-direction: column;
  align-items: center;
`

const StyledAvatar = styled.div<TransientProps<CardProps['avatarProps']>>`
  align-items: center;
  background-color: ${({ $backgroundColor }) => getColor($backgroundColor)};
  border-radius: 5px;
  box-sizing: border-box;
  display: flex;
  grid-area: icon;
  justify-content: center;
  height: 36px;
  width: 36px;
`

const StyledTitle = styled.span`
  color: ${getColor('blue.950')};
  font-size: 16px;
  font-weight: bold;
  grid-area: title;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const StyledSubtitle = styled.span`
  color: ${getColor('gray.615')};
  font-size: 13px;
  grid-area: subtitle;
  max-width: calc(100% - 20px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const StyledIndicator = styled.span`
  color: ${getColor('blue.950')};
  font-size: 16px;
  font-weight: bold;
  grid-area: indicator;
  text-align: right;
`

type StyledHeaderProps = TransientProps<CardProps['headerProps']> & {
  /**
   * Hide the border of the header
   *
   * @default false
   */
  $hideBorder?: boolean
}

const StyledHeader = styled.div<StyledHeaderProps>`
  align-items: center;
  background-color: ${({ $backgroundColor }) =>
    getColor($backgroundColor ?? 'transparent')};
  border-bottom: ${({ $borderBottomColor, $hideBorder }) =>
    $hideBorder
      ? 'none'
      : `1px solid ${getColor($borderBottomColor ?? 'slate.300')}`};
  box-sizing: border-box;
  color: ${getColor('gray.615')};
  display: grid;
  grid-gap: 0 15px;
  grid-template-areas: 'icon title indicator';
  grid-template-columns: 36px calc(100% - 85px) 20px;
  grid-template-rows: 36px;
  height: 63px;
  padding: 14px 15px 0 15px;
  width: 100%;
`

type StyledFooterProps = {
  /**
   * Show the footer border
   *
   * @default false
   */
  $showBorder?: boolean
}

const StyledFooter = styled.div<StyledFooterProps>`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  height: 42px;
  /* If there are 2 or more direct children, use space-between */
  justify-content: space-between;
  max-width: 100%;
  padding-bottom: 15px;
  /**
   * The padding-left/right should be the same as StyledHeader's padding-left/right
   */
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 15px;
  width: 100%;

  border-top: ${({ $showBorder }) =>
    $showBorder ? `1px solid ${getColor('slate.300')}` : 'none'};

  /**
   * When the footer has only one child, add a hover effect to footer
   *
   * Using classname "only-child" here is a workaround for testing environment compatibility
   * Current testing setup does not recognize ":has(:only-child)" as a valid CSS selector
   */
  &.only-child {
    padding-left: 0;

    &:hover {
      background-color: ${getColor('indigo.10')};
    }
  }

  /* When there's only one child, make it fill the entire row */
  > *:only-child {
    width: 100%;

    /**
     * When the child is a link, make it fill the entire row
     */
    & > a {
      display: flex;
      justify-content: center;
      width: 100%;
    }
  }
`

const StyledFooterLabel = styled.span`
  text-transform: uppercase;
`

const StyledLetterAvatar = styled.span`
  font-size: 23px;
  font-weight: 700;
  font-family: ${getFont('roboto')};
  color: ${getColor('blue.950')};
`

export {
  StyledAvatar,
  StyledContainer,
  StyledFooter,
  StyledFooterLabel,
  StyledHeader,
  StyledIndicator,
  StyledLetterAvatar,
  StyledSubtitle,
  StyledTitle,
}
