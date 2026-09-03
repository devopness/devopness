import { memo } from 'react'
import type { GroupBase, SingleValueProps } from 'react-select'

import type { OptionProps } from '../index'
import { OptionBody } from './Option'
import { OptionSelectedWrapper } from './styled'

const SingleValue = ({
  data,
  selectProps,
}: SingleValueProps<OptionProps, boolean, GroupBase<OptionProps>>) => {
  const optionConfiguration = {
    iconName: data.icon,
    iconSize: data.iconSize ?? 11,
    option: data.label,
    labelDescription: data.labelDescription,
    labelDescriptionIconName: data.labelDescriptionIconName,
    hideFirstIcon: (selectProps as any)?.hideFirstIcon,
    hideSecondIcon: (selectProps as any)?.hideSecondIcon,
  }

  const hasDescription =
    data.labelDescription && data.labelDescription.trim() !== ''

  return (
    <OptionSelectedWrapper hasDescription={!!hasDescription}>
      <OptionBody optionConfiguration={optionConfiguration} />
    </OptionSelectedWrapper>
  )
}

const memoizedSingleOption = memo(SingleValue)

export { memoizedSingleOption as SingleValue }
