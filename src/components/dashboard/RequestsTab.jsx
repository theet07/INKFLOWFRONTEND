import { useState } from 'react'

const RequestsTab = ({ showToast }) => {
  const [filter, setFilter] = useState('all')
  const [detailModal, setDetailModal] = useState(null)

  const requests = [
    {
      id: 1, clientName: 'Maria Silva', clientPhoto: '/assets/portifolio_tatuadores/Tatuadora_3.png',
      service: 'Tatuagem Blackwork', preferredDate: '2026-04-15', preferredTime: '14:00',
      description: 'Gostaria de uma tatuagem de mandala no antebraço, com detalhes geométricos finos. Referência no Pinterest que posso compartilhar.',
      area: 'Antebraço', size: '15cm x 10cm', status: 'pending',
    },
    {
      id: 2, clientName: 'João Pedro', clientPhoto: '/assets/portifolio_tatuadores/Tatuador_1.png',
      service: 'Realismo Retrato', preferredDate: '2026-04-18', preferredTime: '10:00',
      description: 'Quero um retrato realista do meu pet (golden retriever). Tenho fotos em alta resolução para referência.',
      area: 'Panturrilha', size: '20cm x 15cm', status: 'pending',
    },
    {
      id: 3, clientName: 'Ana Beatriz', clientPhoto: '/assets/portifolio_tatuadores/Tatuadora_5.png',
      service: 'Fine Line Floral', preferredDate: '2026-04-10', preferredTime: '16:00',
      description: 'Buquê de lavanda minimalista, traço fino e delicado. Já fiz duas sessões anteriores no estúdio.',
      area: 'Costela', size: '12cm x 8cm', status: 'approved',
    },
    {
      id: 4, clientName: 'Carlos Mendes', clientPhoto: '/assets/portifolio_tatuadores/Tatuador_2.png',
      service: 'Geométrico Sagrado', preferredDate: '2026-04-12', preferredTime: '11:00',
      description: 'Flor da vida com elementos de geometria sagrada, interligados com linhas finas.',
      area: 'Antebraço', size: '18cm x 18cm', status: 'rejected',
    },
    {
      id: 5, clientName: 'Fernanda Lopes', clientPhoto: '/assets/portifolio_tatuadores/Tatuadora_3.png',
      service: 'Lettering Script', preferredDate: '2026-04-20', preferredTime: '15:00',
      description: 'Frase em letra cursiva elegante: "Per aspera ad astra". Localização na clavícula.',
      area: 'Clavícula', size: '10cm x 3cm', status: 'pending',
    },
  ]

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)

  const statusConfig = {
    pending: { label: 'Pendente', badgeClass: 'ad-badge-yellow' },
    approved: { label: 'Aprovado', badgeClass: 'ad-badge-green' },
    rejected: { label: 'Recusado', badgeClass: 'ad-badge-red' },
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase().replace('.', '')
  }

  const handleApprove = (req) => {
    showToast(`Solicitação de ${req.clientName} aprovada!`)
  }

  const handleReject = (req) => {
    showToast(`Solicitação de ${req.clientName} recusada.`, true)
  }

  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'pending', label: 'Pendentes' },
    { key: 'approved', label: 'Aprovados' },
    { key: 'rejected', label: 'Recusados' },
  ]

  return (
    <>
      {/* Header */}
      <section className="ad-header-section">
        <div className="ad-header-text">
          <span className="ad-overview-label">Gerenciamento</span>
          <h1 className="ad-page-title">
            Solicitações de <br />
            <span className="ad-title-dim">Agendamento</span>
          </h1>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="ad-filter-tabs">
        {filters.map(f => (
          <button
            key={f.key}
            className={`ad-filter-tab ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            {f.key !== 'all' && (
              <span className="ad-filter-count">{requests.filter(r => f.key === 'all' || r.status === f.key).length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Request Cards */}
      <div className="ad-requests-list">
        {filtered.length === 0 ? (
          <div className="ad-empty-state">
            <span className="material-symbols-outlined">inbox</span>
            <p>Nenhuma solicitação nesta categoria.</p>
          </div>
        ) : filtered.map(req => (
          <div key={req.id} className="ad-request-card">
            <div className="ad-request-header">
              <div className="ad-request-client">
                <div className="ad-request-avatar">
                  <img src={req.clientPhoto} alt={req.clientName} onError={e => { e.target.style.display = 'none' }} />
                </div>
                <div>
                  <p className="ad-request-name">{req.clientName}</p>
                  <p className="ad-request-service">{req.service}</p>
                </div>
              </div>
              <span className={`ad-badge ${statusConfig[req.status].badgeClass}`}>
                {statusConfig[req.status].label}
              </span>
            </div>

            <p className="ad-request-desc">{req.description}</p>

            <div className="ad-request-meta">
              <div className="ad-request-meta-item">
                <span className="material-symbols-outlined">calendar_today</span>
                <span>{formatDate(req.preferredDate)}</span>
              </div>
              <div className="ad-request-meta-item">
                <span className="material-symbols-outlined">schedule</span>
                <span>{req.preferredTime}</span>
              </div>
              <div className="ad-request-meta-item">
                <span className="material-symbols-outlined">straighten</span>
                <span>{req.size}</span>
              </div>
              <div className="ad-request-meta-item">
                <span className="material-symbols-outlined">body_system</span>
                <span>{req.area}</span>
              </div>
            </div>

            <div className="ad-request-actions">
              {req.status === 'pending' && (
                <>
                  <button className="ad-btn-approve" onClick={() => handleApprove(req)}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>check</span>
                    Aprovar
                  </button>
                  <button className="ad-btn-reject" onClick={() => handleReject(req)}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>close</span>
                    Recusar
                  </button>
                </>
              )}
              <button className="ad-btn-detail" onClick={() => setDetailModal(req)}>
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {detailModal && (
        <div className="ad-modal-overlay" onClick={() => setDetailModal(null)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-header">
              <h3>Detalhes da Solicitação</h3>
              <button onClick={() => setDetailModal(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="ad-modal-body">
              <div className="ad-modal-client-info">
                <div className="ad-request-avatar" style={{ width: 64, height: 64 }}>
                  <img src={detailModal.clientPhoto} alt={detailModal.clientName} onError={e => { e.target.style.display = 'none' }} />
                </div>
                <div>
                  <h4>{detailModal.clientName}</h4>
                  <span className={`ad-badge ${statusConfig[detailModal.status].badgeClass}`}>
                    {statusConfig[detailModal.status].label}
                  </span>
                </div>
              </div>
              <div className="ad-modal-detail-grid">
                <div className="ad-modal-detail-item">
                  <span className="ad-modal-detail-label">Serviço</span>
                  <span>{detailModal.service}</span>
                </div>
                <div className="ad-modal-detail-item">
                  <span className="ad-modal-detail-label">Data Preferida</span>
                  <span>{formatDate(detailModal.preferredDate)} às {detailModal.preferredTime}</span>
                </div>
                <div className="ad-modal-detail-item">
                  <span className="ad-modal-detail-label">Área</span>
                  <span>{detailModal.area}</span>
                </div>
                <div className="ad-modal-detail-item">
                  <span className="ad-modal-detail-label">Tamanho</span>
                  <span>{detailModal.size}</span>
                </div>
              </div>
              <div className="ad-modal-detail-item" style={{ marginTop: 16 }}>
                <span className="ad-modal-detail-label">Descrição do Pedido</span>
                <p style={{ marginTop: 8, color: 'var(--ad-on-surface-variant)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  "{detailModal.description}"
                </p>
              </div>
            </div>
            {detailModal.status === 'pending' && (
              <div className="ad-modal-footer">
                <button className="ad-btn-reject" onClick={() => { handleReject(detailModal); setDetailModal(null) }}>Recusar</button>
                <button className="ad-btn-approve" onClick={() => { handleApprove(detailModal); setDetailModal(null) }}>Aprovar e Agendar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default RequestsTab
