import { iconLoader } from 'src/icons'

import {
  AddCardContainer,
  AddCardInner,
  AddCardLabel,
  PlusIconWrapper,
} from './AddCard.style'

type ResourceDataCardLinkProps = {
  resourceType: string
  onClick?: () => void
}

const ResourceDataCardLink = ({
  resourceType,
  onClick,
}: ResourceDataCardLinkProps) => (
  <AddCardContainer
    onClick={onClick}
    type="button"
    aria-label={`Link ${resourceType}`}
  >
    <AddCardInner>
      <PlusIconWrapper aria-hidden="true">
        {iconLoader('link', 20)}
      </PlusIconWrapper>
      <AddCardLabel>{`Link ${resourceType}`}</AddCardLabel>
    </AddCardInner>
  </AddCardContainer>
)

export type { ResourceDataCardLinkProps }
export { ResourceDataCardLink }
