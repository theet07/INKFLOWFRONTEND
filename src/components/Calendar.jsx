import { useState } from 'react'
import './Calendar.css'

const Calendar = ({ selectedDate, onDateSelect, availableSlots = {} }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Dias vazios do mês anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }
  
  const isToday = (date) => {
    const today = new Date()
    return date && date.toDateString() === today.toDateString()
  }
  
  const isSelected = (date) => {
    if (!date || !selectedDate) return false
    const selected = new Date(selectedDate + 'T00:00:00')
    return date.toDateString() === selected.toDateString()
  }
  
  const isPastDate = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date && date < today
  }
  
  const hasAvailableSlots = (date) => {
    if (!date) return false
    const dateStr = date.toISOString().split('T')[0]
    return availableSlots[dateStr] && availableSlots[dateStr].length > 0
  }
  
  const handleDateClick = (date) => {
    if (date && !isPastDate(date) && hasAvailableSlots(date)) {
      const formattedDate = date.toISOString().split('T')[0]
      onDateSelect(formattedDate)
    }
  }
  
  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      newMonth.setMonth(prev.getMonth() + direction)
      return newMonth
    })
  }
  
  const days = getDaysInMonth(currentMonth)
  
  return (
    <div className="calendar-container">
      <label style={{ color: 'var(--accent-red)', marginBottom: '1.5rem', display: 'block', fontWeight: '700', textAlign: 'center', fontSize: '1.3rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Data</label>
      <div className="calendar-header">
        <button type="button" className="calendar-nav" onClick={() => navigateMonth(-1)}>
          ‹
        </button>
        <h3 className="calendar-month">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button type="button" className="calendar-nav" onClick={() => navigateMonth(1)}>
          ›
        </button>
      </div>
      
      <div className="calendar-weekdays">
        {weekdays.map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
      </div>
      
      <div className="calendar-days">
        {days.map((date, index) => (
          <button
            key={index}
            type="button"
            className={`calendar-day ${
              !date ? 'empty' : 
              isPastDate(date) ? 'disabled' : 
              !hasAvailableSlots(date) ? 'no-slots' :
              isSelected(date) ? 'selected' : ''
            }`}
            onClick={() => handleDateClick(date)}
            disabled={!date || isPastDate(date) || !hasAvailableSlots(date)}
          >
            {date ? date.getDate() : ''}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Calendar