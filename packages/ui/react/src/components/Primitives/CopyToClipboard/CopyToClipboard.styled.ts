import { styled } from 'styled-components'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

const ContentMain = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`

const ContentCopyAction = styled.div`
  width: 12px;
  height: 12px;
  padding: 0 15px;
  color: ${getColor('gray.615')};
  opacity: 0;

  &:hover {
    opacity: 1;
  }

  > svg {
    fill: ${getColor('gray.615')};
  }
`

const ContentChildren = styled.span`
  user-select: all;
  max-width: calc(100% - 42px);
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ${getFont('roboto')};

  &:hover ~ ${ContentCopyAction} {
    opacity: 1;
  }
`

const CopyAction = styled.div`
  cursor: pointer;
`

export { ContentMain, ContentChildren, ContentCopyAction, CopyAction }
