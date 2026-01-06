'use client'

import { ReactNode, useState } from 'react'

import {
  ContentChildren,
  ContentCopyAction,
  ContentMain,
  CopyAction,
} from './CopyToClipboard.styled'
import { Tooltip } from 'src/components/Primitives/Tooltip'
import { iconLoader } from 'src/icons'

const ICON_SIZE = 12

type CopyToClipboardProps = {
  /**
   * Unique identifier to find content to be copied
   *
   * WARNING: Must be a valid HTML identifier (id)
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id
   */
  id: string
  /** Element or content to be copied */
  children: ReactNode
}

/**
 * CopyToClipboard provides an interactive element to copy content
 * to the user's clipboard with tooltip feedback.
 *
 * @example
 * ```jsx
 * <CopyToClipboard id="copy_text">
 *   Some content to copy
 * </CopyToClipboard>
 * ```
 */
const CopyToClipboard = ({ id, children }: CopyToClipboardProps) => {
  const contentId = `copy_${id}`
  const [
    tooltipMessage,
    setTooltipMessage,
  ] = useState('Copy to clipboard')
  const [
    isCopied,
    setIsCopied,
  ] = useState(false)

  const handleResetCopyState = () => {
    setTimeout(() => {
      setTooltipMessage('Copy to clipboard')
      setIsCopied(false)
    }, 200)
  }

  const handleCopyToClipboard = () => {
    const textToCopy = document.getElementById(contentId)?.innerText ?? ''

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setTooltipMessage('Copied!')
        setIsCopied(true)
      })
      .catch((error: unknown) => {
        setTooltipMessage('Error!')
        throw new Error(
          `CopyToClipboard: unable to copy: ${JSON.stringify(error)}`
        )
      })
  }

  return (
    <ContentMain>
      <ContentChildren id={contentId}>{children}</ContentChildren>
      <ContentCopyAction>
        <Tooltip
          title={tooltipMessage}
          placement="top-start"
        >
          <CopyAction
            role="button"
            className="copyaction"
            onClick={handleCopyToClipboard}
            onMouseOut={handleResetCopyState}
          >
            {iconLoader(isCopied ? 'copy' : 'copyOutline', ICON_SIZE)}
          </CopyAction>
        </Tooltip>
      </ContentCopyAction>
    </ContentMain>
  )
}

export { CopyToClipboard }

export type { CopyToClipboardProps }
