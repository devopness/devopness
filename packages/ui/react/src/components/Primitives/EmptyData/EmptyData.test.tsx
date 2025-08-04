import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EmptyData } from './EmptyData'

describe('EmptyData', () => {
  it('should render default message when message prop is not provided', () => {
    render(<EmptyData />)

    expect(
      screen.getByText(
        (text) =>
          text.includes('You do not have any items created for this module') &&
          text.includes('Add button')
      )
    ).toBeInTheDocument()
  })

  it('should render the provided message when passed as prop', () => {
    const customMessage = 'No items found. Try creating one.'

    render(<EmptyData message={customMessage} />)

    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })

  it('should not render the image if image prop is not provided', () => {
    render(<EmptyData />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('should render the image with correct src and alt', () => {
    const imageUrl = 'https://example.com/empty.svg'

    render(<EmptyData image={imageUrl} />)

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', imageUrl)
    expect(img).toHaveAttribute('alt', 'Empty data logo')
  })

  it('should apply small container styles when isSmallContainer is true', () => {
    const imageUrl = 'https://example.com/empty.svg'

    render(
      <EmptyData
        image={imageUrl}
        isSmallContainer
      />
    )

    const imgContainer = screen.getByTestId('emptydata-img-container')

    expect(imgContainer).toHaveStyle('width: 100px')
    expect(imgContainer).toHaveStyle('height: 100px')
  })

  it('should apply default container styles when isSmallContainer is false', () => {
    const imageUrl = 'https://example.com/empty.svg'

    render(
      <EmptyData
        image={imageUrl}
        isSmallContainer={false}
      />
    )

    const imgContainer = screen.getByTestId('emptydata-img-container')

    expect(imgContainer).toHaveStyle('width: 170px')
    expect(imgContainer).toHaveStyle('height: 170px')
  })
})
