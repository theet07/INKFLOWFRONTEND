import { useState, useEffect } from 'react'
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
  'AGENDADO': { label: 'PENDENTE', badgeClass: 'ad-badge-yellow' },
  'CONFIRMADO': { label: 'CONFIRMADO', badgeClass: 'ad-badge-green' },
  'EM_ANDAMENTO': { label: 'EM ANDAMENTO', badgeClass: 'ad-badge-blue' },
  'REALIZADO': { label: 'REALIZADO', badgeClass: 'ad-badge-purple' },
  'FINALIZADO': { label: 'FINALIZADO', badgeClass: 'ad-badge-teal' },
  'CANCELADO': { label: 'CANCELADO', badgeClass: 'ad-badge-red' },
}

const RequestsTab = ({ showToast, openDrawer }) => {
  const [filter, setFilter] = useState('all')
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
          } catch (err) {
            console.error('Falha ao buscar solicitacoes do artista. Negando extração global.', err);
            res = { data: [] }
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

  const getClientName = (ag) => ag?.cliente?.fullName || ag?.cliente?.nome || 'Cliente'
  const getClientEmail = (ag) => ag?.cliente?.email || ''

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
    console.log('Agendamento selecionado:', ag)
    // Usa o drawer blindado do componente pai (ArtistDashboard)
    if (openDrawer) {
      openDrawer(ag)
    }
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
                const cfg = statusConfig[ag?.status] || { label: ag?.status || '—', badgeClass: '' }
                return (
                  <tr
                    key={ag?.id}
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
                    <td className="ad-req-td-right">
                      <div className="ad-req-actions">
                        {ag?.status === 'AGENDADO' ? (
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
    </>
  )
}

export default RequestsTab
