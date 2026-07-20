export default function ProductsLoading() {
  return (
    <div className="container" style={{ padding: '3rem 2rem' }}>
      <div style={{ width: '200px', height: '28px', background: '#f0ece7', borderRadius: '4px', margin: '0 auto 2rem' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} style={{
            aspectRatio: '3/4',
            borderRadius: '8px',
            background: 'linear-gradient(90deg, #f5f3f0 25%, #ede9e4 50%, #f5f3f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }} />
        ))}
      </div>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}
