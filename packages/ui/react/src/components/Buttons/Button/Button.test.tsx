import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Button } from '.'
import { getHoverBackgroundColor, getHoverBorderColor } from './Button.styled'
import { getColor } from 'src/colors'

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

    it('with default margin and icon gap controls', () => {
      render(
        <Button
          icon="html"
          noIconMargin
        >
          No Icon Gap Button
        </Button>
      )

      const button = screen.getByTestId('button')
      expect(button).toHaveStyle({ margin: '0' })
      expect(button).toHaveStyle({ gap: '0' })
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

    it('applies correct icon margins', () => {
      render(<Button icon="html">Button with Icon</Button>)

      const iconContainer = screen.getByTestId('button')
      expect(iconContainer).toHaveStyle({ gap: '10px' })
    })

    it('applies no icon margin when noIconMargin is true', () => {
      render(
        <Button
          icon="html"
          noIconMargin
        >
          Button with Icon
        </Button>
      )

      const iconContainer = screen.getByTestId('button')
      expect(iconContainer).toHaveStyle({ gap: '0' })
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

    it('with noPadding prop removes padding', () => {
      render(<Button noPadding>No Padding Button</Button>)

      const button = screen.getByTestId('button')
      expect(button).toHaveStyle({
        padding: '0',
      })
    })

    it('loading state should override icon prop', () => {
      render(
        <Button
          loading
          icon="html"
        >
          Button
        </Button>
      )

      const iconContainer = screen.getByTestId('button-icon')
      expect(iconContainer).toHaveAttribute('aria-label', 'loading')
      expect(iconContainer).not.toHaveAttribute('aria-label', 'html icon')
    })

    it('should not render icon container when no icon or loading props provided', () => {
      render(<Button>Button</Button>)

      const iconContainer = screen.queryByTestId('button-icon')
      expect(iconContainer).not.toBeInTheDocument()
    })

    it('should not render label when no children provided', () => {
      render(<Button icon="html" />)

      const label = screen.queryByTestId('button-label')
      expect(label).not.toBeInTheDocument()
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

  describe('hover color helpers', () => {
    const bg = '#123456'
    const text = '#abcdef'
    const border = '#fedcba'

    describe('getHoverBackgroundColor', () => {
      it('mixes text color with white for borderless', () => {
        expect(getHoverBackgroundColor('borderless', bg, text)).toBe(
          `color-mix(in srgb, ${text} 12%, white)`
        )
      })

      it('mixes text color with white for outlinedSecondary', () => {
        expect(getHoverBackgroundColor('outlinedSecondary', bg, text)).toBe(
          `color-mix(in srgb, ${text} 12%, white)`
        )
      })

      it('mixes text color with white for outlinedAuxiliary', () => {
        expect(getHoverBackgroundColor('outlinedAuxiliary', bg, text)).toBe(
          `color-mix(in srgb, ${text} 12%, white)`
        )
      })

      it('darkens background for default buttonType', () => {
        expect(getHoverBackgroundColor('Default', bg, text)).toBe(
          `color-mix(in srgb, ${bg} 90%, #000)`
        )
      })

      it('darkens background when buttonType is undefined', () => {
        expect(getHoverBackgroundColor(undefined, bg, text)).toBe(
          `color-mix(in srgb, ${bg} 90%, #000)`
        )
      })
    })

    describe('getHoverBorderColor', () => {
      it('returns transparent for borderless', () => {
        expect(getHoverBorderColor('borderless', border)).toBe('transparent')
      })

      it('darkens border for outlinedSecondary', () => {
        expect(getHoverBorderColor('outlinedSecondary', border)).toBe(
          `color-mix(in srgb, ${border} 88%, #000)`
        )
      })

      it('darkens border for outlinedAuxiliary', () => {
        expect(getHoverBorderColor('outlinedAuxiliary', border)).toBe(
          `color-mix(in srgb, ${border} 88%, #000)`
        )
      })

      it('darkens border for default buttonType', () => {
        expect(getHoverBorderColor('Default', border)).toBe(
          `color-mix(in srgb, ${border} 88%, #000)`
        )
      })

      it('darkens border when buttonType is undefined', () => {
        expect(getHoverBorderColor(undefined, border)).toBe(
          `color-mix(in srgb, ${border} 88%, #000)`
        )
      })
    })
  })
})
