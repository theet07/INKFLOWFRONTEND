import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { agendamentoService } from '../../services/inkflowApi'

const formatDate = (dataHora) => {
  if (!dataHora) return ''
  const d = new Date(dataHora)
  const day = d.getDate()
  const months = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ']
  return `${day} ${months[d.getMonth()]}`
}

const formatTime = (dataHora) => {
  if (!dataHora) return ''
  const d = new Date(dataHora)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const getTimePeriod = (dataHora) => {
  if (!dataHora) return ''
  const h = new Date(dataHora).getHours()
  return h < 12 ? 'AM' : 'PM'
}

const statusBadgeClass = {
  'PENDENTE': 'ad-badge-red',
  'AGENDADO': 'ad-badge-yellow',
  'CONFIRMADO': 'ad-badge-green',
  'EM_ANDAMENTO': 'ad-badge-blue',
  'REALIZADO': 'ad-badge-purple',
  'FINALIZADO': 'ad-badge-teal',
  'CANCELADO': 'ad-badge-red',
}

const statusLabel = {
  'PENDENTE': 'Pendente',
  'AGENDADO': 'Agendado',
  'CONFIRMADO': 'Confirmado',
  'EM_ANDAMENTO': 'Em Andamento',
  'REALIZADO': 'Realizado',
  'FINALIZADO': 'Finalizado',
  'CANCELADO': 'Cancelado',
}

const ClientAvatar = ({ ag, size = '0.9rem' }) => {
  const nome = ag?.cliente?.fullName || ag?.cliente?.nome || 'C'
  const foto = ag?.cliente?.fotoUrl
  const [imgError, setImgError] = useState(false)

  if (foto && !imgError) {
    return (
      <img src={foto} alt={nome} onError={() => setImgError(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    )
  }
  return (
    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#e63946', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: size }}>
      {nome.charAt(0).toUpperCase()}
    </div>
  )
}

const DashboardTab = ({ showToast, openDrawer, onNewArt }) => {
  const [agendamentos, setAgendamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(null)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const [historicoCliente, setHistoricoCliente] = useState(null)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const close = () => setMenuOpen(null)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user.artistaId && !user.id) {
          console.error('Estado do usuário corrompido: sem artistaId nem id.')
          setLoading(false)
          return
        }
        const res = await agendamentoService.getByArtista(user.artistaId || user.id)
        setAgendamentos(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        console.error('Erro ao carregar agendamentos do artista:', err)
        showToast('Erro ao carregar agenda', true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleStatusUpdate = async (agId, novoStatus, clienteNome) => {
    try {
      await agendamentoService.updateStatus(agId, { status: novoStatus })
      setAgendamentos(prev => prev.map(a => a.id === agId ? { ...a, status: novoStatus } : a))
      showToast(`${clienteNome} → ${statusLabel[novoStatus] || novoStatus}`)
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Erro ao atualizar status'
      showToast(typeof msg === 'string' ? msg : 'Erro ao atualizar status', true)
    }
  }

  // Filtros
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayAgenda = agendamentos
    .filter(a => {
      if (!a.dataHora) return false
      const d = new Date(a.dataHora)
      d.setHours(0, 0, 0, 0)
      return d.getTime() === today.getTime() && a.status !== 'CANCELADO'
    })
    .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))

  const pendentes = agendamentos.filter(a => a.status === 'PENDENTE' || a.status === 'AGENDADO').length
  const confirmados = agendamentos.filter(a => a.status === 'CONFIRMADO' || a.status === 'EM_ANDAMENTO').length
  const concluidos = agendamentos.filter(a => a.status === 'REALIZADO' || a.status === 'FINALIZADO').length

  const recentBookings = [...agendamentos]
    .filter(a => a.status !== 'CANCELADO')
    .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
    .slice(0, 8)

  const getClientName = (ag) => ag.cliente?.fullName || ag.cliente?.nome || 'Cliente'
  const getClientEmail = (ag) => ag.cliente?.email || ''

  const avaliacoes = agendamentos
    .filter(a => a.avaliacao != null && a.avaliacao > 0)
    .map(a => a.avaliacao)

  const mediaAvaliacao = avaliacoes.length > 0
    ? (avaliacoes.reduce((sum, v) => sum + v, 0) / avaliacoes.length).toFixed(1)
    : null

  // Próximo status possível para ações rápidas
  const getNextStatus = (current) => {
    const flow = { 
      'PENDENTE': 'CONFIRMADO',
      'CONFIRMADO': 'EM_ANDAMENTO', 
      'EM_ANDAMENTO': 'REALIZADO' 
    }
    return flow[current] || null
  }

  return (
    <>
      {/* Header Section */}
      <section className="ad-header-section">
        <div className="ad-header-text">
          <span className="ad-overview-label">Visão Geral</span>
          <h1 className="ad-page-title">
            Painel do <br />
            <span className="ad-title-dim">Artista</span>
          </h1>
        </div>
        <div className="ad-header-actions">
          <button className="ad-btn-primary" onClick={onNewArt}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>add</span>
            Nova Arte
          </button>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="ad-bento-grid">
        <div className="ad-card-highlight">
          <div className="ad-card-highlight-bg">
            <img
              alt="tattoo art"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcwMBoogvZI_cuzbWkJsJ-H3csKEkUzGPrTnBccbSByv9y0lN_JIf4HjArRRW1PQAT-pZgiG_ER61m0fY6Wxa5ueTP2zOCTYvsvcR4gWVxWrbyWahDzJK9FDiAN-8e5xzBBbk1VvX1UL3-AEDiZSwcZLR2y08Aa-O9kpnmRfDiWYOpH0X_yLWvrt27XW52E0qko1GBvirlrW1w9e6IuOchdJQVsaG8NkpqqsAkhJxbmVGh50QOQd-aWTWQLR_AYuQFIK-bUbPFvV8"
            />
            <div className="ad-card-highlight-overlay"></div>
          </div>
          <div className="ad-card-top">
            <span className="ad-card-label">Solicitações Pendentes</span>
            <span className="material-symbols-outlined ad-card-icon">pending_actions</span>
          </div>
          <div className="ad-card-bottom">
            <h3 className="ad-card-number">{loading ? '...' : pendentes}</h3>
            <p className="ad-card-subtitle">aguardando confirmação</p>
          </div>
        </div>

        <div className="ad-card-regular">
          <div className="ad-card-top">
            <span className="ad-card-label">Confirmados</span>
            <span className="material-symbols-outlined ad-card-icon-muted">event_available</span>
          </div>
          <div>
            <h3 className="ad-card-number-md">{loading ? '...' : confirmados}</h3>
            <p className="ad-card-subtitle-muted">Agenda Ativa</p>
          </div>
        </div>

        <div className="ad-card-regular">
          <div className="ad-card-top">
            <span className="ad-card-label">Mensal</span>
            <span className="material-symbols-outlined ad-card-icon-muted">check_circle</span>
          </div>
          <div>
            <h3 className="ad-card-number-md">{loading ? '...' : concluidos}</h3>
            <p className="ad-card-subtitle-muted">Sessões Concluídas</p>
          </div>
        </div>

        <div className="ad-card-rating">
          <div className="ad-rating-left">
            <div className="ad-rating-score">{mediaAvaliacao ?? '—'}</div>
            <div>
              <div className="ad-rating-stars">
                {(() => {
                  const nota = parseFloat(mediaAvaliacao) || 0
                  const fullStars = Math.floor(nota)
                  const hasHalf = nota - fullStars >= 0.3
                  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)
                  return (
                    <>
                      {Array.from({ length: fullStars }, (_, i) => (
                        <span key={`full-${i}`} className="material-symbols-outlined icon-filled">star</span>
                      ))}
                      {hasHalf && <span key="half" className="material-symbols-outlined icon-filled">star_half</span>}
                      {Array.from({ length: emptyStars }, (_, i) => (
                        <span key={`empty-${i}`} className="material-symbols-outlined">star</span>
                      ))}
                    </>
                  )
                })()}
              </div>
              <p className="ad-rating-label">Avaliação Média do Artista</p>
            </div>
          </div>
          <div className="ad-rating-divider"></div>
          <div className="ad-rating-stats">
            <div className="ad-stat-item">
              <p className="ad-stat-value">{agendamentos.length}</p>
              <p className="ad-stat-label">Total Sessões</p>
            </div>
            <div className="ad-stat-item">
              <p className="ad-stat-value">{todayAgenda.length}</p>
              <p className="ad-stat-label">Hoje</p>
            </div>
            <div className="ad-stat-item">
              <p className="ad-stat-value">{concluidos}</p>
              <p className="ad-stat-label">Concluídas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Agenda */}
      <section className="ad-section">
        <div className="ad-section-header">
          <h2 className="ad-section-title">Agenda de Hoje</h2>
        </div>
        {loading ? (
          <div style={{ color: 'rgba(255,255,255,0.4)', padding: '2rem', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', animation: 'spin 1s linear infinite' }}>progress_activity</span>
            Carregando agenda...
          </div>
        ) : todayAgenda.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.4)', padding: '2rem', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>event_busy</span>
            Nenhuma sessão agendada para hoje.
          </div>
        ) : (
          <div className="ad-agenda-scroll no-scrollbar">
            {todayAgenda.map((ag) => (
              <div
                key={ag.id}
                className="ad-agenda-card"
                onClick={() => openDrawer(ag)}
              >
                <div className="ad-agenda-time">
                  <p className="ad-agenda-time-value">{formatTime(ag.dataHora)}</p>
                  <p className="ad-agenda-time-period">{getTimePeriod(ag.dataHora)}</p>
                </div>
                <div className="ad-agenda-avatar">
                  <ClientAvatar ag={ag} size="0.9rem" />
                </div>
                <div style={{ flex: 1 }}>
                  <p className="ad-agenda-name">{getClientName(ag)}</p>
                  <p className="ad-agenda-desc">{ag.servico || 'Sessão'}</p>
                  <span className={`ad-badge ${statusBadgeClass[ag.status] || ''}`}>{statusLabel[ag.status] || ag.status}</span>
                </div>
                {getNextStatus(ag.status) && (
                  <button 
                    className="ad-action-accept" 
                    style={{ minWidth: '32px', height: '32px', flexShrink: 0 }}
                    title={`Avançar para ${statusLabel[getNextStatus(ag.status)]}`}
                    onClick={(e) => { e.stopPropagation(); handleStatusUpdate(ag.id, getNextStatus(ag.status), getClientName(ag)) }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_forward</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Bookings Table */}
      <section className="ad-section">
        <div className="ad-section-header">
          <h2 className="ad-section-title">Agendamentos Recentes</h2>
        </div>
        {loading ? (
          <div style={{ color: 'rgba(255,255,255,0.4)', padding: '2rem', textAlign: 'center' }}>Carregando...</div>
        ) : recentBookings.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.4)', padding: '2rem', textAlign: 'center' }}>Nenhum agendamento encontrado.</div>
        ) : (
          <div className="ad-table-wrapper">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Sessão</th>
                  <th>Serviço</th>
                  <th className="text-center">Status</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((ag) => {
                  const clientName = getClientName(ag)
                  const nextStatus = getNextStatus(ag.status)
                  return (
                    <tr key={ag.id} onClick={() => openDrawer(ag)}>
                      <td>
                        <div className="ad-client-cell">
                          <div className="ad-client-avatar">
                            <ClientAvatar ag={ag} size="0.75rem" />
                          </div>
                          <div>
                            <p className="ad-client-name">{clientName}</p>
                            <p className="ad-client-email">{getClientEmail(ag)}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="ad-session-date">{formatDate(ag.dataHora)}</p>
                        <p className="ad-session-time">{formatTime(ag.dataHora)}</p>
                      </td>
                      <td>
                        <p className="ad-style-name">{ag.servico || 'Tatuagem'}</p>
                        <p className="ad-style-area">{ag.regiao || '—'}</p>
                      </td>
                      <td className="text-center">
                        <span className={`ad-badge ${statusBadgeClass[ag.status] || ''}`}>{statusLabel[ag.status] || ag.status}</span>
                      </td>
                      <td className="text-right">
                        {nextStatus ? (
                          <div className="ad-row-actions">
                            <button className="ad-action-accept" title={`Avançar para ${statusLabel[nextStatus]}`} onClick={(e) => { e.stopPropagation(); handleStatusUpdate(ag.id, nextStatus, clientName) }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>arrow_forward</span>
                            </button>
                            {(ag.status === 'AGENDADO' || ag.status === 'PENDENTE') && (
                              <button className="ad-action-decline" title="Cancelar" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(ag.id, 'CANCELADO', clientName) }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>close</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <button className="ad-more-btn" onClick={(e) => {
                            e.stopPropagation()
                            const rect = e.currentTarget.getBoundingClientRect()
                            setMenuPos({ top: rect.top - 90, left: rect.right - 200 })
                            setMenuOpen(menuOpen === ag.id ? null : ag.id)
                          }}>
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {menuOpen && createPortal(
        <div style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, zIndex: 9999, minWidth: 200, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', overflow: 'hidden' }}
          onClick={e => e.stopPropagation()}>
          {(() => {
            const ag = agendamentos.find(a => a.id === menuOpen)
            if (!ag) return null
            return (
              <>
                <button onClick={() => { navigator.clipboard.writeText(getClientEmail(ag)); showToast('E-mail copiado!'); setMenuOpen(null) }}
                  style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: '#fff', fontSize: '0.85rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#E21B3C' }}>content_copy</span>
                  Copiar contato
                </button>
                <button onClick={() => {
                  const clientId = ag.cliente?.id
                  const nome = getClientName(ag)
                  const historico = agendamentos.filter(a => a.cliente?.id === clientId).sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
                  setHistoricoCliente({ nome, agendamentos: historico })
                  setMenuOpen(null)
                }} style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: '#fff', fontSize: '0.85rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#E21B3C' }}>history</span>
                  Ver histórico
                </button>
              </>
            )
          })()}
        </div>,
        document.body
      )}
      {historicoCliente && (
        <div onClick={() => setHistoricoCliente(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: '90%', maxWidth: 560, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.7rem', color: '#E21B3C', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Histórico do Cliente</p>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{historicoCliente.nome}</h3>
              </div>
              <button onClick={() => setHistoricoCliente(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {historicoCliente.agendamentos.length === 0 ? (
                <p style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Nenhum agendamento encontrado.</p>
              ) : historicoCliente.agendamentos.map(a => (
                <div key={a.id} style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>{a.servico || 'Sessão'}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{formatDate(a.dataHora)} · {formatTime(a.dataHora)}</p>
                  </div>
                  <span className={`ad-badge ${statusBadgeClass[a.status] || ''}`}>{statusLabel[a.status] || a.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DashboardTab
