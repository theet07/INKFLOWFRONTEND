import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { agendamentoService, clienteService } from '../services/inkflowApi'

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('agendamentos')
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.isAdmin) {
      navigate('/login')
      return
    }
    
    loadAgendamentos()
  }, [navigate])
  
  const loadAgendamentos = async () => {
    try {
      const response = await agendamentoService.getAll()
      setBookings(response.data)
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
      // Fallback para localStorage se backend não estiver disponível
      const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      setBookings(savedBookings)
    }
  }

  const updateBookingStatus = async (id, status) => {
    try {
      const booking = bookings.find(b => b.id === id)
      const updatedBooking = { ...booking, status }
      
      await agendamentoService.update(id, updatedBooking)
      
      const updatedBookings = bookings.map(b =>
        b.id === id ? { ...b, status } : b
      )
      setBookings(updatedBookings)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status do agendamento')
    }
  }

  const deleteBooking = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return
    
    try {
      await agendamentoService.delete(id)
      const updatedBookings = bookings.filter(booking => booking.id !== id)
      setBookings(updatedBookings)
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error)
      alert('Erro ao excluir agendamento')
    }
  }

  return (
    <div className="admin-dashboard">
      <section className="section">
        <h2>Painel Administrativo</h2>
        
        <div className="admin-tabs" style={{ marginBottom: '2rem' }}>
          <button 
            className={`btn ${activeTab === 'agendamentos' ? '' : 'btn-outline'}`}
            onClick={() => setActiveTab('agendamentos')}
          >
            Agendamentos ({bookings.length})
          </button>
          <button 
            className={`btn ${activeTab === 'estatisticas' ? '' : 'btn-outline'}`}
            onClick={() => setActiveTab('estatisticas')}
            style={{ marginLeft: '1rem' }}
          >
            Estatísticas
          </button>
        </div>

        {activeTab === 'agendamentos' && (
          <div className="bookings-management">
            {bookings.length === 0 ? (
              <p className="text-gray">Nenhum agendamento encontrado.</p>
            ) : (
              <div className="bookings-grid">
                {bookings.map(booking => (
                  <div key={booking.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 className="text-primary">{booking.nome}</h4>
                        <p className="text-light">{booking.email}</p>
                        <p className="text-light">{booking.telefone}</p>
                        <p className="text-gray">Serviço: {booking.servico}</p>
                        <p className="text-gray">Data: {new Date(booking.dataHora || booking.data).toLocaleString('pt-BR')}</p>
                        {booking.descricao && (
                          <p className="text-gray">Descrição: {booking.descricao}</p>
                        )}
                      </div>
                      <span className={`status ${booking.status || 'pendente'}`} style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        backgroundColor: booking.status === 'confirmado' ? 'green' : 
                                       booking.status === 'cancelado' ? 'red' : 'orange'
                      }}>
                        {booking.status || 'Pendente'}
                      </span>
                    </div>
                    
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button 
                        className="btn" 
                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                        onClick={() => updateBookingStatus(booking.id, 'confirmado')}
                      >
                        Confirmar
                      </button>
                      <button 
                        className="btn btn-outline" 
                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                        onClick={() => updateBookingStatus(booking.id, 'cancelado')}
                      >
                        Cancelar
                      </button>
                      <button 
                        className="btn btn-outline" 
                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', borderColor: 'red', color: 'red' }}
                        onClick={() => deleteBooking(booking.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'estatisticas' && (
          <div className="statistics">
            <div className="grid-responsive">
              <div className="card-equal">
                <div className="icon-circle">{bookings.length}</div>
                <h3 className="text-primary">Total de Agendamentos</h3>
              </div>
              <div className="card-equal">
                <div className="icon-circle">
                  {bookings.filter(b => b.status === 'confirmado').length}
                </div>
                <h3 className="text-primary">Confirmados</h3>
              </div>
              <div className="card-equal">
                <div className="icon-circle">
                  {bookings.filter(b => !b.status || b.status === 'pendente').length}
                </div>
                <h3 className="text-primary">Pendentes</h3>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminDashboard