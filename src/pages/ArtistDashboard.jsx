import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardTab from '../components/dashboard/DashboardTab'
import RequestsTab from '../components/dashboard/RequestsTab'
import ScheduleTab from '../components/dashboard/ScheduleTab'
import PortfolioTab from '../components/dashboard/PortfolioTab'
import SettingsTab from '../components/dashboard/SettingsTab'
import './ArtistDashboard.css'

const ArtistDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerClient, setDrawerClient] = useState('Nome do Cliente')
  const [toasts, setToasts] = useState([])
  const [activeTab, setActiveTab] = useState('dashboard')
  const navigate = useNavigate()

  // Segurança de rota: apenas artistas podem acessar este dashboard
  useEffect(() => {
    const userType = localStorage.getItem('userType')
    const userData = localStorage.getItem('user')

    // Se não há sessão, limpa tudo e manda pro login
    if (!userData || !userType) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('userType')
      navigate('/login', { replace: true })
      return
    }

    // Se é cliente tentando acessar, expulsa para agendamento
    if (userType === 'client') {
      navigate('/agendamento', { replace: true })
      return
    }

    // Se não é artista nem admin, manda pro login
    if (userType !== 'artist' && userType !== 'admin') {
      navigate('/login', { replace: true })
    }
  }, [navigate])

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

  const openDrawer = (clientName) => {
    setDrawerClient(clientName)
    setDrawerOpen(true)
  }

  const closeDrawer = () => setDrawerOpen(false)

  const handleDrawerAction = (action) => {
    if (action === 'Declined') {
      showToast(`Solicitação de ${drawerClient} recusada.`, true)
    } else {
      showToast(`${drawerClient} agendado com sucesso!`)
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

  const handleViewToggle = (mode) => {
    setViewMode(mode)
    showToast(`Visualização alterada para ${mode === 'monthly' ? 'Mensal' : 'Semanal'}`)
  }

  const navItems = [
    { key: 'dashboard', icon: 'dashboard', label: 'Painel' },
    { key: 'requests', icon: 'potted_plant', label: 'Solicitações' },
    { key: 'schedule', icon: 'calendar_today', label: 'Agenda' },
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
        return <DashboardTab showToast={showToast} openDrawer={openDrawer} />
      case 'requests':
        return <RequestsTab showToast={showToast} />
      case 'schedule':
        return <ScheduleTab showToast={showToast} />
      case 'portfolio':
        return <PortfolioTab showToast={showToast} />
      case 'settings':
        return <SettingsTab showToast={showToast} />
      default:
        return <DashboardTab showToast={showToast} openDrawer={openDrawer} />
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
          <button className="ad-icon-btn">
            <span className="material-symbols-outlined">notifications</span>
          </button>
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
              <span className="ad-pulse-dot"></span>
              <span className="ad-status-text">Aceitando Agendamentos</span>
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
        <div className={`ad-content ${activeTab === 'schedule' ? 'full-width' : ''}`}>
          {renderContent()}
        </div>
      </main>

      {/* Side Drawer */}
      <div className={`ad-drawer-overlay ${drawerOpen ? 'open' : ''}`}>
        <div className="ad-drawer-backdrop" onClick={closeDrawer} />
        <div className="ad-drawer-panel">
          <div className="ad-drawer-header">
            <div>
              <span className="ad-drawer-tag">Detalhes da Solicitação</span>
              <h2 className="ad-drawer-title">{drawerClient}</h2>
            </div>
            <button className="ad-drawer-close" onClick={closeDrawer}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="ad-drawer-body no-scrollbar">
            <div>
              <p className="ad-drawer-section-label">Arte de Referência</p>
              <div className="ad-drawer-image">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmN4GiqG1UKG5wb0rE-gwsBmNGJ_kALhiQlNaEdO-u3LfH3Cb5Cxeru88n43_CJWBz8P7xrp3GF7zpmjbVHG7mTN6KM4CJJ26O_Dt8TICmOOeGQMrWprSVLZXz4lFwui3vZH_AACVRpHbJg_pk-tXOTK2lvxDY07K-tpndiA78LpnTtLsCC1pZvlQuQbebRX-5Cw0KbU5bebeKc3UugAepm-LpIeFIckrLpx_KUuusPc9M_jMQzQcaEymXsrzldTrXIMGDjlQNjhs"
                  alt="Arte de Referência"
                />
              </div>
            </div>
            <div className="ad-specs-grid">
              <div className="ad-spec-item">
                <p className="ad-spec-label">Tamanho Estimado</p>
                <p className="ad-spec-value">15cm x 10cm</p>
              </div>
              <div className="ad-spec-item">
                <p className="ad-spec-label">Região</p>
                <p className="ad-spec-value">Antebraço</p>
              </div>
            </div>
            <div>
              <p className="ad-drawer-section-label">Descrição do Pedido</p>
              <p className="ad-drawer-description">
                &quot;Procuro uma peça neo-tradicional com um corvo e peônias escuras. Gostaria que o traçado fosse bem marcado, mas com uma mistura suave de cores nas pétalas. É minha primeira peça maior no braço, então estou aberto a ajustes na composição para se encaixar no fluxo do antebraço.&quot;
              </p>
            </div>
            <div className="ad-drawer-tags">
              <span className="ad-drawer-tag-item primary">Primeiro cliente</span>
              <span className="ad-drawer-tag-item muted">Colorido</span>
              <span className="ad-drawer-tag-item muted">Design Personalizado</span>
            </div>
          </div>
          <div className="ad-drawer-footer">
            <button className="ad-drawer-btn-decline" onClick={() => handleDrawerAction('Declined')}>
              Recusar
            </button>
            <button className="ad-drawer-btn-accept" onClick={() => handleDrawerAction('Accepted')}>
              Aceitar e Agendar
            </button>
          </div>
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
      <button className="ad-fab" onClick={() => showToast('Abrindo formulário de nova sessão...')}>
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
