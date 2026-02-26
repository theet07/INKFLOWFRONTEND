const LoadingSpinner = ({ size = 'medium', text = 'Carregando...' }) => {
  const sizeClasses = {
    small: { width: '30px', height: '30px' },
    medium: { width: '50px', height: '50px' },
    large: { width: '70px', height: '70px' }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '2rem'
    }}>
      <div 
        className="loading-spinner glow-red"
        style={sizeClasses[size]}
      />
      {text && (
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          fontWeight: '500',
          textAlign: 'center'
        }}>
          {text}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner