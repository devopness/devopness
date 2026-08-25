import Step from '@mui/material/Step'
import StepLabelCore from '@mui/material/StepLabel'
import StepperCore from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import { styled } from 'styled-components'

import { getColor } from 'src/colors'

type DisplayStepProps = {
  disabled?: boolean
}

type CancelButtonProps = {
  hiddenButton?: boolean
}

type ActiveProps = {
  $active?: boolean
}

const WrapperButton = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  width: 100%;
  height: 126px;
`

const GridButtons = styled.div`
  display: grid;
  grid-template-columns: auto 1fr 1fr 1fr auto auto;
  grid-column-gap: 30px;

  @media (max-width: 768px) {
    grid-column-gap: 16px;
  }
`

const PreviousButtons = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  grid-column: 1 / 2;
  grid-row: 1 / 2;
`

const CancelButton = styled.div<CancelButtonProps>`
  grid-column: 5 / 6;
  grid-row: 1 / 2;
  ${({ hiddenButton }) => hiddenButton && 'display: none'};
`

const NextAndConfirmButton = styled.div`
  grid-column: 6 / 7;
  grid-row: 1 / 2;
`

const Stepper = styled(StepperCore)`
  &.MuiStepper-root {
    border: 0;
    border-bottom: 1px solid ${getColor('slate.300')};
    color: #fff;
    background-color: #fff;
    min-height: 0;
    padding: 0;
    margin: 0;
  }

  &.MuiStepper-horizontal {
    align-items: flex-start;
  }
`

const StepLabel = styled(StepLabelCore)`
  .MuiStepLabel-label.MuiStepLabel-alternativeLabel {
    margin-top: 5px;
  }
`

const DisplayStep = styled.div<DisplayStepProps>`
  display: ${({ disabled }: DisplayStepProps) => disabled && 'none'};
  margin: 0;
  padding: 0;
`

const StepperContainer = styled.div`
  width: 100%;
`

const StepLabelTypography = styled(Typography)<ActiveProps>`
  &.MuiTypography-root {
    line-height: 1;
    letter-spacing: 0;
    font-weight: normal;
    font-size: 11px;
    color: ${({ $active }) =>
      $active ? getColor('purple.800') : getColor('slate.400')};
  }
`

const StepIconRoot = styled.div<ActiveProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: Roboto;
  font-size: 11px;
  line-height: 1;
  width: 12px;
  height: 12px;
  margin: 0;
  padding: 0;
  color: ${({ $active }) => ($active ? '#fff' : getColor('slate.400'))};
  background-color: ${({ $active }) =>
    $active ? getColor('purple.800') : getColor('indigo.100')};
  border: 1px solid
    ${({ $active }) =>
      $active ? getColor('purple.800') : getColor('slate.300')};
  border-radius: 50%;
  z-index: 1;
  font-weight: normal;
`

const StepContainer = styled(Step)<ActiveProps>`
  &.MuiStep-root {
    border: 0;
    border-top: ${({ $active }) =>
      $active ? `1px solid ${getColor('purple.800')}` : '0'};
    font-size: 11px;
    margin: 0;
    padding: 6px 15px 8px 15px;
  }
`

export {
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
}
