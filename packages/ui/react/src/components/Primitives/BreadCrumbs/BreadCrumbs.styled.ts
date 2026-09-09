import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

export const Container = styled.div`
  display: none;
  position: relative;
  overflow: hidden;

  @media (min-width: 600px) {
    display: block;
  }
`

export const Crumbs = styled.div<{
  $hasLogoCrumb?: boolean
  $hasAdjacentBrand?: boolean
}>`
  display: flex;
  max-width: 100%;
  min-width: 0;
  height: 65px;
  position: relative;
  padding-left: ${({ $hasLogoCrumb = true, $hasAdjacentBrand = false }) =>
    $hasLogoCrumb || $hasAdjacentBrand ? 0 : '16px'};
`

export const Border = styled(motion.div)<{ $isLoading: boolean }>`
  position: absolute;
  top: calc(100% - 1px);
  height: 1px;
  width: ${({ $isLoading }) => !$isLoading && '100%'};
  background: ${getColor('slate.300')};
`

export const LoadingLine = styled(motion.div)<{ $isLoading: boolean }>`
  position: absolute;
  display: ${({ $isLoading }) => !$isLoading && 'none'};
  top: calc(100% - 2px);
  height: 2px;
  z-index: 10;
  width: ${({ $isLoading }) => !$isLoading && '100%'};
  background: ${getColor('purple.800')};
`

export const Background = styled(motion.div)<{ $color: string }>`
  position: absolute;
  inset: 0;
  background-color: ${({ $color }) => $color};

  &:after {
    position: absolute;
    right: -23px;
    top: 9px;
    content: '';
    width: 46px;
    height: 46px;
    background-color: ${({ $color }) => $color};
    border-radius: 0 10px 0 0;
    transform: rotate(45deg);
  }
`

export const CrumbContainer = styled.div<{
  $zIndex?: number
  $last?: boolean
  $isLeadingWithoutLogo?: boolean
  $shrinkWeight?: number
}>`
  display: flex;
  height: 100%;
  min-width: calc(96px + 4ch);
  box-sizing: border-box;
  z-index: ${({ $zIndex }) => $zIndex};
  flex-shrink: ${({ $shrinkWeight }) => $shrinkWeight ?? 1};
  position: relative;
  cursor: pointer;
  margin-left: ${({ $isLeadingWithoutLogo }) =>
    $isLeadingWithoutLogo ? 0 : '-32px'};

  &:hover {
    &:after {
      background-color: ${getColor('indigo.10')};
    }

    & .arrow-head svg {
      fill: ${getColor('indigo.10')};
    }
  }
`

export const CrumbWrapper = styled.article`
  display: flex;
  height: 100%;
  min-width: 0;
  position: relative;
  margin-left: -23px;
`

export const NodeContentContainer = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  background-color: white;
  position: relative;
  z-index: 2;
  padding-left: 3rem;

  ${CrumbContainer}:hover & {
    background-color: ${getColor('indigo.10')};
  }
`

export const NodeContent = styled.div<{ $zIndex?: number; $order: number }>`
  display: grid;
  min-width: 0;
  grid-template-columns: auto 1fr;
  grid-column-gap: 10px;
  align-items: center;
  height: 63px;
  z-index: ${({ $zIndex = 0 }) => $zIndex + 5};
  padding: 0 30px 0 15px;
`

export const ContentBadge = styled.span<{
  $backgroundColor?: string
  $color?: string
}>`
  ${({ $backgroundColor, $color }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    background-color: ${$backgroundColor};
    border-radius: 5px;
    text-transform: uppercase;
    font-family: ${getFont('roboto')};
    font-weight: bold;
    font-size: 14px;
    color: ${$color || getColor('blue.800')};
    margin-left: 10px;

    > svg {
      color: #fff;
      fill: #fff;
    }
  `}
`

export const CrumbText = styled.span`
  color: ${getColor('blue.800')};
  font-family: ${getFont('roboto')};
  font-weight: bold;
  font-size: 14px;
  line-height: normal;
  user-select: none;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ContentIconArrow = styled.span<{ $zIndex?: number }>`
  z-index: ${({ $zIndex = 0 }) => $zIndex + 2};

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s;
    border-radius: 20px;
    height: 24px;
    width: 24px;

    &:hover {
      background-color: ${getColor('slate.300')};
    }

    svg {
      color: ${getColor('blue.800')};
      fill: ${getColor('blue.800')};
    }
  }
`

export const LogoContainer = styled.article`
  display: flex;
  height: 100%;
  z-index: 10;
  position: relative;
  cursor: pointer;

  &:hover svg {
    fill: ${getColor('indigo.10')};
  }
`

export const LogoContent = styled.div`
  display: flex;
  align-items: center;
  width: max-content;
  height: 65px;
  background-color: white;

  ${LogoContainer}:hover & {
    background-color: ${getColor('indigo.10')};
  }
`

export const LogoImage = styled.div<{
  $src: string
  $expandedSrc: string
  $compact: boolean
}>`
  max-width: 130px;
  width: ${({ $compact }) => ($compact ? '23px' : '130px')};
  height: 21px;
  margin-left: 30px;
  margin-right: 7px;
  background-image: url(${({ $src, $expandedSrc, $compact }) =>
    $compact ? $src : $expandedSrc});
  background-repeat: no-repeat;
  background-size: contain;
`
