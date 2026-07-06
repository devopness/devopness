import { styled } from 'styled-components'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

const CardContainer = styled.div`
  height: 160px;
  min-height: 160px;
  max-height: 160px;
  width: 100%;
  min-width: 0;
  cursor: pointer;
  border-radius: 12px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  &:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
  }
`

const CardInner = styled.div`
  height: 100%;
  min-height: 0;
  border: 2px solid ${getColor('gray.300')};
  background: ${getColor('white')};
  border-radius: 12px;
  display: grid;
  grid-template-columns: 1fr;
  align-content: center;
  justify-items: start;
  padding: 1.25rem;
  gap: 0.5rem;
  overflow: hidden;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:hover {
    border-color: #94a3b8;
    background-color: ${getColor('blue.50')};
    transform: translateY(-4px);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  min-width: 0;
`

const Avatar = styled.div<{ $backgroundColor?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${({ $backgroundColor }) => $backgroundColor ?? '#6366f1'};
  color: ${getColor('white')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${getFont('roboto')};
  font-size: 1.125rem;
  font-weight: 600;
  flex-shrink: 0;
`

const Name = styled.span`
  font-family: ${getFont('roboto')};
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex: 1;
  min-width: 0;
`

const MetaGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
  min-width: 0;
`

const Meta = styled.span`
  font-family: ${getFont('roboto')};
  font-size: 0.875rem;
  font-weight: 400;
  color: #6b7280;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`

export { Avatar, CardContainer, CardInner, Header, Meta, MetaGroup, Name }
