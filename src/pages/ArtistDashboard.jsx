import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardTab from '../components/dashboard/DashboardTab'
import RequestsTab from '../components/dashboard/RequestsTab'
import ScheduleTab from '../components/dashboard/ScheduleTab'
import PortfolioTab from '../components/dashboard/PortfolioTab'
import SettingsTab from '../components/dashboard/SettingsTab'
import MessagesTab from '../components/dashboard/MessagesTab'
import { agendamentoService } from '../services/inkflowApi'
import { useAuth } from '../contexts/AuthContext'
import './ArtistDashboard.css'

const ArtistDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerAgendamento, setDrawerAgendamento] = useState(null)
  const [toasts, setToasts] = useState([])
  const [activeTab, setActiveTab] = useState('dashboard')
  const navigate = useNavigate()

  const { token, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.role !== 'ROLE_ARTISTA' && payload.role !== 'ROLE_ADMIN') {
        navigate('/login', { replace: true })
      }
    } catch {
      navigate('/login', { replace: true })
    }
  }, [loading, token, navigate])

  // Persistência de sessão ao usar setas do browser (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const userData = localStorage.getItem('user')
      const userType = localStorage.getItem('userType')
      if (!userData || !userType) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('userType')
        navigate('/login', { replace: true })
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [navigate])

  const showToast = useCallback((message, isError = false) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, isError, removing: false }])
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, removing: true } : t))
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 300)
    }, 3000)
  }, [])

  useEffect(() => {
    const loadNotifs = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem('user') || '{}')
        const artistaId = stored.artistaId || stored.id
        if (!artistaId) return
        const res = await agendamentoService.getByArtista(artistaId)
        const all = Array.isArray(res.data) ? res.data : []
        setNotifItems([...all].sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora)).slice(0, 5))
        if (all.length > 0) {
          const lastSeen = localStorage.getItem('notif_artista_lastSeen')
          const maisRecente = all.reduce((a, b) => new Date(a.dataHora) > new Date(b.dataHora) ? a : b)
          setArtistaHasNew(!lastSeen || new Date(maisRecente.dataHora) > new Date(lastSeen))
        }
      } catch {}
    }
    loadNotifs()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const openDrawer = (agendamento) => {
    console.log('Agendamento selecionado:', agendamento)
    setDrawerAgendamento(agendamento)
    setDrawerOpen(true)
  }

  const closeDrawer = () => setDrawerOpen(false)

  const getDrawerClientName = () => {
    if (!drawerAgendamento) return 'Cliente'
    return drawerAgendamento.cliente?.fullName || drawerAgendamento.cliente?.nome || 'Cliente'
  }

  const getDrawerSizeLabel = () => {
    if (!drawerAgendamento) return '—'
    if (drawerAgendamento.largura && drawerAgendamento.altura) return `${drawerAgendamento.largura}cm x ${drawerAgendamento.altura}cm`
    if (drawerAgendamento.largura) return `${drawerAgendamento.largura}cm`
    return '—'
  }

  const getDrawerTags = () => {
    if (!drawerAgendamento?.tags) return []
    if (typeof drawerAgendamento.tags !== 'string') return []
    return drawerAgendamento.tags.split(',').map(t => t.trim()).filter(Boolean)
  }

  const handleDrawerAction = async (action) => {
    if (!drawerAgendamento) return
    const clientName = getDrawerClientName()
    try {
      if (action === 'Declined') {
        await agendamentoService.updateStatus(drawerAgendamento.id, { status: 'CANCELADO' })
        showToast(`Solicitação de ${clientName} recusada.`, true)
      } else {
        await agendamentoService.updateStatus(drawerAgendamento.id, { status: 'CONFIRMADO' })
        showToast(`${clientName} agendado com sucesso!`)
      }
    } catch (err) {
      showToast('Erro ao atualizar status', true)
    }
    closeDrawer()
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    navigate('/login')
  }

  const [viewMode, setViewMode] = useState('monthly')
  const handleViewToggle = (mode) => setViewMode(mode)
  const [studioOpen, setStudioOpen] = useState(true)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifItems, setNotifItems] = useState([])
  const [artistaHasNew, setArtistaHasNew] = useState(false)

  const navItems = [
    { key: 'dashboard', icon: 'dashboard', label: 'Painel' },
    { key: 'requests', icon: 'potted_plant', label: 'Solicitações' },
    { key: 'schedule', icon: 'calendar_today', label: 'Agenda' },
    { key: 'messages', icon: 'chat', label: 'Mensagens' },
    { key: 'portfolio', icon: 'brush', label: 'Portfólio' },
    { key: 'settings', icon: 'settings', label: 'Configurações' },
  ]

  const switchTab = (tabKey) => {
    setActiveTab(tabKey)
    setSidebarOpen(false)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab showToast={showToast} openDrawer={openDrawer} onNewArt={() => switchTab('portfolio')} />
      case 'requests':
        return <RequestsTab showToast={showToast} openDrawer={openDrawer} />
      case 'schedule':
        return <ScheduleTab showToast={showToast} openDrawer={openDrawer} viewMode={viewMode} />
      case 'messages':
        return <MessagesTab showToast={showToast} />
      case 'portfolio':
        return <PortfolioTab showToast={showToast} />
      case 'settings':
        return <SettingsTab showToast={showToast} studioOpen={studioOpen} setStudioOpen={setStudioOpen} switchTab={switchTab} />
      default:
        return <DashboardTab showToast={showToast} openDrawer={openDrawer} onNewArt={() => switchTab('portfolio')} />
    }
  }

  return (
    <div className="artist-dashboard">
      {/* TopAppBar */}
      <header className="ad-topbar">
        <div className="ad-topbar-left">
          <button className="ad-mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="ad-topbar-brand">INKFLOW</span>
        </div>
        <div className="ad-topbar-right">
          {activeTab === 'schedule' && (
            <div className="ad-sched-view-toggle">
              <button
                className={`ad-sched-view-btn ${viewMode === 'monthly' ? 'active' : ''}`}
                onClick={() => handleViewToggle('monthly')}
              >Mensal</button>
              <button
                className={`ad-sched-view-btn ${viewMode === 'weekly' ? 'active' : ''}`}
                onClick={() => handleViewToggle('weekly')}
              >Semanal</button>
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <button className="ad-icon-btn" title="Notificações" onClick={() => {
              setNotifOpen(o => !o)
              if (!notifOpen) {
                localStorage.setItem('notif_artista_lastSeen', new Date().toISOString())
                setArtistaHasNew(false)
              }
            }}>
              <span className="material-symbols-outlined">notifications</span>
              {artistaHasNew && (
                <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: '50%', background: '#E21B3C', border: '1.5px solid #0a0a0a' }} />
              )}
            </button>
            {notifOpen && (
              <div style={{ position: 'absolute', top: '110%', right: 0, width: 320, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, zIndex: 999, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: 1, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Notificações</div>
                {notifItems.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Sem notificações</div>
                ) : notifItems.map(ag => (
                  <div key={ag.id} onClick={() => { openDrawer(ag); setNotifOpen(false) }}
                    style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E21B3C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: '#fff', flexShrink: 0 }}>
                      {(ag.cliente?.fullName || ag.cliente?.nome || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ag.cliente?.fullName || ag.cliente?.nome || 'Cliente'}</p>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{ag.servico || 'Sessão'} · {ag.status}</p>
                    </div>
                  </div>
                ))}
                <div onClick={() => { switchTab('requests'); setNotifOpen(false) }} style={{ padding: '10px 16px', textAlign: 'center', fontSize: '0.8rem', color: '#E21B3C', cursor: 'pointer', fontWeight: 600 }}>Ver todas</div>
              </div>
            )}
          </div>
          <div className="ad-user-info">
            <div className="ad-user-text">
              <p className="ad-user-name">{JSON.parse(localStorage.getItem('user') || '{}').nome || JSON.parse(localStorage.getItem('user') || '{}').fullName || 'Artista'}</p>
              <p className="ad-user-role">Artista</p>
            </div>
            <button className="ad-icon-btn" onClick={handleLogout} title="Sair">
              <span className="material-symbols-outlined" style={{ fontSize: '1.875rem' }}>account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`ad-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="ad-sidebar-header">
          <h2 className="ad-sidebar-brand">INKFLOW</h2>
          <p className="ad-sidebar-subtitle">Estúdio do Artista</p>
        </div>
        <nav className="ad-sidebar-nav">
          {navItems.map((item) => (
            <a
              key={item.key}
              href="#"
              onClick={(e) => { e.preventDefault(); switchTab(item.key) }}
              className={`ad-nav-item ${activeTab === item.key ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="ad-sidebar-footer">
          <div className="ad-studio-status">
            <p className="ad-studio-status-label">Status do Estúdio</p>
            <div className="ad-studio-status-value">
              <span className="ad-pulse-dot" style={!studioOpen ? { background: '#888' } : {}}></span>
              <span className="ad-status-text">{studioOpen ? 'Aceitando Agendamentos' : 'Pausado'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar Backdrop */}
      {sidebarOpen && (
        <div className="ad-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="ad-main">
        <div className={`ad-content ${activeTab === 'schedule' || activeTab === 'messages' ? 'full-width' : ''}`}>
          {renderContent()}
        </div>
      </main>

      {/* Side Drawer */}
      <div className={`ad-drawer-overlay ${drawerOpen ? 'open' : ''}`}>
        <div className="ad-drawer-backdrop" onClick={closeDrawer} />
        <div className="ad-drawer-panel">
          {drawerAgendamento ? (
            <>
              <div className="ad-drawer-header">
                <div>
                  <span className="ad-drawer-tag">Detalhes da Solicitação</span>
                  <h2 className="ad-drawer-title">{drawerAgendamento?.cliente?.fullName || drawerAgendamento?.cliente?.nome || 'Cliente'}</h2>
                  {drawerAgendamento?.cliente?.email && (
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>{drawerAgendamento.cliente.email}</p>
                  )}
                </div>
                <button className="ad-drawer-close" onClick={closeDrawer}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="ad-drawer-body no-scrollbar">
                <div>
                  <p className="ad-drawer-section-label">Arte de Referência</p>
                  {drawerAgendamento?.imagemReferenciaUrl ? (
                    <div className="ad-drawer-image">
                      <img src={drawerAgendamento.imagemReferenciaUrl} alt="Arte de Referência" />
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', border: '1px dashed rgba(255,255,255,0.1)', marginBottom: '1rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>image</span>
                      Sem imagem de referência
                    </div>
                  )}
                </div>
                <div className="ad-specs-grid">
                  <div className="ad-spec-item">
                    <p className="ad-spec-label">Tamanho Estimado</p>
                    <p className="ad-spec-value">{getDrawerSizeLabel()}</p>
                  </div>
                  <div className="ad-spec-item">
                    <p className="ad-spec-label">Região</p>
                    <p className="ad-spec-value">{drawerAgendamento?.regiao || 'Não informado'}</p>
                  </div>
                </div>
                <div>
                  <p className="ad-drawer-section-label">Descrição do Pedido</p>
                  <p className="ad-drawer-description">
                    {drawerAgendamento?.descricao || drawerAgendamento?.observacoes || 'Sem descrição fornecida pelo cliente.'}
                  </p>
                </div>
                {drawerAgendamento?.servico && (
                  <div>
                    <p className="ad-drawer-section-label">Serviço</p>
                    <p className="ad-drawer-description">{drawerAgendamento.servico}</p>
                  </div>
                )}
                <div className="ad-drawer-tags">
                  {getDrawerTags().length > 0 ? (
                    getDrawerTags().map((tag, i) => (
                      <span key={i} className="ad-drawer-tag-item muted">{tag}</span>
                    ))
                  ) : drawerAgendamento?.servico ? (
                    <span className="ad-drawer-tag-item primary">{drawerAgendamento.servico}</span>
                  ) : null}
                </div>
              </div>
              {drawerAgendamento?.status === 'AGENDADO' ? (
                <div className="ad-drawer-footer">
                  <button className="ad-drawer-btn-decline" onClick={() => handleDrawerAction('Declined')}>
                    Recusar
                  </button>
                  <button className="ad-drawer-btn-accept" onClick={() => handleDrawerAction('Accepted')}>
                    Aceitar e Agendar
                  </button>
                </div>
              ) : (
                <div className="ad-drawer-footer">
                  <div style={{ width: '100%', textAlign: 'center', padding: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Status: {drawerAgendamento?.status || '—'}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="ad-drawer-header">
                <div>
                  <span className="ad-drawer-tag">Detalhes da Solicitação</span>
                  <h2 className="ad-drawer-title">Carregando...</h2>
                </div>
                <button className="ad-drawer-close" onClick={closeDrawer}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="ad-drawer-body no-scrollbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', animation: 'spin 1s linear infinite' }}>progress_activity</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Nav (Mobile) */}
      <nav className="ad-bottom-nav">
        {navItems.map(item => (
          <button
            key={item.key}
            className={`ad-bottom-nav-item ${activeTab === item.key ? 'active' : ''}`}
            onClick={() => switchTab(item.key)}
          >
            <span
              className="material-symbols-outlined"
              style={activeTab === item.key ? { fontVariationSettings: "'FILL' 1" } : {}}
            >{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* FAB Mobile */}
      <button className="ad-fab" onClick={() => switchTab('requests')}>
        <span className="material-symbols-outlined">add</span>
      </button>

      {/* Toasts */}
      <div className="ad-toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`ad-toast toast-animate ${toast.isError ? 'error' : ''}`}
            style={toast.removing ? { opacity: 0, transform: 'translateY(10px)', transition: 'all 0.3s ease' } : {}}
          >
            <span className="material-symbols-outlined ad-toast-icon">
              {toast.isError ? 'error' : 'check_circle'}
            </span>
            <span className="ad-toast-message">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ArtistDashboard
