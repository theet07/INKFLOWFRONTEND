import { useState, useEffect } from 'react'
import Calendar from '../components/Calendar'
import oioiImage from '../assets/oioi.png'

import { agendamentoService, clienteService } from '../services/inkflowApi'

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [currentImageSlide, setCurrentImageSlide] = useState(0)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    servico: '',
    descricao: ''
  })

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
  const services = ['Tatuagem Pequena', 'Tatuagem Média', 'Tatuagem Grande', 'Retoque', 'Consulta']
  
  const getAvailableSlots = () => {
    const slots = {}
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      
      if (date.getDay() !== 0) {
        const availableHours = timeSlots.filter(() => Math.random() > 0.3)
        if (availableHours.length > 0) {
          slots[dateStr] = availableHours
        }
      }
    }
    return slots
  }
  
  const availableSlots = getAvailableSlots()
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.email) {
      setFormData(prev => ({
        ...prev,
        nome: user.nome || '',
        email: user.email || ''
      }))
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageSlide((prev) => (prev + 1) % 6)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      let clienteId
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      if (user.id) {
        clienteId = user.id
      } else {
        const novoCliente = {
          username: formData.email.split('@')[0],
          email: formData.email,
          password: '123456',
          fullName: formData.nome
        }
        
        const clienteResponse = await clienteService.create(novoCliente)
        clienteId = clienteResponse.data.id
      }
      
      const dataHora = `${selectedDate}T${selectedTime}:00`
      const novoAgendamento = {
        cliente: { id: clienteId },
        dataHora: dataHora,
        servico: formData.servico,
        descricao: formData.descricao
      }
      
      await agendamentoService.create(novoAgendamento)
      
      setSubmitSuccess(true)
      setTimeout(() => {
        setFormData({ nome: '', email: '', telefone: '', servico: '', descricao: '' })
        setSelectedDate(null)
        setSelectedTime('')
        setSubmitSuccess(false)
      }, 3000)
      
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      alert('Erro ao realizar agendamento. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div style={{
      backgroundImage: `url(${oioiImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',

      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      padding: '2rem',
      paddingTop: '6rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.1)',
        zIndex: 1
      }} />

      <div style={{
        maxWidth: '800px',
        width: '100%',
        background: 'transparent',
        borderRadius: '0',
        padding: '3rem',
        boxShadow: 'none',
        border: 'none',
        position: 'relative',
        zIndex: 2
      }}>
        {submitSuccess && (
          <div style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            padding: '1rem 2rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            color: '#fff',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            ✅ Agendamento enviado com sucesso! Entraremos em contato em breve.
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    textAlign: 'left',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#e11d48">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    Nome
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#121212',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                      color: '#f1f1f1',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#e11d48'
                      e.target.style.boxShadow = '0 0 0 2px rgba(225, 29, 72, 0.2)'
                      e.target.style.backgroundColor = '#1f1f1f'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#262626'
                      e.target.style.boxShadow = 'none'
                      e.target.style.backgroundColor = '#121212'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    textAlign: 'left',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#121212',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                      color: '#f1f1f1',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#e11d48'
                      e.target.style.boxShadow = '0 0 0 2px rgba(225, 29, 72, 0.2)'
                      e.target.style.backgroundColor = '#1f1f1f'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#262626'
                      e.target.style.boxShadow = 'none'
                      e.target.style.backgroundColor = '#121212'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    textAlign: 'left',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#121212',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                      color: '#f1f1f1',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#e11d48'
                      e.target.style.boxShadow = '0 0 0 2px rgba(225, 29, 72, 0.2)'
                      e.target.style.backgroundColor = '#1f1f1f'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#262626'
                      e.target.style.boxShadow = 'none'
                      e.target.style.backgroundColor = '#121212'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    textAlign: 'left',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Serviço
                  </label>
                  <select
                    name="servico"
                    value={formData.servico}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#121212',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                      color: '#f1f1f1',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#e11d48'
                      e.target.style.boxShadow = '0 0 0 2px rgba(225, 29, 72, 0.2)'
                      e.target.style.backgroundColor = '#1f1f1f'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#262626'
                      e.target.style.boxShadow = 'none'
                      e.target.style.backgroundColor = '#121212'
                    }}
                  >
                    <option value="">Selecione um serviço</option>
                    {services.map(service => (
                      <option key={service} value={service} style={{background: '#121212'}}>{service}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <Calendar 
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                availableSlots={availableSlots}
              />
            </div>
            
            {selectedDate && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  color: '#e11d48',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  textAlign: 'left',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase'
                }}>🕒 Horário Disponível *</label>
                <p style={{
                  color: '#a1a1a1',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  textAlign: 'left',
                  letterSpacing: '0.3px'
                }}>Disponível das 9h às 18h</p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                  gap: '0.75rem'
                }}>
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      style={{
                        padding: '0.875rem',
                        background: selectedTime === time ? '#e11d48' : '#121212',
                        border: selectedTime === time ? '2px solid #e11d48' : '1px solid #262626',
                        borderRadius: '8px',
                        color: '#f1f1f1',
                        fontSize: '0.9rem',
                        fontWeight: selectedTime === time ? '600' : '400',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: selectedTime === time ? 'translateY(-2px) scale(1.05)' : 'scale(1)',
                        boxShadow: selectedTime === time ? '0 4px 10px rgba(225, 29, 72, 0.4)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedTime !== time) {
                          e.target.style.background = '#1f1f1f'
                          e.target.style.transform = 'translateY(-2px)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedTime !== time) {
                          e.target.style.background = '#121212'
                          e.target.style.transform = 'scale(1)'
                        }
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                textAlign: 'left',
                letterSpacing: '0.3px',
                textTransform: 'uppercase'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Descrição do projeto
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="3"
                maxLength="500"
                placeholder="Descreva sua ideia de tatuagem, tamanho aproximado e local no corpo."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#121212',
                  border: '1px solid #262626',
                  borderRadius: '8px',
                  color: '#f1f1f1',
                  fontSize: '1rem',
                  resize: 'vertical',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e11d48'
                  e.target.style.boxShadow = '0 0 0 2px rgba(225, 29, 72, 0.2)'
                  e.target.style.backgroundColor = '#1f1f1f'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#262626'
                  e.target.style.boxShadow = 'none'
                  e.target.style.backgroundColor = '#121212'
                }}
              />
              <p style={{
                color: '#a1a1a1',
                fontSize: '0.8rem',
                textAlign: 'right',
                marginTop: '0.25rem',
                letterSpacing: '0.3px'
              }}>{formData.descricao.length}/500 caracteres</p>
            </div>
            
            <button 
              type="submit" 
              disabled={!selectedDate || !selectedTime || isSubmitting}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                background: (!selectedDate || !selectedTime || isSubmitting) ? '#666' : '#e11d48',
                border: 'none',
                borderRadius: '8px',
                color: '#f1f1f1',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: (!selectedDate || !selectedTime || isSubmitting) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                transform: 'scale(1)',
                boxShadow: (!selectedDate || !selectedTime || isSubmitting) ? 'none' : '0 4px 15px rgba(225, 29, 72, 0.4)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                if (selectedDate && selectedTime && !isSubmitting) {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 20px rgba(225, 29, 72, 0.5)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedDate && selectedTime && !isSubmitting) {
                  e.target.style.transform = 'scale(1)'
                  e.target.style.boxShadow = '0 4px 15px rgba(225, 29, 72, 0.4)'
                }
              }}
            >
              {isSubmitting ? '⏳ Enviando...' : '✅ Confirmar Agendamento'}
            </button>
        </form>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{
            background: '#181818',
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '1px solid #262626',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            textAlign: 'left',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{
              color: '#e11d48',
              fontSize: '1rem',
              fontWeight: '700',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>📋 Políticas de Agendamento</h3>
            <ul style={{
              color: '#f1f1f1',
              fontSize: '0.85rem',
              lineHeight: '1.5',
              listStyle: 'none',
              padding: 0,
              letterSpacing: '0.3px'
            }}>
              <li style={{ marginBottom: '0.25rem' }}>• Agendamentos com 24h de antecedência</li>
              <li style={{ marginBottom: '0.25rem' }}>• Cancelamento até 2h antes</li>
              <li style={{ marginBottom: '0.25rem' }}>• Consulta inicial gratuita</li>
              <li style={{ marginBottom: '0.25rem' }}>• Sinal de 50% para confirmar</li>
            </ul>
          </div>
          
          <div style={{
            background: '#181818',
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '1px solid #262626',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            textAlign: 'left',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{
              color: '#e11d48',
              fontSize: '1rem',
              fontWeight: '700',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>🕒 Horários de Funcionamento</h3>
            <ul style={{
              color: '#f1f1f1',
              fontSize: '0.85rem',
              lineHeight: '1.5',
              listStyle: 'none',
              padding: 0,
              letterSpacing: '0.3px'
            }}>
              <li style={{ marginBottom: '0.25rem' }}>• Segunda a Sexta: 9h às 18h</li>
              <li style={{ marginBottom: '0.25rem' }}>• Sábado: 9h às 16h</li>
              <li style={{ marginBottom: '0.25rem' }}>• Domingo: Fechado</li>
              <li style={{ marginBottom: '0.25rem' }}>• Feriados: Consultar</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Booking