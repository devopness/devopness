import type React from 'react'
import { typedMemo } from './type-guards'

type ConditionalWrapperProps = {
  condition: unknown
  wrapper: (children: React.ReactNode) => React.ReactNode
  children: React.ReactNode
}

const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: ConditionalWrapperProps) => (condition ? wrapper(children) : children)

export default typedMemo(ConditionalWrapper)
