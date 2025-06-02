import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'

import { Card } from './Card'
import type { CardProps } from './Card'
import { getColor } from 'src/colors'
import { testHoverTooltip } from 'src/test-utils'

/**
 * Default props used across all Card component tests
 */
const defaultProps = {
  title: 'Test Card',
  avatarProps: {
    backgroundColor: 'purple.800',
  },
} satisfies CardProps

describe('Card', () => {
  describe('renders correctly', () => {
    it('with default props', () => {
      render(<Card {...defaultProps} />)

      expect(screen.getByText('Test Card')).toBeInTheDocument()
      expect(screen.getByText('T')).toBeInTheDocument() // First letter avatar
    })

    it('with subtitle', () => {
      render(
        <Card
          {...defaultProps}
          subtitle="Test Subtitle"
        />
      )

      expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
    })

    it('without subtitle when not provided', () => {
      render(<Card {...defaultProps} />)

      expect(screen.queryByText(/subtitle/i)).not.toBeInTheDocument()
    })

    it('with custom icon instead of letter avatar', () => {
      render(
        <Card
          {...defaultProps}
          icon="add"
          url="/test"
        />
      )

      // Letter avatar should not be present when icon is provided
      expect(screen.queryByText('T')).not.toBeInTheDocument()
      // Find SVG element
      expect(document.querySelector('a[href="/test"] svg')).toBeInTheDocument()
    })

    it('with indicator', () => {
      render(
        <Card
          {...defaultProps}
          indicator={5}
        />
      )

      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('with indicator > 99 shows +99', () => {
      render(
        <Card
          {...defaultProps}
          indicator={100}
        />
      )

      expect(screen.getByText('+99')).toBeInTheDocument()
    })

    it('with custom header background color', () => {
      render(
        <Card
          {...defaultProps}
          headerProps={{
            backgroundColor: 'blue.100',
          }}
          // Without any footer, the border will be hidden
          footer={[
            {
              label: 'Settings',
              url: '/settings',
            },
          ]}
        />
      )

      const header = screen.getByTestId('card-header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveStyle({
        'background-color': 'rgb(220, 236, 255)',
      })
    })

    it('with custom header border bottom color', () => {
      render(
        <Card
          {...defaultProps}
          headerProps={{
            borderBottomColor: 'blue.100',
          }}
          // Without any footer, the border will be hidden
          footer={[
            {
              label: 'Settings',
              url: '/settings',
            },
          ]}
        />
      )

      const header = screen.getByTestId('card-header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveStyle({
        'border-bottom-color': 'rgb(220, 236, 255)',
      })
    })

    it('with both header background and border colors', () => {
      render(
        <Card
          {...defaultProps}
          headerProps={{
            backgroundColor: 'blue.100',
            borderBottomColor: 'purple.800',
          }}
          // Without any footer, the border will be hidden
          footer={[
            {
              label: 'Settings',
              url: '/settings',
            },
          ]}
        />
      )

      const header = screen.getByTestId('card-header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveStyle({
        'background-color': 'rgb(220, 236, 255)',
        'border-bottom-color': 'rgb(120, 110, 253)',
      })
    })

    it('with children content', () => {
      render(
        <Card {...defaultProps}>
          <div data-testid="child-content">Child Content</div>
        </Card>
      )

      expect(screen.getByTestId('child-content')).toBeInTheDocument()
      expect(screen.getByText('Child Content')).toBeInTheDocument()
    })

    it('with string icon converted to object with default size', () => {
      render(
        <Card
          {...defaultProps}
          icon="add"
          url="/test"
        />
      )

      const svg = document.querySelector('a[href="/test"] svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('width', '23') // Default size if not specified
    })

    it('with icon object including custom size', () => {
      render(
        <Card
          {...defaultProps}
          icon={{
            name: 'add',
            size: 24,
          }}
          url="/test"
        />
      )

      const svg = document.querySelector('a[href="/test"] svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('width', '24')
    })
  })

  describe('title behavior', () => {
    it('applies custom title styles when provided', () => {
      render(
        <Card
          {...defaultProps}
          titleProps={{ style: { color: 'rgb(255, 0, 0)' } }}
        />
      )

      expect(screen.getByText('Test Card')).toHaveStyle({
        color: 'rgb(255, 0, 0)',
      })
    })
  })

  describe('accessibility', () => {
    it('applies custom id when provided', () => {
      render(
        <Card
          {...defaultProps}
          id="custom-card-id"
        />
      )

      expect(
        screen.getByText('Test Card').closest('div[id="custom-card-id"]')
      ).toBeInTheDocument()
    })

      it('header has role and aria-labelledby', () => {
      render(
        <Card
          {...defaultProps}
          id="accessible-card"
        />
      )
      const header = screen.getByTestId('card-header')
      expect(header).toHaveAttribute('role', 'heading')
      expect(header).toHaveAttribute('aria-labelledby')
      const labelledby = header.getAttribute('aria-labelledby')
      expect(document.getElementById(labelledby!)).toBeInTheDocument()
    })  

    it('makes links navigable', () => {
      render(
        <Card
          {...defaultProps}
          footer={[
            {
              label: 'view all',
              url: '/projects',
            },
          ]}
        />
      )

      const link = screen.getByText('view all').closest('a')
      expect(link).toHaveAttribute('href', '/projects')
    })
  })

  describe('footer behavior', () => {
    it('renders footer items with labels and links', () => {
      render(
        <Card
          {...defaultProps}
          footer={[
            {
              icon: 'add',
              label: 'Add',
              url: '/projects/add',
            },
            {
              label: 'view all',
              url: '/projects',
            },
          ]}
        />
      )

      const addLink = screen.getByText('Add').closest('a')
      const viewAllLink = screen.getByText('view all').closest('a')

      expect(addLink).toHaveAttribute('href', '/projects/add')
      expect(addLink).toHaveAttribute('tabindex', '0')
      expect(addLink).toHaveAttribute('aria-label', 'Add')

      expect(viewAllLink).toHaveAttribute('href', '/projects')
      expect(viewAllLink).toHaveAttribute('tabindex', '0')
      expect(viewAllLink).toHaveAttribute('aria-label', 'view all')
    })

    it('renders footer items with icons', () => {
      render(
        <Card
          {...defaultProps}
          footer={[
            {
              label: 'Settings',
              url: '/settings',
              icon: {
                name: 'settings',
                size: 16,
                color: 'blue.500',
              },
            },
          ]}
        />
      )

      expect(screen.getByText('Settings')).toBeInTheDocument()
      // Find an SVG element within the footer link
      const link = screen.getByText('Settings').closest('a')
      expect(link?.querySelector('svg')).toBeInTheDocument()
    })

    it('shows tooltips for footer items when provided', async () => {
      render(
        <Card
          {...defaultProps}
          footer={[
            {
              label: 'Settings',
              url: '/settings',
              tooltip: 'Manage your settings',
            },
          ]}
        />
      )

      const footerButton = screen.getByText('Settings')
      await testHoverTooltip({
        element: footerButton,
        tooltipText: 'Manage your settings',
      })
    })

    it('renders multiple footer items with mixed content', () => {
      render(
        <Card
          {...defaultProps}
          footer={[
            {
              label: 'Details',
              url: '/details',
              tooltip: 'View details',
            },
            {
              label: 'Settings',
              url: '/settings',
              icon: {
                name: 'settings',
                size: 16,
              },
            },
            {
              label: 'Delete',
              url: '/delete',
              icon: {
                name: 'delete',
                size: 16,
                color: 'red.500',
              },
              tooltip: 'Delete item',
            },
          ]}
        />
      )

      expect(screen.getByText('Details')).toBeInTheDocument()
      expect(screen.getByText('Details').closest('a')).toHaveAttribute(
        'href',
        '/details'
      )
      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('Settings').closest('a')).toHaveAttribute(
        'href',
        '/settings'
      )
      expect(screen.getByText('Delete')).toBeInTheDocument()
      expect(screen.getByText('Delete').closest('a')).toHaveAttribute(
        'href',
        '/delete'
      )
    })

    it('handles object-style tooltip props in footer items', async () => {
      render(
        <Card
          {...defaultProps}
          footer={[
            {
              label: 'Settings',
              url: '/settings',
              tooltip: {
                title: 'Advanced settings',
                placement: 'top',
              },
            },
          ]}
        />
      )

      const footerButton = screen.getByText('Settings')
      await testHoverTooltip({
        element: footerButton,
        tooltipText: 'Advanced settings',
      })
    })

    it('renders footer with default icon color when not specified', () => {
      render(
        <Card
          {...defaultProps}
          footer={[
            {
              label: 'Settings',
              url: '/settings',
              icon: {
                name: 'settings',
                size: 16,
              },
            },
          ]}
        />
      )

      const link = screen.getByText('Settings').closest('a')
      const svg = link?.querySelector('svg')
      expect(svg).toHaveAttribute('color', getColor('gray.615'))
    })

    it('renders footer with string icon using default color', () => {
      render(
        <Card
          {...defaultProps}
          footer={[
            {
              label: 'Add',
              url: '/add',
              icon: 'add',
            },
          ]}
        />
      )

      const link = screen.getByText('Add').closest('a')
      const svg = link?.querySelector('svg')
      expect(svg).toHaveAttribute('color', getColor('gray.615'))
    })

    it('hides footer when no children present', () => {
      render(<Card {...defaultProps} />)

      const footer = screen.queryByTestId('card-footer')
      expect(footer).not.toBeInTheDocument()
    })
  })

  describe('border behavior', () => {
    it('shows footer border when children and footer are present', () => {
      render(
        <Card
          {...defaultProps}
          footer={[
            {
              label: 'Settings',
              url: '/settings',
            },
          ]}
        >
          <div>Child content</div>
        </Card>
      )

      const footer = screen.getByTestId('card-footer')
      expect(footer).toHaveStyle({
        borderTop: expect.any(String),
      })
    })

    it('hides footer border when no children are present', () => {
      render(
        <Card
          {...defaultProps}
          footer={[
            {
              label: 'Settings',
              url: '/settings',
            },
          ]}
        />
      )

      const footer = screen.getByTestId('card-footer')
      expect(footer).toHaveStyle({
        borderTop: '',
      })
    })
  })

  describe('url behavior', () => {
    it('makes card header clickable when url is provided', () => {
      const { rerender } = render(
        <Card
          {...defaultProps}
          url="/test-url"
        />
      )

      const link = screen.getByText('Test Card').closest('a')
      expect(link).toHaveAttribute('href', '/test-url')
      // Default target is _blank for @devopness/ui-react:Link component
      expect(link).toHaveAttribute('target', '_blank')

      rerender(
        <Card
          {...defaultProps}
          url={{
            to: '/test-url-2',
            target: '_self',
          }}
        />
      )

      expect(link).toHaveAttribute('href', '/test-url-2')
      expect(link).toHaveAttribute('target', '_self')
    })
  })
})
