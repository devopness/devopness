import { render } from '@testing-library/react'

import { describe, expect, it } from 'vitest'

import { CardGrid } from './CardGrid'

const getBaseStyleRule = (element: Element | null) => {
  if (!element) return undefined

  const generatedClassName = element.className.split(/\s+/).at(-1)
  if (!generatedClassName) return undefined

  return Array.from(document.styleSheets)
    .flatMap((styleSheet) => Array.from(styleSheet.cssRules))
    .find(
      (rule): rule is CSSStyleRule =>
        rule instanceof CSSStyleRule &&
        rule.selectorText === `.${generatedClassName}`
    )
}

describe('CardGrid', () => {
  it('renders children', () => {
    const { getByText } = render(
      <CardGrid>
        <span>Card A</span>
        <span>Card B</span>
      </CardGrid>
    )
    expect(getByText('Card A')).toBeInTheDocument()
    expect(getByText('Card B')).toBeInTheDocument()
  })

  it('applies default styles', () => {
    const { container } = render(
      <CardGrid>
        <span>Card</span>
      </CardGrid>
    )
    const grid = container.firstChild
    expect(grid).toHaveStyle('display: grid')
    expect(grid).toHaveStyle('gap: 24px')
    expect(
      getBaseStyleRule(container.firstElementChild)?.style.getPropertyValue(
        'grid-template-columns'
      )
    ).toBe('repeat(1, 1fr)')
  })

  it('applies the configured mobile column count', () => {
    const { container } = render(
      <CardGrid columns={{ mobile: 2 }}>
        <span>Card</span>
      </CardGrid>
    )
    expect(
      getBaseStyleRule(container.firstElementChild)?.style.getPropertyValue(
        'grid-template-columns'
      )
    ).toBe('repeat(2, 1fr)')
  })

  it('applies the configured gap', () => {
    const { container } = render(
      <CardGrid gap="2rem">
        <span>Card</span>
      </CardGrid>
    )
    expect(container.firstChild).toHaveStyle('gap: 32px')
  })

  it('applies a fixed row height when provided', () => {
    const { container } = render(
      <CardGrid rowHeight="200px">
        <span>Card</span>
      </CardGrid>
    )
    expect(container.firstChild).toHaveStyle('grid-auto-rows: 200px')
  })
})
