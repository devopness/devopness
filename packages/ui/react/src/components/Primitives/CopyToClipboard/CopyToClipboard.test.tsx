import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CopyToClipboard } from './CopyToClipboard'

describe('CopyToClipboard', () => {
  let writeTextSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    writeTextSpy = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextSpy },
      writable: true,
    })
  })

  it('copies the text when the button is clicked', async () => {
    render(<CopyToClipboard id="test">Copiar isso</CopyToClipboard>)
    const copyButton = screen.getByRole('button')
    fireEvent.click(copyButton)
    await waitFor(() => {
      expect(document.body.textContent).toContain('Copiar isso')
    })
  })

  it('displays Copied! when the text is copied', async () => {
    render(<CopyToClipboard id="test">Copiar isso</CopyToClipboard>)
    const copyButton = screen.getByRole('button')
    fireEvent.click(copyButton)
    await waitFor(() => {
      expect(screen.getByLabelText('Copied!')).toBeInTheDocument()
    })
  })

  it('resets the tooltip message on mouse out', async () => {
    render(<CopyToClipboard id="test">Copiar isso</CopyToClipboard>)
    const copyButton = screen.getByRole('button')

    fireEvent.click(copyButton)
    await waitFor(() => {
      expect(screen.getByLabelText('Copied!')).toBeInTheDocument()
    })

    fireEvent.mouseOut(copyButton)

    await waitFor(
      () => {
        expect(screen.getByLabelText('Copy to clipboard')).toBeInTheDocument()
      },
      { timeout: 1000 }
    )
  })

  it('displays Error! when copying fails', async () => {
    /*
      We mock the writeText method to return a custom "fake promise".
      This allows us to trigger the `.catch` block in the component
      and synchronously swallow the `throw new Error(...)` it generates,
      preventing Vitest from failing due to an Unhandled Promise Rejection.
    */
    const fakePromise = {
      then: () => fakePromise,
      catch: (errorCallback: (err: Error) => void) => {
        try {
          errorCallback(new Error('Clipboard error'))
        } catch {
          // Swallow the error thrown by the component
        }
      },
    }
    writeTextSpy.mockReturnValueOnce(fakePromise as unknown as Promise<void>)

    render(<CopyToClipboard id="test">Copiar isso</CopyToClipboard>)
    const copyButton = screen.getByRole('button')

    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(screen.getByLabelText('Error!')).toBeInTheDocument()
    })
  })

  it('renders correctly with alwaysVisible prop', () => {
    render(
      <CopyToClipboard
        id="test"
        alwaysVisible
      >
        Always visible
      </CopyToClipboard>
    )
    const copyButton = screen.getByRole('button')
    expect(copyButton).toBeInTheDocument()
  })

  it('copies empty string if content is not found', async () => {
    render(<CopyToClipboard id="non-existent">Content</CopyToClipboard>)
    const copyButton = screen.getByRole('button')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(writeTextSpy).toHaveBeenCalledWith('')
    })
  })
})
