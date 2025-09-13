import type { ComponentType } from 'react'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import Tooltip from '@mui/material/Tooltip'

import type { DropdownOption } from '../Dropdown'
import {
  StyledAccordion,
  StyledAccordionSummary,
  StyledAccordionDetails,
  Text,
} from './AccordionExpand.styled'

/**
 * Base props shared by both Accordion variations
 */
type AccordionExpandBaseProps = {
  /** Label displayed in the accordion summary */
  label: string
  /** Optional tooltip for the accordion summary */
  tooltip?: string
  /** Disables the accordion if true */
  isDisabled?: boolean
  /**
   * Optional callback for handling errors on item click.
   * Receives the error thrown by the item's onClick.
   */
  onItemClickError?: (error: unknown) => void
}

/**
 * Props when using navigationComponent (requires url in items)
 */
type AccordionWithNavigation = AccordionExpandBaseProps & {
  /**
   * List of items that **must** have `url` defined
   */
  items: DropdownOption[]
  /**
   * Component to use for navigation links
   */
  navigationComponent: ComponentType<{
    to: string
    children: React.ReactNode
    hideUnderline?: boolean
    style?: React.CSSProperties
  }>
}

/**
 * Props when NOT using navigationComponent (items cannot have url)
 */
type AccordionWithoutNavigation = AccordionExpandBaseProps & {
  items: (Omit<DropdownOption, 'url'> & { url?: undefined })[]
  navigationComponent?: never
}

/**
 * Union type for Accordion props
 */
type AccordionExpandProps = AccordionWithNavigation | AccordionWithoutNavigation

/**
 * Accordion component that displays a list of items with optional tooltips and navigation links.
 *
 * This component supports two usage modes:
 *
 * 1. **Navigation Mode:** If any item in `items` contains a `url`, you **must** provide a
 *    `navigationComponent` to render the link. The `navigationComponent` receives `to`,
 *    `children`, `hideUnderline`, and `style` props.
 *
 * 2. **Standard Mode:** If none of the items have a `url`, `navigationComponent` should **not** be provided.
 *
 *
 * @example
 * // Standard usage without links
 * <AccordionExpand
 *   label="My Accordion"
 *   items={[
 *     { label: 'Option 1', onClick: async () => console.log('clicked') },
 *     { label: 'Option 2', onClick: () => console.log('clicked too') }
 *   ]}
 * />
 *
 * @example
 * // Navigation mode with links
 * <AccordionExpand
 *   label="My Accordion"
 *   items={[
 *     { label: 'Option 1', url: '/home' },
 *     { label: 'Option 2', url: '/about' }
 *   ]}
 *   navigationComponent={MyNavLink}
 * />
 */

const AccordionExpand = ({
  label,
  tooltip,
  isDisabled = false,
  items,
  navigationComponent,
  onItemClickError,
}: AccordionExpandProps) => {
  const summary = (
    <StyledAccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel-content"
      id="panel-header"
    >
      <Text color="blue.800">{label}</Text>
    </StyledAccordionSummary>
  )

  const handleItemClick = async (option: DropdownOption) => {
    if (!option.onClick) return
    try {
      await Promise.resolve(option.onClick())
    } catch (err) {
      onItemClickError?.(err)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <StyledAccordion disabled={isDisabled}>
        {tooltip ? <Tooltip title={tooltip}>{summary}</Tooltip> : summary}
        <StyledAccordionDetails>
          {items.map((option, index) => {
            const content = (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  opacity: option.isDisabled ? 0.5 : 1,
                  cursor: option.isDisabled ? 'not-allowed' : 'pointer',
                }}
                onClick={(e) => {
                  if (option.isDisabled) return
                  if (option.onClick) {
                    e.preventDefault()
                    e.stopPropagation()
                    void handleItemClick(option)
                  }
                }}
              >
                {option.label && (
                  <Tooltip title={option.label}>
                    <Text
                      style={{ fontSize: 13, fontWeight: 400 }}
                      color={option.color}
                    >
                      {option.label}
                    </Text>
                  </Tooltip>
                )}
              </div>
            )

            if (option.url && navigationComponent) {
              const Nav = navigationComponent
              return (
                <Nav
                  key={`link-${String(index)}`}
                  to={option.url}
                  style={{ display: 'block' }}
                  hideUnderline
                >
                  {content}
                </Nav>
              )
            }

            return content
          })}
        </StyledAccordionDetails>
      </StyledAccordion>
    </div>
  )
}

export { AccordionExpand }
