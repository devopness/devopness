import MuiTab, { tabClasses } from '@mui/material/Tab'
import MuiTabs, { tabsClasses } from '@mui/material/Tabs'
import { styled } from 'styled-components'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

const StyledTabs = styled(MuiTabs)`
  &.${tabsClasses.root} {
    height: 40px;
    min-height: 40px;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    background-color: ${getColor('white')};
    z-index: 998; /* same z-index as Submenu component */
  }

  & .${tabsClasses.scrollButtons} {
    width: 1.25rem; /* => 20px */
  }

  & .${tabsClasses.indicator} {
    background-color: ${getColor('purple.800')};
  }
`

const StyledTab = styled(MuiTab)`
  &.${tabClasses.root} {
    min-width: auto;
    color: ${getColor('blue.950')};
    text-transform: capitalize;
    font-family: ${getFont('roboto')};
    font-size: 14px;
    font-weight: 500;
    line-height: 100%;
    letter-spacing: normal;
    opacity: 1;
  }

  &.${tabClasses.selected} {
    color: ${getColor('purple.800')};
    font-weight: 600;
  }
`

export { StyledTabs, StyledTab }
