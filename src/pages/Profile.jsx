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

const Profile = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const [toasts, setToasts] = useState([])
  const [modal, setModal] = useState({ isOpen: false, title: '', content: null, isImage: false })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [agendamentos, setAgendamentos] = useState([])
  const [loadingAg, setLoadingAg] = useState(true)
  const [editProfile, setEditProfile] = useState({ isOpen: false, nome: '', telefone: '', saving: false })
  const settingsRef = useRef(null)

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

  const proximas = agendamentos.filter(a => a.status === 'AGENDADO' || a.status === 'CONFIRMADO' || a.status === 'EM_ANDAMENTO')
  const colecao = agendamentos.filter(a => a.status === 'REALIZADO')
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
      case 'logout':
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        navigate('/login')
        break
      default: break
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
      showToast('Erro ao atualizar sessão. Verifique sua conexão.', 'error')
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
            <div className="profile-avatar">{user.nome?.charAt(0)?.toUpperCase() || user.fullName?.charAt(0)?.toUpperCase() || 'U'}</div>
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
              <div className="p-settings-wrap" ref={settingsRef}>
                <button className="p-btn-settings" onClick={() => setSettingsOpen(prev => !prev)}>
                  <span className="material-symbols-outlined">settings</span>
                </button>
                {settingsOpen && (
                  <div className="p-settings-dropdown">
                    <button onClick={() => handleAction('logout')}>
                      <span className="material-symbols-outlined">logout</span>
                      Sair da Conta
                    </button>
                  </div>
                )}
              </div>
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
                <a onClick={() => {}}>Ver Todas</a>
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
                  {proximas.map(ag => (
                    <div key={ag.id} className="session-card">
                      <div className="session-img" style={{ backgroundImage: 'url("/assets/portifolio_novo/Rosto.webp")', backgroundSize: 'cover' }}></div>
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

const SessionModalContent = ({ ag, onUpdate }) => {
  const [avaliacao, setAvaliacao] = useState(ag.avaliacao || 0)
  const [observacoes, setObservacoes] = useState(ag.observacoes || '')
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (status) => {
    setLoading(true)
    await onUpdate(status, avaliacao, observacoes)
    setLoading(false)
  }

  const statusLabel = {
    'AGENDADO': 'Agendada',
    'CONFIRMADO': 'Confirmada',
    'EM_ANDAMENTO': 'Em Andamento',
    'REALIZADO': 'Realizada',
    'CANCELADO': 'Cancelada',
  }

  return (
    <div className="p-modal-stack">
      <div className="p-modal-card border-red">
        <h4>Serviço</h4>
        <p>{(ag.servico || 'Tatuagem').replace(/\s+com\s+.+$/i, '')}{ag.artista?.nome ? ` com ${ag.artista.nome}` : ''}</p>
      </div>
      <div className="p-modal-grid">
        <div className="p-modal-card">
          <span>Data & Hora</span>
          <strong>{new Date(ag.dataHora).toLocaleDateString('pt-BR')}<br/>{new Date(ag.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</strong>
        </div>
        <div className="p-modal-card">
          <span>Artista</span>
          <strong>{ag.artista?.nome || '—'}</strong>
        </div>
      </div>
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
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              className="p-btn-primary"
              disabled={loading}
              onClick={() => handleUpdate('REALIZADO')}
              style={{ flex: 1 }}
            >
              Marcar como Realizada
            </button>
            <button
              className="p-btn-secondary"
              disabled={loading}
              onClick={() => handleUpdate('CANCELADO')}
              style={{ flex: 1 }}
            >
              Cancelar Sessão
            </button>
          </div>
        </>
      ) : ag.status === 'REALIZADO' ? (
        <>
          <div className="p-modal-card">
            <span>Avaliação do Artista</span>
            <StarRating value={avaliacao} onChange={setAvaliacao} />
          </div>
          <button className="p-btn-primary" disabled={loading} onClick={() => handleUpdate('REALIZADO')}>
            Salvar Avaliação
          </button>
        </>
      ) : null}
    </div>
  )
}

export default Profile
