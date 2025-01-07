import { css } from 'styled-components'

const removeBlueMark = css`
  outline: none;

  & textarea:focus,
  input:focus {
    outline: none;
  }

  & *:focus {
    outline: none;
  }
`

export { removeBlueMark }
