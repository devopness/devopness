import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Button } from '.'

const styleButtonFactory = ({
  color = 'rgb(255, 255, 255)',
  backgroundColor = 'rgb(120, 110, 253)',
  border = '1px',
  borderColor = '#786efd',
  borderRadius = '25px',
  height = '34px',
  borderStyle = 'solid',
}) => `
      color: ${color};
      background-color: ${backgroundColor};
      border: ${border};
      border-color: ${borderColor};
      border-style: ${borderStyle};
      border-radius: ${borderRadius};
      height: ${height};
      `

describe('Button', () => {
  describe('renders correctly', () => {
    const typeSizes = [
      { typeSize: 'default', height: '34px' },
      { typeSize: 'medium', height: '27px' },
    ] as const

    it.each(typeSizes)(
      'with primary type (typeSize: $typeSize)',
      ({ typeSize, height }) => {
        render(
          <Button
            type="button"
            typeSize={typeSize}
          >
            Click me!
          </Button>
        )

        const expectedButton = screen.getByTestId('button')
        const expectedStyles = styleButtonFactory({ height })

        expect(expectedButton).toBeInTheDocument()
        expect(expectedButton).toHaveTextContent('Click me!')
        expect(expectedButton).toHaveStyle(expectedStyles)
        expect(expectedButton).toHaveAttribute('type', 'button')
      }
    )

    it.each(typeSizes)(
      'with secondary type (typeSize: $typeSize)',
      ({ typeSize, height }) => {
        render(
          <Button
            type="button"
            typeSize={typeSize}
            buttonType='outlinedSecondary'
          >
            Click me!
          </Button>
        )

        const expectedButton = screen.getByTestId('button')
        const expectedStyles = styleButtonFactory({
          color: 'rgb(120, 110, 253)',
          backgroundColor: 'rgb(255, 255, 255)',
          height,
        })

        expect(expectedButton).toBeInTheDocument()
        expect(expectedButton).toHaveTextContent('Click me!')
        expect(expectedButton).toHaveStyle(expectedStyles)
        expect(expectedButton).toHaveAttribute('type', 'button')
      }
    )

    it.each(typeSizes)(
      'with borderless type (typeSize: $typeSize)',
      ({ typeSize, height }) => {
        render(
          <Button
            type="button"
            typeSize={typeSize}
            buttonType='borderless'
          >
            Click me!
          </Button>
        )

        const expectedButton = screen.getByTestId('button')
        const expectedStyles = styleButtonFactory({
          color: 'rgb(120, 110, 253)',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          border: '1px',
          borderColor: '',
          height,
          borderStyle: 'none',
        })

        expect(expectedButton).toBeInTheDocument()
        expect(expectedButton).toHaveTextContent('Click me!')
        expect(expectedButton).toHaveStyle(expectedStyles)
        expect(expectedButton).toHaveAttribute('type', 'button')
      }
    )

    it.each(typeSizes)(
      'with outlined auxiliary type (typeSize: $typeSize)',
      ({ typeSize, height }) => {
        render(
          <Button
            type="button"
            typeSize={typeSize}
            buttonType='outlinedAuxiliary'
          >
            Click me!
          </Button>
        )

        const expectedButton = screen.getByTestId('button')
        const expectedStyles = styleButtonFactory({
          color: 'rgb(120, 110, 253)',
          backgroundColor: 'rgb(255, 255, 255)',
          height,
          borderColor: '#828795',
        })

        expect(expectedButton).toBeInTheDocument()
        expect(expectedButton).toHaveTextContent('Click me!')
        expect(expectedButton).toHaveStyle(expectedStyles)
        expect(expectedButton).toHaveAttribute('type', 'button')
      }
    )

    it.each(typeSizes)(
      'with loading (typeSize: $typeSize)',
      ({ typeSize, height }) => {
        render(
          <Button
            type="button"
            typeSize={typeSize}
            loading
          >
            Click me!
          </Button>
        )

        const expectedButton = screen.getByTestId('button')
        const expectedStyles = styleButtonFactory({ height })
        const expectedLoading = screen.getByTestId('loading')

        expect(expectedButton).toBeInTheDocument()
        expect(expectedButton).toHaveTextContent('Click me!')
        expect(expectedButton).toHaveStyle(expectedStyles)
        expect(expectedButton).toHaveAttribute('type', 'button')
        expect(expectedLoading).toBeInTheDocument()
      }
    )

    it.each(typeSizes)(
      'with icon (typeSize: $typeSize)',
      ({ typeSize, height }) => {
        render(
          <Button
            type="button"
            typeSize={typeSize}
            icon="html"
          >
            Click me!
          </Button>
        )

        const expectedButton = screen.getByTestId('button')
        const expectedStyles = styleButtonFactory({ height })
        const expectedIcon = screen.getByTestId('icon')

        expect(expectedButton).toBeInTheDocument()
        expect(expectedButton).toHaveTextContent('Click me!')
        expect(expectedButton).toHaveStyle(expectedStyles)
        expect(expectedButton).toHaveAttribute('type', 'button')
        expect(expectedIcon).toBeInTheDocument()
      }
    )
  })
})

