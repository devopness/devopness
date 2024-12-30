import React from 'react'

import { ContainerStyled, WrapperContent } from './Container.styled'

type ContainerProps = {
  noTopMargin?: boolean
  styles?: {
    bgWrapperContent?: string
    height?: string
  }
  children?: React.ReactNode
}

const Container = (props: ContainerProps) => (
  <React.Fragment>
    <ContainerStyled noTopMargin={props.noTopMargin}>
      <WrapperContent styles={props.styles}>{props.children}</WrapperContent>
    </ContainerStyled>
  </React.Fragment>
)

export type { ContainerProps }
export { Container }
