import { ReactNode } from 'react'

import type { PopoverProps as MaterialPopoverProps } from '@mui/material'

import { Container, Footer, Header, Title, Content } from './Popover.styled'
import { IconButton } from 'src/components/Buttons'
import { ConditionalWrapper } from 'src/components/helpers'

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
      <IconButton
        variant="ghost"
        name="close"
        size={14}
        aria-label="Close"
        onClick={() => props.onClose?.({}, 'backdropClick')}
      />
    </Header>

    <Content data-testid="popover-content">{children}</Content>

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
