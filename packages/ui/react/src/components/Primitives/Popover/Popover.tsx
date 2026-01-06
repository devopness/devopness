import { ReactNode } from 'react'

import type { PopoverProps as MaterialPopoverProps } from '@mui/material'

import { Container, Footer, Header, Title } from './Popover.styled'
import { Button } from 'src/components/Buttons'
import { ConditionalWrapper } from 'src/components/helpers'
import { iconLoader } from 'src/icons'

type PopoverProps = {
  /** Optional header title */
  title?: string
  /** Optional footer content */
  footer?: ReactNode
  /** Popover children */
  children?: ReactNode
} & MaterialPopoverProps

/**
 * Popover component
 *
 * Displays a panel anchored to another element.
 * Can optionally show a header title and footer content.
 * Supports closing via the built-in close button.
 *
 * @example
 * ```tsx
 * <Popover
 *   open={isOpen}
 *   anchorEl={anchorElement}
 *   onClose={() => setIsOpen(false)}
 *   title="Popover Title"
 *   footer={<div>Footer content</div>}
 * >
 *   <div>Main content of the popover</div>
 * </Popover>
 * ```
 */
const Popover = ({ title, footer, children, ...props }: PopoverProps) => (
  <Container
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    {...props}
  >
    <Header
      data-testid="popover-header"
      $justifyContent={title ? 'space-between' : 'end'}
    >
      {title && <Title data-testid="popover-title">{title}</Title>}
      <Button
        noPadding
        noMargin
        buttonType="borderless"
        onClick={() => props.onClose?.({}, 'backdropClick')}
      >
        {iconLoader('close', 14)}
      </Button>
    </Header>

    {children}

    <ConditionalWrapper
      condition={Boolean(footer)}
      wrapper={(children) => (
        <Footer
          id="popover"
          $justifyContent="space-between"
        >
          {children}
        </Footer>
      )}
    >
      {footer}
    </ConditionalWrapper>
  </Container>
)

export { Popover }
export type { PopoverProps }
