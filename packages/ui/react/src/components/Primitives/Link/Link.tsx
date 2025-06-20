import type { HTMLProps } from 'react'
import React from 'react'

import { StyledLink } from './Link.styled'
import type { Color } from 'src/colors'
import { getColor } from 'src/colors'
import type { IconProps } from 'src/components/Primitives/Icon'
import { Icon } from 'src/components/Primitives/Icon'
import type { Unwrap } from 'src/components/types'

type LinkProps = Omit<
  HTMLProps<HTMLAnchorElement>,
  'href' | 'target' | 'color' | 'ref' | 'as' 
> & {
  /**
   * Defines element foreground color
   *
   * https://developer.mozilla.org/en-US/docs/Web/CSS/color
   * https://developer.mozilla.org/en-US/docs/Web/CSS/fill
   *
   * @see {getColor}
   */
  color?: Color
  /**
   * The URL that the hyperlink points to.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#href
   */
  to?: HTMLProps<HTMLAnchorElement>['href']
  /**
   * Where to display the linked URL.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target
   */
  target?: '_blank' | '_self'
  /**
   * Icon's Props
   *
   * @see {Icon}
   */
  iconProps?: Unwrap<Omit<IconProps, 'name'>>
  /**
   * Hides default underline when the element is visible
   */
  hideUnderline?: boolean
  /**
   * Hides underline when hovering the element
   */
  hideUnderlineOnHover?: boolean
  /**
   * Hides External URL Icon
   */
  hideExternalUrlIcon?: boolean

  /** 
  * A11y label for the link 
  */
  ariaLabel?: string
  
}

/**
 * Display a hyperlink to other application pages or external resources
 */
const Link = ({
  target = '_blank',
  children,
  color = 'purple.800',
  rel = target === '_blank' ? 'noopener noreferrer' : 'noreferrer',
  to: href,
  hideUnderline = false,
  hideUnderlineOnHover = false,
  hideExternalUrlIcon = false,
  iconProps,
  ariaLabel,
  ...props
}: React.PropsWithChildren<LinkProps>) => (
  <StyledLink
    rel={rel}
    tabIndex={0}
    aria-label={ariaLabel}
    href={href}
    target={target}
    color={getColor(color)}
    $showUnderline={!hideUnderline}
    $showUnderlineOnHover={!hideUnderlineOnHover}
    {...props}
  >
    {children ?? href}
    {!hideExternalUrlIcon && (
      <Icon
        name="openInNewWindow"
        {...iconProps}
      />
    )}
  </StyledLink>
)

export type { LinkProps }
export { Link }
