type ConditionalWrapperProps = {
  condition: boolean
  wrapper: (children: React.ReactNode) => React.ReactNode
  children: React.ReactNode
}

/**
 * Wraps children if a condition is met
 */
const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: ConditionalWrapperProps) => (condition ? wrapper(children) : children)

export { ConditionalWrapper }
