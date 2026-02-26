import { useState } from 'react'

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('todos')

  const portfolioItems = [
    { id: 1, category: 'realista', image: '/assets/portifolio_novo/Rosto.webp', title: 'Realista', description: 'Tatuagens altamente detalhadas que parecem fotografias na pele' },
    { id: 2, category: 'realista', image: '/assets/portifolio_novo/FullColorAndre.webp', title: 'Realista', description: 'Tatuagens altamente detalhadas que parecem fotografias na pele' },
    { id: 3, category: 'realista', image: '/assets/portifolio_novo/MulherLobo.webp', title: 'Realista', description: 'Tatuagens altamente detalhadas que parecem fotografias na pele' },
    { id: 4, category: 'realista', image: '/assets/portifolio_novo/Dog.webp', title: 'Realista', description: 'Tatuagens altamente detalhadas que parecem fotografias na pele' },
    { id: 5, category: 'blackwork', image: '/assets/portifolio_novo/Caveira.webp', title: 'Blackwork', description: 'Uso de tinta preta para criar tatuagens ousadas e impactantes' },
    { id: 6, category: 'blackwork', image: '/assets/portifolio_novo/BussolaOlho.webp', title: 'Blackwork', description: 'Uso de tinta preta para criar tatuagens ousadas e impactantes' },
    { id: 7, category: 'geek', image: '/assets/portifolio_novo/HomemDeFerro.webp', title: 'Geek', description: 'Elementos da cultura geek: filmes, séries, games e quadrinhos' },
    { id: 8, category: 'geek', image: '/assets/portifolio_novo/Tattoo-Anim.webp', title: 'Geek', description: 'Elementos da cultura geek: filmes, séries, games e quadrinhos' },
    { id: 9, category: 'geek', image: '/assets/portifolio_novo/Tattoo-Anime-Varios (1).webp', title: 'Geek', description: 'Elementos da cultura geek: filmes, séries, games e quadrinhos' },
    { id: 10, category: 'oriental', image: '/assets/portifolio_novo/tigrao.webp', title: 'Oriental', description: 'Estilo tradicional japonês com dragões, flores de cerejeira e carpas' },
    { id: 11, category: 'oriental', image: '/assets/portifolio_novo/Mexicana.webp', title: 'Oriental', description: 'Estilo tradicional japonês com dragões, flores de cerejeira e carpas' },
    { id: 12, category: 'maori', image: '/assets/portifolio_novo/Rosa-Dos-Ventos-1.webp', title: 'Maori', description: 'Arte corporal tradicional da cultura indígena maori da Nova Zelândia' },
    { id: 13, category: 'maori', image: '/assets/portifolio_novo/CorpoRavena.webp', title: 'Maori', description: 'Arte corporal tradicional da cultura indígena maori da Nova Zelândia' },
    { id: 14, category: 'floral', image: '/assets/portifolio_novo/Tattoo-Cobra-Floral.webp', title: 'Floral', description: 'Simboliza beleza, feminilidade e conexão com a natureza' },
    { id: 15, category: 'floral', image: '/assets/portifolio_novo/Borboleta-Colorida.webp', title: 'Floral', description: 'Simboliza beleza, feminilidade e conexão com a natureza' },
    { id: 16, category: 'realista', image: '/assets/images/messi-tattoo.jpg', title: 'Realista', description: 'Tatuagens altamente detalhadas que parecem fotografias na pele' },
    { id: 17, category: 'blackwork', image: '/assets/images/black work.jpeg', title: 'Blackwork', description: 'Uso de tinta preta para criar tatuagens ousadas e impactantes' },
    { id: 18, category: 'realista', image: '/assets/images/blackwork-tattoo.jpg', title: 'Realista', description: 'Tatuagens altamente detalhadas que parecem fotografias na pele' },
    { id: 19, category: 'oriental', image: '/assets/images/mandala.jpg', title: 'Oriental', description: 'Estilo tradicional japonês com dragões, flores de cerejeira e carpas' },
    { id: 20, category: 'maori', image: '/assets/images/lobo geo.jpg', title: 'Maori', description: 'Arte corporal tradicional da cultura indígena maori da Nova Zelândia' },
    { id: 21, category: 'floral', image: '/assets/images/flor.jpg', title: 'Floral', description: 'Simboliza beleza, feminilidade e conexão com a natureza' }
  ]

  const filteredItems = activeFilter === 'todos' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter)

  return (
    <div className="portfolio" style={{
      background: 'linear-gradient(145deg, #050505, #0f0f0f)',
      minHeight: '100vh'
    }}>
      <section className="section" style={{ paddingTop: '8rem' }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem'
        }}>
          <h2 style={{
            fontFamily: 'Bebas Neue, cursive',
            fontSize: '4rem',
            color: 'var(--accent-red)',
            marginBottom: '1rem',
            textShadow: '0 0 20px rgba(226, 27, 60, 0.3)',
            letterSpacing: '2px'
          }}>PORTFÓLIO</h2>
          
          <div style={{
            width: '80px',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, var(--accent-red), transparent)',
            margin: '0 auto 2rem auto'
          }}></div>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.8rem',
          marginBottom: '4rem',
          flexWrap: 'wrap',
          padding: '1rem',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '50px',
          maxWidth: '800px',
          margin: '0 auto 4rem auto',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {['todos', 'realista', 'blackwork', 'geek', 'oriental', 'maori', 'floral'].map(filter => (
            <button
              key={filter}
              style={{
                padding: '12px 24px',
                background: activeFilter === filter 
                  ? 'linear-gradient(135deg, var(--accent-red), #ff4757)' 
                  : 'rgba(255,255,255,0.05)',
                color: activeFilter === filter ? 'white' : 'var(--text-light)',
                border: activeFilter === filter 
                  ? '1px solid var(--accent-red)' 
                  : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '30px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.95rem',
                fontWeight: activeFilter === filter ? '600' : '400',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: activeFilter === filter 
                  ? '0 4px 15px rgba(226, 27, 60, 0.3)' 
                  : '0 2px 10px rgba(0,0,0,0.1)'
              }}
              onClick={() => setActiveFilter(filter)}
              onMouseEnter={(e) => {
                if (activeFilter !== filter) {
                  e.target.style.background = 'rgba(226, 27, 60, 0.15)'
                  e.target.style.borderColor = 'rgba(226, 27, 60, 0.5)'
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 20px rgba(226, 27, 60, 0.2)'
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== filter) {
                  e.target.style.background = 'rgba(255,255,255,0.05)'
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)'
                }
              }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {filteredItems.map(item => (
            <div key={item.id} style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '0',
              height: '350px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => {
              const img = e.currentTarget.querySelector('img')
              const overlay = e.currentTarget.querySelector('.overlay')
              img.style.transform = 'scale(1.1)'
              overlay.style.opacity = '1'
            }} onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector('img')
              const overlay = e.currentTarget.querySelector('.overlay')
              img.style.transform = 'scale(1)'
              overlay.style.opacity = '0'
            }}>
              <img 
                src={item.image} 
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
              />
              <div 
                className="overlay"
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  background: 'linear-gradient(transparent 60%, rgba(0,0,0,0.9))',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.5rem',
                  opacity: '0',
                  transition: 'opacity 0.3s ease'
                }}
              >
                <h3 style={{
                  color: 'white',
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}>{item.title}</h3>
                <p style={{
                  color: 'var(--text-light)',
                  margin: '0',
                  fontSize: '0.85rem',
                  lineHeight: '1.3'
                }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Portfolio