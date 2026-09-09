import { styled } from 'styled-components'

interface CellIconProps {
  $iconBackgroundColor?: string
}

const TableCellWrapper = styled.div`
  display: flex;
  align-items: center;
`

const TableCellValue = styled.div`
  user-select: all;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const TableCellIcon = styled.div<CellIconProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
  border-radius: 5px;
  color: white;
  background-color: ${({ $iconBackgroundColor }) => $iconBackgroundColor};
  margin-right: 10px;
`

export { TableCellIcon, TableCellValue, TableCellWrapper }
