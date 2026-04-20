import { useState, useEffect } from 'react'
import { agendamentoService } from '../../services/inkflowApi'
import { useAuth } from '../../contexts/AuthContext'

const ScheduleTab = ({ showToast }) => {
  const { user } = useAuth()
  const [selectedDay, setSelectedDay] = useState(null)
  const [agendamentos, setAgendamentos] = useState([])
  const [loading, setLoading] = useState(true)

  const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

  useEffect(() => {
    if (!user?.artistaId && !user?.id) return
    const id = user.artistaId || user.id
    agendamentoService.getByArtista(id)
      .then(res => {
        const dados = Array.isArray(res.data) ? res.data : []
        const ordenados = dados
          .filter(ag => ag.status !== 'CANCELADO')
          .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
        setAgendamentos(ordenados)
      })
      .catch(() => showToast('Erro ao carregar agenda.', true))
      .finally(() => setLoading(false))
  }, [user])

  // Agrupa agendamentos por dia do mês (string '01'..'31')
  const agendamentosPorDia = agendamentos.reduce((acc, ag) => {
    const dia = String(new Date(ag.dataHora).getDate()).padStart(2, '0')
    if (!acc[dia]) acc[dia] = []
    acc[dia].push(ag)
    return acc
  }, {})

  const diasComSessao = Object.keys(agendamentosPorDia)

  // Mês/ano atual para o cabeçalho
  const hoje = new Date()
  const mesNome = hoje.toLocaleDateString('pt-BR', { month: 'long' })
  const mesNomeCapitalizado = mesNome.charAt(0).toUpperCase() + mesNome.slice(1)
  const ano = hoje.getFullYear()

  // Gera o grid do mês atual dinamicamente
  const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  // JS: 0=Dom, ajusta para Seg=0
  const offsetInicio = (primeiroDia.getDay() + 6) % 7
  const totalDias = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate()

  const calendarDays = [
    ...Array(offsetInicio).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => {
      const num = String(i + 1).padStart(2, '0')
      const diaSemana = new Date(hoje.getFullYear(), hoje.getMonth(), i + 1)
        .toLocaleDateString('pt-BR', { weekday: 'long' })
      const nomeDia = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)
      return { day: num, name: nomeDia }
    })
  ]

  const diaAtual = String(hoje.getDate()).padStart(2, '0')
  const effectiveSelected = selectedDay || diaAtual

  const sessoesDoDia = agendamentosPorDia[effectiveSelected] || []

  const getPanelStatus = () => {
    if (sessoesDoDia.length > 0) return 'Confirmado'
    return 'Aberto'
  }

  const getPanelOpacity = () => sessoesDoDia.length > 0 ? 1 : 0.1

  const getSelectedDayName = () => {
    const found = calendarDays.find(d => d && d.day === effectiveSelected)
    return found ? found.name : ''
  }

  const handleDayClick = (day) => {
    setSelectedDay(day.day)
    const count = (agendamentosPorDia[day.day] || []).length
    if (count > 0) {
      showToast(`${count} sessão(ões) em ${mesNomeCapitalizado} ${day.day}`)
    } else {
      showToast(`${mesNomeCapitalizado} ${day.day} está aberto para agendamento`)
    }
  }

  const handleSessionClick = (ag) => {
    showToast(`Detalhes: ${ag.cliente?.nome || 'Cliente'}`)
  }

  const totalConfirmados = agendamentos.filter(ag => ag.status === 'CONFIRMADO').length

  return (
    <div className="ad-sched-layout">

      {/* Calendar Grid Section */}
      <section className="ad-sched-calendar-section">
        <div className="ad-sched-inner">

          {/* Calendar Header */}
          <div className="ad-sched-cal-header">
            <div>
              <h2 className="ad-sched-month-title">
                {mesNomeCapitalizado} <span className="ad-sched-year">{ano}</span>
              </h2>
              <p className="ad-sched-month-subtitle">
                {loading ? 'Carregando...' : `${totalConfirmados} Sessões confirmadas este mês`}
              </p>
            </div>
            <div className="ad-sched-nav-btns">
              <button className="ad-sched-nav-btn" onClick={() => showToast('Mês anterior carregado')}>
                <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>chevron_left</span>
              </button>
              <button className="ad-sched-nav-btn" onClick={() => showToast('Próximo mês carregado')}>
                <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>chevron_right</span>
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="ad-sched-grid">
            {dayNames.map(name => (
              <div key={name} className="ad-sched-day-header">{name}</div>
            ))}

            {calendarDays.map((day, i) => {
              if (!day) {
                return <div key={`empty-${i}`} className="ad-sched-day-cell empty"></div>
              }

              const isSelected = effectiveSelected === day.day
              const isHoje = day.day === diaAtual
              const sessoes = agendamentosPorDia[day.day] || []
              const temSessao = sessoes.length > 0

              return (
                <div
                  key={day.day}
                  className={`ad-sched-day-cell ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  <span className={`ad-sched-day-num ${isSelected ? 'active' : ''}`}>
                    {day.day}
                  </span>

                  {temSessao && (
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

                  {!temSessao && isHoje && (
                    <div className="ad-sched-day-events">
                      <div className="ad-sched-indicator muted"></div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Right Side Panel: Day Details */}
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
            <span className="ad-sched-dot"></span>
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
            sessoesDoDia.map((ag, i) => {
              const data = new Date(ag.dataHora)
              const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
              const isPrimary = ag.status === 'CONFIRMADO'

              return (
                <div
                  key={ag.id}
                  className={`ad-sched-session-card ${isPrimary ? 'primary' : ''}`}
                  onClick={() => handleSessionClick(ag)}
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
                        : <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
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

          {/* Break */}
          {sessoesDoDia.length > 0 && (
            <div className="ad-sched-break">
              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', marginRight: 8 }}>coffee</span>
              <span>Limpeza &amp; Reposição do Estúdio</span>
            </div>
          )}
        </div>

        {/* Panel Footer */}
        <div className="ad-sched-panel-footer">
          <button className="ad-sched-new-btn" onClick={() => showToast('Abrindo formulário de novo agendamento')}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>add_circle</span>
            Novo Agendamento
          </button>
        </div>
      </aside>
    </div>
  )
}

export default ScheduleTab
