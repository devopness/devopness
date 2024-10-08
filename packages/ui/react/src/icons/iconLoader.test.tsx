import '@testing-library/jest-dom'

import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { iconList, iconLoader } from './iconLoader'

describe('iconLoader', () => {
  const defaultProps = {
    accessorName: undefined,
    size: 13,
    color: 'purple',
    opacity: 1,
    label: 'test-label',
  }
  describe('should not render', () => {
    it('with undefined accessor name', () => {
      const { getByLabelText } = render(
        iconLoader(
          undefined,
          defaultProps.size,
          defaultProps.color,
          defaultProps.opacity,
          defaultProps.label
        )
      )
      expect(() => getByLabelText(defaultProps.label)).toThrow(
        `Unable to find a label with the text of: ${defaultProps.label}`
      )
    })
  })

  describe('should render correctly', () => {
    it('a svg from icon library', () => {
      const iconFromList = iconList[0]
      expect(iconFromList.type).toEqual('icon')

      const { getByLabelText } = render(
        iconLoader(
          iconFromList.accessor,
          defaultProps.size,
          defaultProps.color,
          defaultProps.opacity,
          defaultProps.label
        )
      )
      const icon = getByLabelText(defaultProps.label)

      expect(icon).toBeInTheDocument()
      expect(icon).toEqual(
        render(<iconFromList.component />).getByLabelText(defaultProps.label)
      )
    })

    it('an image from Devopness assets CDN', () => {
      const { getByLabelText, queryByRole } = render(
        iconLoader(
          'devopness',
          defaultProps.size,
          defaultProps.color,
          defaultProps.opacity,
          defaultProps.label
        )
      )
      const icon = getByLabelText(defaultProps.label)

      expect(icon).toBeInTheDocument()
      expect(icon).toEqual(queryByRole('img'))
    })
  })
})
