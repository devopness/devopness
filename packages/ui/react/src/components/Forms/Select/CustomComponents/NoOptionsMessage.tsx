import { Wrapper, NoOption as NoOptionDiv } from './styled'

type NoOptionsMessageProps = {
  selectProps: {
    inputValue?: string
    noOptionsMessage?:
      | string
      | ((obj: { inputValue: string }) => React.ReactNode)
  }
}

const NoOptionsMessage = ({ selectProps }: NoOptionsMessageProps) => {
  const defaultErrorMessage = 'No options...'
  const inputValue = selectProps.inputValue ?? ''
  const noOptionsMessage = selectProps.noOptionsMessage

  let errorMessage: React.ReactNode = defaultErrorMessage

  if (typeof noOptionsMessage === 'function') {
    errorMessage = noOptionsMessage({ inputValue })
  } else if (typeof noOptionsMessage === 'string') {
    errorMessage = noOptionsMessage
  } else if (inputValue) {
    errorMessage = `No matching items for "${inputValue}"...`
  }

  return (
    <Wrapper>
      <NoOptionDiv>{errorMessage}</NoOptionDiv>
    </Wrapper>
  )
}

export { NoOptionsMessage }
