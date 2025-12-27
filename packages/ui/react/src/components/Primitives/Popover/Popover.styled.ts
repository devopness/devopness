import { Popover } from '@mui/material'
import { styled } from 'styled-components'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

const Container = styled(Popover)`
  & .MuiPopover-paper {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    margin-top: 10px;
    height: 510px;
    width: 359px;
    border-radius: 0.625rem; /* 0.625rem => 10px */
    box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 30px 0px;
  }

  & iframe {
    border: none;
    flex: 1;
  }
`

const Header = styled.div<{ $justifyContent: 'space-between' | 'end' }>`
  // This position "relative" is necessary for the workaround to embed Life Ring Button in the Popover
  // In Custom CSS Panel on Product Fruits Admin Panel, the position of the button is "absolute"
  // To more information, see Custom CSS setting um Product Fruits Admin Panel
  position: relative;
  display: flex;
  width: 100%;
  justify-content: ${({ $justifyContent }) => $justifyContent};
  align-items: center;
  padding: 15px;
  box-sizing: border-box;
  gap: 15px;

  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-color: ${getColor('stone.100')};
`

const Title = styled.span`
  font-family: ${getFont('montserrat')};
  font-size: 1rem;
  line-height: 1rem;
  font-weight: 600;
  color: ${getColor('blue.800')};
`

const Footer = Header

export { Container, Footer, Header, Title }
