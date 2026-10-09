import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { NavigationLink } from '.'
import { getColor } from 'src/colors'

const LINK_PROPS = {
  url: 'https://www.devopness.com',
}

describe('NavigationLink', () => {
  it('render correctly', () => {
    render(<NavigationLink to={LINK_PROPS.url}>LinkComponent</NavigationLink>)

    const expectedText = screen.getByText('LinkComponent')
    expect(expectedText).toBeInTheDocument()
  })

  it('render correctly without props.children', () => {
    render(<NavigationLink to={LINK_PROPS.url} />)

    const expectedText = screen.getByText('https://www.devopness.com')
    expect(expectedText).toBeInTheDocument()
  })

  it('render correctly with color', () => {
    render(
      <NavigationLink
        color="purple.800"
        to={LINK_PROPS.url}
      />
    )

    const expectedText = screen.getByText('https://www.devopness.com')
    expect(expectedText).toBeInTheDocument()
    expect(expectedText.getAttribute('color')).toEqual(getColor('purple.800'))
  })

  it('render correctly with new style', () => {
    const styles = {
      color: '#ff0000',
      backgroundColor: '#00ff00',
    } satisfies React.CSSProperties

    render(
      <NavigationLink
        style={styles}
        to={LINK_PROPS.url}
      />
    )

    const expectedText = screen.getByText('https://www.devopness.com')
    expect(expectedText).toBeInTheDocument()
    expect(expectedText).toHaveStyle('color: #ff0000;')
    expect(expectedText).toHaveStyle('background-color: #00ff00;')
  })

  it('renders as a custom component when "as" is provided, forwarding "to"', () => {
    const CustomLink = ({
      to,
      children,
      ...props
    }: React.PropsWithChildren<{ to?: string }>) => (
      <span
        data-testid="custom-link"
        data-to={to}
        {...props}
      >
        {children}
      </span>
    )

    render(
      <NavigationLink
        as={CustomLink}
        to={LINK_PROPS.url}
      >
        LinkComponent
      </NavigationLink>
    )

    const customLink = screen.getByTestId('custom-link')
    expect(customLink).toBeInTheDocument()
    expect(customLink).toHaveAttribute('data-to', LINK_PROPS.url)
    expect(customLink).not.toHaveAttribute('href')
    expect(customLink).not.toHaveAttribute('rel')
  })
})
