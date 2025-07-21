import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Skeleton } from '.'

describe('Skeleton', () => {
  it('renders correctly with default props', () => {
    render(<Skeleton />)
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toBeInTheDocument()
  })

  it('renders with width and height in pixels', () => {
    render(
      <Skeleton
        width={100}
        height={50}
      />
    )
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveStyle({
      width: '100px',
      height: '50px',
    })
  })

  it('renders with widthPercent and heightPercent', () => {
    render(
      <Skeleton
        widthPercent={80}
        heightPercent={30}
      />
    )
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveStyle({
      width: '80%',
      height: '30%',
    })
  })

  it('renders with borderRadius', () => {
    render(
      <Skeleton
        borderRadius={12}
        width={100}
        height={20}
      />
    )
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveStyle({
      'border-radius': '12px',
    })
  })
})
