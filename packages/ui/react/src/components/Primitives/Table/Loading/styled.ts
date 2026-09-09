import { styled } from "styled-components";

import { getColor } from "src/colors";
import { getFont } from "src/fonts";

/** Styling props for the loading table container. */
interface TableWrapperProps {
  $smallContainer?: boolean;
}

/** Styling props for the loading table element. */
interface BaseTableProps {
  empty?: boolean;
  $smallContainer?: boolean;
  disabledTable?: boolean;
}

/** Styling props for loading cell content. */
interface LoadingWrapperProps {
  $alignEnd?: boolean;
}

/** Styled container for the loading table. */
const TableWrapper = styled.div<TableWrapperProps>`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  background-color: white;
  padding-top: 42px;
  padding-bottom: ${({ $smallContainer }) => !$smallContainer && "42px"};
`;

/** Styled table element for loading placeholders. */
const BaseTable = styled.table<BaseTableProps>`
  position: relative;
  width: 93%;
  border-spacing: 0;
  font-size: 13px;
  font-family: ${getFont("roboto")};
  color: ${getColor("blue.950")};

  thead {
    &:after {
      position: absolute;
      border-bottom: 1px solid ${getColor("slate.300")};
      left: -3.7%;
      width: 107.4%;
      content: "";
    }
  }

  th {
    opacity: 0.3;
    padding: ${({ $smallContainer }) => ($smallContainer ? "0px 15px" : "10px 15px")};
    height: ${({ $smallContainer }) => ($smallContainer ? "42px" : "auto")};
    text-align: left;
    text-transform: uppercase;
    font-size: 13px !important;
    font-weight: 500 !important;
    position: relative;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }
  }
`;

/** Styled row used by the loading table. */
const TableTr = styled.tr<{ $numberOfColumns?: number }>`
  td {
    padding: 0 15px;
    height: 42px;
    border-bottom: 1px solid ${getColor("slate.300")};
    max-width: ${({ $numberOfColumns }) => ($numberOfColumns ? 100 / $numberOfColumns : 100)}vmax;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }
  }

  &:first-child {
    td {
      border-top: 1px solid ${getColor("slate.300")};
    }
  }
`;

/** Layout wrapper for loading action button placeholders. */
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: auto;
  gap: 15px;
`;

/** Wrapper controlling alignment of loading placeholders. */
const LoadingWrapper = styled.div<LoadingWrapperProps>`
  display: flex;
  justify-content: ${({ $alignEnd }) => $alignEnd && "flex-end"};
  align-items: center;
  gap: 10px;
`;

export { BaseTable, ButtonWrapper, LoadingWrapper, TableTr, TableWrapper };
