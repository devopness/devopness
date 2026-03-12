import { styled } from 'styled-components'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

const ContentMain = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`

const ContentCopyAction = styled.div<{ $allwaysVisible?: boolean }>`
  width: 12px;
  height: 12px;
  padding: 0 15px;
  color: ${getColor('gray.615')};
  opacity: ${({ $allwaysVisible }) => ($allwaysVisible ? 1 : 0)};

  ${({ $allwaysVisible }) =>
    !$allwaysVisible &&
    `
    &:hover {
      opacity: 1;
    }
  `}

  > svg {
    fill: ${getColor('gray.615')};
  }
`

const ContentChildren = styled.span<{ $allwaysVisible?: boolean }>`
  user-select: all;
  max-width: calc(100% - 42px);
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ${getFont('roboto')};

  ${({ $allwaysVisible }) =>
    !$allwaysVisible &&
    `
    &:hover ~ ${ContentCopyAction} {
      opacity: 1;
    }
  `}
`

const CopyAction = styled.div`
  cursor: pointer;
`

export { ContentMain, ContentChildren, ContentCopyAction, CopyAction }
