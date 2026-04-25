import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { agendamentoService, clienteService } from '../services/inkflowApi'
import { useAuth } from '../contexts/AuthContext'
import './Profile.css'

const Toast = ({ message, icon, onExit }) => {
  const [isExiting, setIsExiting] = useState(false)
  useEffect(() => {
    const exitTimer = setTimeout(() => setIsExiting(true), 2700)
    const removeTimer = setTimeout(() => onExit(), 3000)
    return () => { clearTimeout(exitTimer); clearTimeout(removeTimer) }
  }, [onExit])
  return (
    <div className={`p-toast ${isExiting ? 'toast-exit' : 'toast-enter'}`}>
      <span className="material-symbols-outlined p-toast-icon">{icon}</span>
      <span>{message}</span>
    </div>
  )
}

const StarRating = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: '4px', margin: '8px 0' }}>
    {[1,2,3,4,5].map(star => (
      <span
        key={star}
        className="material-symbols-outlined"
        onClick={() => onChange(star)}
        style={{ cursor: 'pointer', color: star <= value ? '#ff0000' : 'rgba(255,255,255,0.3)', fontSize: '1.5rem' }}
      >star</span>
    ))}
  </div>
)

const formatDate = (dataHora) => {
  if (!dataHora) return ''
  const d = new Date(dataHora)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase().replace('.', '')
}

