import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FlexContainer } from './FlexContainer'

describe('FlexContainer', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <FlexContainer>
        <span>Child element</span>
      </FlexContainer>
    )
    expect(getByText('Child element')).toBeInTheDocument()
  })

  it('applies default flex styles', () => {
    const { container } = render(<FlexContainer>Default</FlexContainer>)
    expect(container.firstChild).toHaveStyle('display: flex')
    expect(container.firstChild).toHaveStyle('flex-direction: row')
    expect(container.firstChild).toHaveStyle('justify-content: flex-start')
    expect(container.firstChild).toHaveStyle('align-items: flex-start')
  })

  it('applies custom props correctly', () => {
    const { container } = render(
      <FlexContainer
        direction="column"
        justify="center"
        align="center"
        gap="16px"
        wrap="wrap"
      >
        Custom
      </FlexContainer>
    )
    expect(container.firstChild).toHaveStyle('flex-direction: column')
    expect(container.firstChild).toHaveStyle('justify-content: center')
    expect(container.firstChild).toHaveStyle('align-items: center')
    expect(container.firstChild).toHaveStyle('gap: 16px')
    expect(container.firstChild).toHaveStyle('flex-wrap: wrap')
  })
})
