import { SkeletonEffect } from './Skeleton.styled'

type SkeletonProps = {
  className?: string
  widthPercent?: number
  heightPercent?: number
  width?: number
  height?: number
  borderRadius?: number
}

const Skeleton = (props: SkeletonProps) => {
  const { className, widthPercent, heightPercent, width, height, borderRadius } = props

  return (
    <SkeletonEffect
      data-testid="skeleton"
      className={className}
      $widthPercent={widthPercent}
      $heightPercent={heightPercent}
      $width={width}
      $height={height}
      $borderRadius={borderRadius}
    />
  )
}

export { Skeleton }
