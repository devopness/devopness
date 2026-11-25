import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from 'styled-components'

import { BreadCrumbs } from './BreadCrumbs'

const getStyleRule = (element: Element | null) => {
  if (!element) return undefined

  const classNames = Array.from(element.classList)

  return Array.from(document.styleSheets)
    .flatMap((styleSheet) => Array.from(styleSheet.cssRules))
    .find(
      (rule): rule is CSSStyleRule =>
        rule instanceof CSSStyleRule &&
        classNames.some((className) => rule.selectorText === `.${className}`)
    )
}

describe('BreadCrumbs', () => {
  it('renders breadcrumb labels and logo navigation', () => {
    const imageOnClick = vi.fn()

    render(
      <ThemeProvider theme={{}}>
        <BreadCrumbs
          navigateCrumbs={[
            {
              label: 'Projects',
              list: [],
              onClick: vi.fn(),
            },
          ]}
          backgroundColor="#fff"
          imageOnClick={imageOnClick}
        />
      </ThemeProvider>
    )

    const label = screen.getByText('Projects')
    expect(label).toBeInTheDocument()
    expect(label).toHaveStyle({
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    })

    const nodeContent = label.closest('[role="button"]')
    expect(
      getStyleRule(nodeContent)?.style.getPropertyValue('grid-template-columns')
    ).toMatch(/^auto minmax\(0(?:px)?, 1fr\)$/)
    expect(getStyleRule(label)?.style.getPropertyValue('width')).toBe('100%')
  })
})
