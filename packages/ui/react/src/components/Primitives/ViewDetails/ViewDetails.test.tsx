import { CSSProperties, FC, ReactNode } from 'react'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { ViewDetails } from './ViewDetails'
import { DetailsContentProps } from './ViewDetailsContent'
import { ViewDetailsLoading } from './ViewDetailsLoading'

const MockNavigationLink: FC<{
  to: string | undefined
  target?: '_blank' | '_self' | undefined
  children: ReactNode
  isExternalUrl?: boolean
  style?: CSSProperties
}> = ({ to, target, children, style }) => (
  <a
    href={to ?? '#'}
    target={target}
    style={style}
  >
    {children}
  </a>
)

let writeTextSpy: ReturnType<typeof vi.fn>

beforeEach(() => {
  writeTextSpy = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: writeTextSpy },
    writable: true,
  })
})

const sampleData: { label: string; items: DetailsContentProps[] }[] = [
  {
    label: 'User Info',
    items: [
      {
        label: 'Name',
        value: 'John Doe',
        navigationComponent: MockNavigationLink,
      },
      {
        label: 'Email',
        value: 'john@example.com',
        isCopyToClipboard: true,
        navigationComponent: MockNavigationLink,
      },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Active', value: true, navigationComponent: MockNavigationLink },
      {
        label: 'Secret',
        value: '12345',
        isHidden: true,
        navigationComponent: MockNavigationLink,
      },
      {
        label: 'Website',
        value: 'Example',
        url: 'https://example.com',
        isResourceUrl: false,
        navigationComponent: MockNavigationLink,
      },
    ],
  },
]

describe('ViewDetails', () => {
  it('renders all sections, labels, and values correctly', () => {
    render(
      <ViewDetails
        navigationComponent={MockNavigationLink}
        data={sampleData}
      />
    )

    expect(screen.getByText('User Info')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()

    expect(screen.getByText('Name:')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Email:')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Active?')).toBeInTheDocument()
    expect(screen.getByText('Yes')).toBeInTheDocument()
    expect(screen.getByText('Secret:')).toBeInTheDocument()
    expect(screen.getByText('*****')).toBeInTheDocument()
    expect(screen.getByText('Website:')).toBeInTheDocument()
    expect(screen.getByText('Example')).toBeInTheDocument()
  })

  it('renders loading state', () => {
    render(<ViewDetailsLoading />)
    const container = screen.getByLabelText('loading')
    expect(container).toBeInTheDocument()
    expect(container.querySelectorAll('div').length).toBeGreaterThan(0)
  })

  it('renders hidden content with ToggleContent', () => {
    render(
      <ViewDetails
        navigationComponent={MockNavigationLink}
        data={sampleData}
      />
    )
    const secretValue = screen.getByText('*****')
    expect(secretValue).toBeInTheDocument()
  })

  it('copies text when copy-to-clipboard button is clicked', async () => {
    render(
      <ViewDetails
        navigationComponent={MockNavigationLink}
        data={sampleData}
      />
    )
    const emailValue = screen.getByText('john@example.com')
    expect(emailValue).toBeInTheDocument()

    const copyButtons = screen.getAllByRole('button')

    const copyButton = copyButtons[0]
    expect(copyButton).toBeTruthy()

    fireEvent.click(copyButton)
    await waitFor(() => {
      expect(screen.getByLabelText('Copied!')).toBeInTheDocument()
    })
  })

  it('renders navigation links correctly', () => {
    render(
      <ViewDetails
        navigationComponent={MockNavigationLink}
        data={sampleData}
      />
    )
    const websiteLink = screen.getByText('Example')
    expect(websiteLink.closest('a')).toHaveAttribute(
      'href',
      'https://example.com'
    )
  })

  it('formats boolean values as Yes/No', () => {
    render(
      <ViewDetails
        navigationComponent={MockNavigationLink}
        data={sampleData}
      />
    )
    expect(screen.getByText('Yes')).toBeInTheDocument()
  })

  it('renders tooltips if provided', async () => {
    const dataWithTooltip: { label: string; items: DetailsContentProps[] }[] = [
      {
        label: 'Tooltip Section',
        items: [
          {
            label: 'Info',
            value: 'Value',
            tooltip: 'Tooltip text',
            navigationComponent: MockNavigationLink,
          },
        ],
      },
    ]
    render(
      <ViewDetails
        navigationComponent={MockNavigationLink}
        data={dataWithTooltip}
      />
    )
    const label = screen.getByText('Info:')
    expect(label).toBeInTheDocument()
    await userEvent.hover(label)
  })

  it('applies a mobile breakpoint to the container grid', () => {
    render(
      <ViewDetails
        navigationComponent={MockNavigationLink}
        data={sampleData}
      />
    )
    const styles = Array.from(document.querySelectorAll('style'))
      .map((style) => style.textContent)
      .join('\n')

    expect(styles).toContain('max-width: 768px')
    expect(styles).toContain('16px 1fr 16px')
  })

  it('hides the label/value question-mark tooltips on mobile via CSS only (no JS media-query hook)', () => {
    const dataWithTooltip: { label: string; items: DetailsContentProps[] }[] = [
      {
        label: 'Tooltip Section',
        items: [
          {
            label: 'Info',
            value: 'Value',
            tooltip: { label: 'Label tooltip', value: 'Value tooltip' },
            navigationComponent: MockNavigationLink,
          },
        ],
      },
    ]
    render(
      <ViewDetails
        navigationComponent={MockNavigationLink}
        data={dataWithTooltip}
      />
    )

    // Both tooltips still render in markup (identical on server and client —
    // no hydration divergence); visibility below 600px is CSS-only.
    expect(screen.getByText('Info:')).toBeInTheDocument()

    const styles = Array.from(document.querySelectorAll('style'))
      .map((style) => style.textContent)
      .join('\n')

    expect(styles).toContain('max-width: 600px')
    expect(styles).toContain('display:none')
  })
})
