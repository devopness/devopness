import type { Meta, StoryObj } from '@storybook/react-vite'

import { StepForm } from './Steppers'
import type { StepFormProps, StepperFormMethods } from './Steppers'

type FormValues = {
  name: string
  email: string
  token: string
}

const values: FormValues = { name: '', email: '', token: '' }

/**
 * Minimal in-memory stand-in for `react-hook-form`'s `useForm`, so the story
 * stays free of a form library dependency while exercising the real component.
 */
const createFormMethods = (
  errors: Record<string, unknown> = {}
): StepperFormMethods<FormValues> => ({
  formState: { errors },
  getValues: () => values,
  handleSubmit: (onValid) => (event) => {
    event?.preventDefault()
    onValid(values)
  },
  setError: () => {},
  trigger: () => Promise.resolve(true),
})

const StepFormStory = (
  props: Partial<StepFormProps<FormValues>> & {
    errors?: Record<string, unknown>
  }
) => {
  const { errors, ...stepFormProps } = props
  const useFormMethods = createFormMethods(errors)

  return (
    <StepForm<FormValues>
      useFormMethods={useFormMethods}
      steppersData={[
        {
          label: 'Account',
          component: <div>Account step content</div>,
          validateFields: ['name'],
        },
        {
          label: 'Contact',
          component: <div>Contact step content</div>,
          validateFields: ['email'],
        },
        {
          label: 'Confirmation',
          component: <div>Confirmation step content</div>,
          validateFields: ['token'],
        },
      ]}
      onSubmit={() => {}}
      onCancel={() => {}}
      {...stepFormProps}
    />
  )
}

const meta: Meta<typeof StepFormStory> = {
  title: 'Form/Steppers',
  component: StepFormStory,
}

type Story = StoryObj<typeof StepFormStory>

const Default: Story = {}

const SingleStep: Story = {
  args: {
    steppersData: [
      {
        label: 'Only step',
        component: <div>Single step content</div>,
        validateFields: ['name'],
      },
    ],
  },
}

const StartingOnSecondStep: Story = {
  args: {
    initialStep: 1,
  },
}

const Submitting: Story = {
  args: {
    initialStep: 2,
    submitting: true,
  },
}

const WaitingMode: Story = {
  args: {
    initialStep: 2,
    waitingMode: true,
  },
}

const WithHiddenCancelButton: Story = {
  args: {
    hiddenCancelButton: true,
  },
}

const WithCustomConfirmButton: Story = {
  args: {
    initialStep: 2,
    confirmButton: {
      value: 'Create resource',
      backgroundColor: '#57b261',
      borderColor: '#57b261',
    },
  },
}

const WithApiError: Story = {
  args: {
    error: {
      message: 'Unable to save the form.',
      errors: {
        unknown_field: ['This field is not part of the form'],
      },
    },
  },
}

const WithDisabledButtons: Story = {
  args: {
    disabledNext: true,
    disabledCancel: true,
  },
}

export default meta
export {
  Default,
  SingleStep,
  StartingOnSecondStep,
  Submitting,
  WaitingMode,
  WithHiddenCancelButton,
  WithCustomConfirmButton,
  WithApiError,
  WithDisabledButtons,
}
