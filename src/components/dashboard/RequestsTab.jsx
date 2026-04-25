import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { agendamentoService } from '../../services/inkflowApi'

const formatDate = (dataHora) => {
  if (!dataHora) return ''
  const d = new Date(dataHora)
  const day = d.getDate()
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${day} ${months[d.getMonth()]}, ${d.getFullYear()}`
}

const formatTime = (dataHora) => {
  if (!dataHora) return ''
  return new Date(dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const statusConfig = {
  'PENDENTE':     { label: 'PENDENTE',     badgeClass: 'ad-badge-yellow' },
  'AGENDADO':     { label: 'AGENDADO',     badgeClass: 'ad-badge-yellow' },
  'CONFIRMADO':   { label: 'CONFIRMADO',   badgeClass: 'ad-badge-green'  },
  'EM_ANDAMENTO': { label: 'EM ANDAMENTO', badgeClass: 'ad-badge-blue'   },
  'REALIZADO':    { label: 'REALIZADO',    badgeClass: 'ad-badge-purple' },
  'FINALIZADO':   { label: 'FINALIZADO',   badgeClass: 'ad-badge-teal'   },
  'CANCELADO':    { label: 'CANCELADO',    badgeClass: 'ad-badge-red'    },
}

const ClientAvatar = ({ ag }) => {
  const nome = ag?.cliente?.fullName || ag?.cliente?.nome || 'C'
  const foto = ag?.cliente?.fotoUrl
  const [imgError, setImgError] = useState(false)

  if (foto && !imgError) {
    return (
      <img
        src={foto}
        alt={nome}
        onError={() => setImgError(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    )
  }
  return (
    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#e63946', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>
      {nome.charAt(0).toUpperCase()}
    </div>
  )
}

const getNextStatus = (current) => {
  const flow = { 'PENDENTE': 'CONFIRMADO', 'CONFIRMADO': 'EM_ANDAMENTO', 'EM_ANDAMENTO': 'REALIZADO' }
  return flow[current] || null
}

const RequestsTab = ({ showToast, openDrawer }) => {
  const [filter, setFilter] = useState('all')
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
        console.error('Erro ao carregar solicitações:', err)
        showToast('Erro ao carregar solicitações', true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getClientName = (ag) => ag?.cliente?.fullName || ag?.cliente?.nome || 'Cliente'
  const getClientEmail = (ag) => ag?.cliente?.email || ''

  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'PENDENTE', label: 'Pendente' },
    { key: 'CONFIRMADO', label: 'Confirmado' },
    { key: 'CANCELADO', label: 'Cancelado' },
  ]

  const filteredRows = filter === 'all' ? agendamentos : agendamentos.filter(a => a.status === filter)

  const handleStatusUpdate = async (agId, novoStatus, clienteNome) => {
    try {
      await agendamentoService.updateStatus(agId, { status: novoStatus })
      setAgendamentos(prev => prev.map(a => a.id === agId ? { ...a, status: novoStatus } : a))
      if (novoStatus === 'CONFIRMADO') {
        showToast(`Solicitação de ${clienteNome} confirmada!`)
      } else {
        showToast(`Solicitação de ${clienteNome} recusada.`, true)
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Erro ao atualizar status'
      showToast(typeof msg === 'string' ? msg : 'Erro ao atualizar status', true)
    }
  }

  const handleAccept = (e, ag) => {
    e.stopPropagation()
    handleStatusUpdate(ag.id, 'CONFIRMADO', getClientName(ag))
  }

  const handleDecline = (e, ag) => {
    e.stopPropagation()
    handleStatusUpdate(ag.id, 'CANCELADO', getClientName(ag))
  }

  const handleRowClick = (e, ag) => {
    if (e.target.closest('button')) return
    if (openDrawer) openDrawer(ag)
  }

  return (
    <>
      {/* Page Header & Filters */}
      <div className="ad-req-page-header">
        <h1 className="ad-req-title">Solicitações</h1>
        <div className="ad-req-filters">
          {filters.map(f => (
            <button
              key={f.key}
              className={`ad-req-filter-btn ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="ad-req-table-container">
        {loading ? (
          <div style={{ color: 'rgba(255,255,255,0.4)', padding: '3rem', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', animation: 'spin 1s linear infinite' }}>progress_activity</span>
            Carregando solicitações...
          </div>
        ) : filteredRows.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.4)', padding: '3rem', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>inbox</span>
            Nenhuma solicitação encontrada.
          </div>
        ) : (
          <table className="ad-req-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Data e Hora</th>
                <th>Tipo de Tattoo</th>
                <th>Região</th>
                <th>Status</th>
                <th className="ad-req-th-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map(ag => {
                const cfg = ag?.status === 'REALIZADO'
                  ? { label: 'REALIZADO', badgeClass: ag?.avaliado ? 'ad-badge-teal' : 'ad-badge-purple' }
                  : statusConfig[ag?.status] || { label: ag?.status || '—', badgeClass: '' }
                return (
                  <tr
                    key={ag?.id}
                    className="ad-req-row"
                    onClick={(e) => handleRowClick(e, ag)}
                  >
                    <td>
                      <div className="ad-req-client-cell">
                        <div className="ad-req-client-img">
                          <ClientAvatar ag={ag} />
                        </div>
                        <div>
                          <p className="ad-req-client-name">{getClientName(ag)}</p>
                          <p className="ad-req-client-handle">{getClientEmail(ag)}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="ad-req-date">{formatDate(ag?.dataHora)}</p>
                      <p className="ad-req-time">{formatTime(ag?.dataHora)}</p>
                    </td>
                    <td>
                      <span className="ad-req-style-tag">{ag?.servico || 'Tatuagem'}</span>
                    </td>
                    <td className="ad-req-area">{ag?.regiao || 'Não informado'}</td>
                    <td>
                      <span className={`ad-badge ${cfg.badgeClass}`}>{cfg.label}</span>
                    </td>
                    <td className="ad-req-td-right" style={{ overflow: 'visible', position: 'relative' }}>
                      <div className="ad-req-actions">
                        {(ag?.status === 'PENDENTE' || ag?.status === 'AGENDADO') ? (
                          <>
                            <button className="ad-req-action-accept" onClick={(e) => handleAccept(e, ag)}>
                              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>check</span>
                            </button>
                            <button className="ad-req-action-decline" onClick={(e) => handleDecline(e, ag)}>
                              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>close</span>
                            </button>
                          </>
                        ) : getNextStatus(ag?.status) ? (
                          <div className="ad-req-actions" style={{ justifyContent: 'flex-end' }}>
                            <button className="ad-req-action-accept" title={`Avançar para ${getNextStatus(ag?.status)}`} onClick={(e) => { e.stopPropagation(); handleStatusUpdate(ag.id, getNextStatus(ag.status), getClientName(ag)) }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>arrow_forward</span>
                            </button>
                          </div>
                        ) : (
                          <div className="ad-req-actions" style={{ justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                            <button className="ad-req-action-options" onClick={(e) => {
                              e.stopPropagation()
                              const rect = e.currentTarget.getBoundingClientRect()
                              setMenuPos({ top: rect.top - 90, left: rect.right - 200 })
                              setMenuOpen(menuOpen === ag.id ? null : ag.id)
                            }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>more_vert</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
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
              ) : historicoCliente.agendamentos.map(a => {
                const cfg = a.status === 'REALIZADO'
                  ? { label: 'REALIZADO', badgeClass: a.avaliado ? 'ad-badge-teal' : 'ad-badge-purple' }
                  : statusConfig[a.status] || { label: a.status, badgeClass: '' }
                return (
                  <div key={a.id} style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>{a.servico || 'Sessão'}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{formatDate(a.dataHora)} · {formatTime(a.dataHora)}</p>
                    </div>
                    <span className={`ad-badge ${cfg.badgeClass}`}>{cfg.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RequestsTab
