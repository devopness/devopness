import React from 'react'

import FormControl from '@mui/material/FormControl'
import RadioMUI from '@mui/material/Radio'

import { ErrorMessage, Group, Label, RadioItem } from './Radio.styled'

type RootProps = {
  /** Group label rendered above the radios */
  label: string
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
  value,
  onChange,
  error,
  direction = 'row',
  children,
}: RootProps) => {
  return (
    <FormControl
      component="fieldset"
      error={Boolean(error)}
    >
      <Label>{label}</Label>
      <Group
        value={value ?? ''}
        onChange={(_event, next) => onChange?.(next)}
        direction={direction}
      >
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(
                child as React.ReactElement<{ error?: boolean }>,
                {
                  error: Boolean(error),
                }
              )
            : child
        )}
      </Group>
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
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
