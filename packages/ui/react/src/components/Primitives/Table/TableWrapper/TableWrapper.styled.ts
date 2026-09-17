import styled from 'styled-components'

const TableGridWithPagination = styled.div<{ height?: string }>`
  display: grid;
  grid-template-rows: auto 1fr;
  height: ${(props) => props.height ?? ''};
`

export { TableGridWithPagination }
