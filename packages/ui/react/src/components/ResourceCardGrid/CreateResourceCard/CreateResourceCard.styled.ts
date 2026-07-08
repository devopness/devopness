import { getFont } from 'src/fonts'
import styled from 'styled-components'

const CardContainer = styled.div`
  height: 160px;
  min-height: 160px;
  max-height: 160px;
  width: 100%;
  min-width: 0;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`

const CardInner = styled.div`
  height: 100%;
  min-height: 0;
  border: 2px dashed #d1d5db;
  background-color: #f9fafb;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  overflow: hidden;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:hover {
    border-color: #94a3b8;
    background-color: #f3f4f6;
    transform: translateY(-4px);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  &:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
    border-color: #6366f1;
  }
`

const CreateIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 2px solid #d1d5db;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${getFont('roboto')};
  font-size: 24px;
  font-weight: 400;
  color: rgb(198, 175, 236);

  transition:
    border-color 0.2s ease,
    color 0.2s ease;

  ${CardInner}:hover & {
    border-color: #94a3b8;
    color: #64748b;
  }
`

const Label = styled.span`
  font-family: ${getFont('roboto')};
  font-size: 0.875rem;
  font-weight: 400;
  color: #6b7280;
  transition: color 0.2s ease;

  ${CardInner}:hover & {
    color: #64748b;
  }
`

export { CardContainer, CardInner, CreateIconWrapper, Label }
