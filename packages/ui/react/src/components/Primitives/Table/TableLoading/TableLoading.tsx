import { Fragment } from "react";

import { Skeleton } from "src/components/Primitives/Skeleton";

import {
  BaseTable,
  ButtonWrapper,
  LoadingWrapper,
  TableTr,
  TableWrapper,
} from "./TableLoading.styled";

/** Skeleton layout used for loading table body cells. */
enum TableRowVariation {
  /** Two action button placeholders. */
  TWO_BUTTONS_EFFECT = "TWO_BUTTONS_EFFECT",
  /** One action button placeholder. */
  ONE_BUTTON_EFFECT = "ONE_BUTTON_EFFECT",
  /** Checkbox placeholder. */
  CHECKBOX_EFFECT = "CHECKBOX_EFFECT",
  /** Checkbox and text bar placeholders. */
  CHECKBOX_EFFECT_WITH_BAR = "CHECKBOX_EFFECT_WITH_BAR",
  /** Text bar placeholder. */
  BAR_EFFECT = "BAR_EFFECT",
}

/** Skeleton layout used for loading table header cells. */
enum TableHeaderVariation {
  /** Checkbox placeholder. */
  CHECKBOX_EFFECT = "CHECKBOX_EFFECT",
  /** Text bar placeholder. */
  BAR_EFFECT = "BAR_EFFECT",
}

/** Describes one column in a `TableLoading` placeholder. */
interface TableCellProps {
  /** Header text shown when no header skeleton is configured. */
  name: string;
  /** Skeleton layout rendered in body cells. */
  rowVariation: TableRowVariation;
  /** Optional skeleton layout rendered in the header. */
  headerVariation?: TableHeaderVariation;
  /** Aligns the column loading content to the end. */
  alignEnd?: boolean;
}

/** Props for `TableLoading`. */
interface TableLoadingProps {
  /** Placeholder column definitions. */
  cells: readonly TableCellProps[];
  /** Number of loading rows to render. */
  lines?: number;
  /** Uses compact table spacing. */
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

/**
 * Renders a table-shaped loading state using skeleton placeholders.
 *
 * @example
 * ```tsx
 * <TableLoading
 *   cells={[
 *     { name: "Name", rowVariation: TableRowVariation.BAR_EFFECT },
 *     {
 *       name: "Actions",
 *       rowVariation: TableRowVariation.ONE_BUTTON_EFFECT,
 *     },
 *   ]}
 *   lines={3}
 * />
 * ```
 */
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
