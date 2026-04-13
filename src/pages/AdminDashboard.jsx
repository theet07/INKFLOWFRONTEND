import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { agendamentoService, clienteService } from '../services/inkflowApi'

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('agendamentos')
  const navigate = useNavigate()

  useEffect(() => {
    // IMPORTANTE: Esta verificação é apenas visual. 
    // A proteção real deve ser feita no backend com JWT/roles.
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
      await agendamentoService.updateStatus(id, { status })
      
      const updatedBookings = bookings.map(b =>
        b.id === id ? { ...b, status } : b
      )
      setBookings(updatedBookings)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      const errorMsg = error.response?.data?.message || 'Erro ao atualizar status do agendamento'
      alert(errorMsg)
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
                {bookings.map(booking => {
                  const statusColors = {
                    'AGENDADO': '#f39c12',
                    'CONFIRMADO': '#3498db',
                    'EM_ANDAMENTO': '#9b59b6',
                    'REALIZADO': '#2ecc71',
                    'FINALIZADO': '#8e44ad',
                    'CANCELADO': '#e74c3c'
                  };

                  return (
                    <div key={booking.id} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 className="text-primary">{booking.cliente?.fullName || booking.cliente?.nome || 'Cliente não identificado'}</h4>
                          <p className="text-light">{booking.cliente?.email || '—'}</p>
                          <p className="text-light">{booking.cliente?.telefone || '—'}</p>
                          <p className="text-gray">Serviço: {booking.servico}</p>
                          <p className="text-gray">Data: {new Date(booking.dataHora || booking.data).toLocaleString('pt-BR')}</p>
                          {booking.descricao && (
                            <p className="text-gray">Descrição: {booking.descricao}</p>
                          )}
                        </div>
                        <span className="status" style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          color: '#fff',
                          backgroundColor: statusColors[booking.status] || '#7f8c8d'
                        }}>
                          {booking.status || 'DESCONHECIDO'}
                        </span>
                      </div>
                      
                      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {booking.status !== 'CONFIRMADO' && booking.status !== 'FINALIZADO' && booking.status !== 'CANCELADO' && (
                          <button 
                            className="btn" 
                            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                            onClick={() => updateBookingStatus(booking.id, 'CONFIRMADO')}
                          >
                            Confirmar
                          </button>
                        )}
                        {booking.status !== 'CANCELADO' && booking.status !== 'FINALIZADO' && (
                          <button 
                            className="btn btn-outline" 
                            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                            onClick={() => updateBookingStatus(booking.id, 'CANCELADO')}
                          >
                            Cancelar
                          </button>
                        )}
                        <button 
                          className="btn btn-outline" 
                          style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', borderColor: 'red', color: 'red' }}
                          onClick={() => deleteBooking(booking.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  )
                })}
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
                  {bookings.filter(b => b.status === 'CONFIRMADO').length}
                </div>
                <h3 className="text-primary">Confirmados</h3>
              </div>
              <div className="card-equal">
                <div className="icon-circle">
                  {bookings.filter(b => (!b.status || b.status === 'AGENDADO')).length}
                </div>
                <h3 className="text-primary">Agendados</h3>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminDashboard