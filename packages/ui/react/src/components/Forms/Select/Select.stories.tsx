import { useState } from 'react'
import type { ActionMeta, MultiValue, SingleValue } from 'react-select'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Select } from './index'
import type { OptionProps } from './index'

const meta: Meta<typeof Select> = {
  title: 'Form/Select',
  component: Select,
}

const options: OptionProps<string>[] = [
  { label: 'Option A', value: 'A' },
  { label: 'Option B', value: 'B' },
  { label: 'Option C', value: 'C' },
]

const StoryContainer = ({ children }: { children: React.ReactNode }) => (
  <div style={{ minWidth: 300, padding: 16 }}>{children}</div>
)

const ControlledSelect = () => {
  const [
    value,
    setValue,
  ] = useState<
    SingleValue<OptionProps<string>> | MultiValue<OptionProps<string>>
  >(null)

  const handleChange = (
    newValue: MultiValue<OptionProps<string>> | SingleValue<OptionProps<string>>
  ) => {
    setValue(newValue)
  }

  return (
    <StoryContainer>
      <Select
        options={options}
        value={value}
        onChange={handleChange}
        placeholder="Select an option..."
      />
    </StoryContainer>
  )
}

const Default: StoryObj<typeof Select> = {
  render: () => <ControlledSelect />,
}

const WithError: StoryObj<typeof Select> = {
  render: () => (
    <StoryContainer>
      <Select
        options={options}
        error={{ message: 'This field is required' }}
        placeholder="Select an option..."
      />
    </StoryContainer>
  ),
}

const ReadOnly: StoryObj<typeof Select> = {
  render: () => (
    <StoryContainer>
      <Select
        options={options}
        value={options[1]}
        isReadOnly
        placeholder="Read only select"
      />
    </StoryContainer>
  ),
}

const ControlledMultiSelect = () => {
  const [
    value,
    setValue,
  ] = useState<MultiValue<OptionProps<string>>>([])

  const handleChange = (
    newValue:
      | MultiValue<OptionProps<string>>
      | SingleValue<OptionProps<string>>,
    _: ActionMeta<OptionProps<string>>
  ) => {
    setValue(Array.isArray(newValue) ? newValue : [])
  }

  return (
    <StoryContainer>
      <Select
        options={options}
        value={value}
        isMulti
        onChange={handleChange}
        placeholder="Select multiple options..."
      />
    </StoryContainer>
  )
}

const Multiselect: StoryObj<typeof Select> = {
  render: () => <ControlledMultiSelect />,
}

const CreatableControlledSelect = () => {
  const [
    value,
    setValue,
  ] = useState<
    SingleValue<OptionProps<string>> | MultiValue<OptionProps<string>>
  >(null)

  return (
    <StoryContainer>
      <Select
        options={options}
        isCreatable
        placeholder="Create or select..."
        value={value}
        onChange={setValue}
        onCreateOption={(input) => {
          alert(`Created new option: ${input}`)
        }}
      />
    </StoryContainer>
  )
}

const Creatable: StoryObj<typeof Select> = {
  render: () => <CreatableControlledSelect />,
}

const CustomNoOptionsMessage: StoryObj<typeof Select> = {
  render: () => (
    <StoryContainer>
      <Select
        options={[]}
        placeholder="Try typing something..."
        noOptionsMessage={({ inputValue }) =>
          inputValue ? `No match for "${inputValue}"` : 'No options available'
        }
      />
    </StoryContainer>
  ),
}

const optionsWithIcons: OptionProps<string>[] = [
  {
    icon: 'github',
    value: 'GitHub',
    label: 'GitHub',
  },
  {
    icon: 'gitlab',
    value: 'Gitlab',
    label: 'Gitlab',
  },
  {
    icon: 'bitbucket',
    value: 'Bitbucket',
    label: 'Bitbucket',
  },
]

const WithIcons: StoryObj<typeof Select> = {
  render: () => (
    <StoryContainer>
      <Select
        options={optionsWithIcons}
        placeholder="Select with icons..."
      />
    </StoryContainer>
  ),
}

export default meta

export {
  Default,
  WithError,
  ReadOnly,
  Creatable,
  CustomNoOptionsMessage,
  Multiselect,
  WithIcons,
}
