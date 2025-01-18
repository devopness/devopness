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
        borderColor: customBorderColor
      })
    })

    it('with disabled state', () => {
      render(<Button disabled>Disabled Button</Button>)
      
      const button = screen.getByTestId('button')
      expect(button).toBeDisabled()
    })

    it('with loading state', () => {
      render(<Button loading>Loading Button</Button>)
      
      const loadingIcon = screen.getByTestId('loading')
      expect(loadingIcon).toBeInTheDocument()
    })

    it('with custom icon', () => {
      render(
        <Button icon="html" iconColor={getColor('purple.800')} iconSize={24}>
          Icon Button
        </Button>
      )
      
      const icon = screen.getByTestId('icon')
      expect(icon).toBeInTheDocument()
    })

    it('with reversed orientation', () => {
      render(
        <Button icon="html" revertOrientation>
          Reversed Button
        </Button>
      )
      
      const button = screen.getByTestId('button')
      expect(button).toHaveAttribute('$revertOrientation', 'true')
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
      const handleClick = vi.fn()
      render(
        <Button noPointerEvents onClick={handleClick}>
          No Pointer Events Button
        </Button>
      )
      
      const button = screen.getByTestId('button')
      expect(button).toHaveStyle({ pointerEvents: 'none' })
    })
  })

  describe('button types', () => {
    const buttonTypes = ['borderless', 'outlinedSecondary', 'outlinedAuxiliary'] as const
    
    it.each(buttonTypes)('renders %s button type correctly', (buttonType) => {
      render(<Button buttonType={buttonType}>Button</Button>)
      
      const button = screen.getByTestId('button')
      expect(button).toHaveAttribute('$buttonType', buttonType)
    })
  })

  describe('size variations', () => {
    const sizes = ['default', 'medium', 'auto'] as const
    
    it.each(sizes)('renders %s size correctly', (typeSize) => {
      render(<Button typeSize={typeSize}>Button</Button>)
      
      const button = screen.getByTestId('button')
      expect(button).toHaveAttribute('$typeSize', typeSize)
    })
  })
})
