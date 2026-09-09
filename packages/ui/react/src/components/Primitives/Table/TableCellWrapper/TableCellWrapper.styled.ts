import { styled } from "styled-components";

/** Styling props for the icon container inside a table cell. */
interface CellIconProps {
  $iconBackgroundColor?: string;
}

/** Styled layout wrapper for a table cell value and icon. */
const TableCellWrapper = styled.div`
  display: flex;
  align-items: center;
`;

/** Styled text value inside a table cell. */
const TableCellValue = styled.div`
  user-select: all;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/** Styled icon container inside a table cell. */
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
`;

export { TableCellIcon, TableCellValue, TableCellWrapper };
