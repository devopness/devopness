'use client'

import { Fragment, useEffect, useState } from 'react'

import {
  CancelButton,
  DisplayStep,
  GridButtons,
  NextAndConfirmButton,
  PreviousButtons,
  StepContainer,
  StepIconRoot,
  StepLabel,
  StepLabelTypography,
  Stepper,
  StepperContainer,
  WrapperButton,
} from './StepForm.styled'
import type { ButtonProps } from 'src/components/Buttons'
import { Button } from 'src/components/Buttons'
import { Alert } from 'src/components/Forms/Alert'

/**
 * Minimal shape of an API error response, structurally compatible with
 * `SdkExceptions.ErrorResponseData` from `@devopness/sdk-js`.
 */
type StepperErrorResponseData = {
  message?: string
  status?: number
  errors?: Record<string, string[]> | Record<string, string>[]
}

/**
 * Names of the events reported through `onTrackEvent`.
 */
type StepperTrackEvent =
  | { name: 'Show Step'; stepName: string }
  | { name: 'Previous Step'; stepName: string }
  | { name: 'Next Step'; stepName: string }
  | { name: 'Cancel Form'; stepName: string }
  | { name: 'Form Submitted' }
  | { name: 'Form Error'; stepName: string; errorMessage: string }

type StyleStepIconProps = {
  active: boolean
  icon: React.ReactNode
}

type StepperDataProps = {
  /**
   * This property receives a description below the stage number,
   * helping to identify the stage of the form.
   */
  label: string
  /**
   * This property receives the component responsible for the step. The code
   * snippet in which it forms part of the form.
   */
  component: JSX.Element
  /**
   * This property, which receives a list of field names that make up part of
   * each step of the form, is used to validate the fields for each step.
   */
  validateFields: readonly string[]
}

type StepFormProps<T> = {
  /**
   * Function to get all form values.
   * Compatible with react-hook-form's getValues, Formik's values, or custom implementations.
   */
  getValues: () => any
  /**
   * Function to trigger field validation.
   * Compatible with react-hook-form's trigger, Formik's validateForm, or custom implementations.
   */
  trigger: (fields?: any) => Promise<boolean>
  /**
   * Function to set field errors.
   * Compatible with react-hook-form's setError, Formik's setFieldError, or custom implementations.
   */
  setError?: ((...args: any[]) => void) | ((...args: never[]) => void)
  /**
   * Object containing field errors.
   * Compatible with react-hook-form's formState.errors, Formik's errors, or custom implementations.
   */
  errors: Record<string, unknown>
  /**
   * Function to handle form submission with validation.
   * Compatible with react-hook-form's handleSubmit, Formik's handleSubmit, or custom implementations.
   */
  handleSubmit: (
    onValid: (data: any) => void,
    onInvalid?: any
  ) => (event?: React.BaseSyntheticEvent) => void | Promise<void>
  /**
   * This property is used to receive the list of steps in the form.
   */
  steppersData?: StepperDataProps[]
  /**
   * This method is used for the submission of the form.
   */
  onSubmit?: (formData: T) => void
  /**
   * This method is used to cancel the form.
   */
  onCancel?: () => void
  /**
   * This property is used to disable the `Next` button.
   */
  disabledNext?: boolean
  /**
   * This property is used to disable the `confirmation` button.
   */
  disabledConfirm?: boolean
  /**
   * This property is used to disable the `Cancel` button.
   */
  disabledCancel?: boolean
  /**
   * This property is used to hide the Cancel button
   */
  hiddenCancelButton?: boolean
  /**
   * This property informs the component that the form has been submitted,
   * and blocks the buttons to prevent any user action during the process.
   */
  submitting?: boolean
  /**
   * This property receives the error object returned by the Devopness SDK.
   */
  error?: StepperErrorResponseData | null
  /**
   * This property receives the success object returned by the Devopness SDK.
   */
  success?: unknown
  /**
   * This property is an external validation method, which can be used together
   * with the `validateFields` property that is informed within each step of the
   * form, its purpose is to assist the validation of dynamic inputs for each step,
   * which have some type of specific validation .
   */
  externalStepValidation?: (step: number) => boolean
  /**
   * This property informs the component that the form will not be issued,
   * until something is resolved. Its behavior shows the user a button
   * disabled with a charging effect.
   */
  waitingMode?: boolean

  confirmButton?: {
    backgroundColor?: string
    value: string
    borderColor?: string
  }
  forwardButton?: {
    backgroundColor: string
    value: string
    borderColor: string
  }
  updateCurrentStep?: (step: number) => void

  /**
   * This property sets the step displayed when the form first mounts.
   */
  initialStep?: number

  /**
   * This property enables analytics reporting through `onTrackEvent`
   * for buttons and form events: prev, next, submit and error.
   * @default true
   */
  trackEvents?: boolean

  /**
   * Called for every tracked stepper event when `trackEvents` is enabled.
   * Consumers wire this to their own analytics implementation.
   */
  onTrackEvent?: (event: StepperTrackEvent) => void
}

