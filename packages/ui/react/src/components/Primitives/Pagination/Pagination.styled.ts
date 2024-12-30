import { styled, css } from 'styled-components'

type PaginationContentProps = {
  hideFirstAndLastButton: boolean
}

type TableGridWithPaginationProps = {
  height?: string
}

const ContainerPagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 87px;
`

const hideFirstAndLastButton = css`
  & > button:nth-child(1),
  > button:nth-child(4) {
    visibility: hidden;
  }
`

const PaginationContent = styled.div<PaginationContentProps>`
  display: flex;
  & > button:nth-child(1),
  > button:nth-child(2),
  > button:nth-child(3) {
    margin-right: 15px;
  }
  ${(props) => props.hideFirstAndLastButton && hideFirstAndLastButton}
`

const TableGridWithPagination = styled.div<TableGridWithPaginationProps>`
  display: grid;
  grid-template-rows: auto 1fr;
  height: ${(props) => props.height ?? ''};
`

export { ContainerPagination, PaginationContent, TableGridWithPagination }
