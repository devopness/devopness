/**
 * Generic, content-driven error banner for route-specific error states
 * (e.g., missing OAuth params, provider denied, API failure).
 *
 * NOTE: The app also has event-driven error banners with nearly identical outer styling:
 * - `BannerNotFoundContent` (404 API responses) in `src/router/templates/BannerNotFound/`
 * - `BannerServerErrorContent` (500 API responses) in `src/router/templates/BannerServerError/`
 * - `BannerErrorBoundary` (React error boundary) in `src/router/templates/BannerErrorBoundary/`
 *
 * Those banners could eventually be refactored to compose this `ErrorBanner` internally,
 * since the outer layout/styling is nearly identical. That is a separate concern, though,
 * as it would touch the event-driven banners that are used app-wide.
 */
import { getColor } from '../../../colors'
import { getFont } from '../../../fonts'
import { Link } from '../Link'

type ErrorBannerProps = {
  title: string
  description: string
  errorDetail?: string
  action?: { label: string; href: string }
}

const ErrorBanner = ({
  title,
  description,
  errorDetail,
  action,
}: ErrorBannerProps) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: getFont('roboto'),
        color: getColor('blue.800'),
        fontSize: '1.25rem',
        lineHeight: '1.75rem',
        height: '100%',
        flex: '1',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          gap: '1.875rem',
          maxWidth: '40rem',
        }}
      >
        <h1
          style={{
            margin: '0',
            fontSize: '1.875rem',
            lineHeight: '2.25rem',
            fontWeight: 500,
          }}
        >
          {title}
        </h1>
        <span>{description}</span>
        {errorDetail && (
          <span
            style={{
              fontSize: '0.875rem',
              color: getColor('blue.600'),
            }}
          >
            Details: {errorDetail}
          </span>
        )}
        {action && (
          <Link
            to={action.href}
            target="_self"
            hideExternalUrlIcon
            style={{
              color: getColor('purple.800'),
              fontWeight: 500,
            }}
          >
            {action.label}
          </Link>
        )}
      </div>
    </div>
  )
}

export type { ErrorBannerProps }
export { ErrorBanner }
