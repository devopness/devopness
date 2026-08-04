import { styled } from 'styled-components'

import { getColor, getFont } from 'src/colors'

const AddCardContainer = styled.button<{ $disabled?: boolean }>`
  height: 80px;
  width: 100%;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  background-color: transparent;
  border: none;
  padding: 0;
  box-sizing: border-box;
  text-align: center;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`

const AddCardInner = styled.div<{ $disabled?: boolean }>`
  height: 100%;
  border: 1px dashed #d1d5db;
  background-color: #f9fafb;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-sizing: border-box;
  transition: all 0.2s ease;

  ${({ $disabled }) =>
    !$disabled &&
    `
    &:hover {
      border-color: #94a3b8;
      background-color: #f3f4f6;
    }

    &:focus-visible {
      outline: 2px solid ${getColor('purple.400')};
      outline-offset: -2px;
      border-color: ${getColor('purple.400')};
    }
  `}
`

const PlusIconWrapper = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1.5px solid #d1d5db;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${getFont('roboto')};
  font-size: 20px;
  font-weight: 500;
  color: rgb(198, 175, 236);
  transition: all 0.2s ease;

  ${AddCardContainer}:hover & {
    border-color: #94a3b8;
    color: #64748b;
  }
`

const AddCardLabel = styled.span`
  font-family: ${getFont('roboto')};
  font-size: 15px;
  font-weight: 500;
  color: #6b7280;
  transition: color 0.2s ease;
  text-transform: capitalize;

  ${AddCardContainer}:hover & {
    color: #64748b;
  }
`

export { AddCardContainer, AddCardInner, AddCardLabel, PlusIconWrapper }
