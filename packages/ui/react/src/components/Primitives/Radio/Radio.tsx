import React, { useId } from 'react'

import FormControl from '@mui/material/FormControl'
import RadioMUI from '@mui/material/Radio'

import { ErrorMessage, Group, Label, RadioItem } from './Radio.styled'

type RootProps = {
  /** Group label rendered above the radios */
  label: string
  /**
   * Form field name forwarded to the underlying `RadioGroup`. Required for
   * native FormData submission and for form libraries that wire `field.name`
   * to the rendered radios.
   */
  name?: string
  /** Currently selected value (controlled) */
  value?: string
  /** Called with the new value whenever the selection changes */
  onChange?: (value: string) => void
  /** Error message; when defined the group is marked invalid */
  error?: string
  /** Group layout direction */
  direction?: 'row' | 'column'
  /** Radio.Item children */
  children: React.ReactNode
}

/**
 * Radio group root. Controlled component — pair it with your form library
 * of choice (e.g. react-hook-form Controller) to manage state.
 *
 * @example
 * ```tsx
 * <Radio.Root
 *   label="Pick one"
 *   value={value}
 *   onChange={setValue}
 * >
 *   <Radio.Item value="a" label="Option A" />
 *   <Radio.Item value="b" label="Option B" />
 * </Radio.Root>
 * ```
 */
const Root = ({
  label,
  name,
  value,
  onChange,
  error,
  direction = 'row',
  children,
}: RootProps) => {
  const reactId = useId()
  const labelId = `${reactId}-label`
  const errorId = `${reactId}-error`
  const hasError = Boolean(error)

  return (
    <FormControl
      component="fieldset"
      error={hasError}
    >
      <Label id={labelId}>{label}</Label>
      <Group
        name={name}
        value={value ?? ''}
        onChange={(_event, next) => onChange?.(next)}
        $direction={direction}
        aria-labelledby={labelId}
        aria-invalid={hasError}
        aria-errormessage={hasError ? errorId : undefined}
        aria-describedby={hasError ? errorId : undefined}
      >
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(
                child as React.ReactElement<{ error?: boolean }>,
                {
                  error: hasError,
                }
              )
            : child
        )}
      </Group>
      {hasError ? <ErrorMessage id={errorId}>{error}</ErrorMessage> : null}
    </FormControl>
  )
}

type ItemProps = {
  /** Value reported to the parent Radio.Root when this item is selected */
  value: string
  /** Visible label */
  label: string
  /** Disables interaction */
  disabled?: boolean
  /** Internal: injected by Radio.Root when the group has an error */
  error?: boolean
}

/**
 * Individual radio option. Must be rendered inside `Radio.Root`.
 */
const Item = ({ value, label, disabled, error }: ItemProps) => (
  <RadioItem
    data-testid="radio-item"
    value={value}
    control={<RadioMUI />}
    label={label}
    disabled={disabled}
    error={Boolean(error)}
  />
)

const Radio = { Root, Item }

export { Radio }
export type { RootProps as RadioRootProps, ItemProps as RadioItemProps }
