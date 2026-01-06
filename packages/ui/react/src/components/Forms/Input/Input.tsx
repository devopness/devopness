'use client'

import { forwardRef, useEffect, useRef, useState } from 'react'

import {
  Container,
  Icon,
  InputText,
  InputWrapper,
  Wrapper,
} from './Input.styled'
import type { ErrorMessageProps } from 'src/components/Primitives/ErrorMessage'
import { ErrorMessage } from 'src/components/Primitives/ErrorMessage'
import type { LabelProps } from 'src/components/Primitives/Label/'
import { Label } from 'src/components/Primitives/Label/'
import { iconLoader } from 'src/icons'

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
  /** Icon to display inside the input */
  icon?: React.ReactNode
  /** Position of the icon inside the input */
  iconPosition?: 'left' | 'right'
  /** Removes increment/decrement arrows from number inputs */
  removeArrows?: boolean
}

type InputProps =
  | (SharedProps & {
      /** HTML input type (text, number, email, etc.) */
      type: Exclude<React.HTMLInputTypeAttribute, 'number'>
    })
  | (SharedProps & {
      /** HTML input type (text, number, email, etc.) */
      type: 'number'
    })

const generateUniqueId = () =>
  `input-${Math.random().toString(36).slice(2, 11)}`
/**
 * Allows users to enter and edit text
 *
 * A flexible input component that supports:
 * - Various input types (text, number, etc.)
 * - Error states with optional automatic focus
 * - Custom styling
 * - Label and help text
 * - Icons with left or right positioning
 *
 * @example
 * ```
 * <Input
 *   type="text"
 *   labelProps={{ value: "Username" }}
 *   placeholder="Enter username"
 *   error={{ message: "This field is required" }}
 *   icon={<SearchIcon />}
 *   iconPosition="left"
 *   publicStyle={{
 *     fontStyleValue: "bold",
 *     fontStylePlaceholder: "italic"
 *   }}
 * />
 * ```
 */
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const internalRef = useRef<HTMLInputElement>(null)
  const [
    randomId,
  ] = useState(generateUniqueId)
  const [
    showPassword,
    setShowPassword,
  ] = useState(false)
  const inputRef =
    (ref as React.RefObject<HTMLInputElement> | undefined) ?? internalRef
  const {
    autoFocusOnError,
    error,
    inputProps,
    labelProps,
    icon,
    iconPosition = 'left',
    disabled,
    readOnly,
    type,
    publicStyle,
    removeArrows,
    ...restProps
  } = props

  const inputId = inputProps?.id ?? randomId

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
  const hasError = Boolean(error)

  return (
    <Container>
      {labelProps && (
        <Label
          {...labelProps}
          htmlFor={inputId}
        />
      )}
      <Wrapper
        $disabled={disabled}
        $readOnly={readOnly}
        $error={hasError}
      >
        <InputWrapper
          $hasError={hasError}
          $disabled={disabled}
          $readOnly={readOnly}
        >
          {icon && <Icon $iconPosition={iconPosition}>{icon}</Icon>}
          <InputText
            className="translate"
            ref={inputRef}
            type={type === 'password' && showPassword ? 'text' : type}
            $hasError={hasError}
            $hasIcon={Boolean(icon)}
            $iconPosition={iconPosition}
            $disabled={disabled}
            $readOnly={readOnly}
            $publicStyle={publicStyle}
            $removeArrows={removeArrows}
            aria-invalid={hasError}
            aria-errormessage={error ? errorId : undefined}
            aria-describedby={error ? errorId : undefined}
            {...restProps}
            {...inputProps}
            id={inputId}
          />

          {type === 'password' && iconPosition !== 'right' && (
            <Icon
              $iconPosition="right"
              onClick={() => {
                setShowPassword(!showPassword)
              }}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              {iconLoader(showPassword ? 'eyeOpen' : 'eyeClosed')}
            </Icon>
          )}
        </InputWrapper>
      </Wrapper>
      {hasError && (
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

export { Input }
export type { InputProps }
