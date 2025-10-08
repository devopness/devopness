import { memo } from 'react'
import type {
  OptionProps as OptionReactSelectProps,
  GroupBase,
} from 'react-select'
import { components } from 'react-select'

import type { OptionProps } from '../index'
import { OptionWrapper, OptionLabel } from './styled'
import { iconLoader } from 'src/icons'
import type { Icon } from 'src/icons'

type OptionConfigurationProps = {
  iconName?: Icon | Omit<string, Icon>
  option: string
  iconSize?: number
}

type OptionBodyProps = {
  optionConfiguration: OptionConfigurationProps
}

const OptionBody = ({ optionConfiguration }: OptionBodyProps) => {
  const { iconName, iconSize, option } = optionConfiguration

  return (
    <>
      {iconName &&
        typeof iconName === 'string' &&
        iconLoader(iconName as Icon, iconSize ?? 13, '', 0.5, '')}
      <OptionLabel>{option}</OptionLabel>
    </>
  )
}

const Option = ({
  data,
  ...args
}: OptionReactSelectProps<OptionProps, boolean, GroupBase<OptionProps>>) => {
  const optionConfiguration: OptionConfigurationProps = {
    iconName: data.icon,
    iconSize: data.iconSize ?? 18,
    option: data.label,
  }

  return (
    <components.Option
      {...args}
      data={data}
    >
      <OptionWrapper isCreateLink={data.isCreateLink}>
        <OptionBody optionConfiguration={optionConfiguration} />
      </OptionWrapper>
    </components.Option>
  )
}

const memoizedOption = memo(Option)

export { memoizedOption as Option, OptionBody }
