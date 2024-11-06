type ConditionalWrapperProps = {
  condition: boolean
  wrapper: (children: React.ReactNode) => React.ReactNode
  children: React.ReactNode
}

const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: ConditionalWrapperProps) => (condition ? wrapper(children) : children)

export { ConditionalWrapper }