const formatTime = (dataHora) => {
  if (!dataHora) return ''
  const d = new Date(dataHora)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const getFallbackImage = (servico) => {
  const s = (servico || '').toLowerCase();
  if (s.includes('floral') || s.includes('botâni')) return '/assets/portifolio_novo/Tattoo-Cobra-Floral.webp';
  if (s.includes('realist') || s.includes('realismo')) return '/assets/portifolio_novo/Rosto.webp';
  if (s.includes('colorid') || s.includes('aquarela')) return '/assets/portifolio_novo/Borboleta-Colorida.webp';
  if (s.includes('anime') || s.includes('geek')) return '/assets/portifolio_novo/Tattoo-Anim.webp';
  if (s.includes('pet') || s.includes('animal') || s.includes('cachorro')) return '/assets/portifolio_novo/Dog.webp';
  if (s.includes('oriental')) return '/assets/portifolio_novo/tigrao.webp';
  if (s.includes('preto e cinza') || s.includes('caveira') || s.includes('black')) return '/assets/portifolio_novo/Caveira.webp';
  return '/assets/portifolio_novo/Rosa-Dos-Ventos-1.webp';
}

const Profile = () => {
  const navigate = useNavigate()
  const { user, token, loading: authLoading, logout } = useAuth()

  const [toasts, setToasts] = useState([])
  const [modal, setModal] = useState({ isOpen: false, title: '', content: null, isImage: false })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [deleteAccountModal, setDeleteAccountModal] = useState({ isOpen: false, password: '', deleting: false })
  const [chatAberto, setChatAberto] = useState(false)
  const [artistaDoChat, setArtistaDoChat] = useState(null)
  const [mensagens, setMensagens] = useState([])
  const [inputMsg, setInputMsg] = useState('')
  const [loadingMsg, setLoadingMsg] = useState(false)
  const pollingRef = useRef(null)
  const ultimoTimestampRef = useRef(new Date().toISOString())
  const chatEndRef = useRef(null)
  const [agendamentos, setAgendamentos] = useState([])
  const [loadingAg, setLoadingAg] = useState(true)
  const [editProfile, setEditProfile] = useState({ isOpen: false, nome: '', telefone: '', saving: false })
  const settingsRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setSettingsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchMeusAgendamentos = async () => {
    try {
      if (!token) return;
      const response = await agendamentoService.getMeus()
      setAgendamentos(response.data || []);
    } catch (err) {
      setAgendamentos([]);
    } finally {
      setLoadingAg(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user || !user.email) {
        navigate('/login');
        return;
      }
      fetchMeusAgendamentos();
    }
    return () => {
      if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null }
    }
  }, [user, authLoading, navigate])

  if (authLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
        <h2 style={{ color: '#e63946', marginBottom: '1rem', animation: 'pulsate 1.5s infinite ease-in-out' }}>Autenticando Perfil...</h2>
        <p style={{ opacity: 0.5 }}>Carregando sua galeria segura do InkFlow.</p>
        <style>{`@keyframes pulsate { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }`}</style>
      </div>
    )
  }

  if (!user || !user.email) return null

  const isAvaliado = (ag) => ag.avaliado === true
  const proximas = agendamentos.filter(a => a.status === 'PENDENTE' || a.status === 'CONFIRMADO' || (a.status === 'REALIZADO' && !isAvaliado(a)))
  const colecao = agendamentos.filter(a => a.status === 'REALIZADO' && isAvaliado(a))
  const artistasUnicos = agendamentos
    .filter(a => a.artista)
    .reduce((acc, a) => {
      if (!acc.find(x => x.id === a.artista.id)) acc.push(a.artista)
      return acc
    }, [])

  const showToast = (message, icon = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, icon }])
  }
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))
  const openModal = (title, content, isImage = false) => setModal({ isOpen: true, title, content, isImage })
  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }))

  const handleAction = (action) => {
    switch(action) {
      case 'edit_profile':
        setEditProfile({ isOpen: true, nome: user.nome || user.fullName || '', telefone: user.telefone || '', saving: false })
        break
      case 'share':
        navigator.clipboard.writeText('inkflow.com/perfil/' + (user.nome?.replace(/\s+/g, '-').toLowerCase() || ''))
        showToast('Link da Galeria Copiado!', 'content_copy')
        break
      case 'referral':
        navigator.clipboard.writeText('INK-' + (user.nome?.split(' ')[0]?.toUpperCase() || 'USER') + '-2024')
          .then(() => showToast('Código de indicação copiado!', 'loyalty'))
        break
      case 'switch_account':
        showToast('Funcionalidade em desenvolvimento', 'info')
        setSettingsOpen(false)
        break
      case 'logout':
        logout()
        navigate('/login')
        break
      case 'delete_account':
        setSettingsOpen(false)
        setDeleteAccountModal({ isOpen: true, password: '', deleting: false })
        break
      default: break
    }
  }

  const handleAvatarAction = async (action) => {
    switch(action) {
      case 'upload':
        fileInputRef.current?.click()
        setAvatarModalOpen(false)
        break
      case 'remove':
        if (!user.id) return;
        setAvatarModalOpen(false)
        showToast('Removendo foto...', 'hourglass_empty')
        try {
          await clienteService.deleteFoto(user.id)
          const updatedUser = { ...user }
          delete updatedUser.fotoUrl
          localStorage.setItem('user', JSON.stringify(updatedUser))
          showToast('Foto de perfil removida', 'check_circle')
          setTimeout(() => window.location.reload(), 500)
        } catch (err) {
          showToast('Erro ao remover foto', 'error')
        }
        break
      default:
        break
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!user.id) return;
      const validTypes = ['image/png', 'image/jpeg', 'image/webp']
      if (!validTypes.includes(file.type)) {
        showToast('Formato inválido. Use PNG, JPG ou WEBP.', 'error')
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      
      showToast('Enviando foto...', 'hourglass_empty')
      try {
        const response = await clienteService.uploadFoto(user.id, formData)
        // Assume API returns plain URL string or object like { fotoUrl: '...' }
        const imageUrl = typeof response.data === 'string' ? response.data : response.data.fotoUrl
        
        const updatedUser = { ...user, fotoUrl: imageUrl }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        showToast('Foto atualizada com sucesso!', 'check_circle')
        setTimeout(() => window.location.reload(), 500)
      } catch (err) {
        console.error('Erro de Upload:', err.response?.data || err.message || err);
        const errorMessage = err.response?.data?.message || err.response?.data || 'Erro de comunicação com o servidor ao carregar foto.'
        showToast(typeof errorMessage === 'string' ? errorMessage : 'Erro 500: Falha ao carregar foto.', 'error')
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDeleteAccount = async () => {
    if (!deleteAccountModal.password) {
      showToast('Digite sua senha para confirmar', 'error')
      return
    }
    setDeleteAccountModal(prev => ({ ...prev, deleting: true }))
    try {
      const API_URL = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(/\/api$/, '')
        : 'https://inkflowbackend-4w1g.onrender.com'
      const response = await fetch(`${API_URL}/api/clientes/minha-conta`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ password: deleteAccountModal.password })
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        showToast(data.message || 'Senha incorreta', 'error')
        setDeleteAccountModal(prev => ({ ...prev, deleting: false }))
        return
      }
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('userType')
      showToast('Conta excluída com sucesso', 'check_circle')
      setTimeout(() => navigate('/'), 1500)
    } catch (error) {
      console.error('Erro ao excluir conta:', error)
      showToast('Erro ao excluir conta. Tente novamente.', 'error')
      setDeleteAccountModal(prev => ({ ...prev, deleting: false }))
    }
  }

  const handleSaveProfile = async () => {
    setEditProfile(prev => ({ ...prev, saving: true }))
    try {
      if (user.id) {
        const payloadSeguro = {
          nome: editProfile.nome,
          fullName: editProfile.nome,
          telefone: editProfile.telefone,
          email: user.email,
          cpf: user.cpf,
          dataNascimento: user.dataNascimento
        };
        
        await clienteService.update(user.id, payloadSeguro)
      }
      const updatedUser = { ...user, nome: editProfile.nome, fullName: editProfile.nome, telefone: editProfile.telefone }
      delete updatedUser.imagemReferenciaUrl;
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setEditProfile(prev => ({ ...prev, isOpen: false }))
      showToast('Perfil atualizado com sucesso!', 'check_circle')
      setTimeout(() => window.location.reload(), 500)
    } catch {
      showToast('Erro ao atualizar perfil.', 'error')
      setEditProfile(prev => ({ ...prev, saving: false }))
    }
  }

  const handleUpdateStatus = async (agendamentoId, status, avaliacao, observacoes) => {
    try {
      await agendamentoService.updateStatus(agendamentoId, { status, avaliacao, observacoes })
      await fetchMeusAgendamentos()
      const msg = status === 'CANCELADO' ? 'Sessão cancelada.' : 'Sessão atualizada!'
      showToast(msg, status === 'CANCELADO' ? 'cancel' : 'check_circle')
      closeModal()
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      const errorMsg = err.response?.data?.message || 'Erro ao atualizar sessão. Verifique sua conexão.'
      showToast(errorMsg, 'error')
    }
  }

  const API_BASE = import.meta.env.VITE_API_URL?.replace('/v1', '') || 'https://inkflowbackend-4w1g.onrender.com/api'

  const abrirChat = async (artista) => {
    setArtistaDoChat(artista)
    setChatAberto(true)
    setMensagens([])
    try {
      const res = await fetch(`${API_BASE}/mensagens/conversa/${artista.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const msgs = await res.json()
      setMensagens(Array.isArray(msgs) ? msgs : [])
      if (msgs.length > 0) ultimoTimestampRef.current = msgs[msgs.length - 1].createdAt
      msgs.filter(m => !m.lida && m.destinatarioId === user?.id)
          .forEach(m => fetch(`${API_BASE}/mensagens/${m.id}/lida`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } }))
    } catch { }
    // Iniciar polling
    if (pollingRef.current) clearInterval(pollingRef.current)
    pollingRef.current = setInterval(async () => {
      try {
        const r = await fetch(`${API_BASE}/mensagens/novas?desde=${ultimoTimestampRef.current}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const novas = await r.json()
        if (novas.length > 0) {
          setMensagens(prev => [...prev, ...novas])
          ultimoTimestampRef.current = novas[novas.length - 1].createdAt
        }
      } catch { }
    }, 5000)
  }

  const fecharChat = () => {
    setChatAberto(false)
    setArtistaDoChat(null)
    setMensagens([])
    if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null }
  }

  const enviarMensagem = async () => {
    if (!inputMsg.trim() || !artistaDoChat) return
    setLoadingMsg(true)
    try {
      const res = await fetch(`${API_BASE}/mensagens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ remetenteId: user?.id, destinatarioId: artistaDoChat.id, conteudo: inputMsg.trim() })
      })
      if (!res.ok) { const e = await res.json(); showToast(e.message || 'Erro ao enviar', 'error'); return }
      const nova = await res.json()
      setMensagens(prev => [...prev, nova])
      ultimoTimestampRef.current = nova.createdAt
      setInputMsg('')
    } catch { showToast('Erro ao enviar mensagem', 'error') }
    finally { setLoadingMsg(false) }
  }

  const handleAvaliarSessao = async (agendamentoId, avaliacao, observacoes) => {
    try {
      await agendamentoService.avaliar(agendamentoId, { avaliacao })
      await fetchMeusAgendamentos()
      showToast('Avaliação enviada com sucesso!', 'star')
      closeModal()
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err)
      const errorMsg = err.response?.data?.message || 'Erro ao enviar avaliação. Verifique sua conexão.'
      showToast(errorMsg, 'error')
    }
  }

  const openSessionModal = (ag) => {
    let avaliacao = ag.avaliacao || 0
    let observacoes = ag.observacoes || ''

    const content = (
      <SessionModalContent
        ag={ag}
        onUpdate={(status, av, obs) => handleUpdateStatus(ag.id, status, av, obs)}
        onAvaliar={(av, obs) => handleAvaliarSessao(ag.id, av, obs)}
      />
    )
    openModal('Detalhes da Sessão', content)
  }

  const openAllSessionsModal = () => {
    const content = (
      <AllSessionsModalContent 
        sessoes={agendamentos} 
        onAgendamentoClick={openSessionModal} 
      />
    )
    openModal('Todas as Sessões', content)
  }

  const modalData = {
    'guide_1': {
      title: 'Guia: Primeiras 24 Horas',
      content: (
        <ul className="p-modal-list">
          <li>Deixe o curativo/plástico pelo tempo especificado pelo seu artista (geralmente 2-4 horas).</li>
          <li>Lave as mãos cuidadosamente antes de remover o curativo.</li>
          <li>Lave suavemente a tatuagem com água morna e sabonete antibacteriano sem fragrância. Não esfregue.</li>
          <li>Seque com papel toalha limpo dando tapinhas. Não esfregue nem use toalhas de pano.</li>
          <li>Deixe secar ao ar livre por 10-15 minutos antes de aplicar uma camada muito fina de pomada para tatuagem.</li>
        </ul>
      )
    },
    'guide_2': {
      title: 'Lavar & Proteger',
      content: (
        <>
          <p className="p-modal-text">Para os dias 2-14, siga esta rotina com cuidado:</p>
          <ul className="p-modal-list">
            <li>Lave sua tatuagem 2-3 vezes ao dia usando mãos limpas e sabonete neutro e sem cheiro.</li>
            <li>Mude para uma loção sem fragrância após o dia 3. Aplique uma camada muito fina.</li>
            <li>A tatuagem vai começar a descamar e soltar casquinhas. <strong>NÃO CUTUQUE NEM COCE.</strong></li>
            <li>Use roupas largas para evitar atrito na pele em cicatrização.</li>
          </ul>
        </>
      )
    },
    'guide_3': {
      title: 'Cuidados a Longo Prazo',
      content: (
        <>
          <p className="p-modal-text">Como manter sua tinta vibrante por anos:</p>
          <ul className="p-modal-list">
            <li>Sempre aplique protetor solar FPS 50+ quando expor sua tatuagem à luz solar direta.</li>
            <li>Mantenha a pele hidratada diariamente após o banho.</li>
            <li>Mantenha-se hidratado! Pele saudável significa tatuagens com aparência saudável.</li>
            <li>Evite imersão prolongada (piscinas, mar) até que a tatuagem esteja 100% totalmente cicatrizada.</li>
          </ul>
        </>
      )
    }
  }

  return (
    <div className="profile-page">
      <main className="profile-main">

        {/* Header */}
        <section className="profile-header">
          <div className="profile-avatar-wrap">
            <div 
              className="profile-avatar" 
              onClick={() => setAvatarModalOpen(true)} 
              style={{ 
                cursor: 'pointer',
                backgroundImage: (user.fotoUrl || user.foto || user.fotoPerfil) ? `url(${user.fotoUrl || user.foto || user.fotoPerfil})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: (user.fotoUrl || user.foto || user.fotoPerfil) ? 'transparent' : '#fff'
              }}
            >
              {user.nome?.charAt(0)?.toUpperCase() || user.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="profile-badge"><span className="material-symbols-outlined">verified</span></div>
          </div>

          <div className="profile-info">
            <span className="profile-member">Membro Desde {new Date(user.createdAt || Date.now()).getFullYear()}</span>
            <h1 className="profile-name">{user.nome || user.fullName || 'Visitante'}</h1>
            <div className="profile-actions">
              <button className="p-btn-primary" onClick={() => handleAction('edit_profile')}>
                <span className="material-symbols-outlined">edit</span> Editar Perfil
              </button>
              <button className="p-btn-secondary" onClick={() => handleAction('share')}>
                Compartilhar Galeria
              </button>
              <button className="p-btn-settings" onClick={() => setSettingsOpen(true)}>
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <strong>{agendamentos.length}</strong>
              <span>Sessões</span>
            </div>
            <div className="stat-card">
              <strong>{artistasUnicos.length}</strong>
              <span>Artistas</span>
            </div>
            <div className="stat-card">
              <strong>{colecao.length}</strong>
              <span>Tattoos</span>
            </div>
          </div>
        </section>

        <div className="profile-body layout-grid">
          {/* Left Column */}
          <div className="profile-col-main">

            {/* Próximas Sessões */}
            <div className="profile-section">
              <div className="section-header">
                <h3><span className="material-symbols-outlined">calendar_today</span> Próximas Sessões</h3>
                <a onClick={openAllSessionsModal} style={{ cursor: 'pointer' }}>Ver Todas</a>
              </div>

              {loadingAg ? (
                <p style={{ color: 'rgba(255,255,255,0.4)', padding: '1rem 0' }}>Carregando...</p>
              ) : proximas.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.4)', padding: '2rem 0', textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>calendar_today</span>
                  Nenhuma sessão agendada ainda.
                </div>
              ) : (
                <div className="sessions-grid">
                  {proximas.slice(0, 2).map(ag => (
                    <div key={ag?.id} className="session-card">
                      <div className="session-img" style={{ backgroundImage: `url("${ag?.imagemReferenciaUrl || getFallbackImage(ag?.servico)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                      <div className="session-content">
                        <div className="session-top">
                          <div>
                            <h4>{(ag?.servico || 'Tatuagem').replace(/\s+com\s+.+$/i, '')}</h4>
                            <p>com <span>{ag?.artista?.nome || (ag?.servico?.match(/com\s+(.+)$/i)?.[1]) || 'Artista'}</span></p>
                          </div>
                          <div className={`session-date ${ag.status === 'AGENDADO' ? 'red' : 'gray'}`}>
                            {formatDate(ag.dataHora)}
                          </div>
                        </div>
                        <div className="session-meta">
                          <span><span className="material-symbols-outlined">schedule</span> {formatTime(ag.dataHora)}</span>
                          <span><span className="material-symbols-outlined">info</span> {ag.status}</span>
                        </div>
                        <button className="p-btn-outline" onClick={() => openSessionModal(ag)}>Detalhes da Sessão</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Minha Coleção */}
            <div className="profile-section">
              <div className="section-header">
                <h3><span className="material-symbols-outlined">auto_awesome_motion</span> Minha Coleção</h3>
                <a onClick={() => {}}>Galeria Completa</a>
              </div>

              {colecao.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.4)', padding: '2rem 0', textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>photo_library</span>
                  Suas tattoos realizadas aparecerão aqui.
                </div>
              ) : (
                <div className="gallery-layout">
                  {colecao.map((ag, i) => (
                    <div 
                      key={ag.id} 
                      className="gallery-item" 
                      onClick={() => openModal('Tattoo Finalizada', (
                        <div style={{ padding: '0.5rem', textAlign: 'center', color: '#fff' }}>
                          <img 
                            src={ag.imagemResultadoUrl || ag.imagemReferenciaUrl || getFallbackImage(ag.servico)} 
                            alt={ag.servico} 
                            style={{ width: '100%', maxHeight: '40vh', borderRadius: '8px', objectFit: 'contain', backgroundColor: 'rgba(0,0,0,0.5)' }} 
                          />
                          <h3 style={{ marginTop: '1rem', color: '#e63946', fontSize: '1.4rem' }}>{ag.servico}</h3>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Obra de {ag.artista?.nome || (ag.servico?.match(/com\s+(.+)$/i)?.[1]) || 'Artista Studio'}
                          </p>
                          
                          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ color: '#ffb900', fontSize: '1.4rem', marginBottom: '0.5rem', letterSpacing: '4px' }}>
                              {'★'.repeat(ag.avaliacao || 0)}{'☆'.repeat(5 - (ag.avaliacao || 0))}
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', fontStyle: 'italic', lineHeight: '1.5' }}>
                              "{ag.observacoes || 'Sessão finalizada com muito profissionalismo!'}"
                            </p>
                          </div>
                        </div>
                      ))}
                    >
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        backgroundImage: `url("${ag.imagemResultadoUrl || ag.imagemReferenciaUrl || getFallbackImage(ag.servico)}")`, 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center',
                        borderRadius: 'inherit'
                      }}></div>
                      <div className="gallery-overlay"><span className="material-symbols-outlined">zoom_in</span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column */}
          <div className="profile-col-side">

            {/* Care Guides */}
            <div className="care-guides-box">
              <h3><span className="material-symbols-outlined">medical_services</span> Guias de Cuidados</h3>
              <div className="guides-list">
                <div className="guide-item" onClick={() => openModal(modalData['guide_1'].title, modalData['guide_1'].content)}>
                  <div className="guide-icon"><span className="material-symbols-outlined">water_drop</span></div>
                  <div className="guide-text"><h5>Primeiras 24 Horas</h5><p>Lidando com plasma e plástico</p></div>
                  <span className="material-symbols-outlined guide-arrow">arrow_forward</span>
                </div>
                <div className="guide-item" onClick={() => openModal(modalData['guide_2'].title, modalData['guide_2'].content)}>
                  <div className="guide-icon"><span className="material-symbols-outlined">soap</span></div>
                  <div className="guide-text"><h5>Lavar & Proteger</h5><p>Tipos de sabonete e hidratação</p></div>
                  <span className="material-symbols-outlined guide-arrow">arrow_forward</span>
                </div>
                <div className="guide-item" onClick={() => openModal(modalData['guide_3'].title, modalData['guide_3'].content)}>
                  <div className="guide-icon"><span className="material-symbols-outlined">sunny</span></div>
                  <div className="guide-text"><h5>Cuidados a Longo Prazo</h5><p>Filtro solar e longevidade</p></div>
                  <span className="material-symbols-outlined guide-arrow">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Meus Artistas */}
            <div className="profile-section">
              <div className="section-header">
                <h3><span className="material-symbols-outlined">group</span> Meus Artistas</h3>
              </div>
              {artistasUnicos.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.4)', padding: '1rem 0', textAlign: 'center', fontSize: '0.85rem' }}>
                  Os artistas das suas sessões aparecerão aqui.
                </div>
              ) : (
                <div className="artists-list">
                  {artistasUnicos.map(artista => (
                    <div key={artista?.id} className="artist-item">
                      <img
                        src={artista?.fotoUrl || `https://ui-avatars.com/api/?background=1a1919&color=ff8d8c&name=${encodeURIComponent(artista?.nome || 'User')}`}
                        alt={artista?.nome || 'Artista'}
                        onError={e => { e.target.src = `https://ui-avatars.com/api/?background=1a1919&color=ff8d8c&name=${encodeURIComponent(artista?.nome || 'User')}` }}
                      />
                      <div className="artist-info">
                        <h5>{artista?.nome || 'Artista'}</h5>
                        <p>{artista?.role || 'Tatuador Residente'}</p>
                      </div>
                      <button onClick={() => abrirChat(artista)}>
                        <span className="material-symbols-outlined">chat_bubble</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Promo Card */}
            <div className="promo-card">
              <div className="promo-content">
                <h4>Indique um Amigo</h4>
                <p>Ganhe 20% off na sua próxima sessão ao indicar outro entusiasta da tatuagem.</p>
                <button onClick={() => handleAction('referral')}>Pegar Código de Indicação</button>
              </div>
              <span className="material-symbols-outlined promo-icon">loyalty</span>
            </div>

          </div>
        </div>
      </main>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Avatar Modal (Instagram Style) */}
      {avatarModalOpen && (
        <div className="p-avatar-modal-overlay" onClick={() => setAvatarModalOpen(false)}>
          <div className="p-avatar-modal" onClick={e => e.stopPropagation()}>
            <div className="p-avatar-modal-title">
              Alterar foto de perfil
            </div>
            <button className="p-avatar-modal-item primary" onClick={() => handleAvatarAction('upload')}>
              Carregar foto
            </button>
            <button className="p-avatar-modal-item danger" onClick={() => handleAvatarAction('remove')}>
              Remover foto atual
            </button>
            <button className="p-avatar-modal-item cancel" onClick={() => setAvatarModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal (Instagram Style) */}
      {settingsOpen && (
        <div className="p-settings-modal-overlay" onClick={() => setSettingsOpen(false)}>
          <div className="p-settings-modal" onClick={e => e.stopPropagation()}>
            <button className="p-settings-modal-item" onClick={() => handleAction('switch_account')}>
              Trocar de Conta
            </button>
            <button className="p-settings-modal-item" onClick={() => handleAction('logout')}>
              Sair da Conta
            </button>
            <button className="p-settings-modal-item danger" onClick={() => handleAction('delete_account')}>
              Excluir Conta
            </button>
            <button className="p-settings-modal-item cancel" onClick={() => setSettingsOpen(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {deleteAccountModal.isOpen && (
        <div className="p-modal-overlay" onClick={() => !deleteAccountModal.deleting && setDeleteAccountModal({ isOpen: false, password: '', deleting: false })}>
          <div className="p-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="p-modal-header">
              <h3>Excluir Conta</h3>
              <button onClick={() => !deleteAccountModal.deleting && setDeleteAccountModal({ isOpen: false, password: '', deleting: false })} disabled={deleteAccountModal.deleting}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-modal-body custom-scrollbar">
              <div className="p-modal-stack">
                <div style={{ padding: '1rem', background: 'rgba(232, 25, 44, 0.1)', border: '1px solid rgba(232, 25, 44, 0.3)', borderRadius: '8px', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span className="material-symbols-outlined" style={{ color: '#e8192c', fontSize: '1.5rem' }}>warning</span>
                    <strong style={{ color: '#e8192c', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Atenção: Ação Irreversível</strong>
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                    Ao excluir sua conta, todos os seus dados serão permanentemente removidos, incluindo:
                  </p>
                  <ul style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                    <li>Histórico de agendamentos</li>
                    <li>Avaliações e comentários</li>
                    <li>Preferências e configurações</li>
                    <li>Galeria de tatuagens</li>
                  </ul>
                </div>

                <div className="p-modal-card">
                  <span style={{ color: '#fff', fontWeight: '600' }}>Digite sua senha para confirmar</span>
                  <input
                    type="password"
                    value={deleteAccountModal.password}
                    onChange={e => setDeleteAccountModal(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Sua senha"
                    disabled={deleteAccountModal.deleting}
                    onKeyPress={e => e.key === 'Enter' && handleDeleteAccount()}
                    style={{ 
                      width: '100%', 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      color: '#fff', 
                      borderRadius: '6px', 
                      padding: '12px', 
                      marginTop: '8px', 
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    className="p-btn-secondary"
                    disabled={deleteAccountModal.deleting}
                    onClick={() => setDeleteAccountModal({ isOpen: false, password: '', deleting: false })}
                    style={{ flex: 1 }}
                  >
                    Cancelar
                  </button>
                  <button
                    className="p-btn-primary"
                    disabled={deleteAccountModal.deleting || !deleteAccountModal.password}
                    onClick={handleDeleteAccount}
                    style={{ flex: 1, background: '#e8192c', opacity: deleteAccountModal.deleting || !deleteAccountModal.password ? 0.5 : 1 }}
                  >
                    {deleteAccountModal.deleting ? 'Excluindo...' : 'Excluir Conta'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {modal.isOpen && (
        <div className="p-modal-overlay" onClick={closeModal}>
          <div className={`p-modal ${modal.isImage ? 'image-modal' : ''}`} onClick={e => e.stopPropagation()}>
            <div className="p-modal-header">
              <h3>{modal.title}</h3>
              <button onClick={closeModal}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-modal-body custom-scrollbar">
              {modal.content}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editProfile.isOpen && (
        <div className="p-modal-overlay" onClick={() => setEditProfile(prev => ({ ...prev, isOpen: false }))}>
          <div className="p-modal" onClick={e => e.stopPropagation()}>
            <div className="p-modal-header">
              <h3>Editar Perfil</h3>
              <button onClick={() => setEditProfile(prev => ({ ...prev, isOpen: false }))}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-modal-body custom-scrollbar">
              <div className="p-modal-stack">
                <div className="p-modal-card">
                  <span>Nome</span>
                  <input
                    type="text"
                    value={editProfile.nome}
                    onChange={e => setEditProfile(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Seu nome"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', padding: '10px', marginTop: '6px', fontSize: '1rem' }}
                  />
                </div>
                <div className="p-modal-card">
                  <span>Telefone</span>
                  <input
                    type="tel"
                    value={editProfile.telefone}
                    onChange={e => setEditProfile(prev => ({ ...prev, telefone: e.target.value }))}
                    placeholder="(99) 99999-9999"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', padding: '10px', marginTop: '6px', fontSize: '1rem' }}
                  />
                </div>
                <div className="p-modal-card">
                  <span>Email</span>
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', borderRadius: '6px', padding: '10px', marginTop: '6px', fontSize: '1rem', cursor: 'not-allowed' }}
                  />
                </div>
                <button
                  className="p-btn-primary"
                  disabled={editProfile.saving}
                  onClick={handleSaveProfile}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  {editProfile.saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Chat */}
      {chatAberto && artistaDoChat && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, width: '90%', maxWidth: 480, height: '70vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={artistaDoChat.fotoUrl || `https://ui-avatars.com/api/?background=1a1919&color=ff8d8c&name=${encodeURIComponent(artistaDoChat.nome)}`} alt={artistaDoChat.nome} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{artistaDoChat.nome}</p>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Artista InkFlow</p>
              </div>
              <button onClick={fecharChat} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {/* Mensagens */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mensagens.length === 0 && (
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', marginTop: '2rem' }}>Nenhuma mensagem ainda. Diga olá!</p>
              )}
              {mensagens.map(m => {
                const isCliente = m.remetenteId === user?.id
                return (
                  <div key={m.id} style={{ display: 'flex', justifyContent: isCliente ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: isCliente ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: isCliente ? '#e63946' : 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.875rem', lineHeight: 1.5 }}>
                      <p style={{ margin: 0 }}>{m.conteudo}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '0.65rem', opacity: 0.6, textAlign: 'right' }}>{new Date(m.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                )
              })}
              <div ref={chatEndRef} />
            </div>
            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 10 }}>
              <input value={inputMsg} onChange={e => setInputMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && !loadingMsg && enviarMensagem()} placeholder="Digite uma mensagem..." disabled={loadingMsg}
                style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: '0.875rem', outline: 'none' }} />
              <button onClick={enviarMensagem} disabled={loadingMsg || !inputMsg.trim()}
                style={{ background: '#e63946', border: 'none', borderRadius: 10, padding: '10px 16px', color: '#fff', cursor: loadingMsg || !inputMsg.trim() ? 'not-allowed' : 'pointer', opacity: loadingMsg || !inputMsg.trim() ? 0.5 : 1 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="p-toasts-container">
        {toasts.map(toast => <Toast key={toast.id} {...toast} onExit={() => removeToast(toast.id)} />)}
      </div>
    </div>
  )
}

const AllSessionsModalContent = ({ sessoes, onAgendamentoClick }) => {
  if (sessoes.length === 0) {
    return <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>Nenhuma sessão encontrada.</div>
  }

  return (
    <div className="all-sessions-list">
      {sessoes.map(ag => (
        <div key={ag?.id} className="all-sessions-item" onClick={() => onAgendamentoClick(ag)}>
          <div className="all-sessions-item-img" style={{ backgroundImage: `url("${ag?.imagemReferenciaUrl || getFallbackImage(ag?.servico)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="all-sessions-item-content">
            <div className="all-sessions-item-header">
              <h4>{(ag?.servico || 'Tatuagem').replace(/\s+com\s+.+$/i, '')}</h4>
              <div className={`session-date ${ag?.status === 'AGENDADO' ? 'red' : 'gray'}`}>
                {formatDate(ag?.dataHora)}
              </div>
            </div>
            <div className="all-sessions-item-details">
              <span><span className="material-symbols-outlined">person</span> {ag?.artista?.nome || (ag?.servico?.match(/com\s+(.+)$/i)?.[1]) || 'Artista'}</span>
              <span><span className="material-symbols-outlined">schedule</span> {formatTime(ag?.dataHora)}</span>
              <span><span className="material-symbols-outlined">info</span> {ag?.status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const SessionModalContent = ({ ag, onUpdate, onAvaliar }) => {
  const [avaliacao, setAvaliacao] = useState(ag.avaliacao || 0)
  const [observacoes, setObservacoes] = useState(ag.observacoes || '')
  const [loading, setLoading] = useState(false)
  const [expandedImage, setExpandedImage] = useState(null)

  const handleUpdate = async (status) => {
    setLoading(true)
    await onUpdate(status, avaliacao, observacoes)
    setLoading(false)
  }

  const handleSubmitAvaliacao = async () => {
    setLoading(true)
    await onAvaliar(avaliacao, observacoes)
    setLoading(false)
  }

  const statusLabel = {
    'AGENDADO': 'Agendada',
    'CONFIRMADO': 'Confirmada',
    'EM_ANDAMENTO': 'Em Andamento',
    'REALIZADO': 'Realizada (Aguardando Avaliação)',
    'FINALIZADO': 'Finalizada',
    'CANCELADO': 'Cancelada',
  }

  const now = new Date();
  const createdAt = ag.createdAt ? new Date(ag.createdAt.endsWith('Z') ? ag.createdAt : ag.createdAt + 'Z') : null;
  const horasDesdeCriacao = createdAt ? (now - createdAt) / (1000 * 60 * 60) : 999;
  const isCancellable = horasDesdeCriacao <= 24;
  const cancelMsg = 'O prazo de 24h após o agendamento já expirou. Entre em contato com o estúdio.'

  return (
    <>
    <div className="p-modal-stack">
      <div className="p-modal-card border-red">
        <h4>Serviço</h4>
        <p>{(ag.servico || 'Tatuagem').replace(/\s+com\s+.+$/i, '')}</p>
      </div>
      <div className="p-modal-grid">
        <div className="p-modal-card">
          <span>Data & Hora</span>
          <strong>{new Date(ag.dataHora).toLocaleDateString('pt-BR')}<br/>{new Date(ag.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</strong>
        </div>
        <div className="p-modal-card">
          <span>Artista</span>
          <strong>{ag.artista?.nome || (ag.servico?.match(/com\s+(.+)$/i)?.[1]) || '—'}</strong>
        </div>
      </div>

      <div className="p-modal-grid">
        <div className="p-modal-card">
          <span>Região do Corpo</span>
          <strong>{ag.regiao || 'Não informada'}</strong>
        </div>
        <div className="p-modal-card">
          <span>Tamanho Aproximado</span>
          <strong>{ag.largura && ag.altura ? `${ag.largura} x ${ag.altura} cm` : 'Não informado'}</strong>
        </div>
      </div>

      {(Array.isArray(ag.tags) && ag.tags.length > 0) ? (
        <div className="p-modal-card">
          <span>Tags & Referências</span>
          <div className="session-tags-wrap">
            {ag.tags.map(tag => (
              <span key={tag} className="session-tag-chip">{tag}</span>
            ))}
          </div>
        </div>
      ) : (typeof ag.tags === 'string' && ag.tags.trim().length > 0) ? (
        <div className="p-modal-card">
          <span>Tags & Referências</span>
          <div className="session-tags-wrap">
            {ag.tags.split(',').map(tag => {
              const t = tag.trim();
              return t ? <span key={t} className="session-tag-chip">{t}</span> : null;
            })}
          </div>
        </div>
      ) : null}

      {ag.imagemReferenciaUrl && (
        <div className="p-modal-card">
          <div className="reference-image-container">
            <span>Imagem de Referência</span>
            <img 
              src={ag.imagemReferenciaUrl} 
              alt="Referência" 
              className="session-detail-img-thumb" 
              onClick={() => setExpandedImage(ag.imagemReferenciaUrl)} 
            />
          </div>
        </div>
      )}

      <div className="p-modal-card">
        <span>Status</span>
        <strong style={{ color: '#ff0000' }}>{statusLabel[ag.status] || ag.status}</strong>
      </div>
      {(ag.valorPago != null || ag.valorPendente != null) && (
        <div className="p-modal-grid">
          {ag.valorPago != null && <div className="p-modal-card"><span>Valor Pago</span><strong>R$ {ag.valorPago.toFixed(2)}</strong></div>}
          {ag.valorPendente != null && <div className="p-modal-card"><span>Valor Pendente</span><strong>R$ {ag.valorPendente.toFixed(2)}</strong></div>}
        </div>
      )}

      <div className="p-modal-card">
        <span>Observações</span>
        <textarea
          value={observacoes}
          onChange={e => setObservacoes(e.target.value)}
          placeholder="Adicione anotações sobre a sessão..."
          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', padding: '8px', marginTop: '6px', resize: 'vertical', minHeight: '80px' }}
        />
      </div>

      {ag.status === 'AGENDADO' || ag.status === 'CONFIRMADO' || ag.status === 'PENDENTE' ? (
        <>
          <p className="p-modal-note">Por favor, chegue com 15 minutos de antecedência.</p>
          {!isCancellable && (
            <p className="p-modal-note" style={{ color: '#ff6b7a', marginTop: '0.25rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>warning</span>
              {cancelMsg} Entre em contato com o estúdio.
            </p>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              className="p-btn-secondary"
              disabled={loading || !isCancellable}
              title={!isCancellable ? "Prazo mínimo de 24h para cancelamento excedido." : "Cancelar Sessão"}
              onClick={() => handleUpdate('CANCELADO')}
              style={{ 
                flex: 1, 
                opacity: !isCancellable ? 0.5 : 1, 
                cursor: !isCancellable ? 'not-allowed' : 'pointer',
                background: '#e8192c',
                color: '#fff',
                border: 'none'
              }}
            >
              Cancelar Sessão
            </button>
          </div>
        </>
      ) : (ag.status === 'REALIZADO' && (!ag.avaliacao || ag.avaliacao < 1)) ? (
        <>
          <div className="p-modal-card border-red">
            <span style={{ color: '#ff0000', fontWeight: 'bold' }}>Sessão Concluída! Deixe sua avaliação</span>
            <div style={{ marginTop: '0.5rem' }}>
              <StarRating value={avaliacao} onChange={setAvaliacao} />
            </div>
            {avaliacao < 1 && <span style={{ color: '#ff6b7a', fontSize: '0.65rem' }}>Selecione no mínimo 1 estrela para avaliar.</span>}
          </div>
          <button 
            className="p-btn-primary" 
            disabled={loading || avaliacao < 1} 
            onClick={handleSubmitAvaliacao}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Confirmar e Avaliar
          </button>
        </>
      ) : null}
    </div>

      {expandedImage && (
        <div className="p-modal-overlay" style={{ zIndex: 9999 }} onClick={() => setExpandedImage(null)}>
          <div className="p-modal image-modal" onClick={e => e.stopPropagation()}>
            <div className="p-modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <h3>Referência Visual</h3>
              <button onClick={() => setExpandedImage(null)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-modal-body" style={{ textAlign: 'center', marginTop: '1rem', overflow: 'hidden' }}>
              <img src={expandedImage} alt="Referência" style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '8px', objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Profile
