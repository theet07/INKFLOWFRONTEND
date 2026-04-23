import { useState, useEffect } from 'react'
import { agendamentoService } from '../../services/inkflowApi'
import { useAuth } from '../../contexts/AuthContext'

const ScheduleTab = ({ showToast, openDrawer }) => {
  const { user } = useAuth()
  const [selectedDay, setSelectedDay] = useState(null)
  const [agendamentos, setAgendamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [monthOffset, setMonthOffset] = useState(0)

  // ── Toggle Mensal / Semanal ───────────────────────────────────
  const [viewMode, setViewMode] = useState('mensal')

  // ── Limpeza: drag-drop + confirmação ─────────────────────────
  const [hiddenIds, setHiddenIds] = useState([])
  const [draggingId, setDraggingId] = useState(null)
  const [dragOverZone, setDragOverZone] = useState(false)
  const [confirmDiscard, setConfirmDiscard] = useState(null)

  // ── Bloquear Horário ─────────────────────────────────────────
  const [showBloqueioModal, setShowBloqueioModal] = useState(false)
  const [bloqueio, setBloqueio] = useState({ data: '', horaInicio: '', horaFim: '', motivo: '' })
  const [salvandoBloqueio, setSalvandoBloqueio] = useState(false)

  const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

  useEffect(() => {
    if (!user?.artistaId && !user?.id) return
    const id = user.artistaId || user.id
    agendamentoService.getByArtista(id)
      .then(res => {
        const dados = Array.isArray(res.data) ? res.data : []
        setAgendamentos(
          dados.filter(ag => ag.status !== 'CANCELADO')
               .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
        )
      })
      .catch(() => showToast('Erro ao carregar agenda.', true))
      .finally(() => setLoading(false))
  }, [user])

  // ── Datas base ────────────────────────────────────────────────
  const hoje = new Date()
  const viewDate = new Date(hoje.getFullYear(), hoje.getMonth() + monthOffset, 1)
  const mesNome = viewDate.toLocaleDateString('pt-BR', { month: 'long' })
  const mesNomeCapitalizado = mesNome.charAt(0).toUpperCase() + mesNome.slice(1)
  const ano = viewDate.getFullYear()

  // ── Agrupamento por dia ───────────────────────────────────────
  const agendamentosPorDia = agendamentos.reduce((acc, ag) => {
    if (hiddenIds.includes(ag.id)) return acc
    const d = new Date(ag.dataHora)
    // só agrupa se pertence ao mês/ano exibido
    if (d.getMonth() !== viewDate.getMonth() || d.getFullYear() !== viewDate.getFullYear()) return acc
    const dia = String(d.getDate()).padStart(2, '0')
    if (!acc[dia]) acc[dia] = []
    acc[dia].push(ag)
    return acc
  }, {})

  // ── Grid mensal ───────────────────────────────────────────────
  const primeiroDia = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
  const offsetInicio = (primeiroDia.getDay() + 6) % 7
  const totalDias = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate()

  const allMonthDays = [
    ...Array(offsetInicio).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => {
      const num = String(i + 1).padStart(2, '0')
      const nomeDia = new Date(viewDate.getFullYear(), viewDate.getMonth(), i + 1)
        .toLocaleDateString('pt-BR', { weekday: 'long' })
      return { day: num, name: nomeDia.charAt(0).toUpperCase() + nomeDia.slice(1) }
    })
  ]

  // ── Grid semanal: só os 7 dias da semana atual ─────────────────
  const getWeekDays = () => {
    const ref = monthOffset === 0 ? hoje : viewDate
    const dow = ref.getDay()
    const diffToMon = dow === 0 ? -6 : 1 - dow
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(ref)
      d.setDate(ref.getDate() + diffToMon + i)
      // só mostra se pertence ao mês exibido
      if (d.getMonth() !== viewDate.getMonth() || d.getFullYear() !== viewDate.getFullYear()) return null
      const num = String(d.getDate()).padStart(2, '0')
      const nomeDia = d.toLocaleDateString('pt-BR', { weekday: 'long' })
      return { day: num, name: nomeDia.charAt(0).toUpperCase() + nomeDia.slice(1) }
    })
  }

  const calendarDays = viewMode === 'semanal' ? getWeekDays() : allMonthDays

  const diaAtual = monthOffset === 0 ? String(hoje.getDate()).padStart(2, '0') : null
  const effectiveSelected = selectedDay || diaAtual
  const sessoesDoDia = (agendamentosPorDia[effectiveSelected] || [])

  const getSelectedDayName = () => calendarDays.find(d => d && d.day === effectiveSelected)?.name || ''
  const getPanelStatus = () => sessoesDoDia.length > 0 ? 'Confirmado' : 'Aberto'
  const getPanelOpacity = () => sessoesDoDia.length > 0 ? 1 : 0.1

  const handleDayClick = (day) => {
    setSelectedDay(day.day)
    const count = (agendamentosPorDia[day.day] || []).length
    if (count > 0) showToast(`${count} sessão(ões) em ${mesNomeCapitalizado} ${day.day}`)
    else showToast(`${mesNomeCapitalizado} ${day.day} está aberto para agendamento`)
  }

  const handleSessionClick = (ag) => {
    if (openDrawer) openDrawer(ag)
    else showToast(`Detalhes: ${ag.cliente?.nome || 'Cliente'}`)
  }

  const totalConfirmados = agendamentos.filter(ag => ag.status === 'CONFIRMADO').length

  // ── Drag handlers (Limpeza) ───────────────────────────────────
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
    showToast(`Sessão de ${confirmDiscard.cliente?.nome || 'Cliente'} ocultada`)
    setConfirmDiscard(null)
  }

  // ── Bloquear Horário ──────────────────────────────────────────
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

  // ── Estilos reutilizáveis ─────────────────────────────────────
  const inputStyle = {
    width: '100%', padding: '10px 12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, color: '#fff', fontSize: '0.875rem',
    outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle = {
    display: 'block', fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6,
  }

  return (
    <div className="ad-sched-layout">

      {/* ── CALENDÁRIO ─────────────────────────────────────────── */}
      <section className="ad-sched-calendar-section">
        <div className="ad-sched-inner">

          {/* Header com toggle */}
          <div className="ad-sched-cal-header">
            <div>
              <h2 className="ad-sched-month-title">
                {mesNomeCapitalizado} <span className="ad-sched-year">{ano}</span>
              </h2>
              <p className="ad-sched-month-subtitle">
                {loading ? 'Carregando...' : `${totalConfirmados} Sessões confirmadas este mês`}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Toggle Mensal / Semanal */}
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: 3, gap: 2 }}>
                {['mensal', 'semanal'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => { setViewMode(mode); setSelectedDay(null) }}
                    style={{
                      padding: '5px 14px', borderRadius: 6, border: 'none',
                      fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                      textTransform: 'capitalize', transition: 'all 0.18s ease',
                      background: viewMode === mode ? '#e63946' : 'transparent',
                      color: viewMode === mode ? '#fff' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              {/* Navegação de mês */}
              <div className="ad-sched-nav-btns">
                <button className="ad-sched-nav-btn" onClick={() => { setMonthOffset(p => p - 1); setSelectedDay(null) }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>chevron_left</span>
                </button>
                <button className="ad-sched-nav-btn" onClick={() => { setMonthOffset(p => p + 1); setSelectedDay(null) }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="ad-sched-grid">
            {dayNames.map(name => (
              <div key={name} className="ad-sched-day-header">{name}</div>
            ))}

            {calendarDays.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} className="ad-sched-day-cell empty" />

              const isSelected = effectiveSelected === day.day
              const isHoje = day.day === diaAtual
              const sessoes = agendamentosPorDia[day.day] || []

              return (
                <div
                  key={day.day}
                  className={`ad-sched-day-cell ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  <span className={`ad-sched-day-num ${isSelected ? 'active' : ''}`}>
                    {day.day}
                  </span>

                  {sessoes.length > 0 && (
                    <div className="ad-sched-day-events">
                      <div className="ad-sched-event-tag solid">
                        <p>
                          {sessoes.length === 1
                            ? sessoes[0].servico || 'Sessão'
                            : `Sessões (${sessoes.length})`}
                        </p>
                      </div>
                    </div>
                  )}

                  {!sessoes.length && isHoje && (
                    <div className="ad-sched-day-events">
                      <div className="ad-sched-indicator muted" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PAINEL LATERAL ─────────────────────────────────────── */}
      <aside className="ad-sched-panel">
        <div className="ad-sched-panel-header">
          <div className="ad-sched-panel-header-row">
            <span className="ad-sched-panel-day-name">{getSelectedDayName()}</span>
            <span className="ad-sched-panel-status">{getPanelStatus()}</span>
          </div>
          <h3 className="ad-sched-panel-date">
            {mesNomeCapitalizado.slice(0, 3).toUpperCase()} {effectiveSelected}
          </h3>
        </div>

        <div className="ad-sched-panel-sessions" style={{ opacity: getPanelOpacity() }}>
          <h4 className="ad-sched-panel-section-title">
            <span className="ad-sched-dot" />
            Sessões Agendadas
          </h4>

          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '1rem' }}>
              Carregando...
            </p>
          ) : sessoesDoDia.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '1rem', fontSize: '0.875rem' }}>
              Nenhuma sessão neste dia.
            </p>
          ) : (
            sessoesDoDia.map((ag) => {
              const hora = new Date(ag.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
              const isPrimary = ag.status === 'CONFIRMADO'
              return (
                <div
                  key={ag.id}
                  className={`ad-sched-session-card ${isPrimary ? 'primary' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, ag.id)}
                  onClick={() => handleSessionClick(ag)}
                  style={{ cursor: 'grab' }}
                  title="Arraste para a zona de limpeza para ocultar"
                >
                  <div className="ad-sched-session-top">
                    <div>
                      <p className="ad-sched-session-time">{hora}</p>
                      <h5 className="ad-sched-session-client">{ag.cliente?.nome || 'Cliente'}</h5>
                    </div>
                    <span className={`ad-sched-session-duration ${isPrimary ? 'primary' : ''}`}>
                      {ag.status}
                    </span>
                  </div>
                  <div className="ad-sched-session-bottom">
                    <div className="ad-sched-session-img">
                      {ag.imagemReferenciaUrl
                        ? <img src={ag.imagemReferenciaUrl} alt={ag.cliente?.nome} />
                        : <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.1)', borderRadius: 8 }} />
                      }
                    </div>
                    <div>
                      <p className="ad-sched-session-style">{ag.servico || 'Tatuagem'}</p>
                      <p className="ad-sched-session-detail">{ag.descricao || ag.cliente?.email || ''}</p>
                    </div>
                  </div>
                </div>
              )
            })
          )}

          {/* ── Zona de Limpeza (drop zone) ─────────────────── */}
          {sessoesDoDia.length > 0 && (
            <div
              className="ad-sched-break"
              onDragOver={(e) => { e.preventDefault(); setDragOverZone(true) }}
              onDragLeave={() => setDragOverZone(false)}
              onDrop={handleDropOnZone}
              style={{
                cursor: 'default',
                border: dragOverZone ? '2px dashed #e63946' : '2px dashed transparent',
                borderRadius: 8,
                background: dragOverZone ? 'rgba(230,57,70,0.08)' : undefined,
                color: dragOverZone ? '#e63946' : undefined,
                transition: 'all 0.2s ease',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '0.875rem', marginRight: 8, color: dragOverZone ? '#e63946' : undefined }}
              >
                {dragOverZone ? 'delete_forever' : 'delete'}
              </span>
              <span>{dragOverZone ? 'Solte para ocultar' : 'Limpeza & Reposição do Estúdio'}</span>
            </div>
          )}
        </div>

        {/* ── Footer: Bloquear Horário ──────────────────────────── */}
        <div className="ad-sched-panel-footer">
          <button className="ad-sched-new-btn" onClick={() => setShowBloqueioModal(true)}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>block</span>
            Bloquear Horário
          </button>
        </div>
      </aside>

      {/* ── MODAL: Confirmar descarte ────────────────────────────── */}
      {confirmDiscard && (
        <div
          onClick={() => setConfirmDiscard(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, width: '90%', maxWidth: 420, padding: '28px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(230,57,70,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: '#e63946', fontSize: '1.2rem' }}>delete_forever</span>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.65rem', color: '#e63946', textTransform: 'uppercase', letterSpacing: 1 }}>Ocultar Sessão</p>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{confirmDiscard.cliente?.nome || 'Cliente'}</h3>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: '0 0 24px' }}>
              Tem certeza que deseja ocultar esta sessão da visualização?{' '}
              <strong style={{ color: '#fff' }}>O agendamento não será cancelado.</strong>
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirmDiscard(null)}
                style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmHide}
                style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: '#e63946', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Sim, ocultar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Bloquear Horário ──────────────────────────────── */}
      {showBloqueioModal && (
        <div
          onClick={() => setShowBloqueioModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, width: '90%', maxWidth: 480, padding: '28px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: '0.65rem', color: '#e63946', textTransform: 'uppercase', letterSpacing: 1 }}>Agenda</p>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Bloquear Horário</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
                  O período bloqueado não receberá novos pedidos.
                </p>
              </div>
              <button onClick={() => setShowBloqueioModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Data</label>
                <input type="date" value={bloqueio.data} onChange={e => setBloqueio(p => ({ ...p, data: e.target.value }))} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Hora de Início</label>
                  <input type="time" value={bloqueio.horaInicio} onChange={e => setBloqueio(p => ({ ...p, horaInicio: e.target.value }))} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Hora de Fim</label>
                  <input type="time" value={bloqueio.horaFim} onChange={e => setBloqueio(p => ({ ...p, horaFim: e.target.value }))} style={inputStyle} />
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
              <button
                onClick={() => setShowBloqueioModal(false)}
                style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarBloqueio}
                disabled={salvandoBloqueio}
                style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#e63946', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: salvandoBloqueio ? 'not-allowed' : 'pointer', opacity: salvandoBloqueio ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {salvandoBloqueio
                  ? <><span className="material-symbols-outlined" style={{ fontSize: '1rem', animation: 'spin 1s linear infinite' }}>progress_activity</span> Salvando...</>
                  : <><span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>block</span> Bloquear</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ScheduleTab
