import { styled } from 'styled-components'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

const ChecklistContainer = styled.div`
  position: fixed;
  bottom: 25px;
  right: 30px;
  z-index: 2;
`
const ChecklistLaunch = styled.div`
  position: absolute;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: max-content;
  height: 60px;
  background-color: #121126;
  border-radius: 8px;
  right: 0;
  bottom: 0;

  @media screen and (max-width: 768px) {
    display: none;
  }
`

const Text = styled.p`
  color: ${getColor('white')};
  font-family: ${getFont('roboto')};
  font-size: 1.2rem;
  margin: 0px 20px;

  & path {
    stroke: ${getColor('white')} !important;
  }
`
const Hidden = styled.div`
  display: none;
`
export { ChecklistContainer, ChecklistLaunch, Hidden, Text }
