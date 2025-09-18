import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { SourceAndHash } from './SourceAndHash'

const commit = {
  hash: 'abcd1234567890',
  url: 'https://github.com/repo/commit/abcd1234',
  message: 'Fix bug in deployment',
}

const deployment = {
  source_ref: 'feature/new-feature-branch',
  source_type: 'branch' as const,
}

describe('SourceAndHash', () => {
  it('renders the commit hash truncated by default', () => {
    render(
      <SourceAndHash
        commit={commit}
        deployment={{}}
      />
    )
    expect(screen.getByText('abcd1234')).toBeInTheDocument()
  })

  it('renders full commit hash when maxDisplayCharacters is increased', () => {
    render(
      <SourceAndHash
        commit={commit}
        deployment={{}}
        maxDisplayCharacters={14}
      />
    )
    expect(screen.getByText('abcd1234567890')).toBeInTheDocument()
  })

  it('renders the source_ref when deployment type is not commit', () => {
    render(
      <SourceAndHash
        commit={commit}
        deployment={deployment}
      />
    )
    expect(
      screen.getByText('(feature/new-feature-branc...)')
    ).toBeInTheDocument()
  })

  it('does not render source_ref if deployment type is commit', () => {
    render(
      <SourceAndHash
        commit={commit}
        deployment={{ ...deployment, source_type: 'commit' }}
      />
    )
    expect(screen.queryByText(/\(/)).toBeNull()
  })

  it('renders tooltip with commit message by default', () => {
    render(
      <SourceAndHash
        commit={commit}
        deployment={{}}
      />
    )
    expect(
      screen.getByText('abcd1234').closest('div')?.getAttribute('title')
    ).toBeNull()
  })

  it('overrides tooltip title if tooltipOptions.title is provided', () => {
    render(
      <SourceAndHash
        commit={commit}
        deployment={{}}
        tooltipOptions={{ title: 'Custom tooltip' }}
      />
    )
    expect(screen.getByText('abcd1234')).toBeInTheDocument()
  })
})
