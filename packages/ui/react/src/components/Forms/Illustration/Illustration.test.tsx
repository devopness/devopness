import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { Illustration } from './Illustration'

describe('Illustration', () => {
  it('renders children correctly', () => {
    render(
      <Illustration>
        <p data-testid="child">Hello</p>
      </Illustration>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeVisible()
  })

  it('applies flex centering styles', () => {
    render(
      <Illustration>
        <span>Content</span>
      </Illustration>
    )
    const wrapper = screen.getByText('Content').parentElement
    expect(wrapper).toHaveStyle({
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
    })
  })

  it('has fixed height and border bottom', () => {
    render(
      <Illustration>
        <span>Border test</span>
      </Illustration>
    )
    const wrapper = screen.getByText('Border test').parentElement

    expect(wrapper).toHaveStyle({
      height: '126px',
      width: '100%',
    })

    expect(wrapper).toHaveStyle({
      'border-bottom-width': '1px',
      'border-bottom-style': 'solid',
    })
  })
})
