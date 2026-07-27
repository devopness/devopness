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
    writeTextSpy.mockRejectedValueOnce(new Error('Clipboard error'))

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

  it('copies the text content successfully', async () => {
    render(<CopyToClipboard id="copy-test">Content</CopyToClipboard>)
    const copyButton = screen.getByRole('button')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(writeTextSpy).toHaveBeenCalledWith('Content')
    })
  })
})
