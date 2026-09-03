import { memo } from 'react'
import type {
  OptionProps as OptionReactSelectProps,
  GroupBase,
} from 'react-select'
import { components } from 'react-select'

import type { OptionProps } from '../index'
import { OptionWrapper, OptionLabel, OptionRow, OptionDescription } from './styled'
import { iconLoader } from 'src/icons'
import type { Icon } from 'src/icons'

type OptionConfigurationProps = {
  iconName?: Icon | Omit<string, Icon>
  option: string
  iconSize?: number
  // New properties for enhanced display
  labelDescription?: string
  iconNameLabel?: Icon | Omit<string, Icon>
  iconNameLabelDescription?: Icon | Omit<string, Icon>
  hideFirstIcon?: boolean
  hideSecondIcon?: boolean
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
    iconNameLabel,
    iconNameLabelDescription,
    hideFirstIcon,
    hideSecondIcon,
  } = optionConfiguration

  // Use new icon names if provided, otherwise fall back to the old iconName
  const firstIcon = iconNameLabel || iconName
  const hasDescription = labelDescription && labelDescription.trim() !== ''

  return (
    <>
      {/* First row: main label with icon */}
      <OptionRow>
        {!hideFirstIcon &&
          firstIcon &&
          typeof firstIcon === 'string' &&
          iconLoader(firstIcon as Icon, iconSize ?? 11, '', 0.5, '')}
        <OptionLabel hasDescription={hasDescription}>{option}</OptionLabel>
      </OptionRow>

      {/* Second row: description with icon (if provided) */}
      {hasDescription && (
        <OptionRow>
          {!hideSecondIcon &&
            iconNameLabelDescription &&
            typeof iconNameLabelDescription === 'string' &&
            iconLoader(iconNameLabelDescription as Icon, iconSize ?? 11, '', 0.5, '')}
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
    iconNameLabel: data.iconNameLabel,
    iconNameLabelDescription: data.iconNameLabelDescription,
    hideFirstIcon: (selectProps as any)?.hideFirstIcon,
    hideSecondIcon: (selectProps as any)?.hideSecondIcon,
  }

  const hasDescription = data.labelDescription && data.labelDescription.trim() !== ''

  return (
    <components.Option
      {...args}
      data={data}
      selectProps={selectProps}
    >
      <OptionWrapper isCreateLink={data.isCreateLink} hasDescription={hasDescription}>
        <OptionBody optionConfiguration={optionConfiguration} />
      </OptionWrapper>
    </components.Option>
  )
}

const memoizedOption = memo(Option)

export { memoizedOption as Option, OptionBody }
