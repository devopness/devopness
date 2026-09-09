import { Fragment } from "react";

import { Skeleton } from "src/components/Primitives/Skeleton";

import { BaseTable, ButtonWrapper, LoadingWrapper, TableTr, TableWrapper } from "./styled";

enum TableRowVariation {
  TWO_BUTTONS_EFFECT = "TWO_BUTTONS_EFFECT",
  ONE_BUTTON_EFFECT = "ONE_BUTTON_EFFECT",
  CHECKBOX_EFFECT = "CHECKBOX_EFFECT",
  CHECKBOX_EFFECT_WITH_BAR = "CHECKBOX_EFFECT_WITH_BAR",
  BAR_EFFECT = "BAR_EFFECT",
}

enum TableHeaderVariation {
  CHECKBOX_EFFECT = "CHECKBOX_EFFECT",
  BAR_EFFECT = "BAR_EFFECT",
}

interface TableCellProps {
  name: string;
  rowVariation: TableRowVariation;
  headerVariation?: TableHeaderVariation;
  alignEnd?: boolean;
}

interface TableLoadingProps {
  cells: readonly TableCellProps[];
  lines?: number;
  smallContainer?: boolean;
}

const LOADING_EFFECTS = {
  CHECKBOX_EFFECT: <Skeleton width={20} height={20} borderRadius={5} />,
  ONE_BUTTON_EFFECT: (
    <ButtonWrapper>
      <Skeleton width={80} height={25} borderRadius={25} />
    </ButtonWrapper>
  ),
  TWO_BUTTONS_EFFECT: (
    <ButtonWrapper>
      <Skeleton width={80} height={25} borderRadius={25} />
      <Skeleton width={80} height={25} borderRadius={25} />
    </ButtonWrapper>
  ),
  BAR_EFFECT: <Skeleton widthPercent={80} height={12} borderRadius={2} />,
  CHECKBOX_EFFECT_WITH_BAR: (
    <Fragment>
      <Skeleton width={20} height={20} borderRadius={5} />
      <Skeleton widthPercent={60} height={12} borderRadius={2} />
    </Fragment>
  ),
};

const createIntegerList = (size: number) => Array.from({ length: size }, (_, index) => index);

function TableLoading({ cells, lines = 5, smallContainer }: TableLoadingProps) {
  const linesList = createIntegerList(lines);

  return (
    <TableWrapper>
      <BaseTable $smallContainer={Boolean(smallContainer)}>
        <thead>
          <tr>
            {cells.map((header, index) => (
              <th key={index} className="translate">
                <LoadingWrapper $alignEnd={Boolean(header.alignEnd)}>
                  {!header.headerVariation && header.name}
                  {header.headerVariation && LOADING_EFFECTS[header.headerVariation]}
                </LoadingWrapper>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {linesList.map((_, rowIndex) => (
            <TableTr key={`row-${rowIndex}`} $numberOfColumns={cells.length}>
              {cells.map((header, columnIndex) => (
                <td key={`col-${columnIndex}`}>
                  <LoadingWrapper $alignEnd={Boolean(header.alignEnd)}>
                    {LOADING_EFFECTS[header.rowVariation]}
                  </LoadingWrapper>
                </td>
              ))}
            </TableTr>
          ))}
        </tbody>
      </BaseTable>
    </TableWrapper>
  );
}

export type { TableCellProps, TableLoadingProps };
export { TableHeaderVariation, TableLoading, TableRowVariation };
export default TableLoading;
