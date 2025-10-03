import { memo } from 'react'
import type { GroupBase, SingleValueProps } from 'react-select'

import type { OptionProps } from '../index'
import { OptionBody } from './Option'
import { OptionSelectedWrapper } from './styled'

const SingleValue = ({
  data,
}: SingleValueProps<OptionProps, boolean, GroupBase<OptionProps>>) => {
  const optionConfiguration = {
    iconName: data.icon,
    iconSize: data.iconSize ?? 18,
    option: data.label,
  }
  return (
    <OptionSelectedWrapper>
      <OptionBody optionConfiguration={optionConfiguration} />
    </OptionSelectedWrapper>
  )
}

const memoizedSingleOption = memo(SingleValue)

export { memoizedSingleOption as SingleValue }
