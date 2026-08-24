import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TokenStatus } from './TokenStatus'

describe('TokenStatus', () => {
  it('renders active status', () => {
    render(<TokenStatus status="active" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders expired status', () => {
    render(<TokenStatus status="expired" />)
    expect(screen.getByText('Expired')).toBeInTheDocument()
  })

  it('renders revoked status', () => {
    render(<TokenStatus status="revoked" />)
    expect(screen.getByText('Revoked')).toBeInTheDocument()
  })
})
