import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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

const Profile = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  const [toasts, setToasts] = useState([])
  const [modal, setModal] = useState({ isOpen: false, title: '', content: null, isImage: false })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!user.email) navigate('/login')
  }, [user.email, navigate])

  if (!user.email) return null

  const showToast = (message, icon = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, icon }])
  }

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))
  const openModal = (title, content, isImage = false) => setModal({ isOpen: true, title, content, isImage })
  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }))

  const handleAction = (action) => {
    switch(action) {
      case 'edit_profile': showToast('Abrindo editor de perfil...', 'edit'); break;
      case 'share': 
        navigator.clipboard.writeText('inkflow.com/perfil/' + (user.nome?.replace(/\s+/g, '-').toLowerCase() || ''))
        showToast('Link da Galeria Copiado!', 'content_copy')
        break;
      case 'chat_marcus': showToast('Abrindo chat com Marcus Vane...', 'chat'); break;
      case 'chat_elena': showToast('Abrindo chat com Elena K...', 'chat'); break;
      case 'referral':
        navigator.clipboard.writeText("INK-ALEX-2024").then(() => showToast('Código de indicação copiado!', 'loyalty'))
        break;
      case 'logout':
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        navigate('/login')
        break;
      default: break;
    }
  }

  const modalData = {
    'session_details': {
      title: 'Detalhes da Sessão',
      content: (
        <div className="p-modal-stack">
          <div className="p-modal-card border-red">
            <h4>Projeto</h4>
            <p>Conclusão de Braço (Parte 3)</p>
          </div>
          <div className="p-modal-grid">
            <div className="p-modal-card">
              <span>Data & Hora</span>
              <strong>24 Out, 2024<br/>14:00</strong>
            </div>
            <div className="p-modal-card">
              <span>Artista</span>
              <strong>Marcus Vane</strong>
            </div>
          </div>
          <p className="p-modal-note">Por favor, chegue com 15 minutos de antecedência. Certifique-se de ter feito uma boa refeição e se mantenha hidratado.</p>
        </div>
      )
    },
    'reschedule': {
      title: 'Solicitar Remarcação',
      content: (
        <>
          <p className="p-modal-text">Selecione um motivo para remarcar sua sessão com <strong>Elena K.</strong></p>
          <select className="p-modal-select">
            <option>Problemas de Saúde</option>
            <option>Conflito de Horário</option>
            <option>Preciso de mais tempo para me preparar</option>
          </select>
          <button className="p-btn-primary" onClick={() => { showToast('Solicitação enviada com sucesso!', 'check_circle'); closeModal(); }}>
            Enviar Solicitação
          </button>
        </>
      )
    },
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
            <div className="profile-avatar">{user.nome?.charAt(0)?.toUpperCase() || 'U'}</div>
            <div className="profile-badge"><span className="material-symbols-outlined">verified</span></div>
          </div>
          
          <div className="profile-info">
            <span className="profile-member">Membro Desde 2024</span>
            <h1 className="profile-name">{user.nome || 'Visitante'}</h1>
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
              <strong>3</strong>
              <span>Sessões</span>
            </div>
            <div className="stat-card">
              <strong>2</strong>
              <span>Artistas</span>
            </div>
            <div className="stat-card">
              <strong>12</strong>
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
              
              <div className="sessions-grid">
                <div className="session-card">
                  <div className="session-img" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC9rOn7CCrNd8SAovoAv1ZigtDS0Od507CHUKiPbsxuTfYsJWM3If1GqWedZgpjgYYfhKdSjCQq7-87NdVTW59__Tq43b1BTl9vPrURsZbiJbZuKV2KU8pU7jguvyKnW89VI1_D0S_wtcHhYksnayKzrjdWj5Rkaj4IEO_eXiI62o3tg8lPSNmsSmmp0phPahBZlgnJ4BqhWZKcuXmZfERS-ITHWejaw8jiJa2IU33vNimIJEqZc0ncXPwGNNMVa0VPTMhQwTnWt44")' }}></div>
                  <div className="session-content">
                    <div className="session-top">
                      <div>
                        <h4>Conclusão de Braço</h4>
                        <p>com <span>Marcus Vane</span></p>
                      </div>
                      <div className="session-date red">24 OUT</div>
                    </div>
                    <div className="session-meta">
                      <span><span className="material-symbols-outlined">schedule</span> 14:00</span>
                      <span><span className="material-symbols-outlined">hourglass_empty</span> 4 Horas</span>
                    </div>
                    <button className="p-btn-outline" onClick={() => openModal(modalData['session_details'].title, modalData['session_details'].content)}>Detalhes da Sessão</button>
                  </div>
                </div>

                <div className="session-card">
                  <div className="session-img" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCcbv1GcOVz1nvrRNkIc02e--3wJSmFfT6n_5cb4cxcI7Zf_S0tiIqpkW9Fz2DKgY_R5gX4J8aOn3MVxNoyMz5X_coZy2CH3F7t3umRa9kRyZ1FhNDnNBXRG2lEh3G2C3B7IWR6NVAcWmKKrApQIuJQx8Xp9t8vHsmpS-KKMgTRMx8m-v9Otxs1shCvhiSiaiQ8AsAeXDsVnto_-Zie35a5vBnB2hE3dQ9I3VAFHMFPI-n0TyjfLXgfn82e2k7fYbfe1hgGwKy2lAU")' }}></div>
                  <div className="session-content">
                    <div className="session-top">
                      <div>
                        <h4>Ombro Neo-Trad</h4>
                        <p>com <span>Elena K.</span></p>
                      </div>
                      <div className="session-date gray">12 NOV</div>
                    </div>
                    <div className="session-meta">
                      <span><span className="material-symbols-outlined">schedule</span> 10:30</span>
                      <span><span className="material-symbols-outlined">hourglass_empty</span> 3 Horas</span>
                    </div>
                    <button className="p-btn-secondary" onClick={() => openModal(modalData['reschedule'].title, modalData['reschedule'].content)}>Remarcar</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Minha Coleção */}
            <div className="profile-section">
              <div className="section-header">
                <h3><span className="material-symbols-outlined">auto_awesome_motion</span> Minha Coleção</h3>
                <a onClick={() => {}}>Galeria Completa</a>
              </div>
              <div className="gallery-layout">
                {[
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuCgpSHeNZxNCBjFuwnX1grKnlvGCEIFPHBleVd9QZTpx3vEIsiV1MGv-ASSulImMPB_zXvZXttJdMwh8uzDZM5ps4Yi2OQKO4PzxN2mauqxXuVCfb5Lbo0TdkltagkiKzSs9GAntw92Ly4rfEYalbLoTRRJRB5DZ9zDQwP03MzXhpjQ6tXso6S6ZM-iIRtz6buaYssdh4Erd3go-k_03GVuiriiT4IvN0uBahVN1exHgSmXGrwfdeCyI-cl1VHMgLTelVWGUJ3MHvw",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDYONo8UZd2SE6PPRGa7zoldUR4JzD0CgU8Qzk9Vn0VV8Jv5fUg7fQfEpXmQiNbD4OMsAFKOMwMAH__8UX4OEBBRWN_Nql_e3ahKim-oYdVZRsbTn6eChRhSxKgYrlTpifqua-DUZEE1I_9yvyo0w21ahzbD6QEid0qMBMjFPbsQUYv4DDlpuOz2Oygl_zvrpKkLGFkDGayGktYs05J6AtgUZ18pmnd_wsgDs_o0MCurIiOQLBErwCwBEoJVP3Aix2jwXf_OyoFdSo",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuATT6xdFVuG_lgYyop6RighNb1AX46na3HdnXJcSHhK0hKQH-TI_yTEcoT3z1qOcnuSzqPLc9qtP2bhx7uSc8qVlFbykackNDQhggwbymURTcpsmYqp_P4nj83xLsmbRCDcdt-4ixMqZ5lRXPJrk61U1Kg6Z75Fpmzt8g0WK9_8JxghbG8HVUrCv77KZLi3aMbg9wTKJyll7I-DRtdmpxsjJCgG9kqcjA-DdtLvJhy2avvFN4--PoI0e5WyUxRApzFvXHM9DrVQtOk",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuA-LLnq3e7wmZa8GGBC7AYSPNaNsyX-5sOJv0BLpjazg2f7K0EYywM4LzI4Keq6g6-Toh2o7Q1rr_oWgkoWE0Qj-1hdis3PTMyYrdrv22XO421cgYaUtBqivyMiTZiDwTA6CEF9hPFVU-ZYBGf0-W64yDAhcPJnx4q_hHLNcqlXaPXSRgXTufb_87ZV-FGT5fxVgULZCTaK12wnirBEq9juG-yIXC1C9TRnvKwkw5GQlmo_BX2fXWHwYntlxIFQfMQuU8HsrmZZC9U"
                ].map((src, i) => (
                  <div key={i} className="gallery-item" onClick={() => openModal('Visualização', <img src={src} className="gallery-modal-img" />, true)}>
                    <img src={src} alt="Tattoo Gallery" />
                    <div className="gallery-overlay"><span className="material-symbols-outlined">zoom_in</span></div>
                  </div>
                ))}
              </div>
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
                  <div className="guide-text">
                    <h5>Primeiras 24 Horas</h5>
                    <p>Lidando com plasma e plástico</p>
                  </div>
                  <span className="material-symbols-outlined guide-arrow">arrow_forward</span>
                </div>
                <div className="guide-item" onClick={() => openModal(modalData['guide_2'].title, modalData['guide_2'].content)}>
                  <div className="guide-icon"><span className="material-symbols-outlined">soap</span></div>
                  <div className="guide-text">
                    <h5>Lavar & Proteger</h5>
                    <p>Tipos de sabonete e hidratação</p>
                  </div>
                  <span className="material-symbols-outlined guide-arrow">arrow_forward</span>
                </div>
                <div className="guide-item" onClick={() => openModal(modalData['guide_3'].title, modalData['guide_3'].content)}>
                  <div className="guide-icon"><span className="material-symbols-outlined">sunny</span></div>
                  <div className="guide-text">
                    <h5>Cuidados a Longo Prazo</h5>
                    <p>Filtro solar e longevidade</p>
                  </div>
                  <span className="material-symbols-outlined guide-arrow">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* My Artists */}
            <div className="profile-section">
              <div className="section-header">
                <h3><span className="material-symbols-outlined">group</span> Meus Artistas</h3>
              </div>
              <div className="artists-list">
                <div className="artist-item">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmL3UTPlHIjQKp4Po0YxsNjxzwgyB-NGNGUiaAQWorN-KbrVzk2YJCUq6guz-ZkwIM5PxM-kzJ0_AzT8lVjRPABv6gmOzUGCltq7_FlP7Z_qmlX6xkguEAcaT_IIwynvH5tx8fKU3bAfVgQhrYFA1Y5K0ZEuBP-VDT5iX5AO31QUlS3vn1VKOHuxwpVqDrBEaITfU1SfSxK-gvUkmtJDfqRwQyU3cjq8mfZygrIgL2JTQ_vbZoUPGgRZ4pGoQ5w7ksIbmpHmO1BOI" alt="Marcus Vane" />
                  <div className="artist-info">
                    <h5>Marcus Vane</h5>
                    <p>Especialista Blackwork</p>
                  </div>
                  <button onClick={() => handleAction('chat_marcus')}><span className="material-symbols-outlined">chat_bubble</span></button>
                </div>
                <div className="artist-item">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtF0jjQzt1mm59JECkf795K9PUwWO9bC9FSvCuRhThSluwdXxvRQzCoPlkcOFsgTBBUyOYHBHQctAPKPhTJ685MzPZPCdnAFHrq3uMdf4gRa14orLTAP27fbBXpnJ6srNtoraefd5-IfL6B1z9ebY_ZPi_trjKiQYq_wk4GtfamOq6IQ5_eUuszJDv3jU1QeTofjlPEfFdgzWeHw4kE80x50wIG3zTB3_yr3YZ8Zam23K0lyf_yvsTrvB8P9VYV58SU5t4dInh4R8" alt="Elena K." />
                  <div className="artist-info">
                    <h5>Elena K.</h5>
                    <p>Neo-Tradicional</p>
                  </div>
                  <button onClick={() => handleAction('chat_elena')}><span className="material-symbols-outlined">chat_bubble</span></button>
                </div>
              </div>
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

      {/* Toasts */}
      <div className="p-toasts-container">
        {toasts.map(toast => <Toast key={toast.id} {...toast} onExit={() => removeToast(toast.id)} />)}
      </div>
    </div>
  )
}

export default Profile