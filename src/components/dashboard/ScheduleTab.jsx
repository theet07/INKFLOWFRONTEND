import { useState } from 'react'

const ScheduleTab = ({ showToast }) => {
  const [selectedDay, setSelectedDay] = useState('07')
  const [viewMode, setViewMode] = useState('monthly')

  const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

  // Calendar grid: null = empty leading space, object = day cell
  const calendarDays = [
    null, null, // leading empties (Mon, Tue)
    { day: '01', name: 'Quarta-feira' },
    { day: '02', name: 'Quinta-feira', indicator: 'bar-muted' },
    { day: '03', name: 'Sexta-feira' },
    { day: '04', name: 'Sábado', event: { label: '10:00 AM - Realismo', type: 'primary' } },
    { day: '05', name: 'Domingo' },

    { day: '06', name: 'Segunda-feira' },
    { day: '07', name: 'Terça-feira', event: { label: 'Sessões Ativas (3)', type: 'solid' } },
    { day: '08', name: 'Quarta-feira' },
    { day: '09', name: 'Quinta-feira', indicator: 'bar-error' },
    { day: '10', name: 'Sexta-feira' },
    { day: '11', name: 'Sábado' },
    { day: '12', name: 'Domingo' },

    // Remaining placeholders
    { day: '13', name: 'Segunda-feira', placeholder: true },
    { day: '14', name: 'Terça-feira', placeholder: true },
    { day: '15', name: 'Quarta-feira', placeholder: true },
    { day: '16', name: 'Quinta-feira', placeholder: true },
    { day: '17', name: 'Sexta-feira', placeholder: true },
    { day: '18', name: 'Sábado', placeholder: true },
    { day: '19', name: 'Domingo', placeholder: true },
  ]

  // Sessions for selected day
  const sessions = [
    {
      time: '10:00 AM — 02:00 PM',
      client: 'Elias Thorne',
      duration: '4h Session',
      style: 'Realism Sleeve',
      detail: 'Forearm • Shading Phase',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKPAPuZN7LuO98_XAx_gTS6yOBoNJ28hOrcZ3QftP-HeWOuvtySiIbu_a3D1p54e3KVxvM5aJ0BgB7J5RkxqfIreiacRpTFtDm_PJVB-8gm6neqpNHRFWR60pMWnRjwxYuhF3vYyL8Z7Gpo2JA8ge5KZYfLXyXyeMA95rPcmPM_bven6jOCQmcjRX5VlbEyjYIjei6RmMzfM5_rUqVn2ry889LigIWpX2sSoksyIM5Q11mnemxfFHOPYQAb2_uF1ZO20t6u6kAO2s',
      primary: true,
    },
    {
      time: '03:30 PM — 06:00 PM',
      client: 'Sarah Jenkins',
      duration: '2.5h Session',
      style: 'Fine Line Floral',
      detail: 'Lower Leg • Final Details',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrt43pITqUpk6u2HAIIskG7tVkD6o8yE41vFd2kgFFz29mPKmhTmN72YOgvAVDhscg-mtujNp-kX7oTzQue7W-AfMiYfyjuoCDPakZB_Uwzakdd0HVsp23tKNTBeCZNRgIPTGPs41CAve4o_pkvWHP9kzYvRxb0Hul3fbX_z_FFNTbDHjQ_bLRqa2PeZZZxja8tqahmy-15HzoK0wVc3Ci8UtI517tF-FxsapN6iaeAEf8Fmm7_13FdQfWjbfohoki6lfeQ15McNo',
      primary: false,
    },
    {
      time: '07:30 PM — 10:30 PM',
      client: 'Marcus Vane',
      duration: '3h Session',
      style: 'Geometric Chest',
      detail: 'Chest Piece • Linework',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKhyNbj3W3K-z70gC0xg6DacLUF6OCVOzUOifRv7WaLGVU-1TVHkGq_mTnVenJ3h2koe_VduNeA0E4CtrCbLWJPWyeTAa1ijWnLZqIe-Ws30tfOcJBBmiIMl__gJ7LXlRSjXpmLqPofXt9Txbvk2K4mI0q65KkF-TuUeekz_i0TII4zog1jOhbwt-S-IYJ-denjyiuL1Df6FRa8dxLW-YBe2RX1nCmN95FpSSeYsKkWf3DZm9zDYjdjSaSZ0y8B1mhU3fwVW23Sec',
      primary: true,
    },
  ]

  const daysWithSessions = ['04', '07']
  const daysCanceled = ['09']

  const getPanelStatus = () => {
    if (daysWithSessions.includes(selectedDay)) return 'Confirmado'
    if (daysCanceled.includes(selectedDay)) return 'Cancelado'
    return 'Aberto'
  }

  const getPanelOpacity = () => {
    if (daysWithSessions.includes(selectedDay)) return 1
    if (daysCanceled.includes(selectedDay)) return 0.3
    return 0.1
  }

  const getSelectedDayName = () => {
    const found = calendarDays.find(d => d && d.day === selectedDay)
    return found ? found.name : ''
  }

  const handleDayClick = (day) => {
    setSelectedDay(day.day)
    if (daysWithSessions.includes(day.day)) {
      showToast(`Agenda de Out ${day.day} carregada`)
    } else if (daysCanceled.includes(day.day)) {
      showToast(`Nenhuma sessão ativa em Out ${day.day}`, true)
    } else {
      showToast(`Out ${day.day} está aberto para agendamento`)
    }
  }

  const handleSessionClick = (session) => {
    showToast(`Abrindo detalhes da sessão: ${session.client}`)
  }

  return (
    <div className="ad-sched-layout">

      {/* Calendar Grid Section */}
      <section className="ad-sched-calendar-section">
        <div className="ad-sched-inner">

          {/* Calendar Header */}
          <div className="ad-sched-cal-header">
            <div>
              <h2 className="ad-sched-month-title">
                Outubro <span className="ad-sched-year">2024</span>
              </h2>
              <p className="ad-sched-month-subtitle">12 Sessões confirmadas este mês</p>
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
            {/* Day Labels */}
            {dayNames.map(name => (
              <div key={name} className="ad-sched-day-header">{name}</div>
            ))}

            {/* Day Cells */}
            {calendarDays.map((day, i) => {
              if (!day) {
                return <div key={`empty-${i}`} className="ad-sched-day-cell empty"></div>
              }

              if (day.placeholder) {
                return (
                  <div key={day.day} className="ad-sched-day-cell placeholder">
                    {day.day}
                  </div>
                )
              }

              const isSelected = selectedDay === day.day

              return (
                <div
                  key={day.day}
                  className={`ad-sched-day-cell ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  <span className={`ad-sched-day-num ${isSelected ? 'active' : ''}`}>{day.day}</span>

                  {day.indicator === 'bar-muted' && (
                    <div className="ad-sched-day-events">
                      <div className="ad-sched-indicator muted"></div>
                    </div>
                  )}
                  {day.indicator === 'bar-error' && (
                    <div className="ad-sched-day-events">
                      <div className="ad-sched-indicator error"></div>
                    </div>
                  )}
                  {day.event && day.event.type === 'primary' && (
                    <div className="ad-sched-day-events">
                      <div className="ad-sched-event-tag primary">
                        <p>{day.event.label}</p>
                      </div>
                    </div>
                  )}
                  {day.event && day.event.type === 'solid' && (
                    <div className="ad-sched-day-events">
                      <div className="ad-sched-event-tag solid">
                        <p>{day.event.label}</p>
                      </div>
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
            <span className={`ad-sched-panel-status ${daysCanceled.includes(selectedDay) ? 'error' : ''}`}>
              {getPanelStatus()}
            </span>
          </div>
          <h3 className="ad-sched-panel-date">OUT {selectedDay}</h3>
        </div>

        <div className="ad-sched-panel-sessions" style={{ opacity: getPanelOpacity() }}>
          <h4 className="ad-sched-panel-section-title">
            <span className="ad-sched-dot"></span>
            Sessões Agendadas
          </h4>

          {/* Session Cards */}
          {sessions.map((session, i) => (
            <div
              key={i}
              className={`ad-sched-session-card ${session.primary ? 'primary' : ''}`}
              onClick={() => handleSessionClick(session)}
            >
              <div className="ad-sched-session-top">
                <div>
                  <p className="ad-sched-session-time">{session.time}</p>
                  <h5 className="ad-sched-session-client">{session.client}</h5>
                </div>
                <span className={`ad-sched-session-duration ${session.primary ? 'primary' : ''}`}>
                  {session.duration}
                </span>
              </div>
              <div className="ad-sched-session-bottom">
                <div className="ad-sched-session-img">
                  <img src={session.img} alt={session.client} />
                </div>
                <div>
                  <p className="ad-sched-session-style">{session.style}</p>
                  <p className="ad-sched-session-detail">{session.detail}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Break */}
          <div className="ad-sched-break">
            <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', marginRight: 8 }}>coffee</span>
            <span>Limpeza &amp; Reposição do Estúdio</span>
          </div>
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
