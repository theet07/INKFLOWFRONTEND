import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { clienteService } from '../services/inkflowApi'

const Profile = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const navigate = useNavigate()
  
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  // Inicializa formData com dados do usuário
  useEffect(() => {
    setFormData({
      fullName: user.nome || '',
      email: user.email || '',
      telefone: user.telefone || ''
    })
  }, [])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let clienteId = user.id
      
      // Se não tem ID, busca pelo email
      if (!clienteId) {
        const response = await clienteService.getAll()
        const cliente = response.data.find(c => c.email === user.email)
        if (!cliente) {
          alert('Usuário não encontrado')
          setLoading(false)
          return
        }
        clienteId = cliente.id
      }

      // Usa o método update da API (sem email para evitar conflito)
      const updateData = {
        fullName: formData.fullName,
        telefone: formData.telefone
      }
      await clienteService.update(clienteId, updateData)
      
      // Atualiza localStorage com novos dados
      const updatedUser = {
        ...user,
        nome: formData.fullName,
        email: formData.email,
        telefone: formData.telefone
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      alert('Perfil atualizado com sucesso!')
      setEditing(false)
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      alert(`Erro: ${error.response?.data?.message || 'Falha ao atualizar'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      let clienteId = user.id
      
      // Se não tem ID, busca pelo email
      if (!clienteId) {
        const response = await clienteService.getAll()
        const cliente = response.data.find(c => c.email === user.email)
        if (!cliente) {
          alert('Usuário não encontrado')
          setLoading(false)
          return
        }
        clienteId = cliente.id
      }

      await clienteService.delete(clienteId)
      localStorage.clear()
      alert('Conta deletada com sucesso!')
      window.location.href = '/'
    } catch (error) {
      console.error('Erro completo:', error)
      console.error('Response:', error.response)
      console.error('Status:', error.response?.status)
      console.error('Data:', error.response?.data)
      alert(`Erro: ${error.response?.status} - ${error.response?.data?.message || error.message || 'Falha ao deletar'}`)
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  if (!user.email) {
    return (
      <div className="section">
        <div className="container">
          <h2>Acesso negado</h2>
          <p>Faça login para acessar seu perfil.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile">
      <section className="section">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '4rem' }}>
          
          {/* Header do Perfil - Estilo Instagram */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2rem', 
            marginBottom: '2rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            {/* Avatar */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, var(--accent-red), #ff6b6b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {user.nome?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            
            {/* Info do Usuário */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{user.nome}</h2>
                {!editing && (
                  <>
                    <button 
                      onClick={() => setEditing(true)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Editar perfil
                    </button>
                    <div style={{ position: 'relative' }}>
                      <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: 'transparent',
                          border: '1px solid rgba(255,255,255,0.3)',
                          borderRadius: '6px',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                          <path d="M12.9046 3.06005C12.6988 3 12.4659 3 12 3C11.5341 3 11.3012 3 11.0954 3.06005C10.7942 3.14794 10.5281 3.32808 10.3346 3.57511C10.2024 3.74388 10.1159 3.96016 9.94291 4.39272C9.69419 5.01452 9.00393 5.33471 8.36857 5.123L7.79779 4.93281C7.3929 4.79785 7.19045 4.73036 6.99196 4.7188C6.70039 4.70181 6.4102 4.77032 6.15701 4.9159C5.98465 5.01501 5.83376 5.16591 5.53197 5.4677C5.21122 5.78845 5.05084 5.94882 4.94896 6.13189C4.79927 6.40084 4.73595 6.70934 4.76759 7.01551C4.78912 7.2239 4.87335 7.43449 5.04182 7.85566C5.30565 8.51523 5.05184 9.26878 4.44272 9.63433L4.16521 9.80087C3.74031 10.0558 3.52786 10.1833 3.37354 10.3588C3.23698 10.5141 3.13401 10.696 3.07109 10.893C3 11.1156 3 11.3658 3 11.8663C3 12.4589 3 12.7551 3.09462 13.0088C3.17823 13.2329 3.31422 13.4337 3.49124 13.5946C3.69158 13.7766 3.96395 13.8856 4.50866 14.1035C5.06534 14.3261 5.35196 14.9441 5.16236 15.5129L4.94721 16.1584C4.79819 16.6054 4.72367 16.829 4.7169 17.0486C4.70875 17.3127 4.77049 17.5742 4.89587 17.8067C5.00015 18.0002 5.16678 18.1668 5.5 18.5C5.83323 18.8332 5.99985 18.9998 6.19325 19.1041C6.4258 19.2295 6.68733 19.2913 6.9514 19.2831C7.17102 19.2763 7.39456 19.2018 7.84164 19.0528L8.36862 18.8771C9.00393 18.6654 9.6942 18.9855 9.94291 19.6073C10.1159 20.0398 10.2024 20.2561 10.3346 20.4249C10.5281 20.6719 10.7942 20.8521 11.0954 20.94C11.3012 21 11.5341 21 12 21C12.4659 21 12.6988 21 12.9046 20.94C13.2058 20.8521 13.4719 20.6719 13.6654 20.4249C13.7976 20.2561 13.8841 20.0398 14.0571 19.6073C14.3058 18.9855 14.9961 18.6654 15.6313 18.8773L16.1579 19.0529C16.605 19.2019 16.8286 19.2764 17.0482 19.2832C17.3123 19.2913 17.5738 19.2296 17.8063 19.1042C17.9997 18.9999 18.1664 18.8333 18.4996 18.5001C18.8328 18.1669 18.9994 18.0002 19.1037 17.8068C19.2291 17.5743 19.2908 17.3127 19.2827 17.0487C19.2759 16.8291 19.2014 16.6055 19.0524 16.1584L18.8374 15.5134C18.6477 14.9444 18.9344 14.3262 19.4913 14.1035C20.036 13.8856 20.3084 13.7766 20.5088 13.5946C20.6858 13.4337 20.8218 13.2329 20.9054 13.0088C21 12.7551 21 12.4589 21 11.8663C21 11.3658 21 11.1156 20.9289 10.893C20.866 10.696 20.763 10.5141 20.6265 10.3588C20.4721 10.1833 20.2597 10.0558 19.8348 9.80087L19.5569 9.63416C18.9478 9.26867 18.6939 8.51514 18.9578 7.85558C19.1262 7.43443 19.2105 7.22383 19.232 7.01543C19.2636 6.70926 19.2003 6.40077 19.0506 6.13181C18.9487 5.94875 18.7884 5.78837 18.4676 5.46762C18.1658 5.16584 18.0149 5.01494 17.8426 4.91583C17.5894 4.77024 17.2992 4.70174 17.0076 4.71872C16.8091 4.73029 16.6067 4.79777 16.2018 4.93273L15.6314 5.12287C14.9961 5.33464 14.3058 5.0145 14.0571 4.39272C13.8841 3.96016 13.7976 3.74388 13.6654 3.57511C13.4719 3.32808 13.2058 3.14794 12.9046 3.06005Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        </g>
                      </svg>
                      </button>
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        background: '#1a1a1a',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        padding: '0.5rem 0',
                        minWidth: '120px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                        opacity: isUserMenuOpen ? 1 : 0,
                        visibility: isUserMenuOpen ? 'visible' : 'hidden',
                        transform: isUserMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
                        transition: 'all 0.3s ease',
                        zIndex: 1001
                      }}>
                        <button 
                          onClick={() => {
                            setIsUserMenuOpen(false)
                            localStorage.removeItem('user')
                            navigate('/login')
                          }}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.5rem 1rem',
                            color: 'white',
                            background: 'none',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                          onMouseLeave={(e) => e.target.style.background = 'none'}
                        >
                          Sair
                        </button>
                        <button 
                          onClick={() => {
                            setIsUserMenuOpen(false)
                            setShowDeleteConfirm(true)
                          }}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.5rem 1rem',
                            color: 'var(--accent-red)',
                            background: 'none',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'rgba(208, 0, 0, 0.1)'}
                          onMouseLeave={(e) => e.target.style.background = 'none'}
                        >
                          Deletar conta
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '0.5rem' }}>
                  <span><strong>3</strong> agendamentos</span>
                  <span><strong>12</strong> tatuagens</span>
                  <span><strong>2</strong> anos cliente</span>
                </div>
              </div>
              
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                <div>{user.email}</div>
                <div>{user.telefone || 'Telefone não informado'}</div>
              </div>
            </div>
          </div>
          
          {/* Destaques - Estilo Instagram */}
          <div style={{ 
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              overflowX: 'auto',
              paddingBottom: '0.5rem'
            }}>
              {/* Botão Adicionar Destaque */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                minWidth: '80px'
              }}>
                <div 
                  onClick={() => alert('Funcionalidade de adicionar destaque em desenvolvimento!')}
                  style={{
                    width: '65px',
                    height: '65px',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: '2px dashed rgba(255,255,255,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.7)'
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.4)'
                    e.target.style.backgroundColor = 'transparent'
                  }}
                >
                  <span style={{ fontSize: '1.8rem', color: 'rgba(255,255,255,0.6)' }}>+</span>
                </div>
                <span style={{ fontSize: '0.8rem', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>Novo</span>
              </div>

            </div>
          </div>
          
          {/* Formulário de Edição */}
          {editing && (
            <div style={{ 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              padding: '2rem', 
              borderRadius: '12px',
              marginBottom: '2rem'
            }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Editar Perfil</h3>
              <form onSubmit={handleUpdateProfile}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nome:</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Telefone:</label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'var(--accent-red)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setEditing(false)
                      setFormData({
                        fullName: user.nome || '',
                        email: user.email || '',
                        telefone: user.telefone || ''
                      })
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Seções do Perfil */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              padding: '1.5rem',
              borderRadius: '12px'
            }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--accent-red)' }}>Meus Agendamentos</h4>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Visualize e gerencie seus agendamentos</p>
              <button style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                border: '1px solid var(--accent-red)',
                borderRadius: '6px',
                color: 'var(--accent-red)',
                cursor: 'pointer'
              }}>
                Ver agendamentos
              </button>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              padding: '1.5rem',
              borderRadius: '12px'
            }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--accent-red)' }}>Minhas Tatuagens</h4>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Galeria das suas tatuagens feitas</p>
              <button style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                border: '1px solid var(--accent-red)',
                borderRadius: '6px',
                color: 'var(--accent-red)',
                cursor: 'pointer'
              }}>
                Ver galeria
              </button>
            </div>
          </div>

          {/* Modal de Confirmação para Deletar Conta */}
          {showDeleteConfirm && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: '#1a1a1a',
                padding: '2rem',
                borderRadius: '12px',
                maxWidth: '400px',
                width: '90%',
                border: '1px solid var(--accent-red)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}>
                <h3 style={{ color: 'var(--accent-red)', marginBottom: '1rem' }}>Deletar Conta</h3>
                <p style={{ marginBottom: '1.5rem', color: 'rgba(255,255,255,0.8)' }}>
                  Esta ação é irreversível. Todos os seus dados e agendamentos serão perdidos.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'var(--accent-red)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    {loading ? 'Deletando...' : 'Sim, Deletar'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Profile