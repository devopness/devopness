import { css, styled } from 'styled-components'

import { getColor } from 'src/colors'

type OptionProps = {
  isOptionSelected?: boolean
  isCreateLink?: boolean
}

const ellipsisStyle = css`
  text-overflow: ellipsis;
  max-width: calc(100% - 16px);
  white-space: nowrap;
  overflow: hidden;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 120px;
`

const BoxLoader = styled.div`
  width: 50px;
  height: 50px;
`

const NoOption = styled.div`
  color: ${getColor('blue.800')};
`

const OptionSelectedWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  width: 100%;
  font-size: 13px;
  min-width: 0;
  color: ${getColor('blue.800')};
  margin-right: 6px;
  ${ellipsisStyle}
`

const OptionWrapper = styled.div<OptionProps>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  ${({ isCreateLink }) =>
    isCreateLink &&
    css`
      justify-content: center;
      border-top: 1px solid ${getColor('slate.300')};
      font-weight: bold;
    `};
  height: 100%;
  padding-left: 15px;

  path,
  circle,
  polygon {
    stroke: currentColor;
  }
`

const OptionLabel = styled.span`
  grid-column: 2 / 3;
  padding-left: 6px;
  ${ellipsisStyle}
`

export {
  BoxLoader,
  NoOption,
  OptionLabel,
  OptionSelectedWrapper,
  OptionWrapper,
  Wrapper,
}
