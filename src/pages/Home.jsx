import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Carousel from '../components/Carousel'
import Testimonials from '../components/Testimonials'
import './Home.css'

const WhatsAppSection = () => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const carouselImages = [
    '/assets/images/blackwork-tattoo.jpg',
    '/assets/images/watercolor-tattoo.jpg',
    '/assets/images/messi-tattoo.jpg',
    '/assets/images/mandala.jpg',
    '/assets/images/lobo geo.jpg',
    '/assets/images/flor.jpg'
  ]

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % carouselImages.length)
      }, 3500)
      return () => clearInterval(interval)
    }
  }, [isPaused, carouselImages.length])

  return (
    <section style={{
      background: '#000000',
      position: 'relative',
      padding: '4rem 2rem',
      overflow: 'hidden',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center'
    }}>
      {/* Formato geométrico vermelho diagonal */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: '30%',
        height: '100%',
        background: '#FF0000',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 30% 100%)',
        zIndex: 1
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
        width: '100%'
      }}>
        {/* Lado esquerdo - Texto e botão */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          <p style={{
            color: '#FF0000',
            fontSize: '1rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            margin: 0,
            display: 'flex',
            alignItems: 'center'
          }}><svg viewBox="0 0 24 24" fill="#fff700" xmlns="http://www.w3.org/2000/svg" style={{ width: '32px', height: '32px', marginRight: '8px' }}><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.245 4.174C11.4765 3.50808 11.5922 3.17513 11.7634 3.08285C11.9115 3.00298 12.0898 3.00298 12.238 3.08285C12.4091 3.17513 12.5248 3.50808 12.7563 4.174L14.2866 8.57639C14.3525 8.76592 14.3854 8.86068 14.4448 8.93125C14.4972 8.99359 14.5641 9.04218 14.6396 9.07278C14.725 9.10743 14.8253 9.10947 15.0259 9.11356L19.6857 9.20852C20.3906 9.22288 20.743 9.23007 20.8837 9.36432C21.0054 9.48051 21.0605 9.65014 21.0303 9.81569C20.9955 10.007 20.7146 10.2199 20.1528 10.6459L16.4387 13.4616C16.2788 13.5829 16.1989 13.6435 16.1501 13.7217C16.107 13.7909 16.0815 13.8695 16.0757 13.9507C16.0692 14.0427 16.0982 14.1387 16.1563 14.3308L17.506 18.7919C17.7101 19.4667 17.8122 19.8041 17.728 19.9793C17.6551 20.131 17.5108 20.2358 17.344 20.2583C17.1513 20.2842 16.862 20.0829 16.2833 19.6802L12.4576 17.0181C12.2929 16.9035 12.2106 16.8462 12.1211 16.8239C12.042 16.8043 11.9593 16.8043 11.8803 16.8239C11.7908 16.8462 11.7084 16.9035 11.5437 17.0181L7.71805 19.6802C7.13937 20.0829 6.85003 20.2842 6.65733 20.2583C6.49056 20.2358 6.34626 20.131 6.27337 19.9793C6.18915 19.8041 6.29123 19.4667 6.49538 18.7919L7.84503 14.3308C7.90313 14.1387 7.93218 14.0427 7.92564 13.9507C7.91986 13.8695 7.89432 13.7909 7.85123 13.7217C7.80246 13.6435 7.72251 13.5829 7.56262 13.4616L3.84858 10.6459C3.28678 10.2199 3.00588 10.007 2.97101 9.81569C2.94082 9.65014 2.99594 9.48051 3.11767 9.36432C3.25831 9.23007 3.61074 9.22289 4.31559 9.20852L8.9754 9.11356C9.176 9.10947 9.27631 9.10743 9.36177 9.07278C9.43726 9.04218 9.50414 8.99359 9.55657 8.93125C9.61593 8.86068 9.64887 8.76592 9.71475 8.57639L11.245 4.174Z" fill="#fff700"></path> </g></svg>VENHA FAZER UM ORÇAMENTO!!</p>

          <h2 style={{
            color: '#FFFFFF',
            fontSize: '48px',
            fontWeight: 'bold',
            lineHeight: '1.2',
            margin: 0,
            fontFamily: 'Arial, sans-serif'
          }}>CLIQUE AQUI EMBAIXO E NOS CHAME PELO WHATSAPP</h2>

          <a 
            href="https://api.whatsapp.com/send?phone=5511999999999&text=Olá!%20Vim%20pelo%20site%20e%20quero%20fazer%20um%20orçamento%20de%20tatuagem."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#25D366',
              color: '#FFFFFF',
              padding: '1rem 2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              width: 'fit-content'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#1da851'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#25D366'
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px', marginRight: '8px' }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" fill="#ffffff"/></svg>
            ORÇAMENTO WHATSAPP
          </a>
        </div>

        {/* Lado direito - Carrossel */}
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div 
            style={{
              position: 'relative',
              width: '400px',
              height: '300px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {carouselImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Tatuagem ${index + 1}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: currentImage === index ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out'
                }}
              />
            ))}
          </div>

          {/* Indicadores */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'center'
          }}>
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  border: 'none',
                  background: currentImage === index ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Media Query para responsividade */}
      <style jsx>{`
        @media (max-width: 768px) {
          section {
            padding: 2rem 1rem !important;
          }
          
          section > div:nth-child(2) {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            text-align: center !important;
          }
          
          section > div:nth-child(2) > div:first-child {
            order: 2 !important;
          }
          
          section > div:nth-child(2) > div:last-child {
            order: 1 !important;
          }
          
          section > div:nth-child(2) > div:first-child a {
            width: 80% !important;
            max-width: none !important;
          }
          
          section > div:first-child {
            width: 50% !important;
            clip-path: polygon(40% 0%, 100% 0%, 100% 100%, 0% 100%) !important;
          }
        }
      `}</style>
    </section>
  )
}

