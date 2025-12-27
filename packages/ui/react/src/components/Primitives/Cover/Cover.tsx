import type { PropsWithChildren } from 'react'

import { useMediaQuery } from '@mui/material'

import type { Color } from 'src/colors'
import { getImageAssetUrl } from 'src/icons'
import { Container } from './Cover.styled'

const variants = {
  white: getImageAssetUrl('logo_devopness_beta.png'),
  colored: getImageAssetUrl('logo_devopness_alfa.png'),
} as const

type CoverProps = {
  /** Choose between 'white' and 'colored' logos */
  logo?: keyof typeof variants
  /** Optional className */
  className?: string
  /** Background color */
  backgroundColor?: Color
  /** Minimum width at which to show the cover (ex: '600px', '48em', etc) */
  minWidth?: string
}

/**
 * A component that renders a cover with a logo and background color.
 *
 * It only renders when the screen width is greater than or equal to the provided `minWidth`.
 *
 * @example
 * <Cover minWidth="600px" logo="colored">
 *   <p>Content inside the Cover component</p>
 * </Cover>
 */
const Cover = ({
  className,
  logo = 'colored',
  backgroundColor = 'indigo.10',
  minWidth = '600px',
  children,
}: PropsWithChildren<CoverProps>) => {
  const isVisible = useMediaQuery(`(min-width:${minWidth})`)

  if (!isVisible) return null

  return (
    <Container
      className={className}
      $backgroundColor={backgroundColor}
    >
      <img
        src={variants[logo]}
        alt="devopness"
      />
      {children}
    </Container>
  )
}

export { Cover }

export type { CoverProps }
