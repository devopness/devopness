import styled from 'styled-components'

const GridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 70vh;
  box-sizing: border-box;
  padding: 16px;
  padding-left: max(16px, env(safe-area-inset-left));
  padding-right: max(16px, env(safe-area-inset-right));

  @media (min-width: 768px) {
    padding-top: 2rem;
    padding-bottom: 2rem;
    padding-left: max(2.25rem, env(safe-area-inset-left));
    padding-right: max(2.25rem, env(safe-area-inset-right));
  }
`

export { GridWrapper }
