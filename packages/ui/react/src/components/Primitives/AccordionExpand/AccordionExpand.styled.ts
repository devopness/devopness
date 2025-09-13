import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import { css, styled } from 'styled-components'

import { getColor } from 'src/colors'
import type { Color } from 'src/colors'
import { getFont } from 'src/fonts'

type StyledProps = {
  bgColor?: string
  color?: Color
}

const colorIcon = css`
  > svg {
    color: #fff;
    fill: #fff;
  }
`

const Text = styled.span<StyledProps>`
  grid-area: text;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  font-size: 14px;
  font-family: ${getFont('roboto')};
  color: ${({ color }) => getColor(color ?? 'blue.800')};
`

const ContentBadge = styled.span<StyledProps>`
  grid-area: badge;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.bgColor};
  border-radius: 5px;
  text-transform: uppercase;
  font-family: ${getFont('roboto')};
  font-weight: bold;
  font-size: 14px;
  color: ${getColor('blue.800')};

  ${(props) => props.bgColor && colorIcon}
`

const StyledAccordion = styled(MuiAccordion)`
  width: 100%;
  box-shadow: none !important;
  border: 1px solid #909090;
  border-radius: 20px !important;

  &.Mui-disabled {
    opacity: 0.5;
  }
`

const StyledAccordionSummary = styled(MuiAccordionSummary)`
  width: 100%;
  padding: 0 4px !important;
  margin: 0 !important;
  min-height: unset !important;

  & .MuiAccordionSummary-content {
    margin: 0 !important;
    flex-grow: 0 !important;
    flex-shrink: 0 !important;
    flex-basis: auto !important;
    width: auto !important;
  }

  &.Mui-expanded {
    min-height: unset !important;
  }

  & > span {
    display: inline-flex !important;
    margin: 0 !important;
    padding: 0 !important;
    width: auto !important;
    flex: 0 0 auto !important;
  }

  & .MuiAccordionSummary-expandIconWrapper {
    color: ${getColor('blue.800')};

    &.Mui-expanded {
      transform: rotate(180deg);
    }
  }
`

const StyledAccordionDetails = styled(MuiAccordionDetails)`
  padding-top: 8px !important;
  padding-bottom: 8px !important;
  padding-left: 28px !important;
  margin: 0 !important;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid #ddd;
`

export {
  Text,
  ContentBadge,
  StyledAccordion,
  StyledAccordionSummary,
  StyledAccordionDetails,
}
