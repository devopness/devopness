import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { CardLoading } from './CardLoading'

describe('CardLoading', () => {
  it('should render without crashing', () => {
    render(<CardLoading />)
    expect(screen.getByTestId('card-loading')).toBeInTheDocument()
  })

  it('should render avatar skeleton', () => {
    render(<CardLoading />)
    const avatar = screen.getByTestId('card-loading').querySelector('div')
    expect(avatar).toBeInTheDocument()
  })

  it('should render loading bars and icon', () => {
    render(<CardLoading />)

    expect(screen.getByTestId('card-loading')).toContainHTML('div')
  })
})
