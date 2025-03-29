import * as matchers from '@testing-library/jest-dom/matchers'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

expect.extend(matchers)

type TestHoverTooltipOptions = {
  /** Element to hover over */
  element: HTMLElement
  /** Expected tooltip text */
  tooltipText: string
}

/**
 * Tests hover interactions with elements that trigger tooltips
 *
 * @returns Promise that resolves when the hover test is complete
 *
 * @example
 * ```typescript
 * await testHoverTooltip({
 *   element: screen.getByText('Hover me'),
 *   tooltipText: 'Tooltip content',
 * })
 * ```
 */
export async function testHoverTooltip({
  element,
  tooltipText,
}: TestHoverTooltipOptions) {
  expect(element).toBeInTheDocument()

  const user = userEvent.setup()

  // Hover over element
  await user.hover(element)

  // Verify tooltip appears
  const tooltip = await screen.findByRole('tooltip', {
    name: tooltipText,
  })
  expect(tooltip).toBeInTheDocument()

  // Remove hover
  await user.unhover(element)

  // Verify tooltip disappears
  await waitFor(() => {
    expect(
      screen.queryByRole('tooltip', { name: tooltipText })
    ).not.toBeInTheDocument()
  })
}
