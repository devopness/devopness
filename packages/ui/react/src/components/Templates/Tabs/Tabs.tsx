import React from 'react'

import { StyledTabs, StyledTab } from './Tabs.styled'

type TabsProps = {
  /**
   * Tabs to be rendered
   *
   * - When data has only one tab, Tabs selector becomes hidden
   * - When data is empty, this component returns null
   */
  data: { label: string; component: React.ReactNode }[]
  currentTabIndex: number
  onTabClick?: (event: { index: number; label: string }) => void
}

/** Switch between different views on the same page */
const Tabs = ({
  data: tabsData,
  currentTabIndex,
  onTabClick = (_event) => null,
}: TabsProps) => {
  if (tabsData.length === 0) return null

  if (tabsData.length === 1) return tabsData.at(0)?.component

  return (
    <>
      <StyledTabs
        value={currentTabIndex}
        variant="scrollable"
        scrollButtons={false}
      >
        {tabsData.map(({ label }, index) => (
          <StyledTab
            key={label}
            label={label}
            onClick={() => {
              onTabClick({ index, label })
            }}
          />
        ))}
      </StyledTabs>
      {tabsData.at(currentTabIndex)?.component}
    </>
  )
}

export { Tabs }
