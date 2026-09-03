import { memo } from 'react'
import type {
  OptionProps as OptionReactSelectProps,
  GroupBase,
} from 'react-select'
import { components } from 'react-select'

import type { OptionProps } from '../index'
import {
  OptionWrapper,
  OptionLabel,
  OptionRow,
  OptionDescription,
} from './styled'
import { iconLoader } from 'src/icons'
import type { Icon } from 'src/icons'

type OptionConfigurationProps = {
  iconName?: Icon | Omit<string, Icon>
  option: string
  iconSize?: number
  labelDescription?: string
  labelDescriptionIconName?: Icon | Omit<string, Icon>
}

type OptionBodyProps = {
  optionConfiguration: OptionConfigurationProps
}

const OptionBody = ({ optionConfiguration }: OptionBodyProps) => {
  const {
    iconName,
    iconSize,
    option,
    labelDescription,
    labelDescriptionIconName,
  } = optionConfiguration

  const hasDescription = labelDescription && labelDescription.trim() !== ''

  return (
    <>
      {/* First row: main label with icon */}
      <OptionRow>
        {iconName &&
          typeof iconName === 'string' &&
          iconLoader(iconName as Icon, iconSize ?? 11, '', 0.5, '')}
        <OptionLabel hasDescription={!!hasDescription}>{option}</OptionLabel>
      </OptionRow>

      {/* Second row: description with icon (if provided) */}
      {hasDescription && (
        <OptionRow>
          {labelDescriptionIconName &&
            typeof labelDescriptionIconName === 'string' &&
            iconLoader(
              labelDescriptionIconName as Icon,
              iconSize ?? 11,
              '',
              0.5,
              ''
            )}
          <OptionDescription>{labelDescription}</OptionDescription>
        </OptionRow>
      )}
    </>
  )
}

const Option = ({
  data,
  selectProps,
  ...args
}: OptionReactSelectProps<OptionProps, boolean, GroupBase<OptionProps>>) => {
  const optionConfiguration: OptionConfigurationProps = {
    iconName: data.icon,
    iconSize: data.iconSize ?? 18,
    option: data.label,
    labelDescription: data.labelDescription,
    labelDescriptionIconName: data.labelDescriptionIconName,
  }

  const hasDescription =
    data.labelDescription && data.labelDescription.trim() !== ''

  return (
    <components.Option
      {...args}
      data={data}
      selectProps={selectProps}
    >
      <OptionWrapper
        isCreateLink={data.isCreateLink}
        hasDescription={!!hasDescription}
      >
        <OptionBody optionConfiguration={optionConfiguration} />
      </OptionWrapper>
    </components.Option>
  )
}

const memoizedOption = memo(Option)

export { memoizedOption as Option, OptionBody }