const Home = () => {
  const portfolioImages = [
    { src: '/assets/images/blackwork-tattoo.jpg', alt: 'Blackwork Tattoo', title: 'Blackwork', description: 'Tatuagem em preto sólido com traços marcantes e contrastes intensos, criando designs geométricos e tribais únicos.' },
    { src: '/assets/images/watercolor-tattoo.jpg', alt: 'Watercolor Tattoo', title: 'Aquarela', description: 'Técnica que simula pintura em aquarela na pele, com cores vibrantes e efeitos de respingo artísticos.' },
    { src: '/assets/images/messi-tattoo.jpg', alt: 'Realismo Tattoo', title: 'Realismo', description: 'Tatuagens hiper-realistas com detalhes fotográficos, capturando expressões e texturas com precisão.' },
    { src: '/assets/images/mandala.jpg', alt: 'Mandala Tattoo', title: 'Mandala', description: 'Designs circulares sagrados com padrões simétricos complexos, representando harmonia e equilíbrio.' },
    { src: '/assets/images/lobo geo.jpg', alt: 'Geométrica Tattoo', title: 'Geométrico', description: 'Combinação de formas geométricas com elementos naturais, criando designs modernos e estruturados.' },
    { src: '/assets/images/flor.jpg', alt: 'Fine Line Tattoo', title: 'Fine Line', description: 'Traços finos e delicados para designs minimalistas, perfeitos para tatuagens sutis e elegantes.' }
  ]

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 style={{ color: '#D00000' }}>INK FLOW</h1>
          <p>Transformando pele em arte desde 2025</p>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/portfolio" className="btn">Ver Portfólio</Link>
            <Link to="/agendamento" className="btn btn-outline" style={{ marginLeft: '1rem' }}>Agendar Sessão</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '12rem', paddingBottom: '12rem', display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
        <div className="experience-section" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'start',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div className="experience-left">
            <h2 style={{
              fontFamily: 'Bebas Neue, cursive',
              fontSize: '3rem',
              color: 'var(--accent-red)',
              marginBottom: '1.5rem',
              lineHeight: '1'
            }}>Experiência</h2>
            <p style={{
              color: 'var(--text-gray)',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              fontWeight: '300'
            }}>
              Mais de uma década transformando pele em arte, com especialização em técnicas avançadas e 
              compromisso absoluto com a excelência artística e segurança. Nossa jornada evoluiu constantemente 
              através de cursos especializados e certificações rigorosas, garantindo resultados que superam 
              expectativas e resistem ao tempo.
              
              Desenvolvemos expertise em múltiplos estilos artísticos, utilizando equipamentos de última geração 
              e tintas premium importadas. Cada projeto é tratado como obra única, seguindo protocolos de 
              esterilização hospitalar para total segurança.
            </p>
          </div>
          
          <div className="experience-right">
            <div className="experience-item" style={{
              borderBottom: '1px solid var(--tertiary-dark)',
              paddingBottom: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ color: 'var(--text-light)', fontSize: '1.2rem', margin: '0' }}>Realista & Blackwork</h3>
                <span style={{ color: 'var(--accent-red)', fontSize: '0.9rem' }}>2015 - Presente</span>
              </div>
              <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', margin: '0' }}>Especialização em técnicas hiper-realistas e designs ousados</p>
            </div>
            
            <div className="experience-item" style={{
              borderBottom: '1px solid var(--tertiary-dark)',
              paddingBottom: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ color: 'var(--text-light)', fontSize: '1.2rem', margin: '0' }}>Geek & Oriental</h3>
                <span style={{ color: 'var(--accent-red)', fontSize: '0.9rem' }}>2018 - Presente</span>
              </div>
              <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', margin: '0' }}>Cultura geek e tradição japonesa com mitologia</p>
            </div>
            
            <div className="experience-item" style={{
              borderBottom: '1px solid var(--tertiary-dark)',
              paddingBottom: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ color: 'var(--text-light)', fontSize: '1.2rem', margin: '0' }}>Maori & Floral</h3>
                <span style={{ color: 'var(--accent-red)', fontSize: '0.9rem' }}>2020 - Presente</span>
              </div>
              <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', margin: '0' }}>Arte corporal tradicional e beleza natural</p>
            </div>
            
            <div className="experience-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ color: 'var(--text-light)', fontSize: '1.2rem', margin: '0' }}>Certificação ANVISA</h3>
                <span style={{ color: 'var(--accent-red)', fontSize: '0.9rem' }}>Renovado 2024</span>
              </div>
              <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', margin: '0' }}>Protocolos de segurança e higiene</p>
            </div>
          </div>
        </div>
      </section>

      <section id="sobre-nos" style={{
        padding: '4rem 2rem',
        background: '#000',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          left: '-20%',
          top: '-10%',
          width: '60%',
          height: '110%',
          background: 'linear-gradient(135deg, var(--accent-red), #cc1f1f)',
          clipPath: 'polygon(30% 0, 100% 0, 70% 100%, 0% 100%)',
          zIndex: 0,
          opacity: 0.8
        }} />
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
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
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '32px', height: '32px' }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" fill="#ffffff"/></svg>
              ORÇAMENTO WHATSAPP
            </a>
          </div>
        </div>
        
        <div style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.02) 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(135deg, rgba(255,255,255,0.01) 25%, transparent 25%),
            linear-gradient(45deg, rgba(255,255,255,0.01) 25%, transparent 25%),
            linear-gradient(145deg, #1a1a1a, #0f0f0f)
          `,
          backgroundSize: '60px 60px, 80px 80px, 40px 40px, 40px 40px, 100% 100%',
          margin: '6rem 2rem 0 2rem',
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
                marginBottom: '0.5rem',
                transition: 'transform 0.2s ease-in-out'
              }} onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)'
              }} onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
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
                marginBottom: '0.5rem',
                transition: 'transform 0.2s ease-in-out'
              }} onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)'
              }} onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
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
                marginBottom: '0.5rem',
                transition: 'transform 0.2s ease-in-out'
              }} onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)'
              }} onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
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
                marginBottom: '0.5rem',
                transition: 'transform 0.2s ease-in-out'
              }} onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)'
              }} onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
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
        </div>
      </section>



      <section id="servicos" className="servicos-hero" style={{
        background: '#000000',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        paddingTop: '6rem',
        marginTop: '-2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3rem',
          maxWidth: '1400px',
          width: '100%'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            alignItems: 'center',
            textAlign: 'center',
            flex: '1',
            maxWidth: '280px'
          }}>
            <div style={{
              width: '100%',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.querySelector('h3').style.color = '#E21B3C'
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.querySelector('h3').style.color = '#FFFFFF'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                textAlign: 'center'
              }}>
                <svg width="64" height="64" viewBox="0 0 698.696 698.696" xmlns="http://www.w3.org/2000/svg" fill="#E21B3C">
                  <path d="M428.368,326.508c15.021-1.803,26.04-12.887,24.613-24.763c-0.713-5.922-4.391-10.922-9.761-14.217   c14.528-14.21,21.643-21.001,21.643-21.001h-46.944c-17.239,0-31.216,13.977-31.216,31.216v45.757   c7.68-7.673,14.769-14.742,21.293-21.222C413.438,325.736,420.683,327.429,428.368,326.508z"/>
                  <path d="M245.714,301.746c-1.427,11.869,9.593,22.953,24.614,24.763c7.692,0.921,14.937-0.766,20.372-4.229   c6.524,6.479,13.613,13.549,21.292,21.222v-45.757c0-17.239-13.977-31.216-31.216-31.216h-46.944c0,0,7.122,6.784,21.643,21.001   C250.105,290.823,246.428,295.824,245.714,301.746z"/>
                  <path d="M67.212,183.892c-18.394,41.166-26.216,89.523-23.251,143.732l1.063,19.502l26.248-6.297   c-0.02,16.11,1.07,39.621,5.831,66.395c5.156,28.992,13.582,55.895,25.035,79.944c14.502,30.444,33.908,56.381,57.678,77.077   l15.592,13.575l8.951-17.194c7.679,11.078,18.089,25.029,30.989,39.966c27.493,31.832,72.044,74.295,128.159,95.86l5.837,2.244   l5.844-2.244c56.109-21.56,100.66-64.028,128.153-95.86c12.9-14.937,23.31-28.888,30.989-39.966l8.95,17.194l15.592-13.575   c23.771-20.696,43.176-46.626,57.678-77.077c11.454-24.056,19.88-50.952,25.036-79.944c4.76-26.773,5.85-50.291,5.83-66.395   l26.248,6.297l1.07-19.502c2.964-54.208-4.857-102.566-23.252-143.738c-14.897-33.344-36.657-61.946-64.67-85.016   c-19.879-16.37-40.004-27.558-56.86-35.069l46.243-20.443l-26.015-16.286C501.482,9.113,465.94,0,424.535,0   c-34.998,0-64.112,6.616-75.184,9.521C338.273,6.616,309.159,0,274.167,0c-41.398,0-76.947,9.113-105.647,27.072l-26.015,16.286   l46.244,20.443c-16.85,7.511-36.982,18.699-56.854,35.069C103.87,121.946,82.11,150.548,67.212,183.892z M75.923,306.221   c-0.045-23.576,2.29-45.699,6.94-66.227c19.794-0.681,36.515,4.119,49.824,14.353c10.118,7.776,15.313,16.578,16.915,19.646   c-4.891,23.33-5.104,40.679-5.111,42.326l-0.033,6.343l18.718,20.566c-3.334,1.005-6.804,2.225-10.371,3.71   c-14.009,5.824-31.229,16.545-46.367,36.178c-4.287-35.367-1.894-61.239-1.868-61.524l2.257-22.785L75.923,306.221z    M228.715,194.14c28.375-23.103,67.9-29.828,117.464-19.989l3.171,0.629l3.172-0.629c49.564-9.839,89.082-3.113,117.464,19.989   c42.32,34.453,49.986,96.703,51.361,116.277l-55.72,61.226c-11.759-18.743-23.725-30.931-24.73-31.942l-23.089,22.973   c0.104,0.104,10.475,10.688,20.391,26.527c8.951,14.281,19.387,35.879,18.297,57.639c-0.791,15.819-7.427,29.737-20.223,42.333   l-7.764-2.86l0,0l-73.737-27.169c1.35-10.682,4.385-23.764,11.221-28.589c12.304-8.685,33.292-22.435,0-24.607   c0,0-7.958,4.346-16.649,4.346c-8.685,0-16.643-4.346-16.643-4.346c-33.292,2.173-12.304,15.923,0,24.607   c6.836,4.825,9.871,17.907,11.22,28.589l-73.73,27.163l0,0l-7.764,2.86c-12.764-12.563-19.399-26.449-20.216-42.217   c-2.198-42.385,38.292-83.881,38.701-84.296l-11.564-11.467l11.545,11.486L257.811,339.7c-1.005,1.012-12.972,13.199-24.73,31.942   l-55.719-61.226C178.729,290.811,186.408,228.585,228.715,194.14z M400.427,531.407c-0.396,0.24-1.044,0.513-2.601,0.513l0,0   c-3.729,0-9.353-1.596-15.307-3.282c-9.086-2.574-20.397-5.778-33.168-5.778c-12.771,0-24.082,3.204-33.168,5.778   c-5.954,1.687-11.577,3.282-15.306,3.282c-1.55,0-2.206-0.272-2.595-0.513c-1.706-2.426-2.049-11.207-0.597-20.527l51.666-19.036   l51.66,19.036C402.38,519.739,402.256,528.819,400.427,531.407z M566.931,473.639c-9.288,19.393-20.819,36.605-34.4,51.399   l-16.15-30.988l-14.762,26.144c-0.155,0.272-15.838,27.863-43.39,59.65c-23.984,27.668-61.984,64.132-108.877,83.849   c-46.893-19.717-84.899-56.181-108.877-83.849c-27.552-31.787-43.234-59.378-43.384-59.644l-14.749-26.216l-16.163,31.048   c-13.588-14.788-25.113-32.008-34.401-51.4c-6.207-12.952-11.421-26.903-15.618-41.69c20.508-51.88,57.743-59.637,72.628-60.584   l28.654,31.488c-5.241,14.029-8.568,29.537-7.764,45.608c1.388,27.701,14.463,51.906,38.856,71.947l7.212,5.921l8.438-3.106   c0.272,12.939,3.755,26.891,15.501,34.926c6.148,4.21,13.276,6.337,21.196,6.337c8.256,0,16.357-2.296,24.186-4.514   c7.887-2.238,16.046-4.547,24.289-4.547c8.244,0,16.396,2.309,24.29,4.547c7.835,2.218,15.936,4.514,24.186,4.514l0,0   c7.912,0,15.047-2.134,21.195-6.337c11.746-8.035,15.223-21.986,15.501-34.926l8.438,3.106l7.212-5.921   c24.394-20.041,37.469-44.246,38.856-71.947c0.805-16.071-2.522-31.579-7.764-45.608l28.615-31.442   c5.455,0.376,14.017,1.641,23.518,5.597c21.845,9.087,38.364,27.564,49.156,54.935   C578.353,446.729,573.138,460.68,566.931,473.639z M591.939,298.84l2.199,22.732c0.032,0.305,2.426,26.177-1.861,61.544   c-15.138-19.639-32.364-30.354-46.367-36.178c-3.567-1.485-7.037-2.705-10.371-3.71l18.719-20.566l-0.033-6.343   c-0.006-1.647-0.22-19.01-5.117-42.365c2.983-5.896,20.313-35.393,66.771-33.927c4.644,20.521,6.959,42.638,6.92,66.201   L591.939,298.84z M601.753,197.175c1.518,3.392,2.944,6.855,4.3,10.364c-28.946,1.395-48.98,12.174-61.608,22.337   c-2.438,1.958-4.67,3.956-6.72,5.941c-9.352-23.563-24.017-48.008-47.009-66.791c-0.688-0.564-1.395-1.109-2.095-1.654   c3.496-13.399,14.612-36.95,49.96-49.266c2.504,1.875,5.014,3.846,7.518,5.909C570.206,143.855,588.931,168.469,601.753,197.175z    M216.788,40.595c17.032-5.331,36.217-8.023,57.38-8.023c38.785,0,70.144,9.333,70.436,9.424l4.748,1.434l4.729-1.427   c0.311-0.097,31.67-9.43,70.455-9.43c21.163,0,40.348,2.692,57.38,8.023l-71.39,31.566l51.641,9.657   c0.278,0.052,18.77,3.645,43.124,15.787c-20.69,11.953-32.65,27.175-39.473,39.732c-2.413,4.443-4.313,8.756-5.812,12.816   c-30.788-13.679-67.842-16.571-110.661-8.548c-42.819-8.023-79.873-5.137-110.661,8.548c-1.499-4.054-3.399-8.373-5.812-12.816   c-6.816-12.543-18.763-27.753-39.421-39.7c24.27-12.063,42.819-15.767,43.072-15.819l51.64-9.657L216.788,40.595z    M151.502,124.917c2.873-2.4,5.753-4.663,8.626-6.816c20.054,6.933,34.634,18.167,43.416,33.499   c3.333,5.812,5.299,11.363,6.46,15.819c-0.675,0.532-1.356,1.057-2.024,1.602c-22.992,18.783-37.65,43.228-47.009,66.791   c-2.05-1.984-4.281-3.976-6.719-5.941c-12.622-10.157-32.65-20.936-61.589-22.331c1.239-3.217,2.529-6.395,3.904-9.515   C109.208,169.396,127.692,144.802,151.502,124.917z"/>
                </svg>
                <h3 style={{
                  color: '#FFFFFF',
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  margin: '0',
                  fontFamily: 'inherit',
                  transition: 'color 0.2s ease-in-out'
                }}>REALISTA</h3>
                <p style={{
                  color: '#d6d6d6',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  margin: '0',
                  fontWeight: '400'
                }}>Tatuagens realistas são altamente detalhadas e parecem fotografias na pele. Podem retratar rostos, animais, paisagens e outros elementos de forma extremamente precisa.</p>
              </div>
            </div>
            <div style={{
              width: '100%',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.querySelector('h3').style.color = '#E21B3C'
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.querySelector('h3').style.color = '#FFFFFF'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                textAlign: 'center'
              }}>
                <img src="/assets/images/wow.svg" alt="Blackwork" style={{ width: '100px', height: '100px', filter: 'brightness(0) saturate(100%) invert(18%) sepia(95%) saturate(7495%) hue-rotate(348deg) brightness(95%) contrast(95%)' }} />
                <h3 style={{
                  color: '#FFFFFF',
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  margin: '0',
                  fontFamily: 'inherit',
                  transition: 'color 0.2s ease-in-out'
                }}>BLACKWORK</h3>
                <p style={{
                  color: '#d6d6d6',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  margin: '0',
                  fontWeight: '400'
                }}>Esse estilo se concentra no uso de tinta preta para criar tatuagens ousadas e impactantes. Pode incluir padrões abstratos, mandalas, ornamentos ou ilustrações complexas.</p>
              </div>
            </div>
            <div style={{
              width: '100%',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.querySelector('h3').style.color = '#E21B3C'
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.querySelector('h3').style.color = '#FFFFFF'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                textAlign: 'center'
              }}>
                <svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#E21B3C" width="64" height="64">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <title>naruto [#119]</title>
                    <desc>Created with Sketch.</desc>
                    <defs></defs>
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="Dribbble-Light-Preview" transform="translate(-260.000000, -7639.000000)" fill="#E21B3C">
                        <g id="icons" transform="translate(56.000000, 160.000000)">
                          <path d="M210.593931,7496.99997 L207.738773,7496.99997 C206.968159,7496.99997 206.488644,7496.06497 206.879434,7495.39897 L207.994979,7493.53898 C208.577177,7494.87897 209.474398,7495.99997 210.593931,7496.99997 M211.722437,7484.45598 C214.470925,7482.13098 217.528457,7483.06498 220.109464,7483.56598 C220.872102,7483.71498 221.651688,7483.40498 222.106281,7482.77298 L223.81798,7480.53099 C224.094125,7480.14599 224.052254,7479.61799 223.718289,7479.28299 C223.288619,7478.85199 222.572836,7478.92299 222.235879,7479.42999 C220.40455,7481.83398 220.703624,7481.84898 217.294182,7481.05899 C216.470732,7480.86799 215.615381,7480.78999 214.779968,7480.92499 C210.230058,7481.65998 206.838561,7485.82598 207.288168,7490.65598 L204.277491,7495.89197 C203.496909,7497.22497 204.455939,7498.99997 205.997166,7498.99997 L215.963304,7498.99997 C219.950955,7499.00997 222.511027,7496.40397 223.039391,7492.90298 C223.611619,7489.10298 221.175164,7485.76798 217.732824,7484.98398 C214.524758,7484.25298 211.234946,7486.47998 211.215008,7489.77998 C211.201051,7492.26898 213.008454,7494.33897 215.373131,7494.73997 C217.163587,7495.04297 218.997906,7493.94598 219.18732,7492.13498 C219.376733,7490.33198 217.975074,7488.80998 216.21652,7488.80998 C215.666224,7488.80998 215.220604,7489.25698 215.220604,7489.80998 C215.220604,7490.36198 215.667221,7490.80998 216.218513,7490.80998 C216.768809,7490.80998 217.215426,7491.25698 217.215426,7491.80998 C217.215426,7492.36198 216.768809,7492.80998 216.218513,7492.80998 C214.459959,7492.80998 213.056306,7491.28698 213.244722,7489.48498 C213.435133,7487.67298 215.264468,7486.57598 217.054923,7486.87998 C219.4196,7487.28098 221.217034,7489.35098 221.203078,7491.83898 C221.184136,7495.08197 217.970089,7497.31997 214.803894,7496.66597 C211.62773,7496.00997 209.240124,7493.18898 209.240124,7489.80998 C209.240124,7487.66198 210.205135,7485.73998 211.722437,7484.45598" id="naruto-[#119]"></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
                <h3 style={{
                  color: '#FFFFFF',
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  margin: '0',
                  fontFamily: 'inherit',
                  transition: 'color 0.2s ease-in-out'
                }}>GEEK</h3>
                <p style={{
                  color: '#d6d6d6',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  margin: '0',
                  fontWeight: '400'
                }}>É um estilo de tatuagem que incorpora elementos relacionados à cultura geek, que inclui temas como filmes, séries de TV, jogos de vídeo game, histórias em quadrinhos, tecnologia e muito mais.</p>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: '0 0 auto'
          }}>
            <img 
              src="/assets/images/mao.png" 
              alt="Mão segurando máquina de tatuagem"
              style={{
                width: '400px',
                height: 'auto'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            alignItems: 'center',
            textAlign: 'center',
            flex: '1',
            maxWidth: '280px'
          }}>
            <div style={{
              width: '100%',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.querySelector('h3').style.color = '#E21B3C'
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.querySelector('h3').style.color = '#FFFFFF'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                textAlign: 'center'
              }}>
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#E21B3C" width="64" height="64">
                  <path fill="#E21B3C" d="M325.41 32.18L222.562 237.879h13.711l13.364-13.363 6.363-6.364 19.727 19.727H346l74.947-179.873c-8.11-4.986-23.97-11.715-41.314-16.445-19.05-5.196-39.628-8.654-54.223-9.381zm-139.205.021c-14.576.771-34.953 4.21-53.838 9.36-17.344 4.73-33.204 11.46-41.314 16.445L166 237.879h36.44l38.722-77.445zm29.25 22.563l36.25 84.584 41.984-83.971c-26.948 5.752-51.079 5.561-78.234-.613zM88.416 98.478l-43.691 65.54 65.88 39.529 15.24-15.24zm335.168 0l-37.43 89.829 15.24 15.24 65.881-39.53zM256 243.605l-20.42 20.42 20.42 30.63 20.42-30.63zM153 255.88v30h75.518l-16.098-24.147 5.853-5.853zm140.727 0l5.853 5.853-16.098 24.147H359v-30zm-129.125 48l-26.045 165.24c114.22 14.268 120.666 14.268 234.886 0l-26.045-165.24h-75.916L256 327.102l-15.482-23.223z"/>
                </svg>
                <h3 style={{
                  color: '#FFFFFF',
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  margin: '0',
                  fontFamily: 'inherit',
                  transition: 'color 0.2s ease-in-out'
                }}>ORIENTAL</h3>
                <p style={{
                  color: '#d6d6d6',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  margin: '0',
                  fontWeight: '400'
                }}>Originário do Japão, esse estilo tradicional é caracterizado por grandes composições, cores vibrantes e imagens inspiradas na mitologia e cultura japonesas, como dragões, flores de cerejeira e carpas.</p>
              </div>
            </div>
            <div style={{
              width: '100%',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.querySelector('h3').style.color = '#E21B3C'
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.querySelector('h3').style.color = '#FFFFFF'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                textAlign: 'center'
              }}>
                <svg fill="#E21B3C" height="64px" width="64px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 478.977 478.977" xml:space="preserve">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <g>
                      <path d="M239.489,40.737c-76.104,0-138.02,61.916-138.02,138.02s61.916,138.02,138.02,138.02c76.104,0,138.02-61.916,138.02-138.02 S315.593,40.737,239.489,40.737z M239.489,60.737c48.703,0,90.607,29.655,108.612,71.855H130.876 C148.881,90.392,190.786,60.737,239.489,60.737z M194.428,168.758h-72.531c0.464-5.503,1.304-10.901,2.5-16.165h77.087 C198.162,157.403,195.733,162.87,194.428,168.758z M121.897,188.758h72.531c1.306,5.887,3.734,11.353,7.055,16.163h-77.087 C123.201,199.657,122.361,194.26,121.897,188.758z M213.324,178.757c0-14.427,11.737-26.164,26.164-26.164 s26.163,11.737,26.163,26.164s-11.736,26.164-26.163,26.164S213.324,193.184,213.324,178.757z M284.548,188.758h72.532 c-0.464,5.502-1.304,10.899-2.5,16.163h-77.088C280.814,200.111,283.242,194.645,284.548,188.758z M357.08,168.758h-72.532 c-1.306-5.888-3.734-11.355-7.056-16.165h77.088C355.776,157.857,356.616,163.255,357.08,168.758z M239.489,296.776 c-48.703,0-90.608-29.655-108.612-71.856h217.225C330.096,267.121,288.192,296.776,239.489,296.776z"/>
                      <path d="M220.034,116.822c1.953,1.953,4.512,2.929,7.071,2.929s5.119-0.976,7.071-2.929l5.315-5.315l5.315,5.315 c1.953,1.953,4.512,2.929,7.071,2.929s5.118-0.976,7.071-2.929c3.905-3.905,3.905-10.237,0-14.143l-5.315-5.315l5.315-5.315 c3.905-3.905,3.905-10.237,0-14.143c-3.906-3.905-10.236-3.905-14.143,0l-5.315,5.315l-5.315-5.315 c-3.905-3.905-10.237-3.905-14.143,0c-3.905,3.905-3.905,10.237,0,14.143l5.315,5.315l-5.315,5.315 C216.129,106.584,216.129,112.917,220.034,116.822z"/>
                      <path d="M258.946,240.692c-3.906-3.905-10.236-3.905-14.143,0l-5.312,5.312l-5.312-5.312c-3.905-3.905-10.237-3.905-14.143,0 c-3.905,3.905-3.905,10.237,0,14.143l5.312,5.312l-5.312,5.312c-3.905,3.905-3.905,10.237,0,14.143 c1.953,1.953,4.512,2.929,7.071,2.929s5.119-0.976,7.071-2.929l5.312-5.312l5.312,5.312c1.953,1.953,4.512,2.929,7.071,2.929 s5.118-0.976,7.071-2.929c3.905-3.905,3.905-10.237,0-14.143l-5.312-5.312l5.312-5.312 C262.851,250.929,262.851,244.597,258.946,240.692z"/>
                      <path d="M393.05,270.161c15.99-26.763,25.195-58.027,25.195-91.404C418.245,80.19,338.055,0,239.489,0 C140.922,0,60.732,80.19,60.732,178.757c0,33.375,9.203,64.636,25.191,91.398v40.976c-11.395,12.847-17.635,29.199-17.635,46.518 c0,18.756,7.304,36.389,20.566,49.652c1.953,1.953,4.512,2.929,7.071,2.929s5.119-0.976,7.071-2.929 c13.262-13.263,20.566-30.896,20.566-49.652c0-17.321-6.241-33.676-17.64-46.523V297.42c14.58,16.393,32.119,30.098,51.779,40.257 v24.553c-24.393,27.544-23.424,69.808,2.934,96.166c1.875,1.875,4.419,2.929,7.071,2.929c2.652,0,5.196-1.054,7.072-2.929 c13.262-13.262,20.566-30.896,20.566-49.651c0-17.322-6.242-33.678-17.643-46.526v-15.716c16.287,6.018,33.683,9.724,51.79,10.728 v22.643c-24.402,27.543-23.435,69.815,2.925,96.176c1.875,1.875,4.419,2.929,7.071,2.929c2.653,0,5.196-1.054,7.072-2.929 c13.263-13.263,20.566-30.896,20.566-49.652c0-17.318-6.24-33.67-17.635-46.517v-22.651c18.102-1.003,35.495-4.708,51.779-10.725 v15.719c-11.397,12.847-17.639,29.202-17.639,46.522c0,18.756,7.304,36.389,20.566,49.652c1.953,1.953,4.512,2.929,7.071,2.929 s5.118-0.976,7.071-2.929c13.263-13.263,20.566-30.896,20.566-49.652c0-17.319-6.241-33.673-17.637-46.52v-24.545 c19.66-10.158,37.199-23.862,51.779-40.255v13.704c-11.396,12.847-17.637,29.201-17.637,46.52c0,18.756,7.304,36.389,20.566,49.652 c1.953,1.953,4.512,2.929,7.071,2.929s5.118-0.976,7.071-2.929c13.263-13.263,20.566-30.896,20.566-49.652 c0-17.32-6.242-33.675-17.639-46.522V270.161z M95.926,384.305c-4.975-7.913-7.638-17.08-7.638-26.657 c0-9.576,2.663-18.744,7.638-26.657c4.975,7.913,7.638,17.081,7.638,26.657C103.563,367.225,100.9,376.392,95.926,384.305z M167.707,435.4c-4.975-7.913-7.637-17.08-7.637-26.657c0-9.576,2.663-18.744,7.638-26.656c4.975,7.913,7.637,17.08,7.637,26.656 C175.344,418.32,172.681,427.488,167.707,435.4z M311.27,435.4c-4.975-7.913-7.638-17.08-7.638-26.657 c0-9.576,2.663-18.744,7.638-26.657c4.975,7.913,7.638,17.081,7.638,26.657C318.907,418.32,316.244,427.488,311.27,435.4z M239.495,453.042c-10.163-16.234-10.163-37.056,0.001-53.29c4.97,7.91,7.63,17.074,7.63,26.645S244.465,445.132,239.495,453.042z M239.489,337.514c-87.539,0-158.757-71.218-158.757-158.757S151.95,20,239.489,20c87.539,0,158.757,71.218,158.757,158.757 S327.028,337.514,239.489,337.514z M383.051,384.305c-4.975-7.913-7.638-17.08-7.638-26.657c0-9.576,2.663-18.744,7.638-26.657 c4.975,7.913,7.638,17.081,7.638,26.657C390.689,367.225,388.026,376.392,383.051,384.305z"/>
                      <path d="M239.491,168.757c-2.64,0-5.21,1.07-7.07,2.93c-1.87,1.86-2.93,4.44-2.93,7.07s1.06,5.21,2.93,7.07 c1.86,1.86,4.43,2.93,7.07,2.93c2.63,0,5.21-1.07,7.069-2.93c1.86-1.86,2.931-4.44,2.931-7.07s-1.07-5.21-2.931-7.07 C244.701,169.827,242.121,168.757,239.491,168.757z"/>
                    </g>
                  </g>
                </svg>
                <h3 style={{
                  color: '#FFFFFF',
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  margin: '0',
                  fontFamily: 'inherit',
                  transition: 'color 0.2s ease-in-out'
                }}>MAORI</h3>
                <p style={{
                  color: '#d6d6d6',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  margin: '0',
                  fontWeight: '400'
                }}>As tatuagens Maori, também conhecidas como Moko, são uma forma de arte corporal tradicional da cultura indígena maori da Nova Zelândia. Essas tatuagens têm uma rica história e significado cultural.</p>
              </div>
            </div>
            <div style={{
              width: '100%',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.querySelector('h3').style.color = '#E21B3C'
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.querySelector('h3').style.color = '#FFFFFF'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                textAlign: 'center'
              }}>
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#E21B3C" width="64" height="64">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path fill="#E21B3C" d="M254.7 32.45c-14.6 15.09-28.7 29.9-39.2 44.31-12.1 16.49-19.3 32.24-19.3 46.14 0 24.3 2.1 48.4 7.2 67.7 17.1 12 31.4 26.4 42.3 43.7v-77h18V235c12.6-17.5 27.6-31.9 44.7-44 5.1-19.4 7.3-43.7 7.3-68.2 0-13.9-7.2-29.55-19.3-46.04-10.5-14.41-26.5-29.22-41.7-44.31zM109.6 172.4c-9.79.2-21.86 2.5-34.03 6.6-17 5.7-35.64 14.6-54.58 24 9.68 18.4 19.36 36.3 29.71 50.7 11.85 18.9 24.5 30.5 38.07 34.8 24.33 7.6 45.73 12.2 65.73 13.3 18-12.5 37.4-21.6 57.3-26.5l-74.7-26 5.6-17.2 75.4 23.8c3.1-5.1 7.1-9.6 11.9-13-20.6-32.6-55.4-52.9-104.1-68.2-5-1.7-10.4-2.4-16.3-2.3zm290.8.3c-5.1.1-9.8.8-14.1 2.2-49.5 15.3-83.3 35.4-104 67.9 4.9 3.5 9.1 8 12.1 13.2l72.5-23.6 6.7 17.2-73.5 26c.1 1.5.2 2.9.2 4.4 0 4.6-.8 9.1-2.2 13.3 35.7 14.2 76.1 10.7 124.3-4.7 13.3-4.1 25.6-15.8 37.2-34.8 10.2-14.3 21.7-32.3 31.4-50.6-20.9-9.4-39.1-18.3-55.7-24-11.9-4.1-22.9-6.5-32.7-6.6zm-145.4 80c-13.8 0-24.8 13.5-24.8 27.3s11 24.8 24.8 24.8c14.4 0 27.2-11 27.2-24.8s-12.8-27.3-27.2-27.3zM214.2 293c-38 9.6-69.5 35.6-98.6 78.1-8.2 11.2-11.3 27.8-11 48 .3 17.5 3.2 37.6 6.4 60.5 20.3-3.3 40.3-6.8 57.6-11.9 21.2-8.5 36-16.6 44.2-27.8 14.4-19.9 25.5-38.9 32.7-57.6-6.7-22.3-9.7-42.3-8.3-62.7l-44.6 63.9-15.3-10.7 45.8-64.5c-4-4.3-7-9.7-8.9-15.3zm76 16.6l44 63.1-14.6 10.6-46.1-64.2c-5.9 2.4-12.3 3.7-18.5 3.7h-.1c-2.4 38.7 13.6 77 44.6 116.9 8.1 11.3 22.9 19.4 42.2 27.8 16.7 5.2 38.8 8.6 59.5 11.9 3.2-22.9 6.2-43 6.4-60.5.3-20.1-2.8-36.7-11-47.9-14.4-22.2-31.2-38.5-46.6-51.1-20.9.4-40.8-2.8-59.8-10.3z"/>
                  </g>
                </svg>
                <h3 style={{
                  color: '#FFFFFF',
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  margin: '0',
                  fontFamily: 'inherit',
                  transition: 'color 0.2s ease-in-out'
                }}>FLORAL</h3>
                <p style={{
                  color: '#d6d6d6',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  margin: '0',
                  fontWeight: '400'
                }}>A tatuagem floral simboliza beleza, feminilidade e renovação. Além da estética, a escolha floral reflete conexões emocionais, memórias e um apego à natureza.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      <WhatsAppSection />
    </div>
  )
}

export default Home