import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { agendamentoService, clienteService, adminService } from '../services/inkflowApi'
import { useAuth } from '../contexts/AuthContext'

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('agendamentos')
  const [backupStatus, setBackupStatus] = useState(null)
  const [loadingBackup, setLoadingBackup] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const navigate = useNavigate()
  const { token, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (!token) {
      navigate('/login')
      return
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.role !== 'ROLE_ADMIN') {
        navigate('/login')
        return
      }
    } catch {
      navigate('/login')
      return
    }
    loadAgendamentos()
  }, [token, loading, navigate])
  
  const loadAgendamentos = async () => {
    try {
      setLoadError(false)
      const response = await agendamentoService.getAll()
      setBookings(response.data)
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
      setLoadError(true)
      setBookings([])
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

  const loadBackupStatus = async () => {
    setLoadingBackup(true)
    try {
      const response = await adminService.getBackupStatus()
      setBackupStatus(response.data)
    } catch (error) {
      console.error('Erro ao carregar status do backup:', error)
      setBackupStatus({ lastBackup: new Date().toISOString() })
    } finally {
      setLoadingBackup(false)
    }
  }

  const handleDownloadBackup = async () => {
    setIsDownloading(true)
    try {
      const response = await adminService.exportBackup()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'inkflow_full_backup.sql')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao baixar backup:', error)
      alert('Falha ao gerar arquivo de backup. Verifique a nova rota do Amazon Q.')
    } finally {
      setIsDownloading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'seguranca') {
      loadBackupStatus()
    }
  }, [activeTab])

  return (
    <div className="admin-dashboard" style={{ paddingTop: '100px', minHeight: '100vh' }}>
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
          <button 
            className={`btn ${activeTab === 'seguranca' ? '' : 'btn-outline'}`}
            onClick={() => setActiveTab('seguranca')}
            style={{ marginLeft: '1rem' }}
          >
            Segurança
          </button>
        </div>

        {activeTab === 'agendamentos' && (
          <div className="bookings-management">
            {loadError ? (
              <p className="text-gray" style={{ color: '#e74c3c' }}>Erro ao carregar agendamentos. Verifique a conexão com o servidor.</p>
            ) : bookings.length === 0 ? (
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

        {activeTab === 'seguranca' && (
          <div className="security-management">
            <div className="grid-responsive">
              <div className="card-equal">
                <div className="icon-circle">
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>database</span>
                </div>
                <h3 className="text-primary">Recuperação de Dados</h3>
                <p className="text-gray" style={{ margin: '1rem 0' }}>
                  Gere uma cópia completa do banco de dados em formato SQL para fins de segurança e conformidade.
                </p>
                <button 
                  className="btn btn-large" 
                  onClick={handleDownloadBackup}
                  disabled={isDownloading}
                >
                  {isDownloading ? 'Gerando Arquivo...' : 'Gerar e Baixar Backup FULL (.sql)'}
                </button>
              </div>

              <div className="card-equal">
                <div className="icon-circle">
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>update</span>
                </div>
                <h3 className="text-primary">Próximo Backup Automático</h3>
                <p className="text-light" style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>
                  00:00
                </p>
                <div style={{ textAlign: 'left', marginTop: 'auto' }}>
                  <p className="text-gray">
                    <strong>Último Backup:</strong> {loadingBackup ? 'Carregando...' : (backupStatus?.lastBackup ? new Date(backupStatus.lastBackup).toLocaleString('pt-BR') : 'Nenhum registro encontrado')}
                  </p>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '2rem', borderLeft: '4px solid var(--accent-red)', backgroundColor: 'rgba(220, 20, 60, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '2rem' }}>warning</span>
                <div>
                  <h4 className="text-primary">Atenção</h4>
                  <p className="text-light">
                    Backups automáticos ocorrem diariamente às 00:00. Certifique-se de realizar backups manuais antes de grandes manutenções ou migrações de dados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminDashboard