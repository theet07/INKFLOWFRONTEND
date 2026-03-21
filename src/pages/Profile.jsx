import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { clienteService } from '../services/inkflowApi'
import './Profile.css' // We import the custom scrollbar and animation CSS here

const Toast = ({ message, icon, onExit }) => {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Start exit animation after 2.7s
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
    }, 2700)
    
    // Actually remove the component after 3s total
    const removeTimer = setTimeout(() => {
      onExit()
    }, 3000)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(removeTimer)
    }
  }, [onExit])

  return (
    <div className={`flex items-center gap-3 px-6 py-4 bg-[#121212] border border-white/10 text-white font-bold tracking-widest uppercase text-[10px] rounded shadow-2xl ${isExiting ? 'toast-exit' : 'toast-enter'}`}>
      <span className="material-symbols-outlined text-[#ff0000]">{icon}</span>
      <span>{message}</span>
    </div>
  )
}

const Profile = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  // Custom states for the new design
  const [toasts, setToasts] = useState([])
  const [modal, setModal] = useState({ isOpen: false, title: '', content: null, isImage: false })

  // Ensure this page is only accessible if logged in
  useEffect(() => {
    if (!user.email) {
      navigate('/login')
    }
  }, [user.email, navigate])

  if (!user.email) return null

  // --- Helpers ---
  const showToast = (message, icon = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, icon }])
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const openModal = (title, content, isImage = false) => {
    setModal({ isOpen: true, title, content, isImage })
  }

  const closeModal = () => {
    // We add a slight delay to allow exit animations if we want, or just hide immediately.
    setModal(prev => ({ ...prev, isOpen: false }))
  }

  // --- Handlers ---
  const handleAction = (action) => {
    switch(action) {
      case 'edit_profile':
        showToast('Abrindo editor de perfil...', 'edit')
        break
      case 'share':
        navigator.clipboard.writeText('inkflow.com/perfil/' + (user.nome?.replace(/\s+/g, '-').toLowerCase() || ''))
        showToast('Link da Galeria Copiado!', 'content_copy')
        break
      case 'notifications':
        showToast('Você tem 0 novas notificações', 'notifications')
        break
      case 'settings':
        showToast('Abrindo configurações...', 'settings')
        break
      case 'chat_marcus':
        showToast('Abrindo chat com Marcus Vane...', 'chat')
        break
      case 'chat_elena':
        showToast('Abrindo chat com Elena K...', 'chat')
        break
      case 'referral':
        const code = "INK-ALEX-2024"
        navigator.clipboard.writeText(code).then(() => {
          showToast('Código de indicação copiado!', 'loyalty')
        })
        break
      case 'logout':
        localStorage.removeItem('user')
        navigate('/login')
        break
      default:
        break
    }
  }

  // Modals Content Map
  const modalData = {
    'session_details': {
      title: 'Detalhes da Sessão',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-lg border border-[#ff0000]/20">
            <h4 className="text-[#ff0000] font-bold uppercase tracking-widest text-xs mb-1">Projeto</h4>
            <p className="text-white text-lg font-black">Conclusão de Braço (Parte 3)</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <span className="block text-slate-500 text-[10px] uppercase font-bold mb-1">Data & Hora</span>
              <span className="text-white">24 Out, 2024<br/>14:00</span>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <span className="block text-slate-500 text-[10px] uppercase font-bold mb-1">Artista</span>
              <span className="text-white">Marcus Vane</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 italic">Por favor, chegue com 15 minutos de antecedência. Certifique-se de ter feito uma boa refeição e se mantenha hidratado.</p>
        </div>
      )
    },
    'reschedule': {
      title: 'Solicitar Remarcação',
      content: (
        <>
          <p className="mb-4 text-slate-300">Selecione um motivo para remarcar sua sessão com <strong>Elena K.</strong></p>
          <select className="w-full bg-black border border-white/20 rounded p-3 text-white mb-4 outline-none focus:border-[#ff0000]">
            <option>Problemas de Saúde</option>
            <option>Conflito de Horário</option>
            <option>Preciso de mais tempo para me preparar</option>
          </select>
          <button 
            className="w-full bg-[#ff0000] text-white font-black uppercase text-xs tracking-widest px-6 py-3 rounded hover:bg-red-700 transition-all"
            onClick={() => {
              showToast('Solicitação enviada com sucesso!', 'check_circle')
              closeModal()
            }}
          >
            Enviar Solicitação
          </button>
        </>
      )
    },
    'guide_1': {
      title: 'Guia: Primeiras 24 Horas',
      content: (
        <ul className="space-y-3 list-disc pl-5 text-slate-300">
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
          <p className="mb-3 text-slate-300">Para os dias 2-14, siga esta rotina com cuidado:</p>
          <ul className="space-y-3 list-disc pl-5 text-slate-300">
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
          <p className="mb-3 text-slate-300">Como manter sua tinta vibrante por anos:</p>
          <ul className="space-y-3 list-disc pl-5 text-slate-300">
            <li>Sempre aplique protetor solar FPS 50+ quando expor sua tatuagem à luz solar direta.</li>
            <li>Mantenha a pele hidratada diariamente após o banho.</li>
            <li>Mantenha-se hidratado! Pele saudável significa tatuagens com aparência saudável.</li>
            <li>Evite imersão prolongada (piscinas, mar) até que a tatuagem esteja 100% totalmente cicatrizada (geralmente 3-4 semanas).</li>
          </ul>
        </>
      )
    }
  }

  return (
    <div className="profile-page-root bg-[#000000] text-slate-100 font-display min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        
        <main className="flex-1 px-6 pt-28 pb-8 lg:px-20 max-w-[1400px] mx-auto w-full">
          {/* Profile Header Section */}
          <section className="mb-10 flex flex-col md:flex-row gap-8 items-center md:items-end">
            <div className="relative">
              <div className="size-32 md:size-40 rounded-full border-4 border-[#ff0000] overflow-hidden bg-[#1a1a1a] flex items-center justify-center text-5xl font-black">
                {user.nome?.charAt(0)?.toUpperCase()}
              </div>
              <div className="absolute bottom-1 right-1 bg-[#ff0000] text-black size-8 rounded-full flex items-center justify-center border-4 border-black">
                <span className="material-symbols-outlined text-sm font-bold">verified</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-[#ff0000] font-bold uppercase tracking-[0.2em] text-xs mb-2">Membro Desde 2024</p>
              <h1 className="text-white text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none mb-4">{user.nome || 'Visitante'}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button 
                  className="bg-[#ff0000] text-white font-black uppercase text-xs tracking-widest px-6 py-3 rounded hover:bg-red-700 transition-all flex items-center gap-2" 
                  onClick={() => handleAction('edit_profile')}
                >
                  <span className="material-symbols-outlined text-sm">edit</span> Editar Perfil
                </button>
                <button 
                  className="bg-white/10 text-white font-black uppercase text-xs tracking-widest px-6 py-3 rounded hover:bg-white/20 transition-all" 
                  onClick={() => handleAction('share')}
                >
                  Compartilhar Galeria
                </button>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex-1 md:w-28 flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                <span className="text-3xl font-black text-[#ff0000]">3</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Sessões</span>
              </div>
              <div className="flex-1 md:w-28 flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                <span className="text-3xl font-black text-[#ff0000]">2</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Artistas</span>
              </div>
              <div className="flex-1 md:w-28 flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                <span className="text-3xl font-black text-[#ff0000]">12</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Tattoos</span>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Upcoming Sessions */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ff0000]">calendar_today</span> Próximas Sessões
                  </h3>
                  <a className="text-[#ff0000] text-xs font-bold uppercase tracking-widest hover:underline cursor-pointer">Ver Todas</a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Session Card 1 */}
                  <div className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#ff0000]/50 transition-all">
                    <div className="h-32 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC9rOn7CCrNd8SAovoAv1ZigtDS0Od507CHUKiPbsxuTfYsJWM3If1GqWedZgpjgYYfhKdSjCQq7-87NdVTW59__Tq43b1BTl9vPrURsZbiJbZuKV2KU8pU7jguvyKnW89VI1_D0S_wtcHhYksnayKzrjdWj5Rkaj4IEO_eXiI62o3tg8lPSNmsSmmp0phPahBZlgnJ4BqhWZKcuXmZfERS-ITHWejaw8jiJa2IU33vNimIJEqZc0ncXPwGNNMVa0VPTMhQwTnWt44")' }}></div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-white font-bold text-lg uppercase leading-tight">Conclusão de Braço</h4>
                          <p className="text-slate-400 text-sm">com <span className="text-[#ff0000] font-semibold">Marcus Vane</span></p>
                        </div>
                        <div className="bg-[#ff0000] text-white text-[10px] font-black px-2 py-1 rounded">24 OUT</div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400 font-medium mb-6">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> 14:00</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">hourglass_empty</span> 4 Horas</span>
                      </div>
                      <button 
                        className="w-full py-2 border border-[#ff0000] text-[#ff0000] group-hover:bg-[#ff0000] group-hover:text-white transition-all text-xs font-black uppercase tracking-widest rounded"
                        onClick={() => openModal(modalData['session_details'].title, modalData['session_details'].content)}
                      >
                        Detalhes da Sessão
                      </button>
                    </div>
                  </div>

                  {/* Session Card 2 */}
                  <div className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#ff0000]/50 transition-all">
                    <div className="h-32 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCcbv1GcOVz1nvrRNkIc02e--3wJSmFfT6n_5cb4cxcI7Zf_S0tiIqpkW9Fz2DKgY_R5gX4J8aOn3MVxNoyMz5X_coZy2CH3F7t3umRa9kRyZ1FhNDnNBXRG2lEh3G2C3B7IWR6NVAcWmKKrApQIuJQx8Xp9t8vHsmpS-KKMgTRMx8m-v9Otxs1shCvhiSiaiQ8AsAeXDsVnto_-Zie35a5vBnB2hE3dQ9I3VAFHMFPI-n0TyjfLXgfn82e2k7fYbfe1hgGwKy2lAU")' }}></div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-white font-bold text-lg uppercase leading-tight">Ombro Neo-Trad</h4>
                          <p className="text-slate-400 text-sm">com <span className="text-[#ff0000] font-semibold">Elena K.</span></p>
                        </div>
                        <div className="bg-white/10 text-slate-300 text-[10px] font-black px-2 py-1 rounded uppercase">12 NOV</div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400 font-medium mb-6">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> 10:30</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">hourglass_empty</span> 3 Horas</span>
                      </div>
                      <button 
                        className="w-full py-2 bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded transition-all group-hover:bg-transparent group-hover:border group-hover:border-white/20 group-hover:text-white/60"
                        onClick={() => openModal(modalData['reschedule'].title, modalData['reschedule'].content)}
                      >
                        Remarcar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Artwork Grid */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ff0000]">auto_awesome_motion</span> Minha Coleção
                  </h3>
                  <a className="text-[#ff0000] text-xs font-bold uppercase tracking-widest hover:underline cursor-pointer">Galeria Completa</a>
                </div>
                
                <div className="flex flex-wrap gap-3 lg:gap-4">
                  {[
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCgpSHeNZxNCBjFuwnX1grKnlvGCEIFPHBleVd9QZTpx3vEIsiV1MGv-ASSulImMPB_zXvZXttJdMwh8uzDZM5ps4Yi2OQKO4PzxN2mauqxXuVCfb5Lbo0TdkltagkiKzSs9GAntw92Ly4rfEYalbLoTRRJRB5DZ9zDQwP03MzXhpjQ6tXso6S6ZM-iIRtz6buaYssdh4Erd3go-k_03GVuiriiT4IvN0uBahVN1exHgSmXGrwfdeCyI-cl1VHMgLTelVWGUJ3MHvw",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDYONo8UZd2SE6PPRGa7zoldUR4JzD0CgU8Qzk9Vn0VV8Jv5fUg7fQfEpXmQiNbD4OMsAFKOMwMAH__8UX4OEBBRWN_Nql_e3ahKim-oYdVZRsbTn6eChRhSxKgYrlTpifqua-DUZEE1I_9yvyo0w21ahzbD6QEid0qMBMjFPbsQUYv4DDlpuOz2Oygl_zvrpKkLGFkDGayGktYs05J6AtgUZ18pmnd_wsgDs_o0MCurIiOQLBErwCwBEoJVP3Aix2jwXf_OyoFdSo",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuATT6xdFVuG_lgYyop6RighNb1AX46na3HdnXJcSHhK0hKQH-TI_yTEcoT3z1qOcnuSzqPLc9qtP2bhx7uSc8qVlFbykackNDQhggwbymURTcpsmYqp_P4nj83xLsmbRCDcdt-4ixMqZ5lRXPJrk61U1Kg6Z75Fpmzt8g0WK9_8JxghbG8HVUrCv77KZLi3aMbg9wTKJyll7I-DRtdmpxsjJCgG9kqcjA-DdtLvJhy2avvFN4--PoI0e5WyUxRApzFvXHM9DrVQtOk",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuA-LLnq3e7wmZa8GGBC7AYSPNaNsyX-5sOJv0BLpjazg2f7K0EYywM4LzI4Keq6g6-Toh2o7Q1rr_oWgkoWE0Qj-1hdis3PTMyYrdrv22XO421cgYaUtBqivyMiTZiDwTA6CEF9hPFVU-ZYBGf0-W64yDAhcPJnx4q_hHLNcqlXaPXSRgXTufb_87ZV-FGT5fxVgULZCTaK12wnirBEq9juG-yIXC1C9TRnvKwkw5GQlmo_BX2fXWHwYntlxIFQfMQuU8HsrmZZC9U"
                  ].map((src, i) => (
                    <div 
                      key={i}
                      className="w-[140px] md:w-[160px] lg:w-[180px] xl:w-[200px] flex-shrink-0 aspect-[4/5] bg-white/5 rounded-xl overflow-hidden group relative cursor-pointer"
                      onClick={() => openModal('Visualização', <img src={src} className="w-full h-auto rounded-lg mx-auto" style={{ maxHeight: '70vh', objectFit: 'contain' }} />, true)}
                    >
                      <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={src} alt="Tattoo Gallery" />
                      <div className="absolute inset-0 bg-[#ff0000]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="material-symbols-outlined text-white">zoom_in</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Care Guides & Artists */}
            <div className="space-y-8">
              {/* Care Guides */}
              <div className="bg-[#ff0000]/5 border border-[#ff0000]/20 rounded-2xl p-6">
                <h3 className="text-white text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ff0000]">medical_services</span> Guias de Cuidados
                </h3>
                <div className="space-y-3">
                  <div 
                    className="p-4 bg-black/40 border border-white/5 rounded-xl flex items-center gap-4 group cursor-pointer hover:border-[#ff0000]/40 transition-all" 
                    onClick={() => openModal(modalData['guide_1'].title, modalData['guide_1'].content)}
                  >
                    <div className="size-10 bg-[#ff0000]/10 rounded-lg flex items-center justify-center text-[#ff0000]">
                      <span className="material-symbols-outlined">water_drop</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-white text-sm font-bold uppercase leading-none mb-1">Primeiras 24 Horas</h5>
                      <p className="text-slate-400 text-[10px]">Lidando com plasma e plástico</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-500 text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                  
                  <div 
                    className="p-4 bg-black/40 border border-white/5 rounded-xl flex items-center gap-4 group cursor-pointer hover:border-[#ff0000]/40 transition-all" 
                    onClick={() => openModal(modalData['guide_2'].title, modalData['guide_2'].content)}
                  >
                    <div className="size-10 bg-[#ff0000]/10 rounded-lg flex items-center justify-center text-[#ff0000]">
                      <span className="material-symbols-outlined">soap</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-white text-sm font-bold uppercase leading-none mb-1">Lavar & Proteger</h5>
                      <p className="text-slate-400 text-[10px]">Tipos de sabonete e hidratação</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-500 text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                  
                  <div 
                    className="p-4 bg-black/40 border border-white/5 rounded-xl flex items-center gap-4 group cursor-pointer hover:border-[#ff0000]/40 transition-all" 
                    onClick={() => openModal(modalData['guide_3'].title, modalData['guide_3'].content)}
                  >
                    <div className="size-10 bg-[#ff0000]/10 rounded-lg flex items-center justify-center text-[#ff0000]">
                      <span className="material-symbols-outlined">sunny</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-white text-sm font-bold uppercase leading-none mb-1">Cuidados a Longo Prazo</h5>
                      <p className="text-slate-400 text-[10px]">Filtro solar e longevidade</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-500 text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </div>
              </div>

              {/* My Artists */}
              <div>
                <h3 className="text-white text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ff0000]">group</span> Meus Artistas
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                    <img className="size-12 rounded-full border border-[#ff0000]/30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmL3UTPlHIjQKp4Po0YxsNjxzwgyB-NGNGUiaAQWorN-KbrVzk2YJCUq6guz-ZkwIM5PxM-kzJ0_AzT8lVjRPABv6gmOzUGCltq7_FlP7Z_qmlX6xkguEAcaT_IIwynvH5tx8fKU3bAfVgQhrYFA1Y5K0ZEuBP-VDT5iX5AO31QUlS3vn1VKOHuxwpVqDrBEaITfU1SfSxK-gvUkmtJDfqRwQyU3cjq8mfZygrIgL2JTQ_vbZoUPGgRZ4pGoQ5w7ksIbmpHmO1BOI" alt="Marcus Vane" />
                    <div className="flex-1">
                      <h5 className="text-white font-bold text-sm">Marcus Vane</h5>
                      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Especialista Blackwork</p>
                    </div>
                    <button 
                      className="size-8 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-[#ff0000] transition-colors" 
                      onClick={(e) => { e.stopPropagation(); handleAction('chat_marcus') }}
                    >
                      <span className="material-symbols-outlined text-sm">chat_bubble</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                    <img className="size-12 rounded-full border border-[#ff0000]/30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtF0jjQzt1mm59JECkf795K9PUwWO9bC9FSvCuRhThSluwdXxvRQzCoPlkcOFsgTBBUyOYHBHQctAPKPhTJ685MzPZPCdnAFHrq3uMdf4gRa14orLTAP27fbBXpnJ6srNtoraefd5-IfL6B1z9ebY_ZPi_trjKiQYq_wk4GtfamOq6IQ5_eUuszJDv3jU1QeTofjlPEfFdgzWeHw4kE80x50wIG3zTB3_yr3YZ8Zam23K0lyf_yvsTrvB8P9VYV58SU5t4dInh4R8" alt="Elena K." />
                    <div className="flex-1">
                      <h5 className="text-white font-bold text-sm">Elena K.</h5>
                      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Neo-Tradicional</p>
                    </div>
                    <button 
                      className="size-8 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-[#ff0000] transition-colors" 
                      onClick={(e) => { e.stopPropagation(); handleAction('chat_elena') }}
                    >
                      <span className="material-symbols-outlined text-sm">chat_bubble</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Promo Card */}
              <div className="relative overflow-hidden rounded-2xl bg-[#ff0000] p-6">
                <div className="relative z-10">
                  <h4 className="text-white text-2xl font-black italic uppercase leading-tight mb-2">Indique um Amigo</h4>
                  <p className="text-white/80 text-sm font-medium mb-6">Ganhe 20% off na sua próxima sessão ao indicar outro entusiasta da tatuagem.</p>
                  <button 
                    className="bg-black text-white font-black uppercase text-[10px] tracking-widest px-6 py-3 rounded hover:bg-gray-900 transition-colors"
                    onClick={() => handleAction('referral')}
                  >
                    Pegar Código de Indicação
                  </button>
                </div>
                <div className="absolute -bottom-4 -right-4 opacity-10">
                  <span className="material-symbols-outlined text-[120px] rotate-12">loyalty</span>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* ================= MODAL OVERLAY ================= */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeModal}
          ></div>
          <div className={`relative z-10 w-full ${modal.isImage ? 'max-w-3xl' : 'max-w-lg'} rounded-2xl bg-[#121212] border border-white/10 p-6 shadow-2xl transform transition-transform scale-100 opacity-100 duration-300`}>
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
              <h3 className="text-xl font-black uppercase italic text-white">{modal.title}</h3>
              <button 
                className="text-slate-400 hover:text-[#ff0000] transition-colors size-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
                onClick={closeModal}
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="text-slate-300 text-sm leading-relaxed custom-scrollbar max-h-[70vh] overflow-y-auto pr-2">
               {modal.content}
            </div>
          </div>
        </div>
      )}

      {/* ================= TOAST CONTAINER ================= */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            message={toast.message} 
            icon={toast.icon} 
            onExit={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </div>
  )
}

export default Profile