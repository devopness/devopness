import { styled } from 'styled-components'

import { Link } from 'src/components/Primitives/Link'
import { getColor, getFont } from 'src/colors'

const CardsContainer = styled.div<{
  $paddingLeft?: string
  $paddingRight?: string
}>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: ${({ $paddingLeft }) =>
    $paddingLeft || 'max(16px, env(safe-area-inset-left))'};
  padding-right: ${({ $paddingRight }) =>
    $paddingRight || 'max(16px, env(safe-area-inset-right))'};
`

const CardWrapper = styled.div`
  border: 1px solid ${getColor('purple.400')};
  background-color: ${getColor('indigo.10')};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: none;
`

const CardHeader = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 48px;
  padding: 12px 16px 20px 16px;
  gap: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background-color 0.2s;
  border-bottom: 1.5px solid ${getColor('purple.300')};

  &:hover:not(:disabled) {
    background-color: ${getColor('purple.50')};
  }

  &:focus-visible {
    outline: 2px solid ${getColor('purple.400')};
    outline-offset: -2px;
  }

  &:disabled {
    cursor: default;
  }
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
`

const PrefixContainer = styled.div<{ $backgroundColor?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 1000%;
  overflow: hidden;
  flex-shrink: 0;
  background-color: ${({ $backgroundColor }) =>
    $backgroundColor || getColor('purple.100')};
  color: ${getColor('white')};
  font-family: ${getFont('roboto')};
  font-weight: 600;
  font-size: 20px;
`

const Title = styled.h3`
  margin: 0;
  font-family: ${getFont('roboto')};
  font-size: 14px;
  font-weight: 600;
  color: ${getColor('blue.950')};
  line-height: normal;
  text-align: left;
  word-break: break-word;
`

const HeaderLabel = styled.span`
  font-family: ${getFont('roboto')};
  font-size: 10px;
  color: ${getColor('gray.600')};
  line-height: normal;
  margin-bottom: 0px;
  text-transform: uppercase;
`

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  gap: 2px;
`

const ExpandIconWrapper = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${getColor('blue.800')};
  transform: rotate(${({ $isExpanded }) => ($isExpanded ? '180deg' : '0deg')});
  transition: transform 0.2s ease-in-out;
  margin-left: 8px;

  svg {
    font-size: 20px;
  }
`

const CardBodyWrapper = styled.div<{ $isExpanded: boolean }>`
  display: grid;
  grid-template-rows: ${({ $isExpanded }) => ($isExpanded ? '1fr' : '0fr')};
  transition: grid-template-rows 0.2s ease-in-out;
`

const CardBodyContent = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
`

const CardBodyInner = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const DataRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${getColor('purple.300')};

  &:last-child {
    border-bottom: none;
  }
`

const DataLabel = styled.span`
  font-family: ${getFont('roboto')};
  font-size: 14px;
  text-transform: capitalize;
  color: ${getColor('blue.950')};
  letter-spacing: 0.02em;
  flex: 0 0 37%;
  min-width: 80px;
`

const DataValue = styled.div`
  font-family: ${getFont('roboto')};
  font-size: 14px;
  font-weight: 500;
  color: ${getColor('gray.800')};
  word-break: break-word;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  text-align: right;
  min-width: 0;
`

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  margin-top: 8px;
  flex-wrap: wrap;
  width: 100%;

  & > * {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
`

const CardFooter = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 0px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
  border-top: 1px solid ${getColor('purple.300')};

  &:hover {
    opacity: 0.75;
  }

  &:focus-visible {
    outline: 2px solid ${getColor('purple.400')};
    outline-offset: -2px;
  }
`

const CardFooterLabel = styled.span`
  font-family: ${getFont('roboto')};
  font-size: 13px;
  text-transform: uppercase;
`

export {
  ActionsContainer,
  CardBodyContent,
  CardBodyInner,
  CardBodyWrapper,
  CardFooter,
  CardFooterLabel,
  CardHeader,
  CardWrapper,
  CardsContainer,
  DataLabel,
  DataRow,
  DataValue,
  ExpandIconWrapper,
  HeaderContent,
  HeaderLabel,
  InfoGroup,
  PrefixContainer,
  Title,
}
