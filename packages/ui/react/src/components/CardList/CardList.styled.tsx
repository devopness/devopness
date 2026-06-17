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
  grid-template-columns: 1fr;
  grid-gap: 42px 30px;
  padding-bottom: 42px;
  width: 100%;

  @media (min-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`

export { StyledCardListContainer, StyledGrid }
