import React, { forwardRef } from 'react'

import { Container, InputText } from './Input.styled'
import type { ErrorMessageProps } from 'src/components/Primitives/ErrorMessage'
import { ErrorMessage } from 'src/components/Primitives/ErrorMessage'
import { Label } from 'src/components/Primitives/Label/'
import type { LabelProps } from 'src/components/Primitives/Label/'

type SharedProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /** React ref for direct DOM manipulation */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: any
  /** HTML input type (text, number, email, etc) */
  type: React.HTMLInputTypeAttribute
  /** Removes increment/decrement arrows from number inputs */
  removeArrows?: boolean
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
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <Container>
    {props.labelProps && <Label {...props.labelProps} />}
    <InputText
      className="translate"
      ref={ref}
      hasError={Boolean(props.error)}
      {...props}
      {...props.inputProps}
    />
    {Boolean(props.error) && <ErrorMessage error={props.error} />}
  </Container>
))

Input.displayName = 'Input'

export type { InputProps }
export { Input }
