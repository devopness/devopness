import { css, styled } from 'styled-components'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

/**
 * Creates the pseudo-element styling used for rounded row borders.
 *
 * @param hoverColor - Background color applied to the generated border.
 */
const pseudoBorderStyled = (hoverColor?: string) => css`
  content: '';
  position: absolute;
  top: -1px;
  visibility: visible;
  height: 100%;
  width: 25px;
  background-color: ${hoverColor};
  border-top: 1px solid ${getColor('slate.300')};
  border-bottom: 1px solid ${getColor('slate.300')};
`

/** Styling props for the outer table scroll container. */
interface TableWrapperProps {
  $smallContainer?: boolean
  $padding?: string
}

/** Styling props for the base table element. */
interface BaseTableProps {
  $smallContainer?: boolean
  $disabledTable?: boolean
  $thMaxWidth?: string
  $headerColor?: string
  $alignEndLastColumn?: boolean
}

/** Styling props for table rows, including fixed-line and hover states. */
interface TableTrProps {
  $lineBackgroundColor?: string
  $lineHoverColor?: string
  $hoverColor?: string
  $numberOfColumns?: number
  $fixedLineEnabled?: boolean
  $tdMaxWidth?: string
  $disabledRow?: boolean
  $alignEndLastColumn?: boolean
}

/** Styled outer container used by the primary Table implementation. */
const TableWrapper = styled.div<TableWrapperProps>`
  background-color: white;
  padding-top: 42px;
  padding-left: 32px;
  padding-right: 8px;
  padding-bottom: ${({ $smallContainer }) => (!$smallContainer ? '42px' : '0')};
  padding: ${({ $padding }) => $padding};

  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`

/** Styled table element shared by the primary and drag-and-drop tables. */
const BaseTable = styled.table<BaseTableProps>`
  position: relative;
  width: 100%;
  min-width: 600px;
  border-spacing: 0;
  font-size: 13px;
  font-family: ${getFont('roboto')};
  color: ${getColor('blue.950')};
  table-layout: auto;

  thead {
    pointer-events: ${({ $disabledTable }) => ($disabledTable ? 'none' : 'all')};

    tr {
      border-bottom: 1px solid ${getColor('slate.300')};
    }
  }

  th {
    padding: ${({ $smallContainer }) => ($smallContainer ? '0px 15px' : '10px 15px')};
    height: ${({ $smallContainer }) => ($smallContainer ? '42px' : 'auto')};
    max-width: ${({ $thMaxWidth }) => $thMaxWidth || 'none'};
    color: ${({ $headerColor }) => $headerColor || getColor('blue.950')};

    text-align: left;
    text-transform: uppercase;
    font-size: 13px !important;
    font-weight: 500 !important;
    position: relative;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:first-child {
      padding-left: 0;
    }

    ${({ $alignEndLastColumn }) =>
      $alignEndLastColumn &&
      `&:last-child {
        padding-right: 0;
        display: flex;
        justify-content: end;
      }`}
  }
`

