'use client';

export default function Error({ error, reset }) {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '4rem 2rem',
    }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#1a1a1a', marginBottom: '0.75rem' }}>
        Something went wrong
      </h1>
      <p style={{ color: '#888', marginBottom: '2rem', maxWidth: '400px' }}>
        We encountered an unexpected error. Please try again.
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: '0.75rem 2rem',
          background: '#1a1a1a',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: '500',
        }}
      >
        Try Again
      </button>
    </div>
  );
}
