import { BsQuestionCircleFill } from 'react-icons/bs'

import { styled } from 'styled-components'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

const LabelElement = styled.label`
  color: ${getColor('blue.950')};
  font-family: ${getFont('roboto')};
  font-size: 13px;

  & > strong {
    font-weight: bold;
  }
`

const ContentFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  height: 42px;
  padding-bottom: 10px;
  gap: 10px;
`

const QuestionIcon = styled(BsQuestionCircleFill)`
  fill: ${getColor('slate.400')};
  width: 13px;
  height: 13px;
  transition: fill 0.2s ease-out;
  cursor: pointer;

  &:hover {
    fill: ${getColor('blue.800')};
  }
`

export { LabelElement, ContentFlex, QuestionIcon }
