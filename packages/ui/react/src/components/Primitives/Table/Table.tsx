import type { ReactElement, ReactNode } from 'react'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import type {
  Cell,
  ColumnInstance,
  HeaderGroup,
  Row,
  TableInstance,
  TableOptions,
} from 'react-table'
import { useExpanded, useTable } from 'react-table'

import {
  BaseTable,
  TableCellValue,
  TableCellWrapper,
  TableIndentation,
  TableTr,
  TableWrapper,
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
type TableRowMetadata = {
  /** Identifier used to reset expanded rows when the table changes. */
  tableId?: string | number
  /** Row type used by the indented layout. */
  rowType?: string
  /** Fixed line styling for the row. */
  fixedLine?: FixedLine
  /** Disables interaction with the row and renders it with reduced opacity. */
  disabled?: boolean
}

/** Props accepted by the generic React Table wrapper. */
type TableProps<T extends object = {}> = TableOptions<T> & {
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
  customSubRowInjection?: (row: Row<T>) => ReactNode
}

/**
 * A generic table built on React Table v7 with Devopness styling and expansion support.
 *
 * @example
 * ```tsx
 * <Table
 *   columns={[
 *     { Header: "Name", accessor: "name" },
 *     { Header: "Status", accessor: "status" },
 *   ]}
 *   data={[
 *     { name: "Production", status: "Healthy" },
 *   ]}
 * />
 * ```
 */
function Table<T extends object = {}>(props: TableProps<T>): ReactElement {
  const [dataTable, setDataTable] = useState<T[]>([])

  const skipPageRef = useRef({ autoReset: false })

  useEffect(() => {
    if (Array.isArray(props.data)) {
      skipPageRef.current.autoReset = true
      setDataTable(props.data)
    }
  }, [props.data])

  useEffect(() => {
    skipPageRef.current.autoReset = false
  }, [])

  const tableInstance: TableInstance<T> = useTable<T>(
    {
      ...props,
      data: dataTable,
      autoResetPage: !skipPageRef.current.autoReset,
      autoResetGroupBy: !skipPageRef.current.autoReset,
      autoResetSelectedRows: !skipPageRef.current.autoReset,
      autoResetSortBy: !skipPageRef.current.autoReset,
      autoResetFilters: !skipPageRef.current.autoReset,
      autoResetRowState: !skipPageRef.current.autoReset,
      autoResetExpanded: !skipPageRef.current.autoReset,
    } as TableOptions<T>,
    useExpanded
  )
  const isIndented = props.layout === 'indented'
  const tableId = (dataTable[0] as (T & TableRowMetadata) | undefined)?.tableId

  useEffect(() => {
    tableInstance.toggleAllRowsExpanded(false)
  }, [tableId])

  return (
    <TableWrapper
      $padding={props.padding}
      $smallContainer={props.smallContainer}
    >
      <BaseTable
        $smallContainer={props.smallContainer}
        $disabledTable={props.disabledTable}
        $thMaxWidth={props.headerMaxWidth}
        $headerColor={props.headerColor}
        $alignEndLastColumn={props.alignEndLastColumn ?? true}
        {...tableInstance.getTableProps()}
      >
        <thead>
          {tableInstance.headerGroups.map((headerGroup: HeaderGroup<T>) => {
            const { key: headerGroupKey, ...restOfHeaderGroupProps } =
              headerGroup.getHeaderGroupProps()
            return (
              <tr
                key={headerGroupKey}
                {...restOfHeaderGroupProps}
              >
                {headerGroup.headers.map((header: ColumnInstance<T>, i) => {
                  const headerProps = header.getHeaderProps()
                  const { key: headerKey, ...restOfHeaderProps } = headerProps

                  return (
                    <th
                      key={headerKey}
                      className="translate"
                      {...restOfHeaderProps}
                      {...(isIndented && i === 0 ? { colSpan: 2 } : {})}
                    >
                      <TableCellWrapper $alignColumn={header.alignColumn}>
                        {header.render('Header')}
                      </TableCellWrapper>
                    </th>
                  )
                })}
              </tr>
            )
          })}
        </thead>

        <tbody {...tableInstance.getTableBodyProps()}>
          {tableInstance.rows.map((row: Row<T>) => {
            tableInstance.prepareRow(row)
            const { key, ...restOfRowProps } = row.getRowProps()
            const original = row.original as T & TableRowMetadata
            const isIndentedSubrow =
              isIndented && original.rowType?.toLowerCase() === 'subrow'

            return (
              <Fragment key={key}>
                <TableTr
                  $lineBackgroundColor={original.fixedLine?.lineBackgroundColor}
                  $lineHoverColor={original.fixedLine?.lineHoverColor}
                  $hoverColor={props.hoverColor}
                  $alignEndLastColumn={props.alignEndLastColumn ?? true}
                  $numberOfColumns={tableInstance.visibleColumns.length}
                  $fixedLineEnabled={original.fixedLine?.activated}
                  $tdMaxWidth={props.cellMaxWidth}
                  $disabledRow={original.disabled || props.disabledTable}
                  className={isIndentedSubrow ? 'indented' : ''}
                  {...restOfRowProps}
                >
                  {isIndentedSubrow ? <TableIndentation /> : null}

                  {row.cells.map((cell: Cell<T, unknown>, i) => {
                    const { key: cellKey, ...restOfCellProps } =
                      cell.getCellProps()
                    return (
                      <td
                        key={cellKey}
                        className="translate normal-td"
                        {...restOfCellProps}
                        {...(isIndented && original.rowType === 'row' && i === 0
                          ? { colSpan: 2 }
                          : {})}
                      >
                        <TableCellWrapper
                          $alignColumn={cell.column.alignColumn}
                          className="cell-wrapper"
                        >
                          <TableCellValue
                            $overflowVisible={props.cellOverflowVisible}
                            width={props.cellWidth}
                          >
                            {cell.render('Cell')}
                          </TableCellValue>
                        </TableCellWrapper>
                      </td>
                    )
                  })}
                </TableTr>

                {row.subRows?.length === 0 &&
                  row.isExpanded &&
                  props.customSubRowInjection && (
                    <TableTr
                      key={`expanded-tr-${row.index}`}
                      className="expanded-tr"
                    >
                      {isIndented ? <TableIndentation /> : null}

                      <td
                        key={`expanded-td-${row.index}`}
                        colSpan={tableInstance.visibleColumns.length}
                        className="expanded-td"
                      >
                        {props.customSubRowInjection(row)}
                      </td>
                    </TableTr>
                  )}
              </Fragment>
            )
          })}
        </tbody>
      </BaseTable>
    </TableWrapper>
  )
}

export type { FixedLine, TableProps, TableRowMetadata }
export { Table }
export default React.memo(Table) as typeof Table

export { TableCellWrapper } from './TableCellWrapper/TableCellWrapper'
export type { TableCellWrapperProps } from './TableCellWrapper/TableCellWrapper'
export { TableLoading } from './TableLoading/TableLoading'
export {
  TableHeaderVariation,
  TableRowVariation,
} from './TableLoading/TableLoading'
export type {
  TableCellProps,
  TableLoadingProps,
} from './TableLoading/TableLoading'
export { default as TableRowDragDrop } from './TableRowDragDrop/TableRowDragDrop'
export type {
  TableMovingDataParams,
  TableRowDragDropProps,
} from './TableRowDragDrop/TableRowDragDrop'
export * from './Table.styled'
