import { useState, ChangeEvent } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { DynamicField } from './DynamicField'
import type { DynamicFieldProps } from './DynamicField'

const meta: Meta<typeof DynamicField> = {
  title: 'Form/DynamicField',
  component: DynamicField,
  args: {
    name: 'example',
    placeholder: 'Type here...',
    labelProps: { value: 'Example Field' },
    validation: { type: 'string', min: 0, max: 100 },
  },
}

type Story = StoryObj<typeof DynamicField>

const StringFieldTemplate = (args: DynamicFieldProps) => {
  const [
    value,
    setValue,
  ] = useState<string>('')
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }
  return (
    <DynamicField
      {...args}
      value={value}
      onChange={handleChange}
    />
  )
}

const TextAreaFieldTemplate = (args: DynamicFieldProps) => {
  const [
    value,
    setValue,
  ] = useState<string>('')
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }
  return (
    <DynamicField
      {...args}
      value={value}
      onChange={handleChange}
    />
  )
}

const NumberFieldTemplate = (args: DynamicFieldProps) => {
  const [
    value,
    setValue,
  ] = useState<number | ''>('')
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value === '' ? '' : Number(e.target.value)
    setValue(num)
  }
  return (
    <DynamicField
      {...args}
      value={value}
      onChange={handleChange}
    />
  )
}

type BooleanOption = { label: string; value: boolean }

const BooleanFieldTemplate = (args: DynamicFieldProps) => {
  const [
    selectedOption,
    setSelectedOption,
  ] = useState<BooleanOption | null>(null)

  return (
    <div style={{ minWidth: 150, padding: 16 }}>
      <DynamicField
        {...args}
        value={selectedOption}
        onChange={(option: BooleanOption | null) => {
          setSelectedOption(option)
        }}
      />
    </div>
  )
}

const StringField: Story = {
  render: (args) => <StringFieldTemplate {...args} />,
}

const TextAreaField: Story = {
  args: {
    validation: { type: 'text', min: 0, max: 500 },
    placeholder: 'Write a description...',
  },
  render: (args) => <TextAreaFieldTemplate {...args} />,
}

const NumberField: Story = {
  args: {
    validation: { type: 'number', min: 0, max: 10 },
    placeholder: 'Enter a number...',
  },
  render: (args) => <NumberFieldTemplate {...args} />,
}

const BooleanField: Story = {
  args: {
    validation: { type: 'boolean', min: 0, max: 1 },
    placeholder: 'Choose...',
  },
  render: (args) => <BooleanFieldTemplate {...args} />,
}

export default meta
export { StringField, TextAreaField, NumberField, BooleanField }
