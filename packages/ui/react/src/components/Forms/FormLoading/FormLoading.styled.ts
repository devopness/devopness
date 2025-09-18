import { styled } from 'styled-components'

const Container = styled.div``

const WrapperTitle = styled.div`
  margin-bottom: 20px;
`

const WrapperParagraph = styled.div`
  margin-bottom: 20px;

  & > div:nth-child(1) {
    margin-bottom: 10px;
  }
`
const Line = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 1px;
  background-color: #dde4fd;
`

const WrapperButton = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 126px;

  & > div:nth-child(1) {
    margin-right: 30px;
  }
`

export { Container, WrapperTitle, WrapperParagraph, Line, WrapperButton }
