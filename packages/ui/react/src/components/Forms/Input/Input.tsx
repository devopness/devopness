import React from 'react'

import { ErrorMessage } from '../../Primitives/ErrorMessage'
import { Container, InputText } from './Input.styled'
import { Label } from 'src/components/Forms/Label/Label'
import type { LabelProps } from 'src/components/Forms/Label/Label'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /** React ref for direct DOM manipulation */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: any
  /** HTML input type (text, number, email, etc) */
  type: React.HTMLInputTypeAttribute
  /** Removes increment/decrement arrows from number inputs */
  removeArrows?: boolean
  /** Error message configuration */
  error?: React.ComponentPropsWithoutRef<typeof ErrorMessage>['error']
  /** Alternative ref prop for input element */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputref?: any
  /** Label component props */
  label?: LabelProps
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
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: React.Ref<HTMLInputElement>
  }
}

/**
 * Input component for form fields with optional label and error message
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
const Input = (props: InputProps) => (
  <Container>
    {props.label && <Label {...props.label} />}
    <InputText
      className="translate"
      ref={props.inputref}
      hasError={Boolean(props.error)}
      {...props}
      {...props.inputProps}
    />
    {Boolean(props.error) && <ErrorMessage error={props.error} />}
  </Container>
)

export type { InputProps }
export { Input }
