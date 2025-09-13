import { styled } from 'styled-components'

import { getColor, Color } from 'src/colors'
type StyledCoverProps = {
  backgroundColor: Color
}

export const Container = styled.div<StyledCoverProps>`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 82px 1fr;
  align-items: center;
  height: 100vh;
  max-width: 100%;
  background-color: ${(props) => getColor(props.backgroundColor)};
  text-align: center;

  & img {
    margin: 0 auto;
    align-self: flex-end;

    &:nth-child(2) {
      width: 100%;
    }
  }

  & video {
    max-width: 100%;
    max-height: 100%;
  }
`
