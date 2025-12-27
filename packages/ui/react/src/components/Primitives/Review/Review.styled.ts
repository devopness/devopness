import { css, styled } from 'styled-components'

import { getColor } from 'src/colors'

type DetailContentValueProps = {
  $isBoldFontWeight?: boolean
}

type DetailContentInformationProps = {
  $noIcon?: boolean
  $isIconAfterLabel?: boolean
  $backgroundColor?: string
}

type ContentDetailProps = {
  type?: 'default' | 'warning'
}

type StyledProps = {
  $backgroundColor?: string
  color?: string
}

const getBackgroundColor = (props: ContentDetailProps) => {
  switch (props.type) {
    case 'warning':
      return getColor('red.100')
    case 'default':
      return getColor('indigo.100')
    default:
      return getColor('white')
  }
}

const gridInformation = css`
  display: grid;
  grid-template-columns: 20px auto;
  grid-column-gap: 8px;
  align-items: center;
  padding: 15px;
`

const DetailContentInformation = styled.article<DetailContentInformationProps>`
  ${gridInformation}
  ${({ $noIcon, $isIconAfterLabel }) => css`
    grid-template-columns: ${$noIcon || $isIconAfterLabel ? 'auto' : '20px auto'};
    padding-left: ${$noIcon || $isIconAfterLabel ? '10px' : '5px'};
  `}
  background-color: ${(props) => props.$backgroundColor && props.$backgroundColor};
`

const DetailContentValue = styled.span<DetailContentValueProps>`
  color: #2e364e;
  font-family: Roboto;
  font-size: 13px;
  line-height: 18px;
  ${({ $isBoldFontWeight }) => css`
    font-weight: ${$isBoldFontWeight ? 'bold' : 'normal'};
  `}
  word-break: normal;
`

const PrefixWrapper = styled.span<{
  $showMarginRight?: boolean
}>`
  margin-right: ${({ $showMarginRight }) => ($showMarginRight ? '5px' : 'auto')};
`

const ContentIcon = styled.div<StyledProps>`
  max-width: 20px;
  width: 100%;
  max-height: 20px;
  padding: 1px;
  height: 100%;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.$backgroundColor && props.$backgroundColor};
  color: white;
`

const ContentDetail = styled.header<ContentDetailProps>`
  grid-area: content_detail;
  background-color: ${(props) => getBackgroundColor(props)};
`

export {
  ContentDetail, ContentIcon, DetailContentInformation,
  DetailContentValue,
  PrefixWrapper
}
export type {
  ContentDetailProps, DetailContentInformationProps,
  DetailContentValueProps
}
