import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { agendamentoService } from '../services/inkflowApi'
import { useAuth } from '../contexts/AuthContext'
import './Header.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [agendamentos, setAgendamentos] = useState([])
  const [clienteHasNew, setClienteHasNew] = useState(false)
  const [msgNaoLidas, setMsgNaoLidas] = useState(0)
  const notifRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, userType, logout, token } = useAuth()

  const API_URL = import.meta.env.VITE_API_URL?.replace('/v1', '') || 'https://inkflowbackend-4w1g.onrender.com/api'

  useEffect(() => {
    if (userType !== 'client' || !user?.id || !token) {
      setAgendamentos([])
      setMsgNaoLidas(0)
      return
    }

    const fetchNotifs = () => {
      // Fetch agendamentos
      agendamentoService.getByCliente(user.id)
        .then(res => setAgendamentos(
          [...res.data].sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora)).slice(0, 3)
        ))
        .catch(() => {})

      // Fetch mensagens não lidas
      fetch(`${API_URL}/mensagens/nao-lidas/count`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => setMsgNaoLidas(data.total || 0))
        .catch(() => {})
    }

    fetchNotifs() // Roda imediatamente

    const interval = setInterval(fetchNotifs, 10000) // Repete a cada 10s
    return () => clearInterval(interval) // Limpa ao desmontar
  }, [user, userType, token])

  useEffect(() => {
    if (agendamentos.length === 0) return
    const lastSeen = localStorage.getItem('notif_cliente_lastSeen')
    if (!lastSeen) { setClienteHasNew(true); return }
    const maisRecente = agendamentos.reduce((a, b) =>
      new Date(a.createdAt) > new Date(b.createdAt) ? a : b
    )
    setClienteHasNew(new Date(maisRecente.createdAt) > new Date(lastSeen))
  }, [agendamentos])

  const handleAbrirSinoCliente = () => {
    setNotifOpen(prev => !prev)
    if (!notifOpen) {
      localStorage.setItem('notif_cliente_lastSeen', new Date().toISOString())
      setClienteHasNew(false)
      
      // Marcar mensagens como lidas no backend
      if (msgNaoLidas > 0 && token) {
        fetch(`${API_URL}/mensagens/marcar-todas-lidas`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(() => setMsgNaoLidas(0))
          .catch(() => {})
      }
    }
  }

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
        </ul>

        <div className="nav-actions">
          <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
        </div>

        {userType === 'client' && (
          <div className="notif-wrap" ref={notifRef}>
            <button className="notif-btn" onClick={handleAbrirSinoCliente}
              style={{ position: 'relative' }}>
              <span className="material-symbols-outlined">notifications</span>
              {(clienteHasNew || msgNaoLidas > 0) && (
                <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: '50%', background: '#E21B3C', border: '1.5px solid #0a0a0a' }} />
              )}
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
                {msgNaoLidas > 0 && (
                  <div className="notif-header" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 4, paddingTop: 8 }}>
                    💬 {msgNaoLidas} mensagem(ns) não lida(s)
                  </div>
                )}
                <div className="notif-footer"
                  onClick={() => { navigate('/perfil'); setNotifOpen(false) }}>
                  Ver todos no perfil →
                </div>
              </div>
            )}
          </div>
        )}

        {userType === 'admin' && (
          <button
            onClick={() => { logout(); navigate('/login') }}
            style={{
              background: 'none',
              border: '1px solid currentColor',
              borderRadius: '4px',
              color: 'inherit',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              padding: '4px 12px',
              marginLeft: '12px'
            }}>
            Sair
          </button>
        )}
      </nav>
    </header>
  )
}

export default Header
