import { Fragment, type PropsWithChildren } from 'react'

import {
  EmptyData,
  type EmptyDataProps,
} from 'src/components/Primitives/EmptyData'
import {
  Pagination,
  type PaginationProps,
} from 'src/components/Primitives/Pagination'
import { useDebounce } from 'src/hooks/useDebounce'
import {
  TableLoading,
  TableLoadingCellProps,
} from 'src/components/Primitives/Table/TableLoading'

import { TableGridWithPagination } from './TableWrapper.styled'

interface TableWrapperProps {
  /** Indicates whether the table data is loading, used in conjuction with `loadingTableCells` */
  isLoading?: boolean
  /** Cell data to show when table data is loading, when isLoading is true */
  loadingTableCells?: readonly TableLoadingCellProps[]
  /** Indicates whether the table is empty, used in conjuction with `emptyData` */
  isEmpty?: boolean
  /** Empty data to show when table has no data, meaning `isEmpty` is true */
  emptyData?: EmptyDataProps
  /** Pagination metadata and callbacks */
  paginationData?: {
    pageCount: number
    paginationProps: PaginationProps
  }
  /** Gives fixed to the table, with overflow scroll behaviour */
  height?: string
}

function TableWrapper({
  isLoading = false,
  loadingTableCells = [],
  isEmpty = false,
  emptyData,
  paginationData,
  children,
  height,
}: PropsWithChildren<TableWrapperProps>) {
  const delay = useDebounce<boolean>(isLoading, 500)
  if (children) {
    if ((isLoading || delay) && loadingTableCells?.length) {
      return <TableLoading cells={loadingTableCells} />
    } else if (isEmpty && emptyData) {
      return (
        <Fragment>
          {children}
          <div
            style={{
              padding: '0 16px',
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            <EmptyData
              isSmallContainer={Boolean(emptyData?.isSmallContainer)}
              image={emptyData.image}
              message={emptyData.message || ''}
            />
          </div>
        </Fragment>
      )
    }
    return (
      <Fragment>
          <TableGridWithPagination height={height}>
            {children}
            {paginationData && paginationData.pageCount > 1 && (
              <Pagination {...paginationData.paginationProps} />
            )}
          </TableGridWithPagination>
      </Fragment>
    )
  }
  return <Fragment />
}

export { TableWrapper, type TableWrapperProps }
