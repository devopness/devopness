import { describe, expect, it } from 'vitest'

import { getColor, getOpacity } from './getColor'

describe('getColor', () => {
  it('returns the hex value for a color name', () => {
    expect(getColor('blue.800')).toBe('#2e364e')
  })

  it('returns non-hex colors unchanged', () => {
    expect(getColor('transparent')).toBe('transparent')
  })
})

describe('getOpacity', () => {
  it('returns fully transparent alpha for opacity 0', () => {
    expect(getOpacity(getColor('blue.800'), 0)).toBe('#2e364e00')
  })

  it('pads single-digit alpha values with a leading zero', () => {
    expect(getOpacity(getColor('blue.800'), 0.05)).toBe('#2e364e0c')
  })

  it('keeps the established truncation convention for normal values', () => {
    expect(getOpacity(getColor('blue.800'), 0.1)).toBe('#2e364e19')
    expect(getOpacity(getColor('blue.800'), 0.5)).toBe('#2e364e7f')
    expect(getOpacity(getColor('blue.800'), 0.7)).toBe('#2e364eb2')
  })

  it('returns fully opaque alpha for opacity 1', () => {
    expect(getOpacity(getColor('blue.800'), 1)).toBe('#2e364eff')
  })

  it('returns non-hex colors unchanged', () => {
    expect(getOpacity(getColor('transparent'), 0.5)).toBe('transparent')
  })
})
