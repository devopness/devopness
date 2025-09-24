import { styled } from 'styled-components'

import { getColor } from 'src/colors'

const StyledLabel = styled.label`
  background-color: ${getColor('white')};
  border-radius: 0.5rem;
  box-sizing: border-box;
  padding: 1.25rem;
  max-width: 10rem;
  cursor: pointer;

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
export { StyledLabel }
