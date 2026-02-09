import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { expect, afterEach } from 'vitest'

expect.extend(matchers)

// Add custom snapshot serializer to normalize dynamic class names
expect.addSnapshotSerializer({
  test: (val) => typeof val === 'string',
  print: (val) => {
    const normalized = (val as string)
      // Normalize styled-components class names (sc-xxxxx)
      .replace(/sc-[a-zA-Z0-9]+/g, 'sc-test')
      // Normalize emotion/mui class names (css-xxxxx)
      .replace(/css-[a-z0-9]+/g, 'css-test')
      // Normalize styled-components dynamic component hashes
      // Match any 5-7 character word that contains both uppercase and lowercase letters
      .replace(/\b[a-zA-Z]*[a-z][a-zA-Z]*[A-Z][a-zA-Z]*\b/g, (match) => {
        // Only replace if it's 4-7 chars (typical hash length)
        return match.length >= 4 && match.length <= 7 ? 'hash-test' : match
      })
      .replace(/\b[a-zA-Z]*[A-Z][a-zA-Z]*[a-z][a-zA-Z]*\b/g, (match) => {
        // Catch patterns that start with uppercase
        return match.length >= 4 && match.length <= 7 ? 'hash-test' : match
      })
      // Normalize any other hash-based class names (e.g., MuiBox-root-xxxxx)
      .replace(/([A-Z][a-z]+)-([a-z]+)-[a-z0-9]+/g, '$1-$2-test')
    return `"${normalized}"`
  },
})

afterEach(() => {
  cleanup()
})
