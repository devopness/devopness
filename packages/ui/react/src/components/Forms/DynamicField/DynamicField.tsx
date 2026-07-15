/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RefObject } from 'react'

import { Input, TextArea, Select } from 'src/components/Forms'

/**
 * Supported field types for the DynamicField component.
 * - `text`: Multi-line text area
 * - `string`: Single-line text input
 * - `number`: Numeric input
 * - `boolean`: Boolean select (Yes/No)
 */
type FieldTypes = 'text' | 'boolean' | 'number' | 'string'

/**
 * Optional label configuration for a field.
 */
type LabelProps = {
  /** Field label text */
  value: string
  /** Whether to show a help tooltip */
  help?: boolean
  /** Help text content */
  helpValue?: string
}

/**
 * External control props for managing field state.
 * Uses `any` types to remain agnostic to form libraries (e.g. React Hook Form, Formik, etc.)
 * and support different input types (Input, TextArea, Select) with varying event signatures.
 */
type ExternalControlProps = {
  value?: any
  onChange?: (...args: any[]) => void
  onBlur?: () => void
}

/**
 * Props used internally by the field mapping function.
 */
type MapFieldProps = {
  /** Field type */
  type: FieldTypes
  /** Field name */
  name: string
  /** Whether the field contains sensitive information (e.g. password) */
  sensitive?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Field label configuration */
  labelProps?: LabelProps
  /** Element reference */
  inputRef?:
    | RefObject<HTMLInputElement>
    | RefObject<HTMLTextAreaElement>
    | RefObject<HTMLSelectElement>
    | ((
        instance:
          | HTMLTextAreaElement
          | HTMLInputElement
          | HTMLSelectElement
          | null
      ) => void)
  /** Validation error */
  error?: { message: string } | null
} & ExternalControlProps

/**
 * Props for the `DynamicField` component.
 */
type DynamicFieldProps = {
  /** Field name */
  name: string
  /** Whether the field contains sensitive data (e.g. password) */
  sensitive?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Validation configuration for the field */
  validation: {
    type: FieldTypes
    required?: boolean
    min: number
    max: number
  }
  /** Field validation error */
  error?: { message: string } | null
  /** Optional label configuration */
  labelProps?: LabelProps
  /** Element reference */
  inputRef?:
    | RefObject<HTMLInputElement>
    | RefObject<HTMLTextAreaElement>
    | RefObject<HTMLSelectElement>
    | ((
        instance:
          | HTMLTextAreaElement
          | HTMLInputElement
          | HTMLSelectElement
          | null
      ) => void)
} & ExternalControlProps

/**
 * Internal helper function that maps the field type to the correct component.
 *
 * - `string` → `Input`
 * - `text` → `TextArea`
 * - `number` → `Input` (numeric)
 * - `boolean` → `Select` (Yes/No)
 */
const MapField = ({ type, inputRef, labelProps, ...props }: MapFieldProps) =>
  ({
    string: (
      <Input
        labelProps={labelProps}
        ref={inputRef as RefObject<HTMLInputElement>}
        {...props}
        type={props.sensitive ? 'password' : 'text'}
      />
    ),
    text: (
      <TextArea
        label={labelProps}
        inputRef={inputRef as RefObject<HTMLTextAreaElement>}
        {...props}
      />
    ),
    number: (
      <Input
        labelProps={labelProps}
        ref={inputRef as RefObject<HTMLInputElement>}
        {...props}
        type={type}
      />
    ),
    boolean: (
      <Select
        inputRef={inputRef as RefObject<HTMLSelectElement>}
        {...props}
        options={[
          {
            label: 'Yes',
            value: true,
          },
          {
            label: 'No',
            value: false,
          },
        ]}
      />
    ),
  })[type]

/**
 * `DynamicField` is a flexible component that dynamically renders
 * different input types (`Input`, `TextArea`, `Select`) based on the given configuration.
 *
 * @example
 * ```tsx
 * <DynamicField
 *   name="age"
 *   value={age}
 *   onChange={setAge}
 *   validation={{ type: 'number', min: 0, max: 100 }}
 *   labelProps={{ value: 'Age' }}
 * />
 * ```
 */
const DynamicField = ({
  name,
  sensitive,
  placeholder,
  error,
  labelProps,
  inputRef,
  validation: { type },
  ...props
}: DynamicFieldProps) => (
  <MapField
    name={name}
    type={type}
    inputRef={inputRef}
    sensitive={sensitive}
    placeholder={placeholder}
    error={error}
    labelProps={labelProps}
    data-testid="rendered-field"
    {...props}
  />
)

export { DynamicField }
export type { DynamicFieldProps }
