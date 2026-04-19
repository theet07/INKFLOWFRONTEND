import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { agendamentoService } from '../services/inkflowApi'
import { useAuth } from '../contexts/AuthContext'
import './Header.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [agendamentos, setAgendamentos] = useState([])
  const notifRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, userType, logout } = useAuth()

  useEffect(() => {
    if (userType === 'client' && user?.id) {
      agendamentoService.getByCliente(user.id)
        .then(res => setAgendamentos(res.data.slice(0, 3)))
        .catch(() => {})
    } else {
      setAgendamentos([])
    }
  }, [user, userType])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDate = (dataHora) => {
    if (!dataHora) return ''
    return new Date(dataHora).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase()
  }

  const statusColor = {
    'AGENDADO': '#ff0000',
    'CONFIRMADO': '#10b981',
    'REALIZADO': '#6366f1',
    'CANCELADO': 'rgba(255,255,255,0.3)'
  }

  const isActive = (path) => location.pathname === path ? 'active' : ''

  const handleSobreNosClick = (e) => {
    e.preventDefault()
    if (location.pathname === '/') {
      document.getElementById('sobre-nos')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => document.getElementById('sobre-nos')?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  const handleServicosClick = (e) => {
    e.preventDefault()
    if (location.pathname === '/') {
      document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="8" r="4"/>
      <path d="M12 14c-6 0-8 4-8 4v2h16v-2s-2-4-8-4z"/>
    </svg>
  )

  return (
    <header>
      <nav>
        <Link to="/" className="logo">INK FLOW</Link>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" className={isActive('/')}>Home</Link></li>
          <li><Link to="/artistas" className={isActive('/artistas')}>Explorar Artistas</Link></li>
          <li><Link to="/portfolio" className={isActive('/portfolio')}>Portfólio</Link></li>
          <li><Link to="/agendamento" className={isActive('/agendamento')}>Agendamento</Link></li>
          <li><Link to="/contato" className={isActive('/contato')}>Contato</Link></li>

          {(!user || userType === 'admin') && (
            <li>
              <Link to="/para-tatuadores" className={isActive('/para-tatuadores')}
                style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>
                Para Tatuadores
              </Link>
            </li>
          )}

          {user ? (
            <li>
              {userType === 'client' && (
                <Link to="/perfil" className={isActive('/perfil')}><UserIcon /></Link>
              )}
              {userType === 'artist' && (
                <Link to="/artist-dashboard" className={isActive('/artist-dashboard')}><UserIcon /></Link>
              )}
              {userType === 'admin' && (
                <Link to="/admin" className={isActive('/admin')}><UserIcon /></Link>
              )}
            </li>
          ) : (
            <li>
              <Link to="/login" className={isActive('/login')}>
                <UserIcon />
                <span style={{ marginLeft: '0.5rem' }}>Login</span>
              </Link>
            </li>
          )}

          {user && (
            <li>
              <button
                onClick={() => { logout(); navigate('/login') }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  padding: '0'
                }}>
                Sair
              </button>
            </li>
          )}
        </ul>

        <div className="nav-actions">
          <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
        </div>

        {userType === 'client' && (
          <div className="notif-wrap" ref={notifRef}>
            <button className="notif-btn" onClick={() => setNotifOpen(prev => !prev)}>
              <span className="material-symbols-outlined">notifications</span>
            </button>
            {notifOpen && (
              <div className="notif-dropdown">
                <div className="notif-header">Agendamentos Recentes</div>
                {agendamentos.length === 0 ? (
                  <div className="notif-empty">Nenhum agendamento ainda.</div>
                ) : (
                  agendamentos.map(ag => (
                    <div key={ag.id} className="notif-item"
                      onClick={() => { navigate('/perfil'); setNotifOpen(false) }}>
                      <div className="notif-item-title">{ag.servico || 'Tatuagem'}</div>
                      <div className="notif-item-sub">{ag.artista?.nome || 'Artista'} · {formatDate(ag.dataHora)}</div>
                      <span className="notif-item-status"
                        style={{ color: statusColor[ag.status] || '#fff' }}>{ag.status}</span>
                    </div>
                  ))
                )}
                <div className="notif-footer"
                  onClick={() => { navigate('/perfil'); setNotifOpen(false) }}>
                  Ver todos no perfil →
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
