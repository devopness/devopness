import type { ReactElement, ReactNode } from 'react'
import { Fragment, useEffect, useRef, useState } from 'react'
import type {
  CellContext,
  ColumnDef,
  Row,
  RowData,
  TableOptions,
} from '@tanstack/react-table'
import { flexRender, useTable } from '@tanstack/react-table'

import { TableWrapper, type TableWrapperProps } from './TableWrapper'
import { tableFeatureSet, type TableFeatureSet } from './table-features'

import {
  BaseTable,
  TableCellValue,
  TableCellWrapper,
  TableIndentation,
  TableTr,
  TableStyled,
} from './Table.styled'

/** Configuration for the fixed background and hover line rendered around a row. */
type FixedLine = {
  /** Whether the line styling is enabled for the row. */
  activated?: boolean
  /** Background color applied to the row line. */
  lineBackgroundColor?: string
  /** Background color applied while hovering the row. */
  lineHoverColor?: string
}

/** Optional metadata read from each row by `Table`. */
type TableRowMetadata<T extends RowData> = {
  /** Identifier used to reset expanded rows when the table changes. */
  tableId?: string | number
  /** Row type used by the indented layout. */
  rowType?: string
  /** Nested rows used by TanStack Table's expansion model. */
  subRows?: T[]
  /** Fixed line styling for the row. */
  fixedLine?: FixedLine
  /** Disables interaction with the row and renders it with reduced opacity. */
  disabled?: boolean
}

type TableColumn<T extends RowData, TValue = any> = ColumnDef<
  TableFeatureSet,
  T,
  TValue
>
type ColumnWithAlignment<T extends RowData> = TableColumn<T> & {
  alignColumn?: 'left' | 'center' | 'right'
}

type TableCellProps<T extends RowData, TValue = unknown> = CellContext<
  TableFeatureSet,
  T,
  TValue
>
type TableRow<T extends RowData> = Row<TableFeatureSet, T>
type TableRowOriginalProps<T extends RowData> = Row<
  TableFeatureSet,
  T
>['original']

type TableProps<T extends RowData = {}> = Omit<
  TableOptions<TableFeatureSet, T>,
  'data' | 'columns' | 'features'
> & {
  columns?: readonly ColumnWithAlignment<T>[]
  data?: readonly T[]
  /** Custom table content padding. */
  padding?: string
  /** Uses the compact table spacing. */
  smallContainer?: boolean
  /** Disables table interaction and dims the table. */
  disabledTable?: boolean
  /** Header text color. */
  headerColor?: string
  /** Aligns the final column to the end when enabled. */
  alignEndLastColumn?: boolean
  /** Maximum width for header cells. */
  headerMaxWidth?: string
  /** Maximum width for body cells. */
  cellMaxWidth?: string
  /** Allows cell content to render outside its clipped cell. */
  cellOverflowVisible?: boolean
  /** Explicit width for rendered cell values. */
  cellWidth?: string
  /** Row hover background color. */
  hoverColor?: string
  /** Enables the indented row layout. */
  layout?: 'indented'
  /** Renders custom content below an expanded row with no subrows. */
  customSubRowInjection?: (row: TableRow<T>) => ReactNode
} & TableWrapperProps

/**
 * A generic table built on TanStack Table with Devopness styling and expansion support.
 *
 * @example
 * ```tsx
 * <Table
 *   columns={[
 *     { header: "Name", accessorKey: "name" },
 *     { header: "Status", accessorKey: "status" },
 *   ]}
 *   data={[
 *     { name: "Production", status: "Healthy" },
 *   ]}
 * />
 * ```
 */
