import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

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
})