const isDefined = <T,>(data: T | void | null | undefined): data is T =>
  typeof data !== 'undefined' && data !== null

/**
 * Maximum number of steps supported by the component.
 */
const MAX_STEPS = 6

/**
 * Default return value of Array.findIndex when no element is found.
 */
const ELEMENT_NOT_FOUND = -1

const StyleStepIcon = ({ active, icon }: StyleStepIconProps): JSX.Element => (
  <StepIconRoot $active={active}>{icon}</StepIconRoot>
)

/**
 * Stepper component styled Form Action Button (e.g Confirm, Cancel, ...)
 *
 * @deprecated use Stepper instead of html form
 */
const FormActionButton = (props: ButtonProps) => (
  <WrapperButton>
    <Button
      {...props}
      style={{
        borderWidth: '1px',
      }}
    />
  </WrapperButton>
)

/**
 * StepForm Component
 *
 * Renders a multi step form, handling per step field validation,
 * navigation buttons and API error reporting.
 *
 * @example
 * ```tsx
 * <StepForm
 *   useFormMethods={useFormMethods}
 *   steppersData={[
 *     { label: 'Step 1', component: <FirstStep />, validateFields: ['name'] },
 *     { label: 'Step 2', component: <SecondStep />, validateFields: ['email'] },
 *   ]}
 *   onSubmit={handleSubmit}
 * />
 * ```
 */
const StepForm = <T,>({
  steppersData = [],
  onSubmit,
  onCancel = () => {},
  disabledNext = false,
  disabledConfirm = false,
  disabledCancel = false,
  hiddenCancelButton,
  submitting = false,
  getValues,
  trigger,
  setError,
  errors,
  handleSubmit,
  error = null,
  success = null,
  externalStepValidation,
  waitingMode = false,
  forwardButton,
  confirmButton: confirmButtonParam,
  updateCurrentStep,
  initialStep = 0,
  trackEvents = true,
  onTrackEvent,
}: StepFormProps<T>): JSX.Element => {
  const isSingleStep = steppersData.length === 1

  const validatedInitialStep = Number.isFinite(initialStep)
    ? Math.max(0, Math.min(Math.trunc(initialStep), steppersData.length - 1))
    : 0

  const [stepCurrent, setStepCurrent] = useState<number>(validatedInitialStep)
  const [formError, setFormError] = useState<StepperErrorResponseData | null>(
    error
  )
  const [fieldList, setFieldList] = useState<string[]>([])
  const [stepWithError, setStepWithError] = useState<boolean>(false)

  const hasSomeInputError = Object.keys(errors).length > 0

  const trackEvent = (event: StepperTrackEvent) => {
    if (!trackEvents) return
    onTrackEvent?.(event)
  }

  const getCurrentStepLabel = () => {
    const currentStep = steppersData[stepCurrent]
    if (!currentStep) return `step-${stepCurrent}`

    return currentStep.label
  }

  /**
   * Maps API field errors onto the form fields, mirroring the
   * `useFormError` hook behavior.
   */
  useEffect(() => {
    if (!isDefined(error?.errors) || Array.isArray(error.errors)) return

    Object.entries(error.errors).forEach(([name, message]) => {
      const splittedName = name.split('.')
      const parsedName = splittedName[splittedName.length - 1]

      if (fieldList.includes(parsedName)) {
        setError?.(
          parsedName as never,
          {
            type: 'api',
            message: message[0],
          } as never
        )
      }
    })
  }, [error, fieldList, setError])

  // Reset to valid step if steppersData changes and current step becomes invalid
  useEffect(() => {
    if (stepCurrent >= steppersData.length) {
      // If there are steps available, go to the last one
      if (steppersData.length > 0) {
        setStepCurrent(steppersData.length - 1)
      } else {
        // If steps array is empty, reset to 0 to prevent infinite increment
        setStepCurrent(0)
      }
    }
  }, [steppersData.length, stepCurrent])

  useEffect(() => {
    trackEvent({
      name: 'Show Step',
      stepName: getCurrentStepLabel(),
    })
    updateCurrentStep && updateCurrentStep(stepCurrent)
  }, [stepCurrent, updateCurrentStep])

  const getStepFields = () => {
    const currentStepData = steppersData[stepCurrent]
    // This check is necessary to prevent a TypeError if the step data is unexpectedly undefined.
    // This can happen if 'steppersData' changes structure (e.g., a step is removed)
    // while 'stepCurrent' still points to an old, now invalid, index.
    // Returning an empty array ensures the form validation process continues safely.
    if (!currentStepData) {
      return []
    }

    const { validateFields } = currentStepData

    const stepFields: string[] = validateFields.filter((fieldName) =>
      fieldList.includes(fieldName)
    )

    return stepFields
  }

  const getStepFieldsError = (stepFields: string[]) => {
    const listKeysError = Object.keys(errors)

    const verifyStepFieldsError = listKeysError.filter((fieldName) =>
      stepFields.includes(fieldName)
    )

    return verifyStepFieldsError
  }

  const handleActionButtonInErrorStep = () => {
    const stepFields = getStepFields()
    const stepFieldsError: string[] = getStepFieldsError(stepFields)

    setStepWithError(stepFieldsError.length > 0)
  }

  const validateFormBeforeExecuteAction = async (action: () => void) => {
    const stepFields = getStepFields()
    let isValid = await trigger(stepFields)

    if (isValid && externalStepValidation) {
      isValid = externalStepValidation(stepCurrent)
    }

    if (isValid) {
      action()
    }
  }

  const handleCancel = () => {
    trackEvent({
      name: 'Cancel Form',
      stepName: getCurrentStepLabel(),
    })
    onCancel()
  }

  const handlePrev = () => {
    trackEvent({
      name: 'Previous Step',
      stepName: getCurrentStepLabel(),
    })
    setStepCurrent((stepCurrent) => stepCurrent - 1)
  }

  const onSubmitValidate = (data: T) => {
    const submit = () => {
      onSubmit?.(data)
      trackEvent({ name: 'Form Submitted' })
    }
    validateFormBeforeExecuteAction(submit)
  }

  const handleNext = () => {
    if (steppersData.length === 0) return

    trackEvent({
      name: 'Next Step',
      stepName: getCurrentStepLabel(),
    })
    const next = () => setStepCurrent((stepCurrent: number) => stepCurrent + 1)
    validateFormBeforeExecuteAction(next)
  }

  const handleDisplaySteps = (stepCurrent: number) => {
    if (steppersData[stepCurrent]) {
      return steppersData.map((step, index) => (
        <DisplayStep
          key={`step${index}`}
          disabled={index !== stepCurrent}
          data-testid={`step${index + 1}`}
        >
          {step.component}
        </DisplayStep>
      ))
    }
  }

  const handleNextAndConfirmButton = () => {
    const numberSteps = steppersData.length

    if (numberSteps === 0) return null

    const isLastStep = stepCurrent + 1 === numberSteps || numberSteps === 1
    const confirmButton = (
      <FormActionButton
        key="confirm"
        type="submit"
        disabled={stepWithError || disabledConfirm || submitting}
        loading={submitting}
        backgroundColor={
          confirmButtonParam?.backgroundColor || forwardButton?.backgroundColor
        }
        borderColor={
          confirmButtonParam?.borderColor || forwardButton?.borderColor
        }
      >
        {confirmButtonParam?.value || forwardButton?.value || 'Confirm'}
      </FormActionButton>
    )
    const waitingButton = (
      <FormActionButton
        key="waiting"
        type="button"
        disabled
        loading
      >
        Waiting
      </FormActionButton>
    )

    const waitingOrConfirmButton = waitingMode ? waitingButton : confirmButton
    const nextButton = (
      <FormActionButton
        key="next"
        type="button"
        onClick={handleNext}
        disabled={stepWithError || disabledNext}
        buttonType="Default"
        backgroundColor={forwardButton?.backgroundColor}
        borderColor={forwardButton?.borderColor}
      >
        {forwardButton?.value || 'Next'}
      </FormActionButton>
    )

    const buttonElement = isLastStep ? waitingOrConfirmButton : nextButton

    return buttonElement
  }

  const handleDisplayAlertError = (errors: StepperErrorResponseData) => {
    if (errors?.message) {
      const formattedErrors: Array<[string, string[]]> = isDefined(
        errors.errors
      )
        ? Array.isArray(errors.errors)
          ? errors.errors.reduce<Array<[string, string[]]>>(
              (accumulator, error) =>
                accumulator.concat(
                  Object.entries(error as Record<string, string>).map(
                    ([key, errorMessage]) =>
                      [key, [errorMessage]] as [string, string[]]
                  )
                ),
              []
            )
          : Object.entries(errors.errors)
        : []

      const nonFormFieldErrorsMessage = formattedErrors
        .filter(([key]) => !fieldList.includes(key))
        .map(([key, errorMessages]) => (
          <Fragment key={key}>
            {key}: {errorMessages.join(', ')}
            <br />
          </Fragment>
        ))
      trackEvent({
        name: 'Form Error',
        stepName: getCurrentStepLabel(),
        errorMessage: errors.message || 'An error occurred!',
      })
      return (
        <Alert
          type="error"
          alertDescription={
            <>
              {errors.message}
              {isDefined(nonFormFieldErrorsMessage) ? (
                <>
                  <br />
                  {nonFormFieldErrorsMessage}
                </>
              ) : (
                <></>
              )}
            </>
          }
        />
      )
    }
  }

  const handleRedirectToStepWithError = (error: StepperErrorResponseData) => {
    if (error?.errors && !Array.isArray(error.errors)) {
      for (const key in error.errors) {
        const splittedName = key.split('.')
        const parsedName = splittedName[splittedName.length - 1] as keyof T &
          string

        if (fieldList.includes(parsedName)) {
          const index = steppersData.findIndex((step) =>
            step.validateFields.includes(parsedName)
          )
          if (index > ELEMENT_NOT_FOUND) {
            setStepCurrent(index)
          }
          break
        }
      }
    }
  }

  useEffect(() => {
    handleActionButtonInErrorStep()
  }, [errors, stepCurrent])

  useEffect(() => {
    if (error !== null) {
      handleRedirectToStepWithError(error)
      setFormError(error)
    } else if (success !== null) {
      setFormError(null)
    } else if (!hasSomeInputError) {
      setFormError(null)
    }
  }, [error, success, hasSomeInputError, fieldList])

  useEffect(() => {
    if (steppersData.length > MAX_STEPS) {
      throw new Error(`This component has a limit of ${MAX_STEPS} steps.`)
    } else {
      const fieldList: string[] = Object.keys(
        getValues() as Record<string, unknown>
      )
      setFieldList(fieldList)
    }
  }, [steppersData])

  return (
    <StepperContainer>
      <form onSubmit={handleSubmit(onSubmitValidate)}>
        {!isSingleStep && (
          <Stepper
            activeStep={stepCurrent}
            alternativeLabel
            connector={null}
          >
            {steppersData.map((item, index) => (
              <StepContainer
                key={`step${index}`}
                $active={index === stepCurrent}
              >
                <StepLabel
                  className="translate"
                  slots={{ stepIcon: StyleStepIcon }}
                >
                  <StepLabelTypography
                    $active={index === stepCurrent}
                    variant="body1"
                  >
                    {item.label}
                  </StepLabelTypography>
                </StepLabel>
              </StepContainer>
            ))}
          </Stepper>
        )}

        {/* general error alert area */}
        {formError !== null && handleDisplayAlertError(formError)}

        {/* Steps body area */}
        {handleDisplaySteps(stepCurrent)}

        {/* Button area */}
        <GridButtons>
          <NextAndConfirmButton>
            {handleNextAndConfirmButton()}
          </NextAndConfirmButton>
          <CancelButton hiddenButton={hiddenCancelButton}>
            <FormActionButton
              key="cancel"
              type="button"
              buttonType="outlinedSecondary"
              onClick={handleCancel}
              disabled={disabledCancel || submitting}
            >
              Cancel
            </FormActionButton>
          </CancelButton>
          <PreviousButtons>
            {stepCurrent > 0 && steppersData.length > 0 && (
              <FormActionButton
                key="back"
                type="button"
                buttonType="outlinedAuxiliary"
                icon="arrowLeft"
                onClick={handlePrev}
                disabled={submitting}
              >
                Previous
              </FormActionButton>
            )}
          </PreviousButtons>
        </GridButtons>
      </form>
    </StepperContainer>
  )
}

export { StepForm, FormActionButton }
export type { StepFormProps, StepperDataProps }
