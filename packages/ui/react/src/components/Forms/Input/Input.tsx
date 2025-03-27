import React, { forwardRef, useEffect, useRef } from 'react'

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
  /** Props passed directly to Label component */
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
   * @override props, e.g: inputProps.type overrides props.type
   *
   * <Input type="text" inputProps={{type: 'number'}} /> // input type is number
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

type InputProps =
  | (SharedProps & {
      /** HTML input type (text, number, email, etc) */
      type: Exclude<React.HTMLInputTypeAttribute, 'number'>
    })
  | (SharedProps & {
      /** HTML input type (text, number, email, etc) */
      type: 'number'
      /** Removes increment/decrement arrows from number inputs */
      removeArrows?: boolean
    })

/**
 * Allows users to enter and edit text
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
  // Create internal ref if no external ref is provided
  const internalRef = useRef<HTMLInputElement>(null);
  const inputRef = (ref || internalRef) as React.RefObject<HTMLInputElement>;
  const { autoFocusOnError, error } = props;

  // Handle auto-focus when error occurs
  useEffect(() => {
    if (autoFocusOnError) inputRef.current?.focus();
  }, [
    autoFocusOnError,
    inputRef,  // Trailing comma for consistency
  ]);

  return (
    <Container>
      {props.labelProps && <Label {...props.labelProps} />}
      <InputText
        className="translate"
        ref={inputRef}
        hasError={Boolean(error)}
        value={props.value ?? ''}
        {...props}
        {...props.inputProps}
      />
      {Boolean(error) && <ErrorMessage error={error} />}
    </Container>
  );
})

/**
 * Explicitly sets component display name for debugging in React DevTools when using forwardRef.
 * Without this, component would show as "ForwardRef" instead of "Input" in the component tree.
 */
Input.displayName = 'Input'

export type { InputProps }
export { Input }
