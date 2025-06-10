import { forwardRef, useEffect, useRef } from 'react'

import { Container, InputText } from './Input.styled'
import type { ErrorMessageProps } from 'src/components/Primitives/ErrorMessage'
import { ErrorMessage } from 'src/components/Primitives/ErrorMessage'
import { Label } from 'src/components/Primitives/Label/'
import type { LabelProps } from 'src/components/Primitives/Label/'

type SharedProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /** React ref for direct DOM manipulation */
  ref?: React.Ref<HTMLInputElement>
  /** Error message configuration */
  error?: ErrorMessageProps['error']
  /** Props passed directly to a Label component */
  labelProps?: LabelProps
  /** Custom styling options for input text */
  publicStyle?: {
    /** Font style applied to input value */
    fontStyleValue?: string
    /** Font style applied to placeholder */
    fontStylePlaceholder?: string
  }
  /** Whether to automatically focus the input when an error occurs */
  autoFocusOnError?: boolean
  /**
   * Props passed directly to input HTML element
   *
   * @override props, e.g.: inputProps.type overrides props.type
   *
   * <Input type="text" inputProps={{type: 'number'}} /> // input type is number
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

type InputProps =
  | (SharedProps & {
      /** HTML input type (text, number, email, etc.) */
      type: Exclude<React.HTMLInputTypeAttribute, 'number'>
    })
  | (SharedProps & {
      /** HTML input type (text, number, email, etc.) */
      type: 'number'
      /** Removes increment/decrement arrows from number inputs */
      removeArrows?: boolean
    })

/**
 * Allows users to enter and edit text
 *
 * A flexible input component that supports:
 * - Various input types (text, number, etc.)
 * - Error states with optional automatic focus
 * - Custom styling
 * - Label and help text
 *
 * @example
 * ```
 * <Input
 *   type="text"
 *   label={{ value: "Username" }}
 *   placeholder="Enter username"
 *   error={{ message: "This field is required" }}
 *   publicStyle={{
 *     fontStyleValue: "bold",
 *     fontStylePlaceholder: "italic"
 *   }}
 * />
 * ```
 */
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const internalRef = useRef<HTMLInputElement>(null)
  const inputRef =
    (ref as React.RefObject<HTMLInputElement> | undefined) ?? internalRef
  const { autoFocusOnError, error, inputProps, labelProps, ...restProps } =
    props

  const inputId =
    inputProps?.id ?? `input-${Math.random().toString(36).slice(2, 11)}`

  useEffect(() => {
    if (autoFocusOnError && error && inputRef.current) {
      inputRef.current.focus()
    }
  }, [
    autoFocusOnError,
    error,
    inputRef,
  ])

  const errorId = `${inputId}-error`

  return (
    <Container>
      {labelProps && (
        <Label
          {...labelProps}
          htmlFor={inputId}
        />
      )}
      <InputText
        className="translate"
        ref={inputRef}
        hasError={Boolean(error)}
        aria-invalid={Boolean(error)}
        aria-errormessage={error ? errorId : undefined}
        aria-describedby={error ? errorId : undefined}
        {...restProps}
        {...inputProps}
        id={inputId}
      />
      {Boolean(error) && (
        <ErrorMessage
          id={errorId}
          error={error}
        />
      )}
    </Container>
  )
})

/**
 * Explicitly sets the component display name for debugging in React DevTools when using forwardRef.
 * Without this, the component would show as "ForwardRef" instead of "Input" in the component tree.
 */
Input.displayName = 'Input'

export type { InputProps }
export { Input }
