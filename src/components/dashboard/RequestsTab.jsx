import { useState, useEffect } from 'react'
import { agendamentoService } from '../../services/inkflowApi'

const formatDate = (dataHora) => {
  if (!dataHora) return ''
  const d = new Date(dataHora)
  const day = d.getDate()
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${day} ${months[d.getMonth()]}, ${d.getFullYear()}`
}

const formatFullDate = (dataHora) => {
  if (!dataHora) return ''
  const d = new Date(dataHora)
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const formatWeekday = (dataHora) => {
  if (!dataHora) return ''
  const d = new Date(dataHora)
  return d.toLocaleDateString('pt-BR', { weekday: 'long' }).replace(/^\w/, c => c.toUpperCase())
}

const formatTime = (dataHora) => {
  if (!dataHora) return ''
  return new Date(dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const statusConfig = {
  'AGENDADO': { label: 'PENDENTE', badgeClass: 'ad-badge-yellow' },
  'CONFIRMADO': { label: 'CONFIRMADO', badgeClass: 'ad-badge-green' },
  'EM_ANDAMENTO': { label: 'EM ANDAMENTO', badgeClass: 'ad-badge-blue' },
  'REALIZADO': { label: 'REALIZADO', badgeClass: 'ad-badge-purple' },
  'FINALIZADO': { label: 'FINALIZADO', badgeClass: 'ad-badge-teal' },
  'CANCELADO': { label: 'CANCELADO', badgeClass: 'ad-badge-red' },
}

const RequestsTab = ({ showToast }) => {
  const [filter, setFilter] = useState('all')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerClient, setDrawerClient] = useState(null)
  const [agendamentos, setAgendamentos] = useState([])
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res
        if (user.artistaId || user.id) {
          try {
            res = await agendamentoService.getByArtista(user.artistaId || user.id)
          } catch {
            res = await agendamentoService.getAll()
          }
        } else {
          res = await agendamentoService.getAll()
        }
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

  const getClientName = (ag) => ag.cliente?.fullName || ag.cliente?.nome || 'Cliente'
  const getClientEmail = (ag) => ag.cliente?.email || ''

  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'AGENDADO', label: 'Pendente' },
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
    setDrawerClient(ag)
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => setDrawerClient(null), 300)
  }

  const handleDrawerAccept = () => {
    if (!drawerClient) return
    handleStatusUpdate(drawerClient.id, 'CONFIRMADO', getClientName(drawerClient))
    closeDrawer()
  }

  const handleDrawerDecline = () => {
    if (!drawerClient) return
    handleStatusUpdate(drawerClient.id, 'CANCELADO', getClientName(drawerClient))
    closeDrawer()
  }

  const getSizeLabel = (ag) => {
    if (ag.largura && ag.altura) return `${ag.largura}x${ag.altura}cm`
    if (ag.largura) return `${ag.largura}cm`
    return '—'
  }

  const getTags = (ag) => {
    if (!ag.tags) return []
    return ag.tags.split(',').map(t => t.trim()).filter(Boolean)
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
                const cfg = statusConfig[ag.status] || { label: ag.status, badgeClass: '' }
                return (
                  <tr
                    key={ag.id}
                    className="ad-req-row"
                    onClick={(e) => handleRowClick(e, ag)}
                  >
                    <td>
                      <div className="ad-req-client-cell">
                        <div className="ad-req-client-img">
                          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#e63946', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>
                            {getClientName(ag).charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <p className="ad-req-client-name">{getClientName(ag)}</p>
                          <p className="ad-req-client-handle">{getClientEmail(ag)}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="ad-req-date">{formatDate(ag.dataHora)}</p>
                      <p className="ad-req-time">{formatTime(ag.dataHora)}</p>
                    </td>
                    <td>
                      <span className="ad-req-style-tag">{ag.servico || 'Tatuagem'}</span>
                    </td>
                    <td className="ad-req-area">{ag.regiao || '—'}</td>
                    <td>
                      <span className={`ad-badge ${cfg.badgeClass}`}>{cfg.label}</span>
                    </td>
                    <td className="ad-req-td-right">
                      <div className="ad-req-actions">
                        {ag.status === 'AGENDADO' ? (
                          <>
                            <button className="ad-req-action-accept" onClick={(e) => handleAccept(e, ag)}>
                              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>check</span>
                            </button>
                            <button className="ad-req-action-decline" onClick={(e) => handleDecline(e, ag)}>
                              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>close</span>
                            </button>
                          </>
                        ) : (
                          <button className="ad-req-action-options" onClick={(e) => { e.stopPropagation(); showToast(`${getClientName(ag)}: ${cfg.label}`) }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>more_vert</span>
                          </button>
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

      {/* Detail Drawer */}
      {drawerOpen && drawerClient && (
        <>
          <div className="ad-req-drawer-backdrop" onClick={closeDrawer}></div>
          <aside className="ad-req-drawer">
            <div className="ad-req-drawer-body no-scrollbar">
              {/* Drawer Header */}
              <div className="ad-req-drawer-header">
                <div className="ad-req-drawer-client">
                  <div className="ad-req-drawer-avatar">
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#e63946', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1.2rem' }}>
                      {getClientName(drawerClient).charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h3 className="ad-req-drawer-name">{getClientName(drawerClient)}</h3>
                    <div className="ad-req-drawer-tags">
                      {getTags(drawerClient).map((tag, i) => (
                        <span key={i} className="ad-req-drawer-tag">{tag}</span>
                      ))}
                      {getTags(drawerClient).length === 0 && (
                        <span className="ad-req-drawer-tag">{drawerClient.servico || 'Sessão'}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="ad-req-drawer-close" onClick={closeDrawer}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Tattoo Details */}
              <div className="ad-req-drawer-content">
                <section>
                  <h4 className="ad-req-drawer-section-title">Referência e Descrição</h4>
                  {drawerClient.imagemReferenciaUrl ? (
                    <div className="ad-req-drawer-ref-img">
                      <img src={drawerClient.imagemReferenciaUrl} alt="Referência" />
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', border: '1px dashed rgba(255,255,255,0.1)', marginBottom: '1rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>image</span>
                      Sem imagem de referência
                    </div>
                  )}
                  <p className="ad-req-drawer-description">
                    {drawerClient.descricao || drawerClient.observacoes || 'Sem descrição fornecida pelo cliente.'}
                  </p>
                </section>

                <div className="ad-req-drawer-specs">
                  <div className="ad-req-drawer-spec">
                    <h5 className="ad-req-drawer-spec-label">Tamanho</h5>
                    <p className="ad-req-drawer-spec-value">{getSizeLabel(drawerClient)}</p>
                  </div>
                  <div className="ad-req-drawer-spec">
                    <h5 className="ad-req-drawer-spec-label">Região</h5>
                    <p className="ad-req-drawer-spec-value">{drawerClient.regiao || '—'}</p>
                  </div>
                </div>

                <section>
                  <h4 className="ad-req-drawer-section-title">Informações do Agendamento</h4>
                  <div className="ad-req-drawer-schedule">
                    <div className="ad-req-drawer-schedule-left">
                      <span className="material-symbols-outlined" style={{ color: 'var(--ad-primary)' }}>calendar_today</span>
                      <div>
                        <p className="ad-req-drawer-schedule-date">{formatFullDate(drawerClient.dataHora)}</p>
                        <p className="ad-req-drawer-schedule-weekday">{formatWeekday(drawerClient.dataHora)}</p>
                      </div>
                    </div>
                    <div className="ad-req-drawer-schedule-right">
                      <p className="ad-req-drawer-schedule-date">{formatTime(drawerClient.dataHora)}</p>
                      <p className="ad-req-drawer-schedule-weekday">Horário</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Drawer Footer */}
            {drawerClient.status === 'AGENDADO' ? (
              <div className="ad-req-drawer-footer">
                <button className="ad-req-drawer-btn-decline" onClick={handleDrawerDecline}>
                  Recusar
                </button>
                <button className="ad-req-drawer-btn-accept" onClick={handleDrawerAccept}>
                  Aceitar &amp; Confirmar
                </button>
              </div>
            ) : (
              <div className="ad-req-drawer-footer">
                <div style={{ width: '100%', textAlign: 'center', padding: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Status: {statusConfig[drawerClient.status]?.label || drawerClient.status}
                </div>
              </div>
            )}
          </aside>
        </>
      )}
    </>
  )
}

export default RequestsTab
