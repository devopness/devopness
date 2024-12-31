import type { MouseEventHandler, PropsWithChildren } from 'react'

import {
  ContainerPagination,
  PaginationContent,
  TableGridWithPagination,
} from './Pagination.styled'
import { Button } from 'src/components/Buttons'

type ConfigurationActionsProps = {
  /** Disable all pagination actions */
  disableAllActions?: boolean
  /** Disable only previous/back pagination actions */
  disablePreviousActions?: boolean
  /** Disable only next/forward pagination actions */
  disableNextActions?: boolean
  /** Hide first page and last page buttons */
  hideFirstAndLastButton?: boolean
}

type PaginationActionsProps = ConfigurationActionsProps & {
  /** Handler for navigating to first page */
  firstPaginateAction: MouseEventHandler<HTMLButtonElement>
  /** Handler for navigating to previous page */
  previousPaginateAction: MouseEventHandler<HTMLButtonElement>
  /** Handler for navigating to next page */
  nextPaginateAction: MouseEventHandler<HTMLButtonElement>
  /** Handler for navigating to last page */
  lastPaginateAction: MouseEventHandler<HTMLButtonElement>
}

type TableGridWithPaginationProps = {
  /** Custom height for the table grid */
  height?: string
}

/**
 * Table grid component with pagination support
 *
 * @example
 * ```jsx
 * <TableGridWithPagination height="500px">
 *   <Table>...</Table>
 * </TableGridWithPagination>
 * ```
 */
const TableGridWithPaginationComponent = ({
  height,
  children,
}: PropsWithChildren<TableGridWithPaginationProps>) => (
  <TableGridWithPagination height={height}>{children}</TableGridWithPagination>
)

/**
 * Pagination controls for navigating through paginated content
 *
 * @example
 * ```jsx
 * <Pagination
 *   firstPaginateAction={() => goToPage(1)}
 *   previousPaginateAction={() => goToPage(currentPage - 1)}
 *   nextPaginateAction={() => goToPage(currentPage + 1)}
 *   lastPaginateAction={() => goToPage(totalPages)}
 *   disableNextActions={currentPage === totalPages}
 *   disablePreviousActions={currentPage === 1}
 * />
 * ```
 */
const Pagination = ({
  disableAllActions = false,
  disablePreviousActions = false,
  disableNextActions = false,
  hideFirstAndLastButton = false,
  firstPaginateAction,
  previousPaginateAction,
  nextPaginateAction,
  lastPaginateAction,
}: PaginationActionsProps) => (
  <ContainerPagination>
    <PaginationContent hideFirstAndLastButton={hideFirstAndLastButton}>
      <Button
        type="button"
        buttonType={'outlinedAuxiliary'}
        typeSize="medium"
        noMargin
        onClick={firstPaginateAction}
        disabled={disableAllActions || disablePreviousActions}
      >
        First
      </Button>
      <Button
        type="button"
        buttonType={'outlinedSecondary'}
        typeSize="medium"
        icon="leftArrow"
        noMargin
        onClick={previousPaginateAction}
        disabled={disableAllActions || disablePreviousActions}
      >
        Previous
      </Button>
      <Button
        type="button"
        buttonType={'outlinedSecondary'}
        typeSize="medium"
        icon="rightArrow"
        revertOrientation
        noMargin
        onClick={nextPaginateAction}
        disabled={disableAllActions || disableNextActions}
      >
        Next
      </Button>
      <Button
        type="button"
        buttonType={'outlinedAuxiliary'}
        typeSize="medium"
        noMargin
        onClick={lastPaginateAction}
        disabled={disableAllActions || disableNextActions}
      >
        Last
      </Button>
    </PaginationContent>
  </ContainerPagination>
)

export type { ConfigurationActionsProps, PaginationActionsProps }

export { TableGridWithPaginationComponent, Pagination }
