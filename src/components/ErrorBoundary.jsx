import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o estado para que a próxima renderização mostre a UI de fallback.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Você também pode registrar o erro em um serviço de relatório de erros
    console.error("ErrorBoundary capturou um erro:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // UI de Fallback customizada com a identidade InkFlow
      return (
        <div className="error-boundary-container" style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#ffffff',
          textAlign: 'center',
          padding: '20px',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999
        }}>
          <div style={{ 
            padding: '40px', 
            borderRadius: '24px', 
            background: 'rgba(255,141,140,0.05)', 
            border: '1px solid rgba(255,141,140,0.1)',
            maxWidth: '500px'
          }}>
            <span className="material-symbols-outlined" style={{ 
              fontSize: '80px', 
              color: '#ff8d8c', 
              marginBottom: '24px',
              display: 'block'
            }}>
              ink_eraser
            </span>
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '900', 
              textTransform: 'uppercase', 
              letterSpacing: '2px', 
              marginBottom: '16px',
              color: '#fff'
            }}>
              Ops! Tivemos um problema com a tinta
            </h1>
            <p style={{ 
              color: '#a0a0a0', 
              fontSize: '0.9rem', 
              lineHeight: '1.6',
              marginBottom: '32px' 
            }}>
              Não conseguimos carregar este componente corretamente. Tente recarregar a página para restaurar o traço original.
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '16px 40px',
                background: '#ff8d8c',
                color: '#000000',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 10px 20px rgba(255,141,140,0.2)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Recarregar Sistema
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
