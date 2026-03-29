import { useState } from 'react'

const PortfolioTab = ({ showToast }) => {
  const [uploadModal, setUploadModal] = useState(false)

  const portfolioItems = [
    { id: 1, image: '/assets/portifolio_novo/Rosto.webp', title: 'Retrato Hiper-Realista', tags: ['Realismo', 'Grande'], date: '2026-01-20', likes: 47 },
    { id: 2, image: '/assets/portifolio_novo/Caveira.webp', title: 'Caveira Blackwork', tags: ['Blackwork', 'Médio'], date: '2026-01-15', likes: 62 },
    { id: 3, image: '/assets/portifolio_novo/HomemDeFerro.webp', title: 'Iron Man Geek Art', tags: ['Geek', 'Grande'], date: '2026-02-05', likes: 89 },
    { id: 4, image: '/assets/portifolio_novo/tigrao.webp', title: 'Tigre Oriental', tags: ['Oriental', 'Grande'], date: '2026-02-10', likes: 54 },
    { id: 5, image: '/assets/portifolio_novo/Rosa-Dos-Ventos-1.webp', title: 'Rosa dos Ventos Maori', tags: ['Maori', 'Médio'], date: '2026-02-18', likes: 73 },
    { id: 6, image: '/assets/portifolio_novo/Tattoo-Cobra-Floral.webp', title: 'Cobra Floral', tags: ['Floral', 'Grande'], date: '2026-03-01', likes: 41 },
    { id: 7, image: '/assets/portifolio_novo/Rosto.webp', title: 'Retrato Fine Line', tags: ['Fine Line', 'Pequeno'], date: '2026-03-10', likes: 35 },
    { id: 8, image: '/assets/portifolio_novo/Caveira.webp', title: 'Skull Geométrico', tags: ['Geométrico', 'Médio'], date: '2026-03-15', likes: 58 },
    { id: 9, image: '/assets/portifolio_novo/tigrao.webp', title: 'Leão Realista', tags: ['Realismo', 'Grande'], date: '2026-03-20', likes: 92 },
  ]

  const handleDelete = (item) => {
    showToast(`"${item.title}" removido do portfólio.`, true)
  }

  const handleEdit = (item) => {
    showToast(`Editando "${item.title}"...`)
  }

  return (
    <>
      {/* Header */}
      <section className="ad-header-section">
        <div className="ad-header-text">
          <span className="ad-overview-label">Galeria</span>
          <h1 className="ad-page-title">
            Meu <br />
            <span className="ad-title-dim">Portfólio</span>
          </h1>
        </div>
        <div className="ad-header-actions">
          <button className="ad-btn-primary" onClick={() => setUploadModal(true)}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>add_photo_alternate</span>
            Adicionar Trabalho
          </button>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="ad-portfolio-stats">
        <div className="ad-portfolio-stat">
          <span className="ad-portfolio-stat-value">{portfolioItems.length}</span>
          <span className="ad-portfolio-stat-label">Trabalhos</span>
        </div>
        <div className="ad-portfolio-stat">
          <span className="ad-portfolio-stat-value">{portfolioItems.reduce((s, i) => s + i.likes, 0)}</span>
          <span className="ad-portfolio-stat-label">Curtidas Total</span>
        </div>
        <div className="ad-portfolio-stat">
          <span className="ad-portfolio-stat-value">{[...new Set(portfolioItems.flatMap(i => i.tags))].length}</span>
          <span className="ad-portfolio-stat-label">Estilos</span>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="ad-portfolio-grid">
        {portfolioItems.map(item => (
          <div key={item.id} className="ad-portfolio-item">
            <div className="ad-portfolio-img">
              <img src={item.image} alt={item.title} />
              <div className="ad-portfolio-overlay">
                <button className="ad-portfolio-overlay-btn" onClick={() => handleEdit(item)}>
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button className="ad-portfolio-overlay-btn danger" onClick={() => handleDelete(item)}>
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
            <div className="ad-portfolio-info">
              <h4 className="ad-portfolio-title">{item.title}</h4>
              <div className="ad-portfolio-tags">
                {item.tags.map(tag => (
                  <span key={tag} className="ad-portfolio-tag">{tag}</span>
                ))}
              </div>
              <div className="ad-portfolio-foot">
                <span className="ad-portfolio-date">{new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase().replace('.', '')}</span>
                <span className="ad-portfolio-likes">
                  <span className="material-symbols-outlined icon-filled" style={{ fontSize: '0.875rem' }}>favorite</span>
                  {item.likes}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {uploadModal && (
        <div className="ad-modal-overlay" onClick={() => setUploadModal(false)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-header">
              <h3>Adicionar Trabalho</h3>
              <button onClick={() => setUploadModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="ad-modal-body">
              <div className="ad-upload-area">
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--ad-on-surface-variant)' }}>cloud_upload</span>
                <p style={{ color: 'var(--ad-on-surface-variant)', fontSize: '0.875rem', marginTop: 8 }}>Arraste uma imagem ou clique para selecionar</p>
                <p style={{ color: 'var(--ad-on-surface-variant)', fontSize: '0.7rem', marginTop: 4 }}>PNG, JPG ou WEBP. Máx 5MB.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                <div>
                  <label className="ad-form-label">Título</label>
                  <input className="ad-form-input" type="text" placeholder="Nome do trabalho" />
                </div>
                <div>
                  <label className="ad-form-label">Tags (separadas por vírgula)</label>
                  <input className="ad-form-input" type="text" placeholder="Blackwork, Grande, Braço" />
                </div>
              </div>
            </div>
            <div className="ad-modal-footer">
              <button className="ad-btn-reject" onClick={() => setUploadModal(false)}>Cancelar</button>
              <button className="ad-btn-approve" onClick={() => { showToast('Trabalho adicionado ao portfólio!'); setUploadModal(false) }}>Publicar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PortfolioTab
