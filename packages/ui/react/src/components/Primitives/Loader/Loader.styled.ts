import { css, styled } from 'styled-components'

import { BarLoader as BaseBarLoader } from './BarLoader'
import { CircleLoader as BaseCircleLoader } from './CircleLoader'
import { PageLoader as BasePageLoader } from './PageLoader'
import { RingLoader as BaseRingLoader } from './RingLoader'
import { getColor } from 'src/colors'

type ContainerCometSpinLoaderProps = {
  $paddingTop?: string
}

type LoaderContainerProps = {
  $paddingTop?: string
  $isAlignLeft?: boolean
}

const PageContainer = styled.div`
  position: fixed;
  top: 150px;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: ${getColor('white')};
  height: calc(100% - 192px);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
  & > div {
    & > img {
      margin: 0 auto;
      transform: scale(0.5);
    }
  }
`

const loaderMargin = css`
  &&& {
    margin: 20px;
  }
`

const ContainerCometSpinLoader = styled.div<ContainerCometSpinLoaderProps>`
  padding-top: ${({ $paddingTop }) => $paddingTop ?? '0'};
`

const LoaderContainer = styled.div<LoaderContainerProps>`
  padding-top: ${({ $paddingTop }) => $paddingTop ?? '0'};
  display: flex;
  height: 42px;
  justify-content: ${({ $isAlignLeft }) =>
    $isAlignLeft ? 'flex-start' : 'center'};
  align-items: center;
`

const CircleLoader = styled(BaseCircleLoader)`
  &&& {
    margin: 10px;
  }
`

const PageLoader = styled(BasePageLoader)`
  ${loaderMargin}
`

const BarLoader = styled(BaseBarLoader)`
  ${loaderMargin}
`

const RingLoader = styled(BaseRingLoader)`
  margin: 5px auto;
`

export {
  BarLoader,
  CircleLoader,
  ContainerCometSpinLoader,
  LoaderContainer,
  PageContainer,
  PageLoader,
  RingLoader,
}
