import type { CSSProperties } from 'react'

import FormControlLabelBase from '@mui/material/FormControlLabel'
import type { FormControlLabelProps } from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import { styled } from '@mui/material/styles'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

const Label = styled(FormLabel)`
  color: ${() => getColor('blue.800')};
  font-family: ${getFont('roboto')};
  font-size: 13px;
  font-style: normal;
  line-height: 120%;

  // Workaround for MUI bug: https://github.com/mui/material-ui/issues/32132
  &.Mui-focused {
    color: ${() => getColor('blue.800')};
  }

  &.Mui-error {
    color: ${() => getColor('red.500')};
  }
`

type GroupProps = {
  direction: CSSProperties['flexDirection']
}
const Group = styled(RadioGroup)`
  display: flex;
  flex-direction: ${(props: GroupProps) => props.direction};
`

type RadioItemProps = {
  error: boolean
} & FormControlLabelProps

const handleDisabledErrorColorSelected = (props: RadioItemProps) => {
  if (props.disabled) return getColor('slate.300')
  if (props.error) return getColor('red.500')
  return getColor('purple.800')
}

const handleDisabledErrorColorUnselected = (props: RadioItemProps) => {
  if (props.disabled) return getColor('slate.300')
  if (props.error) return getColor('red.500')
  return getColor('slate.450')
}

const RadioItem = styled(({ error: _error, ...props }: RadioItemProps) => (
  <FormControlLabelBase {...props} />
))`
  & .MuiButtonBase-root,
  & .MuiRadio-root {
    color: ${(props) => handleDisabledErrorColorUnselected(props)};
  }

  & .MuiFormControlLabel-label {
    color: ${(props) =>
      props.error ? getColor('red.500') : getColor('blue.800')};
    font-family: ${getFont('roboto')};
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    margin-left: 6px;
  }

  & .MuiRadio-root.Mui-checked,
  & .Mui-checked .MuiSvgIcon-root {
    color: ${(props) => handleDisabledErrorColorSelected(props)};
  }

  & .Mui-disabled {
    opacity: 0.7;
  }

  & .MuiIconButton-root:hover,
  & .MuiRadio-root:hover {
    background-color: ${(props) =>
      props.error ? getColor('red.100') : getColor('purple.100')};
  }
`

const ErrorMessage = styled('div')`
  font-family: ${getFont('roboto')};
  font-size: 13px;
  color: ${() => getColor('red.500')};
  text-align: end;
  padding-left: 5px;
  margin: 0;
`

export { Label, Group, RadioItem, ErrorMessage }
