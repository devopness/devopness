import { getColor } from '../../../colors'
import { iconLoader } from '../../../icons'
import type { Icon } from '../../../icons'

import {
  CardWrapper,
  CardHeader,
  TitleContainer,
  IconContainer,
  Title,
  CountBadge,
  AddButton,
  CardBody,
  ResourceList,
  ResourceItem as StyledResourceItem,
  ResourceName,
  ResourceSubText,
  ResourceTag,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  CardFooter,
  FooterButton,
  ResourceListContainer,
} from './ProjectResourceCard.styled'

export type ResourceItem = {
  id: string | number
  name: string
  subText?: string
  tag?: {
    text: string
    color: string
    textColor?: string
  }
}

export type ProjectResourceCardProps = {
  title: string
  icon: Icon
  iconBackgroundColor: string
  resources: ResourceItem[]
  addButtonText?: string
  footerButtonText: string
  onAdd: () => void
  onFooterAction: () => void
  emptyStateTitle?: string
  emptyStateDescription?: string
}

export const ProjectResourceCard = ({
  title,
  icon,
  iconBackgroundColor,
  resources,
  addButtonText,
  footerButtonText,
  onAdd,
  onFooterAction,
  emptyStateTitle,
  emptyStateDescription,
}: ProjectResourceCardProps) => {
  const count = resources.length
  const hasResources = count > 0

  return (
    <CardWrapper>
      <CardHeader>
        <TitleContainer>
          <IconContainer $backgroundColor={iconBackgroundColor}>
            {iconLoader(icon, 20, getColor('blue.500'))}
          </IconContainer>
          <Title>{title}</Title>
          <CountBadge>{count}</CountBadge>
        </TitleContainer>
        {addButtonText && <AddButton onClick={onAdd}>{addButtonText}</AddButton>}
      </CardHeader>
      <CardBody>
        {hasResources ? (
          <ResourceList>
            {resources.map((resource) => (
              <StyledResourceItem key={resource.id}>
                <ResourceListContainer>
                <ResourceName>{resource.name}</ResourceName>
                {resource.subText && (
                  <ResourceSubText>{resource.subText}</ResourceSubText>
                )}
                </ResourceListContainer>
                {resource.tag && (
                  <ResourceTag
                    $backgroundColor={resource.tag.color}
                    $textColor={resource.tag.textColor ?? getColor('white')}
                  >
                    {resource.tag.text}
                  </ResourceTag>
                )}
              </StyledResourceItem>
            ))}
          </ResourceList>
        ) : (
          <EmptyState>
            <EmptyStateIcon>
              {iconLoader(icon, 48, getColor('gray.500'))}
            </EmptyStateIcon>
            <EmptyStateTitle>
              {emptyStateTitle ?? `No ${title.toLowerCase()} found`}
            </EmptyStateTitle>
            {emptyStateDescription && (
              <EmptyStateDescription>
                {emptyStateDescription}
              </EmptyStateDescription>
            )}
          </EmptyState>
        )}
      </CardBody>
      <CardFooter>
        <FooterButton onClick={onFooterAction}>
          {footerButtonText}
        </FooterButton>
      </CardFooter>
    </CardWrapper>
  )
}