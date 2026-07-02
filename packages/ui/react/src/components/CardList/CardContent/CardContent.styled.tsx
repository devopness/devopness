import { getColor } from 'src/colors'
import styled from 'styled-components'

// styled.div``;

const StyledResourceList = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
`

const StyledDivider = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${getColor('slate.300')};
`

const StyledResourceName = styled.span<{
  // transient prop to avoid forwarding to DOM
  $disableHover?: boolean
}>`
  display: block;
  font-size: 0.813rem;
  line-height: 1.25rem;
  min-height: 1.25rem;
  padding-bottom: 1rem;
  /**
   * The padding-left should be the same as the Card Header left padding
   */
  padding-left: 0.875rem;
  padding-right: 2rem;
  padding-top: 1rem;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    background-color: ${({ $disableHover }) =>
      $disableHover ? 'transparent' : getColor('indigo.10')};
  }
`

const StyledAddResourceContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  justify-content: center;
  min-height: 9.875rem;
`

export {
  StyledAddResourceContainer,
  StyledDivider,
  StyledResourceList,
  StyledResourceName,
}
