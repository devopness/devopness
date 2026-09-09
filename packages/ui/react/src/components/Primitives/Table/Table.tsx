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

type FixedLine = {
  activated?: boolean
  lineBackgroundColor?: string
  lineHoverColor?: string
}

type TableRowMetadata = {
  tableId?: string | number
  rowType?: string
  fixedLine?: FixedLine
  disabled?: boolean
}

type TableProps<T extends object = {}> = TableOptions<T> & {
  padding?: string
  smallContainer?: boolean
  disabledTable?: boolean
  headerColor?: string
  alignEndLastColumn?: boolean
  headerMaxWidth?: string
  cellMaxWidth?: string
  cellOverflowVisible?: boolean
  cellWidth?: string
  hoverColor?: string
  layout?: 'indented'
  customSubRowInjection?: (row: Row<T>) => ReactNode
}

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

export { default as CellWrapper } from './CellWrapper'
export type { CellWrapperProps } from './CellWrapper'
export { default as Loading } from './Loading'
export { HeaderVariation, RowVariation } from './Loading'
export type { CellProps, LoadingProps } from './Loading'
export { default as TableRowDragDrop } from './TableRowDragDrop'
export type {
  MovingDataParams,
  TableRowDragDropProps,
} from './TableRowDragDrop'
export * from './Table.styled'
