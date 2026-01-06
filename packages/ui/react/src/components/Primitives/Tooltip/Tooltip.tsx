'use client'

import { useEffect, useRef, useState } from 'react'

import { styled } from '@mui/material/styles'
import type { TooltipProps } from '@mui/material/Tooltip'
import MuiTooltip, { tooltipClasses } from '@mui/material/Tooltip'

import { ContentChildren } from './Tooltip.styled'
import { getColor } from 'src/colors'
import { Unwrap } from 'src/components/types'
import { getFont } from 'src/fonts'

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

const BaseTooltip = ({ className, ...tooltipProps }: TooltipProps) => (
  <MuiTooltip
    {...tooltipProps}
    classes={{ popper: className }}
    data-testid="tooltip"
  />
)

const WrappedTooltip = styled(BaseTooltip)<{
  $color?: string
  $backgroundColor?: string
}>(({ $color, $backgroundColor }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    color: $color,
    backgroundColor: $backgroundColor ?? DEFAULT_BACKGROUND_COLOR,
    fontSize: '11px',
    fontFamily: getFont('roboto'),
  },
}))

const StyledTooltip = ({
  styles,
  ...props
}: Pick<TooltipComponentProps, 'styles'> & TooltipProps) => (
  <WrappedTooltip
    {...props}
    $color={styles?.color}
    $backgroundColor={styles?.backgroundColor}
  />
)

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
    setIsOverflowed,
  ] = useState(false)
  const isControlled = props.open !== undefined
  const contentChildrenRef = useRef<HTMLSpanElement>(null)

  const disableHoverListener = enableOnlyWithEllipsisPoints && !isOverflowed

  const checkOverflow = (windowRefValue: HTMLSpanElement) => {
    const next = windowRefValue.scrollWidth > windowRefValue.clientWidth

    setIsOverflowed((previousValue) =>
      previousValue === next ? previousValue : next
    )
  }

  useEffect(() => {
    const refValue = contentChildrenRef.current

    if (!refValue) return

    // Initial check
    checkOverflow(refValue)

    let resizeObserver: ResizeObserver | null = null

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(checkOverflow.bind(null, refValue))

      try {
        resizeObserver.observe(refValue)
      } catch (error) {
        console.error('Tooltip: ResizeObserver observe failed', error)
      }
    }

    // as a fallback listen to window resize
    window.addEventListener('resize', checkOverflow.bind(null, refValue))

    return () => {
      window.removeEventListener('resize', checkOverflow.bind(null, refValue))
      if (resizeObserver) resizeObserver.disconnect()
    }
  }, [
    contentChildrenRef,
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
      >
        {children}
      </ContentChildren>
    </StyledTooltip>
  )
}

export { Tooltip }
export type { TooltipComponentProps as TooltipProps }
