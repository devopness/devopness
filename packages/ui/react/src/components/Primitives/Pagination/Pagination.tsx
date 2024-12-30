import type { MouseEventHandler, PropsWithChildren } from 'react'
import { memo } from 'react'

import {
  ContainerPagination,
  PaginationContent,
  TableGridWithPagination,
} from './Pagination.styled'
import { Button } from 'src/components/Buttons'

type ConfigurationActionsProps = {
  disableAllActions?: boolean
  disablePreviousActions?: boolean
  disableNextActions?: boolean
  hideFirstAndLastButton?: boolean
}

type PaginationActionsProps = ConfigurationActionsProps & {
  firstPaginateAction: MouseEventHandler<HTMLButtonElement>
  previousPaginateAction: MouseEventHandler<HTMLButtonElement>
  nextPaginateAction: MouseEventHandler<HTMLButtonElement>
  lastPaginateAction: MouseEventHandler<HTMLButtonElement>
}

type TableGridWithPaginationProps = {
  height?: string
}

const TableGridWithPaginationComponent = ({
  height,
  children,
}: PropsWithChildren<TableGridWithPaginationProps>) => (
  <TableGridWithPagination height={height}>{children}</TableGridWithPagination>
)

const PaginationComponent = ({
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

const Pagination = memo(PaginationComponent)

export type { ConfigurationActionsProps, PaginationActionsProps }

export { TableGridWithPaginationComponent, Pagination }
