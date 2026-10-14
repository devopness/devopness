import type { ReactElement, ReactNode } from 'react'
import { Fragment, useEffect, useRef, useState } from 'react'
import type {
  Cell,
  ColumnDef,
  Header,
  Row,
  RowData,
  Table as TableInstance,
  TableOptions,
} from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { TableWrapper, type TableWrapperProps } from './TableWrapper'

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

type ColumnWithAlignment<T extends RowData> = ColumnDef<T> & {
  alignColumn?: 'left' | 'center' | 'right'
}

type TableProps<T extends object = {}> = Omit<
  TableOptions<T>,
  'data' | 'columns' | 'getCoreRowModel'
> & {
  columns: readonly ColumnWithAlignment<T>[]
  data: readonly T[]
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
} & TableWrapperProps

/**
 * A generic table built on TanStack Table v8 with Devopness styling and expansion support.
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
function Table<T extends object = {}>(props: TableProps<T>): ReactElement {
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

  const tableInstance = useReactTable({
    ...props,
    data: dataTable,
    columns: props.columns as ColumnDef<T, unknown>[],
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    autoResetPageIndex: !skipPageRef.current.autoReset,
    autoResetAll: !skipPageRef.current.autoReset,
    state: props.state,
  }) as TableInstance<T>

  const isIndented = props.layout === 'indented'
  const tableId = (dataTable[0] as (T & TableRowMetadata) | undefined)?.tableId

  useEffect(() => {
    tableInstance.toggleAllRowsExpanded(false)
  }, [tableId, tableInstance])

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
                {headerGroup.headers.map((header: Header<T, unknown>, i) => (
                  <th
                    key={header.id}
                    className="translate"
                    {...(isIndented && i === 0 ? { colSpan: 2 } : {})}
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
            {rows.map((row: Row<T>) => {
              const original = row.original as T & TableRowMetadata
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

                    {row.getVisibleCells().map((cell: Cell<T, unknown>, i) => (
                      <td
                        key={cell.id}
                        className="translate normal-td"
                        {...(isIndented && original.rowType === 'row' && i === 0
                          ? { colSpan: 2 }
                          : {})}
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
                      </td>
                    ))}
                  </TableTr>

                  {row.getIsExpanded() &&
                  props.customSubRowInjection &&
                  !row.subRows.length ? (
                    <tr>
                      <td colSpan={row.getVisibleCells().length}>
                        {props.customSubRowInjection(row)}
                      </td>
                    </tr>
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

export { Table }