function Table<T extends RowData = {}>(props: TableProps<T>): ReactElement {
  const [dataTable, setDataTable] = useState<T[]>([])
  const skipPageRef = useRef({ autoReset: false })

  useEffect(() => {
    if (Array.isArray(props.data)) {
      skipPageRef.current.autoReset = true
      setDataTable([...props.data])
    }
  }, [props.data])

  useEffect(() => {
    skipPageRef.current.autoReset = false
  }, [])

  const tableInstance = useTable({
    ...props,
    features: tableFeatureSet,
    data: dataTable,
    columns: (props.columns ?? []) as TableColumn<T>[],
    getSubRows:
      props.getSubRows ?? ((row) => (row as T & TableRowMetadata<T>).subRows),
    getRowCanExpand:
      props.getRowCanExpand ??
      ((row) =>
        row.subRows.length > 0 ||
        (row.original as T & TableRowMetadata<T>).rowType?.toLowerCase() ===
          'subrow'),
    autoResetAll: !skipPageRef.current.autoReset,
    state: props.state,
  })

  const isIndented = props.layout === 'indented'
  const tableId = (dataTable[0] as (T & TableRowMetadata<T>) | undefined)
    ?.tableId

  useEffect(() => {
    tableInstance.toggleAllRowsExpanded(false)
  }, [tableId])

  const headerGroups = tableInstance.getHeaderGroups()
  const rows = tableInstance.getRowModel().rows

  return (
    <TableWrapper
      isLoading={props.isLoading}
      loadingTableCells={props.loadingTableCells}
      isEmpty={props.isEmpty}
      emptyData={props.emptyData}
      paginationData={props.paginationData}
      height={props.height}
    >
      <TableStyled
        $padding={props.padding}
        $smallContainer={props.smallContainer}
      >
        <BaseTable
          $smallContainer={props.smallContainer}
          $disabledTable={props.disabledTable}
          $thMaxWidth={props.headerMaxWidth}
          $headerColor={props.headerColor}
          $alignEndLastColumn={props.alignEndLastColumn ?? true}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, i) => (
                  <th
                    key={header.id}
                    className="translate"
                    {...(isIndented && i === 0
                      ? { colSpan: header.colSpan + 1 }
                      : header.colSpan > 1
                        ? { colSpan: header.colSpan }
                        : {})}
                  >
                    <TableCellWrapper
                      $alignColumn={
                        (header.column.columnDef as ColumnWithAlignment<T>)
                          .alignColumn
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableCellWrapper>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {rows.map((row) => {
              const original = row.original as T & TableRowMetadata<T>
              const isIndentedSubrow =
                isIndented && original.rowType?.toLowerCase() === 'subrow'

              return (
                <Fragment key={row.id}>
                  <TableTr
                    $lineBackgroundColor={
                      original.fixedLine?.lineBackgroundColor
                    }
                    $lineHoverColor={original.fixedLine?.lineHoverColor}
                    $hoverColor={props.hoverColor}
                    $alignEndLastColumn={props.alignEndLastColumn ?? true}
                    $numberOfColumns={row.getVisibleCells().length}
                    $fixedLineEnabled={original.fixedLine?.activated}
                    $tdMaxWidth={props.cellMaxWidth}
                    $disabledRow={original.disabled || props.disabledTable}
                    className={isIndentedSubrow ? 'indented' : ''}
                    onClick={row.getToggleExpandedHandler()}
                  >
                    {isIndentedSubrow ? <TableIndentation /> : null}

                    {row.getVisibleCells().map((cell, i) => (
                      <td
                        key={cell.id}
                        className="translate normal-td"
                        {...(isIndented && original.rowType === 'row' && i === 0
                          ? { colSpan: 2 }
                          : {})}
                      >
                        <TableCellWrapper
                          $alignColumn={
                            (cell.column.columnDef as ColumnWithAlignment<T>)
                              .alignColumn
                          }
                          className="cell-wrapper"
                        >
                          <TableCellValue
                            width={props.cellWidth}
                            $overflowVisible={props.cellOverflowVisible}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCellValue>
                        </TableCellWrapper>
                      </td>
                    ))}
                  </TableTr>

                  {row.getIsExpanded() &&
                  props.customSubRowInjection &&
                  !row.subRows.length ? (
                    <TableTr className="expanded-tr">
                      {isIndented ? <TableIndentation /> : null}
                      <td
                        colSpan={row.getVisibleCells().length}
                        className="expanded-td"
                      >
                        {props.customSubRowInjection(row)}
                      </td>
                    </TableTr>
                  ) : null}
                </Fragment>
              )
            })}
          </tbody>
        </BaseTable>
      </TableStyled>
    </TableWrapper>
  )
}

export type {
  TableCellProps,
  TableColumn,
  TableFeatureSet,
  TableRow,
  TableRowOriginalProps,
}
export { Table }
