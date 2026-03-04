export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#f9fafb',
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#1f2937',
        }}>
          404
        </h1>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1rem',
          color: '#374151',
        }}>
          Page Not Found
        </h2>
        <p style={{
          fontSize: '1rem',
          marginBottom: '2rem',
          color: '#6b7280',
          lineHeight: '1.5',
        }}>
          This application is served at <code style={{
            background: '#e5e7eb',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.9em',
          }}>/docs/</code> to enable reverse proxy integration
          with the main Devopness website.
        </p>
        <a
          href="/docs/"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '500',
          }}
        >
          Go to Documentation →
        </a>
      </div>
    </div>
  );
}
