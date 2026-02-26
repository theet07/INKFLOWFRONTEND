const About = () => {
  return (
    <div style={{
      background: '#000',
      minHeight: '100vh',
      paddingTop: '8rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        left: '-20%',
        top: '5%',
        width: '60%',
        height: '95%',
        background: 'linear-gradient(135deg, var(--accent-red), #cc1f1f)',
        clipPath: 'polygon(30% 0, 100% 0, 70% 100%, 0% 100%)',
        zIndex: 0,
        opacity: 0.8
      }} />
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 2rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src="/assets/images/Retrato INK.png" 
            alt="Retrato INK" 
            style={{
              width: '100%',
              maxWidth: '400px',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }} 
          />
        </div>
        
        <div style={{
          color: 'white'
        }}>
          <p style={{
            color: 'var(--accent-red)',
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '1rem',
            letterSpacing: '2px'
          }}>BEM VINDO AO INK FLOW</p>
          
          <h2 style={{
            fontFamily: 'Bebas Neue, cursive',
            fontSize: '3.5rem',
            color: 'white',
            marginBottom: '2rem',
            lineHeight: '1.1'
          }}>NÓS SOMOS O MELHOR ESTÚDIO DE TATUAGEM</h2>
          
          <p style={{
            color: '#ccc',
            fontSize: '1.1rem',
            lineHeight: '1.7',
            marginBottom: '2rem'
          }}>
            Nossa missão é transformar sua pele em uma obra de arte única. Com mais de 10 anos de experiência, 
            combinamos técnicas tradicionais com inovação artística para criar tatuagens que contam sua história.
          </p>
          
          <div style={{
            marginBottom: '2rem'
          }}>
            <div style={{
              fontFamily: 'cursive',
              fontSize: '1.5rem',
              color: 'var(--accent-red)',
              marginBottom: '0.5rem'
            }}>Lilly Kuiavski</div>
            <p style={{
              color: '#999',
              fontSize: '0.9rem'
            }}>Fundador & Artista Principal</p>
          </div>
          
          <a href="https://wa.me/5511999999999" style={{
            background: '#25d366',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
          }} onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.4)'
          }} onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.3)'
          }}>
            <span>📱</span>
            ORÇAMENTO WHATSAPP
          </a>
        </div>
      </div>
      
      <section style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(255,255,255,0.02) 1px, transparent 1px),
          radial-gradient(circle at 80% 70%, rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(135deg, rgba(255,255,255,0.01) 25%, transparent 25%),
          linear-gradient(45deg, rgba(255,255,255,0.01) 25%, transparent 25%),
          linear-gradient(145deg, #1a1a1a, #0f0f0f)
        `,
        backgroundSize: '60px 60px, 80px 80px, 40px 40px, 40px 40px, 100% 100%',
        margin: '6rem 2rem 4rem 2rem',
        padding: '3rem 2rem',
        borderRadius: '16px',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto',
        border: '1px solid rgba(255,255,255,0.1)',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <img src="/assets/icons/clients.svg" alt="Clientes" style={{
              width: '48px',
              height: '48px',
              marginBottom: '0.5rem'
            }} />
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '0.5rem'
            }}>1.500<span style={{ color: 'var(--accent-red)' }}>+</span></div>
            <p style={{
              color: '#ccc',
              fontSize: '0.9rem',
              margin: 0
            }}>Clientes Satisfeitos</p>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <img src="/assets/icons/arts.svg" alt="Artes" style={{
              width: '48px',
              height: '48px',
              marginBottom: '0.5rem'
            }} />
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '0.5rem'
            }}>1.200<span style={{ color: 'var(--accent-red)' }}>+</span></div>
            <p style={{
              color: '#ccc',
              fontSize: '0.9rem',
              margin: 0
            }}>Artes Criadas</p>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <img src="/assets/icons/years.svg" alt="Experiência" style={{
              width: '48px',
              height: '48px',
              marginBottom: '0.5rem'
            }} />
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '0.5rem'
            }}>10<span style={{ color: 'var(--accent-red)' }}>+</span></div>
            <p style={{
              color: '#ccc',
              fontSize: '0.9rem',
              margin: 0
            }}>Anos de Experiência</p>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <img src="/assets/icons/team.svg" alt="Time" style={{
              width: '48px',
              height: '48px',
              marginBottom: '0.5rem'
            }} />
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '0.5rem'
            }}>100<span style={{ color: 'var(--accent-red)' }}>%</span></div>
            <p style={{
              color: '#ccc',
              fontSize: '0.9rem',
              margin: 0
            }}>Time Profissional</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About