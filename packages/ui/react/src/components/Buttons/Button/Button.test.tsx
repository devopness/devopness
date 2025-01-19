import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { getColor } from 'src/colors'
import { Button } from '.'

describe('Button', () => {
  describe('renders correctly', () => {
    it('with default props', () => {
      render(<Button>Click me!</Button>)

      const button = screen.getByTestId('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Click me!')
      expect(button).toHaveStyle({
        backgroundColor: getColor('purple.800'),
        color: getColor('white'),
        height: '34px',
        borderStyle: 'solid',
      })
    })

    it('with custom styles', () => {
      const customColor = '#FF0000'
      const customBgColor = '#00FF00'
      const customBorderColor = '#0000FF'

      render(
        <Button
          color={customColor}
          backgroundColor={customBgColor}
          borderColor={customBorderColor}
        >
          Custom Button
        </Button>
      )

      const button = screen.getByTestId('button')
      expect(button).toHaveStyle({
        color: customColor,
        backgroundColor: customBgColor,
        borderColor: customBorderColor,
      })
    })

    it('with margin controls', () => {
      render(
        <Button
          noMargin
          noIconMargin
        >
          No Margin Button
        </Button>
      )

      const button = screen.getByTestId('button')
      expect(button).toHaveStyle({ margin: '0' })
    })

    it('with disabled state', () => {
      render(<Button disabled>Disabled Button</Button>)

      const button = screen.getByTestId('button')
      expect(button).toBeDisabled()
      expect(button).toHaveStyle({ opacity: '0.5', cursor: 'not-allowed' })
    })

    it('with loading state', () => {
      render(<Button loading>Loading Button</Button>)

      const loadingIcon = screen.getByTestId('button-icon')
      expect(loadingIcon).toBeInTheDocument()
      expect(loadingIcon).toHaveAttribute('aria-label', 'loading')
      expect(loadingIcon.firstChild).toHaveAttribute('color', getColor('white'))
    })

    it('with loading state and different buttonType', () => {
      render(
        <Button
          loading
          buttonType="borderless"
        >
          Loading Button
        </Button>
      )

      const loadingIcon = screen.getByTestId('button-icon')
      expect(loadingIcon).toBeInTheDocument()
      expect(loadingIcon).toHaveAttribute('aria-label', 'loading')
      expect(loadingIcon.firstChild).toHaveAttribute(
        'color',
        getColor('purple.800')
      )
    })

    it('with custom icon and properties', () => {
      const iconColor = getColor('purple.800')
      const iconSize = 24

      render(
        <Button
          icon="html"
          iconColor={iconColor}
          iconSize={iconSize}
        >
          Icon Button
        </Button>
      )

      const iconContainer = screen.getByTestId('button-icon')
      expect(iconContainer).toBeInTheDocument()
      expect(iconContainer).toHaveAttribute('aria-label', 'html icon')
      expect(iconContainer).toHaveStyle({
        width: `${iconSize}px`,
        height: `${iconSize}px`,
      })
    })

    it('with reversed orientation', () => {
      render(
        <Button
          icon="html"
          revertOrientation
        >
          Reversed Button
        </Button>
      )

      const button = screen.getByTestId('button')
      expect(button).toHaveStyle({ flexDirection: 'row-reverse' })
    })
  })

  describe('interactions', () => {
    it('handles click events', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Clickable Button</Button>)

      const button = screen.getByTestId('button')
      fireEvent.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('prevents interaction when noPointerEvents is true', () => {
      render(
        <Button
          noPointerEvents
          disabled
        >
          No Pointer Events Button
        </Button>
      )

      const button = screen.getByTestId('button')
      expect(button).toHaveStyle({ 'pointer-events': 'none' })
    })
  })

  describe('button types', () => {
    it('renders borderless button type correctly', () => {
      render(<Button buttonType="borderless">Button</Button>)

      const button = screen.getByTestId('button')
      expect(button).toHaveStyle({
        backgroundColor: 'rgba(0, 0, 0, 0)',
        color: getColor('purple.800'),
        borderStyle: 'none',
      })
    })

    it('renders outlinedSecondary button type correctly', () => {
      render(<Button buttonType="outlinedSecondary">Button</Button>)

      const button = screen.getByTestId('button')
      expect(button).toHaveStyle({
        backgroundColor: getColor('white'),
        color: getColor('purple.800'),
        borderColor: getColor('purple.800'),
        borderStyle: 'solid',
      })
    })

    it('renders outlinedAuxiliary button type correctly', () => {
      render(<Button buttonType="outlinedAuxiliary">Button</Button>)

      const button = screen.getByTestId('button')
      expect(button).toHaveStyle({
        backgroundColor: getColor('white'),
        color: getColor('purple.800'),
        borderColor: getColor('gray.800'),
        borderStyle: 'solid',
      })
    })
  })

  describe('size variations', () => {
    it('renders default size correctly', () => {
      render(<Button typeSize="default">Button</Button>)

      const button = screen.getByTestId('button')
      expect(button).toHaveStyle({
        height: '34px',
        borderWidth: '2px',
      })
    })

    it('renders medium size correctly', () => {
      render(<Button typeSize="medium">Button</Button>)

      const button = screen.getByTestId('button')
      expect(button).toHaveStyle({
        height: '27px',
        borderWidth: '1px',
      })
    })

    it('renders auto size correctly', () => {
      render(<Button typeSize="auto">Button</Button>)

      const button = screen.getByTestId('button')
      expect(button).toHaveStyle({
        height: 'auto',
      })
    })
  })
})
