import { styled } from 'styled-components'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

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

export { CardContent, IconWrapper, LabelText, RadioGrid, StyledLabel }
