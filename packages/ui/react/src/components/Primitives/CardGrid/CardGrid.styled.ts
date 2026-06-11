import { styled } from 'styled-components'

type CardGridStyledProps = {
  $columnsMobile: number
  $columnsTablet: number
  $columnsDesktop: number
  $gap: string
  $rowHeight?: string
}

const TABLET_MIN_PX = 641
const DESKTOP_MIN_PX = 1025

const CardGridWrapper = styled.div<CardGridStyledProps>`
  display: grid;
  grid-template-columns: ${({ $columnsMobile }) =>
    `repeat(${$columnsMobile}, 1fr)`};
  gap: ${({ $gap }) => $gap};
  ${({ $rowHeight }) => ($rowHeight ? `grid-auto-rows: ${$rowHeight};` : '')}
  align-items: start;
  min-width: 0;

  @media (min-width: ${TABLET_MIN_PX}px) {
    grid-template-columns: ${({ $columnsTablet }) =>
      `repeat(${$columnsTablet}, 1fr)`};
  }

  @media (min-width: ${DESKTOP_MIN_PX}px) {
    grid-template-columns: ${({ $columnsDesktop }) =>
      `repeat(${$columnsDesktop}, 1fr)`};
  }
`

export { CardGridWrapper }
