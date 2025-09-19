import type { TextareaHTMLAttributes, RefObject } from 'react'

import { Container, StyledTextarea } from './TextArea.styled'
import { Label, ErrorMessage } from 'src/components/Primitives'
import type { LabelProps } from 'src/components/Primitives'

/**
 * Props for the TextArea component.
 */
type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** Reference to the underlying textarea element. Can be RefObject or callback ref */
  inputRef?:
    | RefObject<HTMLTextAreaElement>
    | ((instance: HTMLTextAreaElement | null) => void)

  /** Error information to display below the textarea. */
  error?: Record<string, unknown> | undefined | null

  /** Disable textarea resize when true.
   * @default true
   */
  isResizable?: boolean

  /** Optional label props for the field. */
  label?: LabelProps

  /** Optional className to pass to the container. */
  className?: string
}

/**
 * TextArea component
 *
 * A styled multiline text input that supports an optional label,
 * an error message and optional resize control.
 *
 * @example
 * ```tsx
 * <TextArea
 *   id="notes"
 *   name="notes"
 *   placeholder="Type here..."
 *   label={{ htmlFor: 'notes', value: 'Notes' }}
 *   inputRef={ref}
 *   error={{ message: 'Required' }}
 * />
 * ```
 */
const TextArea = ({
  className,
  inputRef,
  error,
  label,
  isResizable = true,
  ...props
}: TextAreaProps) => (
  <Container className={className}>
    {!!label && <Label {...label} />}
    <StyledTextarea
      hasError={!!error}
      noResize={!isResizable}
      ref={inputRef}
      {...props}
    />
    {!!error && <ErrorMessage error={error} />}
  </Container>
)

export { TextArea }
export type { TextAreaProps }
