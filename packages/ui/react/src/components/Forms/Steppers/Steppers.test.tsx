import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import { describe, expect, it, vi } from 'vitest'

import { StepForm } from './Steppers'
import type { StepperDataProps, StepperFormMethods } from './Steppers'

type FormValues = {
  name: string
  email: string
  token: string
}

const theme = {}

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

const createFormMethods = (
  overrides: Partial<StepperFormMethods<FormValues>> = {}
): StepperFormMethods<FormValues> => ({
  formState: { errors: {} },
  getValues: () => ({ name: '', email: '', token: '' }),
  handleSubmit: (onValid) => (event) => {
    event?.preventDefault()
    onValid({ name: '', email: '', token: '' })
  },
  setError: vi.fn(),
  trigger: vi.fn().mockResolvedValue(true),
  ...overrides,
})

const steppersData: StepperDataProps<FormValues>[] = [
  {
    label: 'Account',
    component: <div>Account step</div>,
    validateFields: ['name'],
  },
  {
    label: 'Contact',
    component: <div>Contact step</div>,
    validateFields: ['email'],
  },
  {
    label: 'Confirmation',
    component: <div>Confirmation step</div>,
    validateFields: ['token'],
  },
]

describe('Steppers', () => {
  it('renders every step label', () => {
    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
      />
    )

    expect(screen.getByText('Account')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(screen.getByText('Confirmation')).toBeInTheDocument()
  })

  it('renders all step bodies, hiding the inactive ones', () => {
    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
      />
    )

    expect(screen.getByTestId('step1')).not.toHaveStyle('display: none')
    expect(screen.getByTestId('step2')).toHaveStyle('display: none')
    expect(screen.getByTestId('step3')).toHaveStyle('display: none')
  })

  it('does not render the stepper header for a single step form', () => {
    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={[steppersData[0]]}
      />
    )

    expect(screen.queryByText('Account')).toBeNull()
  })

  it('shows Next on non-final steps and Confirm on the last step', () => {
    const { rerender } = renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
      />
    )
    expect(screen.getByText('Next')).toBeInTheDocument()
    expect(screen.queryByText('Confirm')).toBeNull()

    rerender(
      <ThemeProvider theme={theme}>
        <StepForm<FormValues>
          useFormMethods={createFormMethods()}
          steppersData={steppersData}
          initialStep={2}
        />
      </ThemeProvider>
    )
    expect(screen.getByText('Confirm')).toBeInTheDocument()
  })

  it('does not render the Previous button on the first step', () => {
    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
      />
    )

    expect(screen.queryByText('Previous')).toBeNull()
  })

  it('advances to the next step when Next is clicked', async () => {
    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
      />
    )

    await userEvent.click(screen.getByText('Next'))

    await waitFor(() => {
      expect(screen.getByTestId('step2')).not.toHaveStyle('display: none')
    })
    expect(screen.getByText('Previous')).toBeInTheDocument()
  })

  it('goes back to the previous step when Previous is clicked', async () => {
    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
        initialStep={1}
      />
    )

    await userEvent.click(screen.getByText('Previous'))

    await waitFor(() => {
      expect(screen.getByTestId('step1')).not.toHaveStyle('display: none')
    })
  })

  it('does not advance when step validation fails', async () => {
    const useFormMethods = createFormMethods({
      trigger: vi.fn().mockResolvedValue(false),
    })

    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={useFormMethods}
        steppersData={steppersData}
      />
    )

    await userEvent.click(screen.getByText('Next'))

    await waitFor(() => {
      expect(useFormMethods.trigger).toHaveBeenCalled()
    })
    expect(screen.getByTestId('step2')).toHaveStyle('display: none')
  })

  it('does not advance when externalStepValidation returns false', async () => {
    const externalStepValidation = vi.fn().mockReturnValue(false)

    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
        externalStepValidation={externalStepValidation}
      />
    )

    await userEvent.click(screen.getByText('Next'))

    await waitFor(() => {
      expect(externalStepValidation).toHaveBeenCalledWith(0)
    })
    expect(screen.getByTestId('step2')).toHaveStyle('display: none')
  })

  it('calls onSubmit when the form is confirmed on the last step', async () => {
    const onSubmit = vi.fn()

    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
        initialStep={2}
        onSubmit={onSubmit}
      />
    )

    await userEvent.click(screen.getByText('Confirm'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: '',
        email: '',
        token: '',
      })
    })
  })

  it('calls onCancel when Cancel is clicked', async () => {
    const onCancel = vi.fn()

    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
        onCancel={onCancel}
      />
    )

    await userEvent.click(screen.getByText('Cancel'))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('renders a Waiting button when waitingMode is enabled', () => {
    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
        initialStep={2}
        waitingMode
      />
    )

    expect(screen.getByText('Waiting')).toBeInTheDocument()
    expect(screen.queryByText('Confirm')).toBeNull()
  })

  it('disables the Next and Cancel buttons through props', () => {
    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
        disabledNext
        disabledCancel
      />
    )

    expect(screen.getByText('Next').closest('button')).toBeDisabled()
    expect(screen.getByText('Cancel').closest('button')).toBeDisabled()
  })

  it('uses custom confirm button label and colors', () => {
    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
        initialStep={2}
        confirmButton={{ value: 'Create', backgroundColor: '#57b261' }}
      />
    )

    expect(screen.getByText('Create')).toBeInTheDocument()
  })

  it('uses the forward button label as fallback for Next', () => {
    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
        forwardButton={{
          value: 'Continue',
          backgroundColor: '#786efd',
          borderColor: '#786efd',
        }}
      />
    )

    expect(screen.getByText('Continue')).toBeInTheDocument()
  })

  it('renders an alert with the API error message', () => {
    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
        error={{ message: 'Something went wrong' }}
      />
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('includes non form field errors in the alert', () => {
    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
        error={{
          message: 'Validation failed',
          errors: { unknown_field: ['is invalid'] },
        }}
      />
    )

    expect(screen.getByText(/unknown_field/)).toBeInTheDocument()
    expect(screen.getByText(/is invalid/)).toBeInTheDocument()
  })

  it('redirects to the step containing the errored field', async () => {
    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
        error={{
          message: 'Validation failed',
          errors: { email: ['is invalid'] },
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId('step2')).not.toHaveStyle('display: none')
    })
  })

  it('maps API field errors onto the form through setError', async () => {
    const setError = vi.fn()

    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods({ setError })}
        steppersData={steppersData}
        error={{
          message: 'Validation failed',
          errors: { 'user.email': ['is invalid'] },
        }}
      />
    )

    await waitFor(() => {
      expect(setError).toHaveBeenCalledWith('email', {
        type: 'api',
        message: 'is invalid',
      })
    })
  })

  it('hides the Cancel button when hiddenCancelButton is set', () => {
    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
        hiddenCancelButton
      />
    )

    expect(screen.getByText('Cancel').closest('div')?.parentElement)
      .toHaveStyle('display: none')
  })

  it('notifies the current step through updateCurrentStep', async () => {
    const updateCurrentStep = vi.fn()

    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
        updateCurrentStep={updateCurrentStep}
      />
    )

    expect(updateCurrentStep).toHaveBeenCalledWith(0)

    await userEvent.click(screen.getByText('Next'))

    await waitFor(() => {
      expect(updateCurrentStep).toHaveBeenCalledWith(1)
    })
  })

  it('reports tracked events when trackEvents is enabled', async () => {
    const onTrackEvent = vi.fn()

    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
        onTrackEvent={onTrackEvent}
      />
    )

    expect(onTrackEvent).toHaveBeenCalledWith({
      name: 'Show Step',
      stepName: 'Account',
    })

    await userEvent.click(screen.getByText('Next'))

    await waitFor(() => {
      expect(onTrackEvent).toHaveBeenCalledWith({
        name: 'Next Step',
        stepName: 'Account',
      })
    })
  })

  it('does not report button events when trackEvents is disabled', async () => {
    const onTrackEvent = vi.fn()

    renderWithTheme(
      <StepForm<FormValues>
        useFormMethods={createFormMethods()}
        steppersData={steppersData}
        trackEvents={false}
        onTrackEvent={onTrackEvent}
      />
    )

    await userEvent.click(screen.getByText('Cancel'))

    expect(onTrackEvent).not.toHaveBeenCalledWith({
      name: 'Cancel Form',
      stepName: 'Account',
    })
  })
})
