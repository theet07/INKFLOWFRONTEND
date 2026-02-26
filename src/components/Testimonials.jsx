import { useState, useEffect } from 'react'

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const testimonials = [
    {
      nome: "Maria Silva",
      comentario: "Trabalho impecável! A tatuagem ficou exatamente como eu imaginava. Profissionalismo e cuidado em cada detalhe.",
      funcao: "Cliente"
    },
    {
      nome: "João Santos", 
      comentario: "Ambiente limpo, equipamentos esterilizados e um resultado incrível. Recomendo de olhos fechados!",
      funcao: "Cliente"
    },
    {
      nome: "Ana Costa",
      comentario: "Atendimento excepcional desde a consulta até o pós-cuidado. Minha tatuagem cicatrizou perfeitamente!",
      funcao: "Cliente"
    },
    {
      nome: "Carlos Mendes",
      comentario: "Superou todas as minhas expectativas! O resultado final ficou ainda melhor do que imaginei.",
      funcao: "Cliente"
    },
    {
      nome: "Fernanda Lima",
      comentario: "Equipe profissional e ambiente acolhedor. Voltarei com certeza para minha próxima tatuagem!",
      funcao: "Cliente"
    },
    {
      nome: "Roberto Alves",
      comentario: "Experiência incrível do início ao fim. A arte ficou perfeita e a cicatrização foi rápida!",
      funcao: "Cliente"
    },
    {
      nome: "Juliana Pereira",
      comentario: "Profissionais extremamente talentosos. Minha tatuagem é uma verdadeira obra de arte!",
      funcao: "Cliente"
    },
    {
      nome: "Diego Martins",
      comentario: "Recomendo sem hesitar! Qualidade excepcional e atendimento personalizado.",
      funcao: "Cliente"
    },
    {
      nome: "Camila Rodrigues",
      comentario: "Melhor estúdio da cidade! Técnica impecável e resultado surpreendente.",
      funcao: "Cliente"
    }
  ]

  const maxSlides = testimonials.length - 2

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % maxSlides)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isAutoPlaying, maxSlides])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <section style={{
      background: '#000000',
      padding: '5rem 2rem',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <p style={{
          color: '#E21B3C',
          fontSize: '1.2rem',
          fontWeight: '600',
          marginBottom: '1rem',
          letterSpacing: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <svg viewBox="0 0 24 24" fill="#fbbf24" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }}>
            <path d="M11.245 4.174C11.4765 3.50808 11.5922 3.17513 11.7634 3.08285C11.9115 3.00298 12.0898 3.00298 12.238 3.08285C12.4091 3.17513 12.5248 3.50808 12.7563 4.174L14.2866 8.57639C14.3525 8.76592 14.3854 8.86068 14.4448 8.93125C14.4972 8.99359 14.5641 9.04218 14.6396 9.07278C14.725 9.10743 14.8253 9.10947 15.0259 9.11356L19.6857 9.20852C20.3906 9.22288 20.743 9.23007 20.8837 9.36432C21.0054 9.48051 21.0605 9.65014 21.0303 9.81569C20.9955 10.007 20.7146 10.2199 20.1528 10.6459L16.4387 13.4616C16.2788 13.5829 16.1989 13.6435 16.1501 13.7217C16.107 13.7909 16.0815 13.8695 16.0757 13.9507C16.0692 14.0427 16.0982 14.1387 16.1563 14.3308L17.506 18.7919C17.7101 19.4667 17.8122 19.8041 17.728 19.9793C17.6551 20.131 17.5108 20.2358 17.344 20.2583C17.1513 20.2842 16.862 20.0829 16.2833 19.6802L12.4576 17.0181C12.2929 16.9035 12.2106 16.8462 12.1211 16.8239C12.042 16.8043 11.9593 16.8043 11.8803 16.8239C11.7908 16.8462 11.7084 16.9035 11.5437 17.0181L7.71805 19.6802C7.13937 20.0829 6.85003 20.2842 6.65733 20.2583C6.49056 20.2358 6.34626 20.131 6.27337 19.9793C6.18915 19.8041 6.29123 19.4667 6.49538 18.7919L7.84503 14.3308C7.90313 14.1387 7.93218 14.0427 7.92564 13.9507C7.91986 13.8695 7.89432 13.7909 7.85123 13.7217C7.80246 13.6435 7.72251 13.5829 7.56262 13.4616L3.84858 10.6459C3.28678 10.2199 3.00588 10.007 2.97101 9.81569C2.94082 9.65014 2.99594 9.48051 3.11767 9.36432C3.25831 9.23007 3.61074 9.22289 4.31559 9.20852L8.9754 9.11356C9.176 9.10947 9.27631 9.10743 9.36177 9.07278C9.43726 9.04218 9.50414 8.99359 9.55657 8.93125C9.61593 8.86068 9.64887 8.76592 9.71475 8.57639L11.245 4.174Z" fill="#fbbf24"></path>
          </svg>
          NOSSOS CLIENTES
        </p>
        
        <h2 style={{
          fontFamily: 'Bebas Neue, cursive',
          fontSize: '5rem',
          fontWeight: '800',
          color: '#FFFFFF',
          marginBottom: '0.75rem',
          lineHeight: '1',
          letterSpacing: '2px'
        }}>DEPOIMENTOS</h2>
        
        <p style={{
          color: '#999',
          fontSize: '1rem',
          marginBottom: '2.5rem',
          maxWidth: '600px',
          margin: '0 auto 2.5rem auto'
        }}>Experiências reais de quem confiou no nosso estúdio</p>
        
        <div 
          style={{
            position: 'relative',
            maxWidth: '1800px',
            margin: '2rem auto 0 auto',
            padding: '0 3rem'
          }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div style={{
            overflow: 'hidden',
            padding: '20px 0'
          }}>
            <div style={{
              display: 'flex',
              transform: `translateX(-${currentSlide * 33.333}%)`,
              transition: 'transform 0.6s ease-in-out'
            }}>
              {testimonials.map((testimonial, index) => {
                const position = (index - currentSlide + testimonials.length) % testimonials.length
                const isSideCard = position === 0 || position === 2
                
                return (
                <div key={index} style={{
                  minWidth: '33.333%',
                  padding: '0 0.5rem',
                  transform: isSideCard ? 'translateY(-20px)' : 'translateY(0px)',
                  transition: 'transform 0.6s ease-in-out'
                }}>
                  <div style={{
                    background: 'linear-gradient(to bottom, #1a1a1a, #171717)',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: isSideCard ? '0 12px 35px rgba(0,0,0,0.5)' : '0 8px 25px rgba(0,0,0,0.4)',
                    height: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textAlign: 'center',
                    transition: 'box-shadow 0.6s ease-in-out'
                  }}>
                    <div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '1rem'
                      }}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{
                            color: '#fbbf24',
                            fontSize: '1rem',
                            marginRight: '0.125rem'
                          }}>★</span>
                        ))}
                      </div>
                      
                      <blockquote style={{
                        color: '#d1d5db',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        marginBottom: '1.5rem',
                        fontStyle: 'italic',
                        fontWeight: '300'
                      }}>"{testimonial.comentario}"</blockquote>
                    </div>
                    
                    <div>
                      <p style={{
                        color: '#ef4444',
                        fontWeight: '600',
                        fontSize: '1rem',
                        margin: '0 0 0.25rem 0'
                      }}>- {testimonial.nome}</p>
                      <span style={{
                        color: '#9ca3af',
                        fontSize: '0.8rem'
                      }}>{testimonial.funcao}</span>
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '2rem'
        }}>
          {Array.from({ length: maxSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Ir para grupo ${index + 1}`}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: '#dc2626',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: currentSlide === index ? 1 : 0.4,
                transform: currentSlide === index ? 'scale(1.2)' : 'scale(1)'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials