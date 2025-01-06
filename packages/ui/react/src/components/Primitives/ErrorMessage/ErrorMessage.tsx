import { StyledErrorMessage } from './ErrorMessage.styled'

/** Error with a type field that can be 'required' or any other string except 'required' */
type ErrorWithType = { type: 'required' | Omit<string, 'required'> }

/** Error containing a direct message string */
type ErrorWithMessage = { message: string }

/** API error response containing nested message */
type APIError = { errors: { message: string } }

type ErrorMessageProps = {
  /** Renders the following error formats, by first match:
   *
   * 1. { type: 'required' }
   *
   * 2. { message: string  }
   *
   * 3. { errors: { message: string } } [1]
   *
   * 4. Record<string, any> [2]
   *
   * [1] API Error response
   * [2] Custom error objects
   */
  error?:
    | ErrorWithType
    | ErrorWithMessage
    | APIError
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | Record<string, any>
    | null
  /** Additional CSS classes to apply to the error message container */
  className?: string
}

/**
 * Extracts an error message from various error object formats.
 *
 * @param error - Error object that can match one of these formats:
 *                1. { type: 'required' }
 *                2. { message: string }
 *                3. { errors: { message: string } } - API Error response
 * @returns The extracted error message string or null if no valid message is found
 */
function handleErrorMessage(error: ErrorMessageProps['error']) {
  if (!error) return null

  if ('type' in error) {
    if (error.type === 'required') {
      return 'This field is required!'
    }
  }

  if ('message' in error) {
    // Handle potential non-string messages from custom error types
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return error.message
  }

  if ('errors' in error) {
    // Handle nested message access from custom error types
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return error.errors.message
  }

  return null
}

/** Test ID for the error message component used in testing */
const ERROR_MESSAGE_TEST_ID = 'error-message'

/**
 * Component that displays error messages in a standardized format.
 * Handles multiple error object formats and renders them consistently.
 *
 * @param props - Component props
 * @param props.error - Error object in various possible formats
 * @param props.className - Additional CSS classes to apply to the container
 */
const ErrorMessage = ({ error, className }: ErrorMessageProps) => {
  const errorMessage = handleErrorMessage(error)
  const classNames = [
    'translate',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <StyledErrorMessage
      className={classNames}
      data-testid={ERROR_MESSAGE_TEST_ID}
    >
      {errorMessage}
    </StyledErrorMessage>
  )
}

export type { ErrorMessageProps }
export { ErrorMessage }
