import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { agendamentoService, clienteService } from '../services/inkflowApi'
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
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const [toasts, setToasts] = useState([])
  const [modal, setModal] = useState({ isOpen: false, title: '', content: null, isImage: false })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [deleteAccountModal, setDeleteAccountModal] = useState({ isOpen: false, password: '', deleting: false })
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

  useEffect(() => {
    if (!user.email) { navigate('/login'); return }
    if (user.id) {
      agendamentoService.getByCliente(user.id)
        .then(res => setAgendamentos(res.data))
        .catch(() => setAgendamentos([]))
        .finally(() => setLoadingAg(false))
    } else {
      setLoadingAg(false)
    }
  }, [user.id])

  if (!user.email) return null

  const proximas = agendamentos.filter(a => a.status === 'AGENDADO' || a.status === 'CONFIRMADO' || a.status === 'EM_ANDAMENTO' || a.status === 'REALIZADO')
  const colecao = agendamentos.filter(a => a.status === 'FINALIZADO')
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
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('userType')
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
      // Validar senha antes de excluir
      const API_URL = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(/\/api$/, '')
        : 'https://inkflowbackend-4w1g.onrender.com'
      
      const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, password: deleteAccountModal.password })
      })

      if (!loginResponse.ok) {
        showToast('Senha incorreta', 'error')
        setDeleteAccountModal(prev => ({ ...prev, deleting: false }))
        return
      }

      // Excluir conta
      if (user.id) {
        await clienteService.delete(user.id)
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
        await clienteService.update(user.id, {
          ...user,
          nome: editProfile.nome,
          fullName: editProfile.nome,
          telefone: editProfile.telefone,
        })
      }
      const updatedUser = { ...user, nome: editProfile.nome, fullName: editProfile.nome, telefone: editProfile.telefone }
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
      const res = await agendamentoService.getByCliente(user.id)
      setAgendamentos(res.data)
      const msg = status === 'REALIZADO' ? 'Sessão marcada como realizada!' : status === 'CANCELADO' ? 'Sessão cancelada.' : 'Sessão atualizada!'
      showToast(msg, status === 'CANCELADO' ? 'cancel' : 'check_circle')
      closeModal()
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      const errorMsg = err.response?.data?.message || 'Erro ao atualizar sessão. Verifique sua conexão.'
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
                backgroundImage: user.fotoUrl ? `url(${user.fotoUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: user.fotoUrl ? 'transparent' : '#fff'
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
                <a onClick={openAllSessionsModal}>Ver Todas</a>
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
                  {proximas.slice(0, 4).map(ag => (
                    <div key={ag.id} className="session-card">
                      <div className="session-img" style={{ backgroundImage: `url("${ag.imagemReferenciaUrl || getFallbackImage(ag.servico)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                      <div className="session-content">
                        <div className="session-top">
                          <div>
                            <h4>{(ag.servico || 'Tatuagem').replace(/\s+com\s+.+$/i, '')}</h4>
                            <p>com <span>{ag.artista?.nome || (ag.servico?.match(/com\s+(.+)$/i)?.[1]) || 'Artista'}</span></p>
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
                    <div key={ag.id} className="gallery-item" onClick={() => openModal('Visualização', <div style={{padding:'2rem',textAlign:'center',color:'rgba(255,255,255,0.6)'}}>{ag.servico} — {formatDate(ag.dataHora)}</div>)}>
                      <div style={{ width: '100%', height: '100%', background: 'rgba(255,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.3)' }}>ink_pen</span>
                      </div>
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
                    <div key={artista.id} className="artist-item">
                      <img
                        src={artista.fotoUrl || '/assets/portifolio_tatuadores/Tatuador_1.png'}
                        alt={artista.nome}
                        onError={e => { e.target.style.display = 'none' }}
                      />
                      <div className="artist-info">
                        <h5>{artista.nome}</h5>
                        <p>{artista.role}</p>
                      </div>
                      <button onClick={() => showToast(`Chat com ${artista.nome} em breve!`, 'chat')}>
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
        <div key={ag.id} className="all-sessions-item" onClick={() => onAgendamentoClick(ag)}>
          <div className="all-sessions-item-img" style={{ backgroundImage: `url("${ag.imagemReferenciaUrl || getFallbackImage(ag.servico)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="all-sessions-item-content">
            <div className="all-sessions-item-header">
              <h4>{(ag.servico || 'Tatuagem').replace(/\s+com\s+.+$/i, '')}</h4>
              <div className={`session-date ${ag.status === 'AGENDADO' ? 'red' : 'gray'}`}>
                {formatDate(ag.dataHora)}
              </div>
            </div>
            <div className="all-sessions-item-details">
              <span><span className="material-symbols-outlined">person</span> {ag.artista?.nome || (ag.servico?.match(/com\s+(.+)$/i)?.[1]) || 'Artista'}</span>
              <span><span className="material-symbols-outlined">schedule</span> {formatTime(ag.dataHora)}</span>
              <span><span className="material-symbols-outlined">info</span> {ag.status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const SessionModalContent = ({ ag, onUpdate }) => {
  const [avaliacao, setAvaliacao] = useState(ag.avaliacao || 0)
  const [observacoes, setObservacoes] = useState(ag.observacoes || '')
  const [loading, setLoading] = useState(false)
  const [expandedImage, setExpandedImage] = useState(null)

  const handleUpdate = async (status) => {
    setLoading(true)
    await onUpdate(status, avaliacao, observacoes)
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

  const sessionDate = new Date(ag.dataHora);
  const now = new Date();
  const diffHours = (sessionDate - now) / (1000 * 60 * 60);
  const isCancellable = diffHours >= 24;

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

      {ag.status === 'AGENDADO' || ag.status === 'CONFIRMADO' ? (
        <>
          <p className="p-modal-note">Por favor, chegue com 15 minutos de antecedência.</p>
          {!isCancellable && (
            <p className="p-modal-note" style={{ color: '#ff6b7a', marginTop: '0.25rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>warning</span>
              Sessões com menos de 24 horas para o início não podem ser canceladas pelo sistema. Entre em contato com o estúdio.
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
                cursor: !isCancellable ? 'not-allowed' : 'pointer' 
              }}
            >
              Cancelar Sessão
            </button>
          </div>
        </>
      ) : ag.status === 'REALIZADO' ? (
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
            onClick={() => handleUpdate('FINALIZADO')}
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
