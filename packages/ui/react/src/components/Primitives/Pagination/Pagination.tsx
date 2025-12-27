import type { MouseEventHandler } from 'react'

import { Button } from 'src/components/Buttons'
import { ContainerPagination, PaginationContent } from './Pagination.styled'

type PaginationProps = {
  /** Disable all pagination actions */
  disableAllActions?: boolean
  /** Disable only previous/back pagination actions */
  disablePreviousActions?: boolean
  /** Disable only next/forward pagination actions */
  disableNextActions?: boolean
  /** Hide first page and last page buttons */
  hideFirstAndLastButton?: boolean
  /** Handler for navigating to first page */
  firstPaginateAction: MouseEventHandler<HTMLButtonElement>
  /** Handler for navigating to previous page */
  previousPaginateAction: MouseEventHandler<HTMLButtonElement>
  /** Handler for navigating to next page */
  nextPaginateAction: MouseEventHandler<HTMLButtonElement>
  /** Handler for navigating to last page */
  lastPaginateAction: MouseEventHandler<HTMLButtonElement>
}

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
}: PaginationProps) => (
  <ContainerPagination>
    <PaginationContent $hideFirstAndLastButton={hideFirstAndLastButton}>
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
        icon="arrowLeft"
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
        icon="arrowRight"
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

export type { PaginationProps }

export { Pagination }
