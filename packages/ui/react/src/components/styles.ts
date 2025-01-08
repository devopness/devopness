import { css } from 'styled-components'

/**
 * Removes browser default focus outlines to ensure clean base styling, allowing
 * Devopness design system styles to be applied without conflicts.
 *
 * @example
 * import { removeBlueMark } from './styles'
 * import { styled } from 'styled-components'
 * const Container = styled.div`
 *   ${removeBlueMark}
 * `
 */
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
