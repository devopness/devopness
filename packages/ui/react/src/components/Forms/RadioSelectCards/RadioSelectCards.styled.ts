import { styled } from 'styled-components'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

type Density = 'default' | 'compact'

const StyledLabel = styled.label`
  background-color: ${getColor('white')};
  border-radius: 0.5rem;
  box-sizing: border-box;
  padding: 1.25rem;
  max-width: 10rem;
  cursor: pointer;

  @media (max-width: 600px) {
    max-width: none;
    padding: 0.5rem;
  }

  &:has(input[type='radio']:not(:checked)) {
    border: 1px solid ${getColor('slate.300')};
  }

  &:has(input[type='radio']:checked) {
    border: 1px solid ${getColor('purple.800')};
  }

  &:has(input[type='radio']:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  & input[type='radio'] {
    position: relative;
    margin: 0 1rem 0 0;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
    }

    &:before {
      transition: transform 0.4s cubic-bezier(0.45, 1.8, 0.5, 0.75);
      transform: scale(0, 0);

      content: '';
      position: absolute;
      top: 0;
      left: 0.125rem;
      z-index: 1;
      width: 0.75rem;
      height: 0.75rem;
      background: ${getColor('purple.800')};
      border-radius: 50%;
    }

    &:checked {
      &:before {
        transform: scale(1, 1);
      }
    }

    &:after {
      content: '';
      position: absolute;
      top: -0.25rem;
      left: -0.125rem;
      width: 1rem;
      height: 1rem;
      background: #fff;
      border: 2px solid #f2f2f2;
      border-radius: 50%;
    }
  }
`

const RadioGrid = styled.div<{ $hasError?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 3rem 2.5rem;
  box-sizing: border-box;
  border: ${({ $hasError }) =>
    $hasError ? `1px solid ${getColor('red.500')}` : 'none'};

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
`

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;

  @media (max-width: 600px) {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
  }
`

const IconWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;

  @media (max-width: 600px) {
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-items: center;
    gap: 0;
    flex: 0 0 auto;

    svg,
    img {
      width: 26px !important;
      height: 26px !important;
    }
  }
`

const LabelText = styled.span`
  color: ${getColor('blue.950')};
  font-family: ${getFont('roboto')};
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.01625rem;

  @media (max-width: 600px) {
    display: -webkit-box;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-word;
    white-space: normal;
    font-size: 0.75rem;
  }
`

const getCardPadding = (density: Density) =>
  density === 'compact' ? '0.875rem' : '1rem'

const getCardGap = (density: Density) =>
  density === 'compact' ? '0.5rem' : '0.75rem'

const getGridGap = (density: Density) =>
  density === 'compact' ? '0.5rem' : '0.75rem'

const getGridMinWidth = (density: Density) =>
  density === 'compact' ? '12.5rem' : '12.5rem'

const getIconSize = (density: Density) =>
  density === 'compact' ? '2.5rem' : '2.75rem'

const StyledCardsRoot = styled.div<{ $error?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  font-family: ${getFont('roboto')};
  border: ${({ $error }) =>
    $error ? `1px solid ${getColor('red.500')}` : '1px solid transparent'};
  border-radius: 1rem;
`

const StyledCardsLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const StyledCardsGrid = styled.div<{ $density: Density }>`
  display: grid;
  gap: ${({ $density }) => getGridGap($density)};
  grid-template-columns: repeat(
    auto-fit,
    minmax(${({ $density }) => getGridMinWidth($density)}, 1fr)
  );
  width: 100%;
`

const StyledCardsSection = styled.section<{
  $density: Density
}>`
  display: flex;
  flex-direction: column;
  gap: ${({ $density }) => getGridGap($density)};
  width: 100%;
`

const StyledCardsSectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`

const StyledCardsSectionTitle = styled.span`
  font-family: ${getFont('roboto')};
  font-size: 0.875rem;
  line-height: 1.25;
  font-weight: 700;
  color: ${getColor('slate.600')};
`

const StyledCardsSectionDescription = styled.span`
  font-family: ${getFont('roboto')};
  font-size: 0.8125rem;
  line-height: 1.45;
  color: ${getColor('slate.400')};
`

const StyledCardLabel = styled.label<{
  $density: Density
}>`
  appearance: none;
  display: flex;
  flex-direction: column;
  gap: ${({ $density }) => getCardGap($density)};
  position: relative;
  width: 100%;
  min-width: 0;
  padding: ${({ $density }) => getCardPadding($density)};
  border-radius: 1rem;
  border: 1px solid ${getColor('slate.300')};
  background: #fff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  box-sizing: border-box;
  cursor: pointer;
  color: ${getColor('blue.950')};
  font: inherit;
  text-align: left;
  transition:
    transform 120ms ease,
    border-color 120ms ease,
    box-shadow 120ms ease,
    background 120ms ease;

  &:has(input[type='radio']:checked) {
    border-color: ${getColor('purple.800')};
    background: linear-gradient(
      180deg,
      rgba(245, 243, 255, 0.95),
      rgba(255, 255, 255, 1)
    );
    box-shadow: 0 10px 24px rgba(124, 58, 237, 0.08);
  }

  &:hover:not(:has(input[type='radio']:disabled)) {
    transform: translateY(-1px);
    border-color: ${getColor('purple.800')};
  }

  &:has(input[type='radio']:disabled) {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

const StyledCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-width: 0;
`

const StyledCardLead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;
`

const StyledCardIcon = styled.div<{
  $density: Density
  $selected?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $density }) => getIconSize($density)};
  height: ${({ $density }) => getIconSize($density)};
  border-radius: 0.875rem;
  flex-shrink: 0;
  background: ${({ $selected }) =>
    $selected
      ? 'linear-gradient(180deg, rgba(124, 58, 237, 0.14), rgba(124, 58, 237, 0.06))'
      : 'linear-gradient(180deg, rgba(241, 245, 249, 1), rgba(255, 255, 255, 1))'};
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.18);
`

const StyledCardText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`

const StyledCardTitle = styled.span`
  font-family: ${getFont('roboto')};
  font-size: 1rem;
  line-height: 1.25;
  font-weight: 700;
  color: ${getColor('blue.950')};
  min-width: 0;
`

const StyledCardDescription = styled.span`
  font-family: ${getFont('roboto')};
  font-size: 0.875rem;
  line-height: 1.45;
  color: ${getColor('slate.600')};
`

const StyledCardMeta = styled.span`
  font-family: ${getFont('roboto')};
  font-size: 0.75rem;
  line-height: 1.4;
  font-weight: 600;
  color: ${getColor('purple.800')};
`

const StyledCardRadio = styled.input<{ $showIndicator: boolean }>`
  ${({ $showIndicator }) =>
    $showIndicator
      ? `
    margin-top: 0.25rem;
    flex-shrink: 0;
    cursor: pointer;
  `
      : `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `}

  &:disabled {
    cursor: not-allowed;
  }
`

export {
  CardContent,
  IconWrapper,
  LabelText,
  RadioGrid,
  StyledLabel,
  StyledCardDescription,
  StyledCardLabel,
  StyledCardHeader,
  StyledCardIcon,
  StyledCardLead,
  StyledCardMeta,
  StyledCardRadio,
  StyledCardText,
  StyledCardTitle,
  StyledCardsGrid,
  StyledCardsLoader,
  StyledCardsRoot,
  StyledCardsSection,
  StyledCardsSectionDescription,
  StyledCardsSectionHeader,
  StyledCardsSectionTitle,
}
export type { Density }
