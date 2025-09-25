import { render, screen, fireEvent } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { HelpCenter } from './HelpCenter'
import { useChecklist, useHelpCenter } from 'src/hooks'

// ===== Mock Product Fruits API =====
const mockInjectToElement = vi.fn()
const mockListen = vi.fn()
const mockButtonOpen = vi.fn()
const mockButtonClose = vi.fn()

beforeAll(() => {
  Object.defineProperty(window, 'productFruits', {
    value: {
      api: {
        checklists: {
          getChecklists: () => [
            {
              id: 1,
              name: 'Test Checklist',
              description: '',
              state: 'open',
              title: 'Checklist',
              items: [
                {
                  id: '1',
                  description: '',
                  internalId: '',
                  state: 'open',
                  title: {},
                },
              ],
            },
          ],
          injectToElement: mockInjectToElement,
          listen: mockListen,
        },
        button: {
          open: mockButtonOpen,
          close: mockButtonClose,
        },
      },
    },
    writable: true,
  })

  // Product Fruits ready callback
  window.productFruitsReady = vi.fn()
})

// ===== Test Helpers for Hooks =====
const ChecklistHookTest = () => {
  const { checklistOpened, handleToggleChecklist, isLoading } =
    useChecklist('1')
  return (
    <div>
      <span data-testid="opened">{String(checklistOpened)}</span>
      <span data-testid="loading">{String(isLoading)}</span>
      <button onClick={handleToggleChecklist}>Toggle</button>
    </div>
  )
}

const HelpCenterHookTest = () => {
  const { isOpened, open, close } = useHelpCenter()
  return (
    <div>
      <span data-testid="isOpened">{String(isOpened)}</span>
      <button onClick={open}>Open</button>
      <button onClick={close}>Close</button>
    </div>
  )
}

// ===== Tests =====
describe('HelpCenter component', () => {
  it('renders correctly when user and workspaceCode are provided', () => {
    render(
      <HelpCenter
        workspaceCode="workspace_123"
        checklistId="1"
        user={{ name: 'Willian', email: 'willian@example.com' }}
      />
    )

    expect(screen.getByText('Onboarding')).toBeInTheDocument()
  })

  it('does not render if user or workspaceCode are missing', () => {
    const { container } = render(
      <HelpCenter
        workspaceCode=""
        checklistId="1"
        user={null}
      />
    )
    expect(container.firstChild).toBeNull()
  })
})

describe('useChecklist hook', () => {
  it('returns correct initial state', () => {
    render(<ChecklistHookTest />)
    expect(screen.getByTestId('opened').textContent).toBe('false')
    expect(screen.getByTestId('loading').textContent).toBe('true')
  })

  it('toggle function works', () => {
    render(<ChecklistHookTest />)
    fireEvent.click(screen.getByText('Toggle'))
    expect(mockInjectToElement).toHaveBeenCalled()
  })
})

describe('useHelpCenter hook', () => {
  it('returns correct initial state', () => {
    render(<HelpCenterHookTest />)
    expect(screen.getByTestId('isOpened').textContent).toBe('false')
  })

  it('open and close functions work', () => {
    render(<HelpCenterHookTest />)
    fireEvent.click(screen.getByText('Open'))
    expect(mockButtonOpen).toHaveBeenCalled()
    fireEvent.click(screen.getByText('Close'))
    expect(mockButtonClose).toHaveBeenCalled()
  })
})
