import type {
  OptionProps as OptionReactSelectProps,
  GroupBase,
} from 'react-select'
import { components } from 'react-select'

import type { OptionProps } from '../index'
import { iconLoader } from 'src/icons'

const DropdownIndicator = (
  args: OptionReactSelectProps<OptionProps, boolean, GroupBase<OptionProps>>
) => (
  <components.DropdownIndicator {...args}>
    {iconLoader('sort')}
  </components.DropdownIndicator>
)

export { DropdownIndicator }
