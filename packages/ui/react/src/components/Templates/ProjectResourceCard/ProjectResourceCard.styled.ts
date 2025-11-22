import { styled } from 'styled-components'

import { getColor } from 'src/colors'

const CardWrapper = styled.div`
  background-color: ${getColor('white')};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
  width: 100%;
  min-width: 400px;
  height: 350px;
`

const CardHeader = styled.div`
  background-color: ${getColor('white')};
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${getColor('gray.200')};
`

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const IconContainer = styled.div<{ $backgroundColor: string }>`
  width: 32px;
  height: 32px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${getColor('gray.800')};
`

const CountBadge = styled.div`
  background-color: ${getColor('gray.500')};
  color: ${getColor('white')};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 8px;
`

const AddButton = styled.button`
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

const CardBody = styled.div`
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const ResourceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
  overflow-y: auto;
  max-height: 180px;
  min-height: 60px;

  &:hover {
    background-color: ${getColor('gray.200')};
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${getColor('gray.200')};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${getColor('gray.400')};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${getColor('gray.500')};
  }
`
const ResourceListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  gap: 8px;
`

const ResourceItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

const ResourceName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${getColor('gray.800')};
`

const ResourceSubText = styled.div`
  font-size: 12px;
  color: ${getColor('gray.600')};
`

const ResourceTag = styled.div<{ $backgroundColor: string; $textColor: string }>`
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  color: ${({ $textColor }) => $textColor};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  align-self: flex-start;
  margin-top: 4px;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px 0;
`

const EmptyStateIcon = styled.div`
  margin-bottom: 16px;
`

const EmptyStateTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${getColor('gray.800')};
  margin-bottom: 8px;
`

const EmptyStateDescription = styled.div`
  font-size: 12px;
  color: ${getColor('gray.600')};
  line-height: 1.4;
  max-width: 200px;
`

const CardFooter = styled.div`
  padding: 16px;
  border-top: 1px solid ${getColor('gray.200')};
  text-align: center;
`

const FooterButton = styled.button`
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

export {
  CardWrapper,
  CardHeader,
  TitleContainer,
  IconContainer,
  Title,
  CountBadge,
  AddButton,
  CardBody,
  ResourceList,
  ResourceListContainer,
  ResourceItem,
  ResourceName,
  ResourceSubText,
  ResourceTag,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  CardFooter,
  FooterButton
}
