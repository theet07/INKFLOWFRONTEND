import { useState } from 'react'

const ScheduleTab = ({ showToast }) => {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(today.getDate())
  const [currentMonth] = useState(today.getMonth())
  const [currentYear] = useState(today.getFullYear())

  const appointments = [
    { id: 1, date: 5, time: '10:00', clientName: 'João Pedro', service: 'Tatuagem Geométrica', status: 'confirmed', duration: '3h' },
    { id: 2, date: 5, time: '14:00', clientName: 'Maria Silva', service: 'Blackwork Mandala', status: 'confirmed', duration: '4h' },
    { id: 3, date: 5, time: '19:00', clientName: 'Ana Carolina', service: 'Fine Line Floral', status: 'completed', duration: '2h' },
    { id: 4, date: 8, time: '10:00', clientName: 'Lucas Mendes', service: 'Realismo Retrato', status: 'confirmed', duration: '5h' },
    { id: 5, date: 8, time: '16:00', clientName: 'Fernanda Lopes', service: 'Lettering Script', status: 'cancelled', duration: '1.5h' },
    { id: 6, date: 12, time: '11:00', clientName: 'Carlos Eduardo', service: 'Maori Bracelete', status: 'confirmed', duration: '6h' },
    { id: 7, date: 15, time: '09:00', clientName: 'Juliana Costa', service: 'Aquarela Abstrata', status: 'confirmed', duration: '3h' },
    { id: 8, date: 15, time: '14:00', clientName: 'Rafael Santos', service: 'Trash Polka', status: 'confirmed', duration: '4h' },
    { id: 9, date: 20, time: '10:00', clientName: 'Beatriz Lima', service: 'Pontilhismo', status: 'confirmed', duration: '5h' },
    { id: 10, date: 22, time: '15:00', clientName: 'Thiago Oliveira', service: 'Old School', status: 'confirmed', duration: '2h' },
  ]

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const dayNames = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const calendarDays = []
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null)
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i)

  const dayAppointments = appointments.filter(a => a.date === selectedDate)
  const datesWithEvents = [...new Set(appointments.map(a => a.date))]

  const statusConfig = {
    confirmed: { label: 'Confirmado', badgeClass: 'ad-badge-green' },
    completed: { label: 'Realizado', badgeClass: 'ad-badge' },
    cancelled: { label: 'Cancelado', badgeClass: 'ad-badge-red' },
  }

  return (
    <>
      {/* Header */}
      <section className="ad-header-section">
        <div className="ad-header-text">
          <span className="ad-overview-label">Organização</span>
          <h1 className="ad-page-title">
            Agenda do <br />
            <span className="ad-title-dim">Estúdio</span>
          </h1>
        </div>
        <div className="ad-header-actions">
          <button className="ad-btn-primary" onClick={() => showToast('Funcionalidade de bloqueio em breve!')}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>block</span>
            Bloquear Horário
          </button>
        </div>
      </section>

      <div className="ad-schedule-layout">
        {/* Calendar */}
        <div className="ad-schedule-calendar">
          <div className="ad-cal-header">
            <h3 className="ad-cal-month">{monthNames[currentMonth]} {currentYear}</h3>
          </div>
          <div className="ad-cal-weekdays">
            {dayNames.map(d => <span key={d}>{d}</span>)}
          </div>
          <div className="ad-cal-grid">
            {calendarDays.map((day, i) => (
              <div
                key={i}
                className={`ad-cal-day ${!day ? 'empty' : ''} ${day === selectedDate ? 'selected' : ''} ${day === today.getDate() ? 'today' : ''} ${datesWithEvents.includes(day) ? 'has-event' : ''}`}
                onClick={() => day && setSelectedDate(day)}
              >
                {day || ''}
              </div>
            ))}
          </div>
          <div className="ad-cal-legend">
            <span><span className="ad-dot today-dot"></span> Hoje</span>
            <span><span className="ad-dot event-dot"></span> Com agendamento</span>
            <span><span className="ad-dot selected-dot"></span> Selecionado</span>
          </div>
        </div>

        {/* Day's Appointments */}
        <div className="ad-schedule-day">
          <h3 className="ad-section-title" style={{ marginBottom: 16 }}>
            {selectedDate} de {monthNames[currentMonth]}
          </h3>
          {dayAppointments.length === 0 ? (
            <div className="ad-empty-state">
              <span className="material-symbols-outlined">event_busy</span>
              <p>Nenhum agendamento neste dia.</p>
            </div>
          ) : (
            <div className="ad-schedule-list">
              {dayAppointments.map(apt => (
                <div key={apt.id} className="ad-schedule-item">
                  <div className="ad-schedule-time">
                    <span className="ad-schedule-time-value">{apt.time}</span>
                    <span className="ad-schedule-duration">{apt.duration}</span>
                  </div>
                  <div className="ad-schedule-line"></div>
                  <div className="ad-schedule-info">
                    <p className="ad-schedule-client">{apt.clientName}</p>
                    <p className="ad-schedule-service">{apt.service}</p>
                    <span className={`ad-badge ${statusConfig[apt.status]?.badgeClass || ''}`}>
                      {statusConfig[apt.status]?.label || apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ScheduleTab
