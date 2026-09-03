import { css, styled } from 'styled-components'

import { getColor } from 'src/colors'

type OptionProps = {
  isOptionSelected?: boolean
  isCreateLink?: boolean
  hasDescription?: boolean
}

const ellipsisStyle = css`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  min-width: 0;
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

const OptionSelectedWrapper = styled.div<OptionProps>`
  display: ${({ hasDescription }) => (hasDescription ? 'grid' : 'grid')};
  ${({ hasDescription }) =>
    hasDescription
      ? css`
          grid-template-rows: auto auto;
          gap: 2px;
          align-items: start;
        `
      : css`
          grid-template-columns: auto 1fr;
          align-items: center;
        `};
  width: 100%;
  font-size: 13px;
  min-width: 0;
  color: ${getColor('blue.800')};
  margin-right: 6px;
`

const OptionWrapper = styled.div<OptionProps>`
  display: ${({ hasDescription }) => (hasDescription ? 'grid' : 'flex')};
  ${({ hasDescription }) =>
    hasDescription
      ? css`
          grid-template-rows: auto auto;
          gap: 2px;
          padding: 8px 0 8px 15px;
        `
      : css`
          align-items: center;
          justify-content: flex-start;
          padding-top: 10px;
          padding-left: 15px;
        `};
  ${({ isCreateLink }) =>
    isCreateLink &&
    css`
      justify-content: center;
      border-top: 1px solid ${getColor('slate.300')};
      font-weight: bold;
    `};
  height: 100%;

  path,
  circle,
  polygon {
    stroke: currentColor;
  }
`

const OptionRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 6px;
  min-width: 0;
`

const OptionLabel = styled.span<{ hasDescription?: boolean }>`
  padding-left: 6px;
  ${ellipsisStyle}
  font-weight: ${({ hasDescription }) => (hasDescription ? 600 : 400)};
`

const OptionDescription = styled.span`
  padding-left: 6px;
  font-size: 12px;
  ${ellipsisStyle}
`

export {
  BoxLoader,
  NoOption,
  OptionLabel,
  OptionDescription,
  OptionRow,
  OptionSelectedWrapper,
  OptionWrapper,
  Wrapper,
}
