'use client'

import { HTMLAttributes, PropsWithChildren, ReactNode, useState } from 'react'

import { Review } from '../Review'
import type { ToggleContentButtonProps } from './ToggleContentButton'
import { ToggleContentButton } from './ToggleContentButton'
import { getColor } from 'src/colors'
import { ConditionalWrapper } from 'src/components/helpers'

const DEFAULT_HIDDEN_CONTENT_PLACEHOLDER = '*****'

/**
 * Props for the `ToggleContent` component.
 */
type ToggleContentProps = {
  /** Whether the content is sensitive (hides by default)
   * @default false
   */
  isSensitiveContent?: boolean
  /** Show warning when revealing sensitive content
   * @default false
   */
  showWarning?: boolean
  /** Placeholder to show when content is hidden */
  hiddenContentPlaceholder?: ReactNode
  /** Whether to show the hidden content placeholder
   * @default true
   */
  showHiddenContentPlaceholder?: boolean
  /** Optional container props */
  containerProps?: HTMLAttributes<HTMLDivElement>
  /** Props for the toggle button */
  buttonProps?: ToggleContentButtonProps
}

/**
 * Component to show/hide sensitive content with a toggle button.
 *
 * @example
 * <ToggleContent
 *   isSensitiveContent
 *   showWarning
 *   hiddenContentPlaceholder="*****"
 * >
 *   <span>Secret value</span>
 * </ToggleContent>
 */
const ToggleContent = ({
  isSensitiveContent = false,
  showWarning = false,
  hiddenContentPlaceholder = DEFAULT_HIDDEN_CONTENT_PLACEHOLDER,
  showHiddenContentPlaceholder = true,
  containerProps,
  buttonProps,
  children,
}: PropsWithChildren<ToggleContentProps>) => {
  const [
    isContentVisible,
    setIsContentVisible,
  ] = useState(false)
  const showContent = isContentVisible || !isSensitiveContent
  const shouldShowHiddenPlaceholder =
    isSensitiveContent && showHiddenContentPlaceholder

  return (
    <div
      {...containerProps}
      style={{
        display: 'flex',
        gap: '0.625rem',
        alignItems: 'start',
        flexDirection: 'column',
        ...containerProps?.style,
      }}
    >
      <ConditionalWrapper
        wrapper={() => (
          <ToggleContentButton
            {...buttonProps}
            showContent={isContentVisible}
            onClick={(event) => {
              setIsContentVisible((visible) => !visible)
              const onClick = buttonProps?.onClick ?? (() => null)
              onClick(event)
            }}
          />
        )}
        condition={isSensitiveContent}
      >
        {null}
      </ConditionalWrapper>

      {showContent ? (
        <>
          <ConditionalWrapper
            wrapper={() => (
              <div style={{ paddingBottom: '0.625rem' }}>
                <Review
                  icon="cloudWarning"
                  iconColor={getColor('amber.500')}
                  backgroundColor={getColor('amber.150')}
                  prefix="WARNING:"
                  content={`You're now revealing values that may contain secret data!`}
                />
              </div>
            )}
            condition={isSensitiveContent && showWarning}
          >
            {null}
          </ConditionalWrapper>
          {children}
        </>
      ) : (
        <ConditionalWrapper
          wrapper={() => <>{hiddenContentPlaceholder}</>}
          condition={shouldShowHiddenPlaceholder}
        >
          {null}
        </ConditionalWrapper>
      )}
    </div>
  )
}

export { ToggleContent }
export type { ToggleContentProps }
