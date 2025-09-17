import { styled } from 'styled-components'

import type { ContainerProps } from './Container'

type StyledProps = Pick<ContainerProps, 'shouldRemoveTopMargin' | 'styles'>

const ContainerStyled = styled.div<StyledProps>`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto;
  grid-column-gap: 30px;
  grid-row-gap: 30px;

  margin-top: ${({ shouldRemoveTopMargin }) =>
    shouldRemoveTopMargin ? '0px' : '42px'};
  padding-left: 30px;
  padding-right: 30px;

  @media (max-width: 640px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
`
const WrapperContent = styled.section<StyledProps>`
  grid-column: 4 / 10;

  @media (max-width: 768px) {
    grid-column: 2 / 12;
  }

  background: ${({ styles }) =>
    styles?.backgroundWrapperContent ?? 'transparent'};
  height: ${({ styles }) =>
    styles?.height ? `${String(styles.height)}px` : 'auto'};
`

export { ContainerStyled, WrapperContent }
