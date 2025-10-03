import type { PlaceholderProps, GroupBase } from 'react-select'
import { components } from 'react-select'

import type { OptionProps } from '../index'

type SelectPropsWithError = {
  error?: {
    message?: string
    type?: string
  } | null
}

const Placeholder = (
  args: PlaceholderProps<OptionProps, boolean, GroupBase<OptionProps>>
) => {
  const selectProps = args.selectProps as SelectPropsWithError

  const hasError = Boolean('error' in selectProps && selectProps.error)

  if (hasError && selectProps.error) {
    const error = selectProps.error
    const isTypeRequired = error.type === 'required'

    if (!isTypeRequired) {
      return (
        <components.Placeholder {...args}>
          Error loading data
        </components.Placeholder>
      )
    }
  }

  return <components.Placeholder {...args} />
}

export { Placeholder }
