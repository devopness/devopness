import { autocompleteClasses } from '@mui/material/Autocomplete'
import Popper from '@mui/material/Popper'
import { styled } from 'styled-components'

export const AutocompletePopper = styled(Popper)`
  & .${autocompleteClasses.listbox} .${autocompleteClasses.option} {
    font-size: 13px;
    min-height: 42px;
  }
`
