// Since Product Fruits is a third-party library and its types are not defined, we need to disable some eslint rules to avoid errors.
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useState } from 'react'

/**
 * Custom hook to control the **Help Center** button provided by Product Fruits.
 */
const useHelpCenter = () => {
  const [
    isOpened,
    setIsOpened,
  ] = useState(false)
  const close = () => {
    window.productFruits?.api?.button.close()
    setIsOpened(false)
  }
  const open = () => {
    // This code is a workaround to force append the Life Ring Button to the popover
    // Is is used because Products Fruits does not support Life Ring Button as embed component (on date of this comment, maybe in the future it will be supported)
    document
      .querySelector('#popover')
      ?.appendChild(
        document.querySelector('.productfruits--container') ??
          document.createElement('div')
      )
    window.productFruits?.api?.button.open()
    setIsOpened(true)
  }
  const asyncClose = async () => {
    close()
    // This code is a workaround to fix flickering when closing the popover
    // This occurs because how DOM not await the Life Ring Modal to be closed, sending the Life Ring Modal opened to the "body"
    // So is needed force some await, until the Life Ring Modal is closed
    // The "300" value is experimental number, testing different values, until achieve the best result
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null)
      }, 300)
    })
    document
      .querySelector('body')
      ?.appendChild(
        document.querySelector('.productfruits--container') ??
          document.createElement('div')
      )
  }

  return {
    isOpened,
    close,
    open,
    asyncClose,
  }
}

export { useHelpCenter }
