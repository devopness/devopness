import React from 'react'

import {
  BarLoader,
  PageLoader,
  CircleLoader,
  LoaderContainer,
  RingLoader,
} from './Loader.styled'
import type { ReactSpinnersProps } from './ReactSpinners.type'
import { Text } from 'src/components/Primitives/Text'

type LoaderVariant = 'bar' | 'page' | 'circle' | 'ring'

type LoaderProps = {
  text?: string
  variant?: LoaderVariant
  paddingTop?: string
  isAlignLeft?: boolean
} & ReactSpinnersProps

const variants: Record<
  LoaderVariant,
  React.ComponentType<Partial<LoaderProps>>
> = {
  bar: BarLoader,
  page: PageLoader,
  circle: CircleLoader,
  ring: RingLoader,
}

const Loader = ({
  text = '',
  variant = 'page',
  paddingTop,
  isAlignLeft,
  ...restProps
}: LoaderProps) => {
  const LoaderComponent = variants[variant]

  if (variant === 'page') {
    return <LoaderComponent />
  }

  return (
    <LoaderContainer
      paddingTop={paddingTop}
      isAlignLeft={isAlignLeft}
    >
      <LoaderComponent
        paddingTop={paddingTop}
        {...restProps}
      />
      {text && (
        <Text
          className="translate"
          isSmall
        >
          {text}
        </Text>
      )}
    </LoaderContainer>
  )
}

export { Loader }
