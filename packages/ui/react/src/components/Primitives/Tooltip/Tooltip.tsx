import { useRef, useState, useEffect } from 'react'

import { styled } from '@mui/material/styles'
import type { TooltipProps } from '@mui/material/Tooltip'
import MuiTooltip, { tooltipClasses } from '@mui/material/Tooltip'

import { ContentChildren } from './Tooltip.styled'
import { getColor } from 'src/colors'
import { Unwrap } from 'src/components/types'
import { getFont } from 'src/fonts'
import { useWindowSize } from 'src/hooks'

type Nullable<T extends object> = { [K in keyof T]: T[K] | null | undefined }

type TooltipComponentProps = Unwrap<
  {
    /**
     * Tooltip reference element.
     */
    children: React.ReactNode
    /**
     * Define component styles
     */
    styles?: {
      /**
       * Tooltip background color.
       * (Does not work with JSX children)
       */
      backgroundColor?: string
      /**
       * font color
       */
      color?: string
    }
    /**
     * If `true`, hover in the tooltip is disabled.
     */
    disableHover?: boolean
    /**
     * If `true`, hover in the tooltip is disabled and enabled only when the
     * element reaches the limit of the width of the contained element.
     */
    enableOnlyWithEllipsisPoints?: boolean
    /**
     * It should be defined when the component is going to be used
     * in the controlled way
     */
    open?: boolean
  } & Omit<TooltipProps, 'title' | 'children'> &
    Nullable<Pick<TooltipProps, 'title'>>
>

const DEFAULT_BACKGROUND_COLOR = getColor('blue.950')

const StyledTooltip = ({
  styles,
  ...props
}: Pick<TooltipComponentProps, 'styles'> & TooltipProps) => {
  const WrappedTooltip = styled(
    ({ className, ...tooltipProps }: TooltipProps) => (
      <MuiTooltip
        {...tooltipProps}
        classes={{ popper: className }}
      />
    )
  )(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
      color: styles?.color,
      backgroundColor: styles?.backgroundColor ?? DEFAULT_BACKGROUND_COLOR,
      fontSize: '11px',
      fontFamily: getFont('roboto'),
    },
  }))

  return <WrappedTooltip {...props} />
}

/** Display informative text when users hover over a child element */
const Tooltip = ({
  disableHover = false,
  enableOnlyWithEllipsisPoints = false,
  title = '',
  children,
  ...props
}: TooltipComponentProps) => {
  const [
    isOverflowed,
    setIsOverflow,
  ] = useState(false)
  const [
    width,
    height,
  ] = useWindowSize()
  const isControlled = props.open !== undefined
  const contentChildrenRef = useRef<HTMLSpanElement>(null)

  const disableHoverListener = enableOnlyWithEllipsisPoints && !isOverflowed

  useEffect(() => {
    if (contentChildrenRef.current) {
      // returns the width of the element
      const elementWidth = contentChildrenRef.current.clientWidth
      // returns the width of the content enclosed in an element
      const containedElementWidth = contentChildrenRef.current.scrollWidth
      setIsOverflow(containedElementWidth > elementWidth)
    }
  }, [
    width,
    height,
  ])

  return (
    <StyledTooltip
      placement="bottom-start"
      disableHoverListener={
        disableHover || disableHoverListener || isControlled
      }
      disableFocusListener
      disableTouchListener
      title={title}
      {...props}
    >
      <ContentChildren
        ref={contentChildrenRef}
        className="translate"
        role="tooltip"
      >
        {children}
      </ContentChildren>
    </StyledTooltip>
  )
}

export type { TooltipComponentProps as TooltipProps }
export { Tooltip }
