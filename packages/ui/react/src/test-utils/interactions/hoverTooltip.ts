import * as matchers from '@testing-library/jest-dom/matchers'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

expect.extend(matchers)

type TestHoverTooltipOptions = {
  /** Element to hover over */
  element: HTMLElement
  /** Expected a tooltip text */
  tooltipText: string
}

/**
 * Tests hover interactions with elements that trigger tooltips
 *
 * @returns Promise that resolves when the hover test is complete
 *
 * @example
 * ```TypeScript
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
  const tooltip = await screen.findByRole('tooltip', { name: tooltipText })
  expect(tooltip).toBeVisible()

  // Remove hover
  await user.unhover(element)

  // Verify tooltip disappears
  await waitFor(
    () => {
      expect(tooltip).not.toBeVisible()
    },
    { timeout: 3000 }
  )
}
