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

const DashboardTab = ({ showToast, openDrawer, onNewArt }) => {
  const [agendamentos, setAgendamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(null)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const [historicoCliente, setHistoricoCliente] = useState(null)

  // ── Toggle Mensal / Semanal ───────────────────────────────────
  const [viewMode, setViewMode] = useState('mensal')

  // ── Limpeza: IDs ocultos + estado de drag + confirmação ──────
  const [hiddenIds, setHiddenIds] = useState([])
  const [draggingId, setDraggingId] = useState(null)
  const [dragOverZone, setDragOverZone] = useState(false)
  const [confirmDiscard, setConfirmDiscard] = useState(null)

  // ── Bloquear Horário ─────────────────────────────────────────
  const [showBloqueioModal, setShowBloqueioModal] = useState(false)
  const [bloqueio, setBloqueio] = useState({ data: '', horaInicio: '', horaFim: '', motivo: '' })
  const [salvandoBloqueio, setSalvandoBloqueio] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const close = () => setMenuOpen(null)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user.artistaId && !user.id) { setLoading(false); return }
        const res = await agendamentoService.getByArtista(user.artistaId || user.id)
        setAgendamentos(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
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

  const pendentes   = agendamentos.filter(a => a.status === 'PENDENTE' || a.status === 'AGENDADO').length
  const confirmados = agendamentos.filter(a => a.status === 'CONFIRMADO' || a.status === 'EM_ANDAMENTO').length
  const concluidos  = agendamentos.filter(a => a.status === 'REALIZADO' || a.status === 'FINALIZADO').length

  // ── Filtragem Mensal / Semanal ───────────────────────────────
  const getWeekRange = () => {
    const now = new Date()
    const day = now.getDay()
    const diffToMon = (day === 0 ? -6 : 1 - day)
    const mon = new Date(now); mon.setDate(now.getDate() + diffToMon); mon.setHours(0,0,0,0)
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6); sun.setHours(23,59,59,999)
    return { mon, sun }
  }

  const recentBookings = [...agendamentos]
    .filter(a => {
      if (a.status === 'CANCELADO') return false
      if (hiddenIds.includes(a.id)) return false
      if (viewMode === 'semanal') {
        const { mon, sun } = getWeekRange()
        const d = new Date(a.dataHora)
        return d >= mon && d <= sun
      }
      // mensal: mesmo mês atual
      const d = new Date(a.dataHora)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
    .slice(0, 8)

  const getClientName  = (ag) => ag.cliente?.fullName || ag.cliente?.nome || 'Cliente'
  const getClientEmail = (ag) => ag.cliente?.email || ''

  const avaliacoes = agendamentos.filter(a => a.avaliacao != null && a.avaliacao > 0).map(a => a.avaliacao)
  const mediaAvaliacao = avaliacoes.length > 0
    ? (avaliacoes.reduce((sum, v) => sum + v, 0) / avaliacoes.length).toFixed(1)
    : null

  const getNextStatus = (current) => {
    const flow = { 'PENDENTE': 'AGENDADO', 'AGENDADO': 'CONFIRMADO', 'CONFIRMADO': 'EM_ANDAMENTO', 'EM_ANDAMENTO': 'REALIZADO' }
    return flow[current] || null
  }

  // ── Drag handlers (Limpeza) ──────────────────────────────────
  const handleDragStart = (e, id) => {
    setDraggingId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDropOnZone = (e) => {
    e.preventDefault()
    setDragOverZone(false)
    if (!draggingId) return
    const ag = agendamentos.find(a => a.id === draggingId)
    if (ag) setConfirmDiscard(ag)
    setDraggingId(null)
  }

  const confirmHide = () => {
    if (!confirmDiscard) return
    setHiddenIds(prev => [...prev, confirmDiscard.id])
    showToast(`Sessão de ${getClientName(confirmDiscard)} ocultada`)
    setConfirmDiscard(null)
  }

  // ── Bloquear Horário ─────────────────────────────────────────
  const handleSalvarBloqueio = async () => {
    if (!bloqueio.data || !bloqueio.horaInicio || !bloqueio.horaFim) {
      showToast('Preencha data e horários', true)
      return
    }
    setSalvandoBloqueio(true)
    try {
      await agendamentoService.bloquearHorario({ ...bloqueio, artistaId: user.artistaId || user.id })
      showToast('Horário bloqueado com sucesso!')
      setShowBloqueioModal(false)
      setBloqueio({ data: '', horaInicio: '', horaFim: '', motivo: '' })
    } catch {
      showToast('Erro ao bloquear horário', true)
    } finally {
      setSalvandoBloqueio(false)
    }
  }

  // ── Estilos inline reutilizáveis ─────────────────────────────
  const inputStyle = {
    width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff',
    fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6,
  }

  return (
    <>
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <section className="ad-header-section">
        <div className="ad-header-text">
          <span className="ad-overview-label">Visão Geral</span>
          <h1 className="ad-page-title">Painel do <br /><span className="ad-title-dim">Artista</span></h1>
        </div>
        <div className="ad-header-actions">
          {/* Bloquear Horário (era "Novo Agendamento") */}
          <button className="ad-btn-primary" onClick={() => setShowBloqueioModal(true)}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>block</span>
            Bloquear Horário
          </button>
          {/* Nova Arte mantida separada */}
          <button className="ad-btn-secondary" onClick={onNewArt} style={{ marginLeft: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>add</span>
            Nova Arte
          </button>
        </div>
      </section>

      {/* ── BENTO GRID ─────────────────────────────────────────── */}
      <section className="ad-bento-grid">
        <div className="ad-card-highlight">
          <div className="ad-card-highlight-bg">
            <img alt="tattoo art" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcwMBoogvZI_cuzbWkJsJ-H3csKEkUzGPrTnBccbSByv9y0lN_JIf4HjArRRW1PQAT-pZgiG_ER61m0fY6Wxa5ueTP2zOCTYvsvcR4gWVxWrbyWahDzJK9FDiAN-8e5xzBBbk1VvX1UL3-AEDiZSwcZLR2y08Aa-O9kpnmRfDiWYOpH0X_yLWvrt27XW52E0qko1GBvirlrW1w9e6IuOchdJQVsaG8NkpqqsAkhJxbmVGh50QOQd-aWTWQLR_AYuQFIK-bUbPFvV8" />
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
                      {Array.from({ length: fullStars }, (_, i) => <span key={`full-${i}`} className="material-symbols-outlined icon-filled">star</span>)}
                      {hasHalf && <span key="half" className="material-symbols-outlined icon-filled">star_half</span>}
                      {Array.from({ length: emptyStars }, (_, i) => <span key={`empty-${i}`} className="material-symbols-outlined">star</span>)}
                    </>
                  )
                })()}
              </div>
              <p className="ad-rating-label">Avaliação Média do Artista</p>
            </div>
          </div>
          <div className="ad-rating-divider"></div>
          <div className="ad-rating-stats">
            <div className="ad-stat-item"><p className="ad-stat-value">{agendamentos.length}</p><p className="ad-stat-label">Total Sessões</p></div>
            <div className="ad-stat-item"><p className="ad-stat-value">{todayAgenda.length}</p><p className="ad-stat-label">Hoje</p></div>
            <div className="ad-stat-item"><p className="ad-stat-value">{concluidos}</p><p className="ad-stat-label">Concluídas</p></div>
          </div>
        </div>
      </section>

      {/* ── AGENDA DE HOJE ─────────────────────────────────────── */}
      <section className="ad-section">
        <div className="ad-section-header"><h2 className="ad-section-title">Agenda de Hoje</h2></div>
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
                draggable
                onDragStart={(e) => handleDragStart(e, ag.id)}
                onClick={() => openDrawer(ag)}
              >
                <div className="ad-agenda-time">
                  <p className="ad-agenda-time-value">{formatTime(ag.dataHora)}</p>
                  <p className="ad-agenda-time-period">{getTimePeriod(ag.dataHora)}</p>
                </div>
                <div className="ad-agenda-avatar">
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#e63946', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                    {getClientName(ag).charAt(0).toUpperCase()}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <p className="ad-agenda-name">{getClientName(ag)}</p>
                  <p className="ad-agenda-desc">{ag.servico || 'Sessão'}</p>
                  <span className={`ad-badge ${statusBadgeClass[ag.status] || ''}`}>{statusLabel[ag.status] || ag.status}</span>
                </div>
                {getNextStatus(ag.status) && (
                  <button className="ad-action-accept" style={{ minWidth: '32px', height: '32px', flexShrink: 0 }} title={`Avançar para ${statusLabel[getNextStatus(ag.status)]}`} onClick={(e) => { e.stopPropagation(); handleStatusUpdate(ag.id, getNextStatus(ag.status), getClientName(ag)) }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_forward</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Zona de Descarte (Limpeza) ─────────────────────── */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOverZone(true) }}
          onDragLeave={() => setDragOverZone(false)}
          onDrop={handleDropOnZone}
          style={{
            marginTop: '1rem',
            border: `2px dashed ${dragOverZone ? '#e63946' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 10,
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            color: dragOverZone ? '#e63946' : 'rgba(255,255,255,0.25)',
            background: dragOverZone ? 'rgba(230,57,70,0.06)' : 'transparent',
            transition: 'all 0.2s ease',
            cursor: 'default',
            userSelect: 'none',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>
            {dragOverZone ? 'delete_forever' : 'delete'}
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>
            {dragOverZone ? 'Solte para ocultar a sessão' : 'Arraste uma sessão aqui para ocultá-la'}
          </span>
        </div>
      </section>

      {/* ── AGENDAMENTOS RECENTES + TOGGLE ─────────────────────── */}
      <section className="ad-section">
        <div className="ad-section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="ad-section-title">Agendamentos Recentes</h2>

          {/* Toggle Mensal / Semanal */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: 3, gap: 2 }}>
            {['semanal', 'mensal'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.18s ease',
                  background: viewMode === mode ? '#e63946' : 'transparent',
                  color: viewMode === mode ? '#fff' : 'rgba(255,255,255,0.4)',
                }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ color: 'rgba(255,255,255,0.4)', padding: '2rem', textAlign: 'center' }}>Carregando...</div>
        ) : recentBookings.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.4)', padding: '2rem', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>event_busy</span>
            Nenhum agendamento para {viewMode === 'semanal' ? 'esta semana' : 'este mês'}.
          </div>
        ) : (
          <div className="ad-table-wrapper">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Cliente</th><th>Sessão</th><th>Serviço</th>
                  <th className="text-center">Status</th><th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((ag) => {
                  const clientName = getClientName(ag)
                  const nextStatus = getNextStatus(ag.status)
                  return (
                    <tr
                      key={ag.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ag.id)}
                      onClick={() => openDrawer(ag)}
                      style={{ cursor: 'grab' }}
                    >
                      <td>
                        <div className="ad-client-cell">
                          <div className="ad-client-avatar">
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#e63946', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.75rem' }}>
                              {clientName.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <p className="ad-client-name">{clientName}</p>
                            <p className="ad-client-email">{getClientEmail(ag)}</p>
                          </div>
                        </div>
                      </td>
                      <td><p className="ad-session-date">{formatDate(ag.dataHora)}</p><p className="ad-session-time">{formatTime(ag.dataHora)}</p></td>
                      <td><p className="ad-style-name">{ag.servico || 'Tatuagem'}</p><p className="ad-style-area">{ag.regiao || '—'}</p></td>
                      <td className="text-center"><span className={`ad-badge ${statusBadgeClass[ag.status] || ''}`}>{statusLabel[ag.status] || ag.status}</span></td>
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

      {/* ── PORTAL: Menu de contexto ────────────────────────────── */}
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

      {/* ── MODAL: Confirmar descarte (Limpeza) ─────────────────── */}
      {confirmDiscard && (
        <div onClick={() => setConfirmDiscard(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, width: '90%', maxWidth: 420, padding: '28px 28px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(230,57,70,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: '#e63946', fontSize: '1.2rem' }}>delete_forever</span>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.65rem', color: '#e63946', textTransform: 'uppercase', letterSpacing: 1 }}>Ocultar Sessão</p>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{getClientName(confirmDiscard)}</h3>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: '0 0 24px' }}>
              Tem certeza que deseja ocultar a sessão de <strong style={{ color: '#fff' }}>{getClientName(confirmDiscard)}</strong> em {formatDate(confirmDiscard.dataHora)} da visualização? Esta ação não cancela o agendamento.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmDiscard(null)} style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={confirmHide} style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: '#e63946', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                Sim, ocultar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Bloquear Horário ──────────────────────────────── */}
      {showBloqueioModal && (
        <div onClick={() => setShowBloqueioModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, width: '90%', maxWidth: 480, padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: '0.65rem', color: '#e63946', textTransform: 'uppercase', letterSpacing: 1 }}>Agenda</p>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Bloquear Horário</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
                  O período bloqueado não receberá novos pedidos.
                </p>
              </div>
              <button onClick={() => setShowBloqueioModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', marginTop: -4 }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Data</label>
                <input
                  type="date"
                  value={bloqueio.data}
                  onChange={e => setBloqueio(p => ({ ...p, data: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Hora de Início</label>
                  <input
                    type="time"
                    value={bloqueio.horaInicio}
                    onChange={e => setBloqueio(p => ({ ...p, horaInicio: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Hora de Fim</label>
                  <input
                    type="time"
                    value={bloqueio.horaFim}
                    onChange={e => setBloqueio(p => ({ ...p, horaFim: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Motivo (opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Folga, viagem, evento..."
                  value={bloqueio.motivo}
                  onChange={e => setBloqueio(p => ({ ...p, motivo: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button onClick={() => setShowBloqueioModal(false)} style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={handleSalvarBloqueio} disabled={salvandoBloqueio} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#e63946', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: salvandoBloqueio ? 'not-allowed' : 'pointer', opacity: salvandoBloqueio ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                {salvandoBloqueio
                  ? <><span className="material-symbols-outlined" style={{ fontSize: '1rem', animation: 'spin 1s linear infinite' }}>progress_activity</span> Salvando...</>
                  : <><span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>block</span> Bloquear</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Histórico do Cliente ──────────────────────────── */}
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
