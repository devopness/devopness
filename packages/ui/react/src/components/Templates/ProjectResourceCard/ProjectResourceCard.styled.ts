import styled from 'styled-components'

import { getColor } from 'src/colors'

export const CardWrapper = styled.div`
  background-color: ${getColor('white')};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
  width: 100%;
  min-width: 400px;
`

export const CardHeader = styled.div`
  background-color: ${getColor('white')};
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${getColor('gray.200')};
`

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const IconContainer = styled.div<{ $backgroundColor: string }>`
  width: 32px;
  height: 32px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${getColor('gray.800')};
`

export const CountBadge = styled.div`
  background-color: ${getColor('gray.500')};
  color: ${getColor('white')};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 8px;
`

export const AddButton = styled.button`
  background-color: #8b5cf6;
  color: ${getColor('white')};
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #7c3aed;
  }
`

export const CardBody = styled.div`
  padding: 16px;
  flex-grow: 1;
`

export const ResourceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background-color: ${getColor('gray.200')};
  }
`
export const ResourceListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  gap: 8px;
`

export const ResourceItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

export const ResourceName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${getColor('gray.800')};
`

export const ResourceSubText = styled.div`
  font-size: 12px;
  color: ${getColor('gray.600')};
`

export const ResourceTag = styled.div<{ $backgroundColor: string; $textColor: string }>`
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  color: ${({ $textColor }) => $textColor};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  align-self: flex-start;
  margin-top: 4px;
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px 0;
`

export const EmptyStateIcon = styled.div`
  margin-bottom: 16px;
`

export const EmptyStateTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${getColor('gray.800')};
  margin-bottom: 8px;
`

export const EmptyStateDescription = styled.div`
  font-size: 12px;
  color: ${getColor('gray.600')};
  line-height: 1.4;
  max-width: 200px;
`

export const CardFooter = styled.div`
  padding: 16px;
  border-top: 1px solid ${getColor('gray.200')};
  text-align: center;
`

export const FooterButton = styled.button`
  width: 100%;
  background-color: ${getColor('white')};
  color: #8b5cf6;
  border: 1px solid #8b5cf6;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #8b5cf6;
    color: ${getColor('white')};
  }
`