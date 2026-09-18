import styled from 'styled-components'

const EmptyDataWrapper = styled.div`
  padding: 0 16px;
  box-sizing: border-box;
  width: 100%;
`

const TableGridWithPagination = styled.div<{ height?: string }>`
  display: grid;
  grid-template-rows: auto 1fr;
  height: ${(props) => props.height ?? ''};
`

export { EmptyDataWrapper, TableGridWithPagination }
