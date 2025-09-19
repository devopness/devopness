import React from 'react'

import { Wrapper } from './Illustration.styled'

/**
 * Illustration Component
 *
 * A simple flex container to center content horizontally and vertically,
 * with a fixed height and bottom border.
 *
 * @example
 * ```tsx
 * <Illustration>
 *   <img src="logo.png" alt="Logo" />
 * </Illustration>
 * ```
 */
type IllustrationProps = {
  /** React children to render inside */
  children: React.ReactNode
}

const Illustration = ({ children }: IllustrationProps) => (
  <Wrapper>{children}</Wrapper>
)

export { Illustration }
export type { IllustrationProps }
