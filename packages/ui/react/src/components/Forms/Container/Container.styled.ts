import { styled } from 'styled-components'

type Props = {
  noTopMargin?: boolean
  styles?: {
    bgWrapperContent?: string
    height?: string
  }
}

const ContainerStyled = styled.div<Props>`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto;
  grid-column-gap: 30px;
  grid-row-gap: 30px;

  margin-top: ${(props) => (props.noTopMargin ? '0px' : '42px')};
  padding-left: 30px;
  padding-right: 30px;
`

const WrapperContent = styled.section<Props>`
  grid-column: 4 / 10;

  @media (max-width: 768px) {
    grid-column: 2 / 12;
  }

  background: ${(props) => props.styles?.bgWrapperContent ?? 'transparent'};
  height: ${(props) =>
    props.styles?.height ? `${props.styles.height}px` : 'auto'};
`
export { ContainerStyled, WrapperContent }
