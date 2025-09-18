import { Link } from '../Link'
import { Tooltip } from '../Tooltip'
import { SourceAndHashSpan } from './SourceAndHash.styled'

/**
 * The type of the deployment source.
 * Can be a branch, a tag, or a commit.
 */
type LocalSourceType = 'branch' | 'commit' | 'tag'

/**
 * Minimal information about a commit required for the SourceAndHash component.
 */
type Commit = {
  /** The commit hash */
  hash: string
  /** The URL to view the commit in the source provider */
  url: string
  /** The commit message to display in the tooltip */
  message: string
}

/**
 * Minimal information about a deployment required for the SourceAndHash component.
 */
type Deployment = {
  /** The git reference used for this deployment (branch, tag, or commit hash) */
  source_ref?: string
  /** The type of source used in the deployment */
  source_type?: LocalSourceType
}

/**
 * Props for the SourceAndHash component.
 */
type SourceAndHashProps = {
  /** Commit information to display */
  commit: Commit
  /** Deployment information to display optional source reference */
  deployment: Deployment
  /** Maximum number of characters to display for the commit hash */
  maxDisplayCharacters?: number
  /** Additional props to pass to the Tooltip component */
  tooltipOptions?: Omit<Parameters<typeof Tooltip>[0], 'children' | 'title'> & {
    title?: string
  }
}

/**
 * SourceAndHash component
 *
 * Displays a shortened commit hash with an optional deployment source reference.
 * The commit hash is wrapped in a link and a tooltip showing the full commit message.
 *
 * @example
 * ```tsx
 * <SourceAndHash
 *   commit={{ hash: 'abcd1234', url: 'https://github.com/repo/commit/abcd1234', message: 'Fix bug' }}
 *   deployment={{ source_ref: 'feature/new-feature', source_type: 'branch' }}
 *   maxDisplayCharacters={8}
 * />
 * ```
 */
const SourceAndHash = ({
  commit,
  deployment,
  maxDisplayCharacters = 8,
  tooltipOptions,
}: SourceAndHashProps) => {
  const hash = commit.hash.slice(0, maxDisplayCharacters)

  const source_ref =
    deployment.source_ref && deployment.source_ref.length > 25
      ? `${deployment.source_ref.slice(0, 25)}...`
      : deployment.source_ref

  return (
    <Tooltip
      {...tooltipOptions}
      title={tooltipOptions?.title ?? commit.message}
    >
      <Link
        target="_blank"
        to={commit.url}
      >
        <SourceAndHashSpan>{hash}</SourceAndHashSpan>
        {source_ref && deployment.source_type !== 'commit' && (
          <SourceAndHashSpan>({source_ref})</SourceAndHashSpan>
        )}
      </Link>
    </Tooltip>
  )
}

export { SourceAndHash }
export type { SourceAndHashProps, Commit, Deployment }