/** Styled table row supporting disabled, hover, and fixed-line states. */
const TableTr = styled.tr<TableTrProps>`
  opacity: ${({ $disabledRow }) => ($disabledRow ? 0.3 : 1)};
  pointer-events: ${({ $disabledRow }) => ($disabledRow ? 'none' : 'auto')};

  td {
    padding: 0 15px;
    height: 42px;
    border-bottom: 1px solid ${getColor('slate.300')};

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    max-width: ${({ $tdMaxWidth, $numberOfColumns }) =>
      $tdMaxWidth || `${$numberOfColumns ? 100 / $numberOfColumns : 100}vmax`};

    @media (max-width: 768px) {
      max-width: none;
    }

    &:first-child {
      padding-left: 0;
      max-width: none;
    }

    ${({ $alignEndLastColumn }) =>
      $alignEndLastColumn &&
      `&:last-child {
        padding-right: 0;
      }`}

    &.drag-cell {
      text-align: center;
      vertical-align: middle;
      cursor: pointer;
    }

    &.drag-cell-block {
      text-align: center;
      vertical-align: middle;
      cursor: not-allowed;
    }
  }

  &.indented td:nth-child(2) {
    padding-left: 0;
  }

  &:first-child {
    td {
      border-top: 1px solid ${getColor('slate.300')};
    }
  }

  .normal-td {
    position: relative;
    background-color: ${({
      $fixedLineEnabled,
      $lineBackgroundColor,
      $hoverColor,
    }) => $fixedLineEnabled && ($lineBackgroundColor || $hoverColor)};

    &:last-child {
      &:before {
        ${({ $fixedLineEnabled, $lineBackgroundColor, $hoverColor }) =>
          $fixedLineEnabled &&
          pseudoBorderStyled($lineBackgroundColor || $hoverColor)}
        right: -26px;
        border-radius: 0 25px 25px 0;
        border-right: 1px solid ${getColor('slate.300')};
      }
    }

    ${({ $alignEndLastColumn }) =>
      $alignEndLastColumn &&
      `&:last-child .cell-wrapper {
        justify-content: flex-end;
      }`}
  }

  .normal-td:first-child,
  &.indented td:nth-child(2) {
    &:before {
      ${({ $fixedLineEnabled, $lineBackgroundColor, $hoverColor }) =>
        $fixedLineEnabled &&
        pseudoBorderStyled($lineBackgroundColor || $hoverColor)}
      left: -26px;
      border-radius: 25px 0 0 25px;
      border-left: 1px solid ${getColor('slate.300')};
    }
  }

  &:hover .normal-td {
    position: relative;
    background-color: ${({ $lineHoverColor, $hoverColor }) => $lineHoverColor || $hoverColor};

    &:first-child:last-child {
      &:before {
        ${({ $lineHoverColor, $hoverColor }) => pseudoBorderStyled($lineHoverColor || $hoverColor)}
        left: -26px;
        border-radius: 25px 0 0 25px;
        border-left: 1px solid ${getColor('slate.300')};
      }

      &:after {
        ${({ $lineHoverColor, $hoverColor }) => pseudoBorderStyled($lineHoverColor || $hoverColor)}
        right: -26px;
        border-radius: 0 25px 25px 0;
        border-right: 1px solid ${getColor('slate.300')};
        content: '';
      }
    }

    &:last-child:not(:first-child) {
      &:before {
        ${({ $lineHoverColor, $hoverColor }) => pseudoBorderStyled($lineHoverColor || $hoverColor)}
        right: -26px;
        border-radius: 0 25px 25px 0;
        border-right: 1px solid ${getColor('slate.300')};
      }
    }
  }

  &:hover .normal-td:first-child:not(:last-child),
  &.indented:hover td:nth-child(2) {
    &:before {
      ${({ $lineHoverColor, $hoverColor }) => pseudoBorderStyled($lineHoverColor || $hoverColor)}
      left: -26px;
      border-radius: 25px 0 0 25px;
      border-left: 1px solid ${getColor('slate.300')};
    }
  }

  .expanded-td {
    padding: 0px;
    padding-bottom: 15px;
  }
`

/** Empty cell used to indent nested rows. */
const TableIndentation = styled.td`
  width: 15px;
  padding: 0px;
  border-bottom: none !important;
`

/** Flex container used for loading-state action placeholders. */
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`

/** Styled wrapper that controls table-cell content alignment and clipping. */
const TableCellWrapper = styled.div<{
  $alignColumn?: 'left' | 'center' | 'right'
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ $alignColumn }) => $alignColumn ?? 'left'};
  overflow: hidden;
`

/** Styled value container used inside a table cell. */
const TableCellValue = styled.div<{
  $overflowVisible?: boolean
  width?: string
}>`
  user-select: all;
  width: ${({ width }) => width};
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ $overflowVisible }) => ($overflowVisible ? 'overflow: visible;' : 'overflow: hidden;')}
`

export {
  BaseTable,
  ButtonWrapper,
  pseudoBorderStyled,
  TableCellValue,
  TableCellWrapper,
  TableIndentation,
  TableTr,
  TableWrapper,
}

export type { BaseTableProps, TableTrProps, TableWrapperProps }
