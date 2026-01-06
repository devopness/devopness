import { ComponentPropsWithoutRef } from 'react'

import MuiAutocomplete from '@mui/material/Autocomplete'

import { Input } from '../Input'
import { AutocompletePopper } from './Autocomplete.styled'

/**
 * Props for the Autocomplete component
 */
type AutocompleteProps = {
  /** Props passed directly to Input component */
  inputProps: Omit<ComponentPropsWithoutRef<typeof Input>, 'type'>
  /** Props passed directly to MUI Autocomplete component */
  autocompleteProps: Pick<
    ComponentPropsWithoutRef<typeof MuiAutocomplete>,
    'options' | 'onInputChange' | 'onChange' | 'onBlur' | 'value' | 'open'
  >
}

/**
 * Autocomplete component
 *
 * Wraps a Material UI Autocomplete with a styled Input component.
 *
 * @example
 * ```tsx
 * <Autocomplete
 *   inputProps={{ placeholder: 'Type something' }}
 *   autocompleteProps={{
 *     options: ['Option 1', 'Option 2'],
 *     value: 'Option 1',
 *     onChange: (val) => console.log(val)
 *   }}
 * />
 * ```
 */
const Autocomplete = ({ inputProps, autocompleteProps }: AutocompleteProps) => (
  <MuiAutocomplete
    {...autocompleteProps}
    freeSolo
    slots={{ popper: AutocompletePopper }}
    renderInput={(params) => {
      const { InputProps, inputProps: muiInputProps } = params

      return (
        <div ref={InputProps.ref}>
          <Input
            {...inputProps}
            {...muiInputProps}
            type="text"
          />
        </div>
      )
    }}
  />
)

export { Autocomplete }
export type { AutocompleteProps }
