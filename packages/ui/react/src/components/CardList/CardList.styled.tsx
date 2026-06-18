import styled from 'styled-components'

const StyledCardListContainer = styled.section`
  padding: 0px 30px;
  padding-top: 42px;

  @media (max-width: 768px) {
    padding-left: 16px;
    padding-right: 16px;
  }

  [data-testid='card-footer'].only-child button,
  [data-testid='card-footer'].only-child button:hover {
    background-color: transparent;
  }
`

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 42px 30px;
  padding-bottom: 42px;
  width: 100%;

  @media (min-width: 641px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1025px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

export { StyledCardListContainer, StyledGrid }
