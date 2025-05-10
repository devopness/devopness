import { styled } from 'styled-components'

import type { AlertProps } from './Alert'
import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

type StyledProps = {
  type: string
}

const handleIconColor = (typeAlert: string) => {
  switch (typeAlert) {
    case 'error':
      return getColor('red.500')
    case 'warning':
      return getColor('amber.400')
    case 'success':
      return getColor('green.600')
  }
}

const handleColor = (typeAlert: string) => {
  switch (typeAlert) {
    case 'error':
      return getColor('red.300')
    case 'warning':
      return getColor('amber.200')
    case 'success':
      return getColor('green.300')
  }
}

const handleBackgroundColor = (typeAlert: string) => {
  switch (typeAlert) {
    case 'error':
      return getColor('red.200')
    case 'warning':
      return getColor('amber.100')
    case 'success':
      return getColor('green.150')
  }
}

const Wrapper = styled.div<Pick<AlertProps, 'noPadding'>>`
  display: flex;
  align-items: center;
  width: 100%;
  padding-top: ${(props) => (props.noPadding ? '' : '42px')};
  padding-bottom: ${(props) => (props.noPadding ? '' : '20px')};
`

const StyledContent = styled.div<StyledProps>`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: ${(props) => handleBackgroundColor(props.type)};
  color: ${(props) => handleColor(props.type)};
  border: 1px solid ${(props) => handleColor(props.type)};
  border-radius: 20px;
  padding: 9px 15px 8px;
`

const StyledIcon = styled.div<StyledProps>`
  height: 13px;
  width: 13px;
  padding: 0px;
  margin-right: 15px;
  color: ${(props) => handleIconColor(props.type)};
`

const StyledLabel = styled.label<{ fullWidth?: boolean }>`
  color: ${getColor('blue.950')};
  font-family: ${getFont('roboto')};
  font-size: 13px;
  letter-spacing: 0;
  line-height: 1.5;
  white-space: pre-wrap;
  ${(props) => (props.fullWidth ? 'width: 100%;' : '')}
`

const LabelContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`

export { Wrapper, StyledContent, StyledIcon, StyledLabel, LabelContentWrapper }
