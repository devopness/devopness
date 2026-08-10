import { styled } from 'styled-components'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

type Density = 'default' | 'compact'

const getCardPadding = (density: Density) =>
  density === 'compact' ? '0.875rem' : '1rem'

const getCardGap = (density: Density) =>
  density === 'compact' ? '0.5rem' : '0.75rem'

const getGridGap = (density: Density) =>
  density === 'compact' ? '0.75rem' : '1rem'

const getGridMinWidth = (density: Density) =>
  density === 'compact' ? '14rem' : '10rem'

const getIconSize = (density: Density) =>
  density === 'compact' ? '2.5rem' : '2.75rem'

const StyledCardsRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  font-family: ${getFont('roboto')};
`

const StyledCardsLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const StyledCardsGrid = styled.div<{ $density: Density; $error?: boolean }>`
  display: grid;
  gap: ${({ $density }) => getGridGap($density)};
  grid-template-columns: repeat(
    auto-fit,
    minmax(${({ $density }) => getGridMinWidth($density)}, 1fr)
  );
  width: 100%;
  border: ${({ $error }) =>
    $error ? `1px solid ${getColor('red.500')}` : '1px solid transparent'};
  border-radius: 1rem;
`

const StyledCardsSection = styled.section<{
  $density: Density
  $error?: boolean
}>`
  display: flex;
  flex-direction: column;
  gap: ${({ $density }) => getGridGap($density)};
  padding: ${({ $density }) => ($density === 'compact' ? '0.875rem' : '1rem')};
  border: ${({ $error }) =>
    $error
      ? `1px solid ${getColor('red.500')}`
      : `1px solid ${getColor('slate.300')}`};
  border-radius: 1rem;
  background:
    linear-gradient(180deg, rgba(248, 250, 252, 0.92), rgba(255, 255, 255, 1)),
    #fff;
  width: 100%;
`

const StyledCardsSectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const StyledCardsSectionTitle = styled.span`
  font: inherit;
  font-size: 1rem;
  line-height: 1.25;
  font-weight: 700;
  color: ${getColor('blue.950')};
`

const StyledCardsSectionDescription = styled.span`
  font: inherit;
  font-size: 0.875rem;
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
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  min-width: 0;
`

const StyledCardLead = styled.div`
  display: flex;
  align-items: flex-start;
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
  font: inherit;
  font-size: 0.9375rem;
  line-height: 1.25;
  font-weight: 700;
  color: ${getColor('blue.950')};
  min-width: 0;
`

const StyledCardDescription = styled.span`
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.45;
  color: ${getColor('slate.600')};
`

const StyledCardMeta = styled.span`
  font: inherit;
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
