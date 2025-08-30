import { SkeletonEffect } from './Skeleton.styled'

type SkeletonProps = {
  className?: string
  widthPercent?: number
  heightPercent?: number
  width?: number
  height?: number
  borderRadius?: number
}

const Skeleton = (props: SkeletonProps) => (
  <SkeletonEffect
    data-testid="skeleton"
    className={props.className}
    {...props}
  />
)

export { Skeleton }
