import type { ReactElement } from 'react'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import type { Cell, ColumnInstance, Row, TableOptions } from 'react-table'
import { useTable } from 'react-table'

import { getColor } from 'src/colors'
import { iconLoader } from 'src/icons'

import { BaseTable, TableTr, TableWrapper } from '../Table.styled'

/** Source and destination indexes for a row move operation. */
export interface TableMovingDataParams {
  /** Original row index. */
  fromIndex: number
  /** Destination row index. */
  toIndex: number
}

type DragDropRowMetadata = {
  id?: string | number
  blockDrag?: { message?: string } | false
  fixedLine?: {
    activated?: boolean
    lineBackgroundColor?: string
    lineHoverColor?: string
  }
  disabled?: boolean
}

/** Props for the sortable drag-and-drop table. */
type TableRowDragDropProps<T extends object = {}> = Pick<
  TableOptions<T>,
  'columns' | 'data'
> & {
  /** Called after a row is dropped with the new ordering. */
  onDrop: (moving: TableMovingDataParams, data: T[]) => void
  /** Called whenever a row starts or stops dragging. */
  onDrag: (isDragging: boolean) => void
}

const moveArrayItem = <T,>(items: T[], fromIndex: number, toIndex: number) => {
  const nextItems = [...items]
  const [item] = nextItems.splice(fromIndex, 1)
  nextItems.splice(toIndex, 0, item)
  return nextItems
}

/**
 * Renders a table whose rows can be reordered with drag and drop.
 *
 * Rows should expose a stable `id` property so React Table can identify them.
 *
 * @example
 * ```tsx
 * <TableRowDragDrop
 *   columns={[{ Header: "Name", accessor: "name" }]}
 *   data={[{ id: "one", name: "First" }, { id: "two", name: "Second" }]}
 *   onDrag={(isDragging) => setDragging(isDragging)}
 *   onDrop={(move, rows) => saveOrder(move, rows)}
 * />
 * ```
 */
function TableRowDragDrop<T extends object = {}>({
  columns,
  data,
  onDrop,
  onDrag,
}: TableRowDragDropProps<T>): ReactElement {
  const [sortedData, setSortedData] = useState<T[]>([])

  useEffect(() => {
    if (Array.isArray(data)) {
      setSortedData(data)
    }
  }, [data])

  const [moving, setMoving] = useState<TableMovingDataParams | null>(null)
  const getRowId = useCallback((row: T) => {
    const rowWithId = row as T & DragDropRowMetadata
    return String(rowWithId.id)
  }, [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable<T>({
    data: sortedData,
    columns,
    getRowId,
  })

  const moveRow = (dragIndex: number, hoverIndex: number) => {
    setMoving((currentMoving) => ({
      fromIndex: currentMoving?.fromIndex ?? dragIndex,
      toIndex: hoverIndex,
    }))
    setSortedData((currentData) =>
      moveArrayItem(currentData, dragIndex, hoverIndex)
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <TableWrapper $smallContainer>
        <BaseTable {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => {
              const { key: headerGroupKey, ...headerGroupProps } =
                headerGroup.getHeaderGroupProps()
              return (
                <tr
                  key={headerGroupKey}
                  {...headerGroupProps}
                >
                  <th />
                  {headerGroup.headers.map((column) => {
                    const { key: columnKey, ...columnProps } =
                      column.getHeaderProps()
                    return (
                      <th
                        key={columnKey}
                        {...columnProps}
                      >
                        {column.render('Header')}
                      </th>
                    )
                  })}
                </tr>
              )
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row)
              const { key: rowKey, ...rowProps } = row.getRowProps()
              return (
                <TableRow<T>
                  key={rowKey}
                  visibleColumns={visibleColumns}
                  index={index}
                  row={row}
                  onDrag={onDrag}
                  onDrop={() => {
                    if (!moving) return
                    onDrop(moving, sortedData)
                    setMoving(null)
                  }}
                  moveRow={moveRow}
                  {...rowProps}
                />
              )
            })}
          </tbody>
        </BaseTable>
      </TableWrapper>
    </DndProvider>
  )
}

const DND_ITEM_TYPE = 'row'

interface TableRowParams<T extends object> {
  row: Row<T>
  index: number
  visibleColumns: ColumnInstance<T>[]
  moveRow(dragIndex: number, hoverIndex: number): void
  onDrop(): void
  onDrag(isDragging: boolean): void
}

function TableRow<T extends object>({
  row,
  index,
  moveRow,
  onDrop,
  onDrag,
  visibleColumns,
}: TableRowParams<T>) {
  const dropRef = useRef<HTMLTableRowElement>(null)
  const dragRef = useRef<HTMLTableCellElement>(null)
  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover(item: { index: number }, monitor) {
      if (!dropRef.current) return

      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = dropRef.current.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY =
        typeof clientOffset?.y === 'number'
          ? clientOffset.y - hoverBoundingRect.top
          : undefined
      const isDraggingUp = dragIndex > hoverIndex

      if (hoverClientY !== undefined) {
        if (!isDraggingUp && hoverClientY > hoverMiddleY) return
        if (isDraggingUp && hoverClientY > hoverMiddleY) return
      }

      moveRow(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })
  const [{ isDragging }, drag, preview] = useDrag({
    type: DND_ITEM_TYPE,
    item: {
      type: DND_ITEM_TYPE,
      index,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: onDrop,
  })

  useEffect(() => {
    onDrag(isDragging)
  }, [isDragging, onDrag])

  preview(drop(dropRef))
  drag(dragRef)

  const { key: rowPropsKey, ...rowPropsRest } = row.getRowProps()
  const rowMetadata = row.original as T & DragDropRowMetadata
  const blockDrag =
    rowMetadata.blockDrag && typeof rowMetadata.blockDrag === 'object'
      ? rowMetadata.blockDrag
      : undefined

  return (
    <Fragment key={`fragment-${rowPropsKey}`}>
      <TableTr
        ref={dropRef}
        style={{ opacity: isDragging ? 0 : 1 }}
        $lineBackgroundColor={rowMetadata.fixedLine?.lineBackgroundColor}
        $lineHoverColor={rowMetadata.fixedLine?.lineHoverColor}
        $fixedLineEnabled={rowMetadata.fixedLine?.activated}
        $disabledRow={rowMetadata.disabled}
        $numberOfColumns={visibleColumns.length}
        {...rowPropsRest}
      >
        <td
          title={blockDrag?.message || ''}
          className={blockDrag ? 'drag-cell-block' : 'drag-cell'}
          ref={blockDrag ? undefined : dragRef}
        >
          {iconLoader(
            'dragHandle',
            18,
            getColor(blockDrag ? 'slate.300' : 'gray.615'),
            1,
            'drag row'
          )}
        </td>
        {row.cells.map((cell: Cell<T, unknown>) => {
          const { key: cellKey, ...cellProps } = cell.getCellProps()
          return (
            <td
              key={cellKey}
              {...cellProps}
            >
              {cell.render('Cell')}
            </td>
          )
        })}
      </TableTr>
    </Fragment>
  )
}

export type { TableRowDragDropProps }
export { TableRowDragDrop }
