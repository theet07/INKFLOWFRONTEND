import { useState, useEffect, useRef } from 'react'
import { leadService } from '../../services/inkflowApi'
import './ArtistLandingPage.css'

const ArtistLandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null)
  const [toasts, setToasts] = useState([])
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const [lightboxImg, setLightboxImg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    nomeEstudio: '',
    email: '',
    whatsapp: '',
    especialidade: ''
  })
  const revealRefs = useRef([])
  const registerRef = useRef(null)

  // FAQ Accordion Data
  const faqData = [
    {
      q: "Quanto custa usar o InkFlow?",
      a: "O InkFlow funciona por assinatura. Mas para você começar com tudo, oferecemos os 3 primeiros meses totalmente grátis. Depois disso, você escolhe o plano que melhor se adapta ao seu volume de trabalho."
    },
    {
      q: "Preciso ter um estúdio físico para me cadastrar?",
      a: "Não! O InkFlow foi feito para artistas residentes, donos de estúdios e também para quem atende em estúdios privados (Sullen/Private). O foco é a sua gestão."
    },
    {
      q: "Como recebo as solicitações de agendamento?",
      a: "Tudo centralizado! Você recebe notificações no seu Dashboard e por e-mail. Você tem total liberdade para aceitar, recusar ou solicitar mais informações antes de confirmar."
    },
    {
      q: "O InkFlow cobra comissão por cada tatuagem?",
      a: "Não cobramos comissão sobre o valor da sua arte. O valor da sua tattoo é 100% seu. Nossa plataforma é uma ferramenta de produtividade, não um intermediário de pagamentos."
    },
    {
      q: "Posso importar meu portfólio do Instagram?",
      a: "Sim! Nossa vitrine digital foi desenhada para que você suba suas fotos em alta resolução de forma simples, criando um catálogo profissional em minutos."
    }
  ]

  // Reveal on Scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    )

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el)
    }
  }

  const showToast = (msg, isError = false) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, msg, isError }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  const formatTelefone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'whatsapp' ? formatTelefone(value) : value
    })
  }

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const scrollToRegister = () => {
    registerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await leadService.criarLeadArtista(formData)
      setSubmitSuccess(true)
    } catch (err) {
      console.error('Erro ao cadastrar lead:', err)
      const errorMsg = err.response?.data?.error || 'Erro ao cadastrar. Tente novamente.'
      showToast(errorMsg, true)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ nomeCompleto: '', nomeEstudio: '', email: '', whatsapp: '', especialidade: '' })
    setSubmitSuccess(false)
  }

  return (
    <div className="alp-container">
      <main className="alp-main">
        
        {/* Hero Section */}
        <section className="alp-section reveal-on-scroll" ref={addToRefs}>
          <div className="alp-hero">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="alp-badge">
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>local_fire_department</span>
                InkFlow For Artists
              </div>
              <h1 className="alp-headline" style={{ fontSize: 'var(--fs-hero, 4rem)', fontWeight: 900, lineHeight: 1.1 }}>
                Sua arte, nossa gestão. <br/>
                <span className="alp-text-gradient">Tatue mais, burocrateie menos.</span>
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--on-surface-variant)', maxWidth: '600px', lineHeight: 1.6 }}>
                A plataforma definitiva para estúdios privados. Centralize agendamentos, gerencie portfólios e elimine o caos do WhatsApp. Foco total na agulha.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="alp-btn-primary" onClick={scrollToRegister}>
                  Criar Conta Grátis
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button className="alp-btn-secondary" onClick={() => setIsDemoOpen(true)}>
                  Ver Demonstração
                </button>
              </div>
            </div>
            
            <div className="alp-hero-image-container alp-ambient-glow">
              <img 
                className="alp-hero-image" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhMn3T-nm6sbjP3vAT_DDwxg0JmTKtT8CZHnfQFaxXbkEV3qQw_RQp4W02KwMO6k5vj3YCNXVBDjIyE1xNHQk2vY4hUVPueTmaUGXx6g70LB7dIgyxTvYQB67inRWeryu6TFH2dr4XXyB7ZFvS38hygZmWBYOl1BQ1GZDlwJuwYAw1zRHcKgidX4m32HLWLrp9pPnWjigqbhs5hWfxtagFtwkLWwBN1pMvw1Y2-_9oSUAe0IkALIG4Bd_Y3o_gSnlAUbVhYpFXVxI" 
                alt="Artist Working"
              />
              <div className="alp-glass-panel" style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', padding: '1.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="alp-icon-box" style={{ marginBottom: 0, width: '3rem', height: '3rem' }}>
                  <span className="material-symbols-outlined">calendar_month</span>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Oferta de Lançamento</p>
                  <p style={{ fontWeight: 700 }}>Comece sem pagar nada.</p>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <p style={{ color: 'var(--primary-red)', fontWeight: 600 }}>3 Meses</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Grátis</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Bar */}
        <div className="alp-social-proof reveal-on-scroll" ref={addToRefs}>
          <div className="alp-section" style={{ padding: '2rem 1.5rem' }}>
            <div className="alp-stats-grid">
              <div className="alp-stat-item">
                <h3 className="alp-headline" style={{ fontSize: '2.5rem', fontWeight: 900 }}>+50.000</h3>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '2px' }}>Agendamentos</p>
              </div>
              <div className="alp-stat-item">
                <h3 className="alp-headline alp-text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900 }}>Zero</h3>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '2px' }}>Conflito de Horários</p>
              </div>
              <div className="alp-stat-item">
                <h3 className="alp-headline" style={{ fontSize: '2.5rem', fontWeight: 900 }}>+40%</h3>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '2px' }}>Tempo Economizado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Section */}
        <section className="alp-section">
          <div className="reveal-on-scroll" ref={addToRefs} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="alp-headline" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem' }}>O fluxo perfeito para o estúdio moderno.</h2>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto' }}>Esqueça mensagens perdidas. Conduza seus clientes por uma experiênia premium desde o primeiro contato.</p>
          </div>
          
          <div className="alp-bento-grid">
            <div className="alp-card reveal-on-scroll alp-delay-100" ref={addToRefs}>
              <div>
                <div className="alp-icon-box">
                  <span className="material-symbols-outlined">person_pin</span>
                </div>
                <h3 className="alp-headline" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Profile</h3>
                <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>Seu portfólio profissional em uma única página. Mostre seu trabalho, defina suas regras e deixe claro quando você está disponível — sem precisar repetir as mesmas informações mil vezes.</p>
              </div>
              <div 
                style={{ position: 'relative', height: '220px', borderRadius: '4px', marginTop: '2rem', overflow: 'hidden', cursor: 'zoom-in' }}
                onClick={() => setLightboxImg('/assets/Para_Tatuadores_Ref/Configurações.webp')}
                onMouseEnter={(e) => e.currentTarget.querySelector('.hover-overlay').style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.querySelector('.hover-overlay').style.opacity = '0'}
              >
                <img src="/assets/Para_Tatuadores_Ref/Configurações.webp" alt="Configurações" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                <div className="hover-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#fff' }}>zoom_in</span>
                </div>
              </div>
            </div>

            <div className="alp-card reveal-on-scroll alp-delay-200" ref={addToRefs} style={{ transform: 'translateY(-2rem)' }}>
              <div>
                <div className="alp-icon-box">
                  <span className="material-symbols-outlined">photo_library</span>
                </div>
                <h3 className="alp-headline" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. Portfolio</h3>
                <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>Galeria de alta resolução categorizada. Permita que clientes encontrem a inspiração perfeita.</p>
              </div>
              <div 
                style={{ position: 'relative', height: '220px', borderRadius: '4px', marginTop: '2rem', overflow: 'hidden', cursor: 'zoom-in' }}
                onClick={() => setLightboxImg('/assets/Para_Tatuadores_Ref/Portfólio.webp')}
                onMouseEnter={(e) => e.currentTarget.querySelector('.hover-overlay').style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.querySelector('.hover-overlay').style.opacity = '0'}
              >
                <img src="/assets/Para_Tatuadores_Ref/Portfólio.webp" alt="Portfólio" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                <div className="hover-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#fff' }}>zoom_in</span>
                </div>
              </div>
            </div>

            <div className="alp-card reveal-on-scroll alp-delay-300" ref={addToRefs}>
              <div>
                <div className="alp-icon-box">
                  <span className="material-symbols-outlined">edit_document</span>
                </div>
                <h3 className="alp-headline" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. Requests</h3>
                <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>Receba orçamentos completos desde o início. Tamanho, região do corpo, referências visuais — todas as informações que você precisa para dar um preço justo, sem perder tempo com perguntas básicas.</p>
              </div>
              <div 
                style={{ position: 'relative', height: '220px', borderRadius: '4px', marginTop: '2rem', overflow: 'hidden', cursor: 'zoom-in' }}
                onClick={() => setLightboxImg('/assets/Para_Tatuadores_Ref/Painel.webp')}
                onMouseEnter={(e) => e.currentTarget.querySelector('.hover-overlay').style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.querySelector('.hover-overlay').style.opacity = '0'}
              >
                <img src="/assets/Para_Tatuadores_Ref/Painel.webp" alt="Painel" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                <div className="hover-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#fff' }}>zoom_in</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Precision Tools Section */}
        <section className="alp-section" style={{ background: 'var(--surface-low)', maxWidth: 'none' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
            <div className="reveal-on-scroll" ref={addToRefs} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
              <div>
                <h2 className="alp-headline" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Ferramentas de Precisão.</h2>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.1rem' }}>Tudo que você precisa em um único painel. Simples, escuro, focado.</p>
              </div>
              <button className="alp-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => document.getElementById('registro')?.scrollIntoView({ behavior: 'smooth' })}>
                Explorar Funcionalidades
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="alp-card reveal-on-scroll" ref={addToRefs} style={{ minHeight: 'auto', flexDirection: 'row', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div 
                  style={{ position: 'relative', width: '300px', height: '180px', background: 'var(--surface-highest)', borderRadius: '4px', overflow: 'hidden', cursor: 'zoom-in' }}
                  onClick={() => setLightboxImg('/assets/Para_Tatuadores_Ref/Agenda.webp')}
                  onMouseEnter={(e) => e.currentTarget.querySelector('.hover-overlay').style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.querySelector('.hover-overlay').style.opacity = '0'}
                >
                  <img src="/assets/Para_Tatuadores_Ref/Agenda.webp" alt="Agenda Digital" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="hover-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#fff' }}>zoom_in</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--primary-red)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>01 / Agenda</p>
                  <h3 className="alp-headline" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Digital Agenda</h3>
                  <p style={{ color: 'var(--on-surface-variant)', maxWidth: '600px' }}>Controle total sobre seus horários. Sincronização inteligente, lembretes automáticos para clientes e bloqueio de horários com um clique.</p>
                </div>
              </div>

              <div className="alp-card reveal-on-scroll" ref={addToRefs} style={{ minHeight: 'auto', flexDirection: 'row-reverse', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div 
                  style={{ position: 'relative', width: '300px', height: '180px', background: 'var(--surface-highest)', borderRadius: '4px', overflow: 'hidden', cursor: 'zoom-in' }}
                  onClick={() => setLightboxImg('/assets/Para_Tatuadores_Ref/Solicitações.webp')}
                  onMouseEnter={(e) => e.currentTarget.querySelector('.hover-overlay').style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.querySelector('.hover-overlay').style.opacity = '0'}
                >
                  <img src="/assets/Para_Tatuadores_Ref/Solicitações.webp" alt="Gerenciamento de Status" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="hover-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#fff' }}>zoom_in</span>
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--primary-red)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>02 / Workflow</p>
                  <h3 className="alp-headline" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Status Management</h3>
                  <p style={{ color: 'var(--on-surface-variant)', maxWidth: '600px', marginLeft: 'auto' }}>Profissionalize sua gestão de clientes. Acompanhe cada etapa do atendimento com status claros (Pendente → Confirmado → Em Andamento → Realizado) e mantenha seu estúdio organizado.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="alp-section reveal-on-scroll" ref={addToRefs}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ color: 'var(--primary-red)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>Dúvidas Frequentes</p>
            <h2 className="alp-headline" style={{ fontSize: '3rem', fontWeight: 800 }}>Tirando suas dúvidas</h2>
          </div>

          <div className="alp-faq-container">
            {faqData.map((item, index) => (
              <div key={index} className={`alp-faq-item ${activeFaq === index ? 'active' : ''}`}>
                <button className="alp-faq-trigger" onClick={() => toggleFaq(index)}>
                  {item.q}
                  <span className="material-symbols-outlined alp-faq-icon">expand_more</span>
                </button>
                <div className="alp-faq-content-wrapper">
                  <div className="alp-faq-content">
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Registration Lead Capture Section */}
        <section 
          className="alp-section alp-register-section reveal-on-scroll" 
          ref={(el) => { registerRef.current = el; addToRefs(el); }} 
          id="registro"
        >
           <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="alp-headline" style={{ fontSize: '3rem', fontWeight: 800 }}>Garanta seu acesso prioritário</h2>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.1rem', marginTop: '1rem' }}>Estamos liberando o acesso gradualmente. Cadastre seu estúdio para entrar na lista.</p>
          </div>

          <div className="alp-form-container">
            {submitSuccess ? (
              <div style={{
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '3rem 2rem',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '2px solid #22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 2rem auto',
                  fontSize: '3rem',
                  color: '#22c55e'
                }}>
                  ✓
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  color: '#ffffff'
                }}>Solicitação enviada com sucesso!</h3>
                <p style={{
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: '1.6',
                  marginBottom: '2rem',
                  maxWidth: '500px',
                  margin: '0 auto 2rem auto'
                }}>
                  Fique de olho no seu e-mail — nossa equipe entrará em contato em breve para dar continuidade ao seu cadastro na plataforma.
                </p>
                <button 
                  onClick={resetForm}
                  className="alp-btn-secondary"
                  style={{ margin: '0 auto' }}
                >
                  Enviar outra solicitação
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit}>
                <div className="alp-form-group">
                  <label>Nome Completo</label>
                  <input 
                    type="text" 
                    name="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={handleChange}
                    placeholder="Seu nome completo" 
                    required 
                  />
                </div>
                <div className="alp-form-group">
                  <label>Nome do Estúdio</label>
                  <input 
                    type="text" 
                    name="nomeEstudio"
                    value={formData.nomeEstudio}
                    onChange={handleChange}
                    placeholder="Ex: Sullen Tattoo Studio" 
                    required 
                  />
                </div>
                <div className="alp-form-group">
                  <label>E-mail Pessoal</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com" 
                    required 
                  />
                </div>
                <div className="alp-form-group">
                  <label>WhatsApp (com DDD)</label>
                  <input 
                    type="tel" 
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999" 
                    required 
                  />
                </div>
                <div className="alp-form-group">
                  <label>Especialidade Principal (Estilo)</label>
                  <select 
                    name="especialidade"
                    value={formData.especialidade}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione seu estilo principal</option>
                    <option value="realismo">Realismo</option>
                    <option value="blackwork">Blackwork</option>
                    <option value="fineline">Fine Line</option>
                    <option value="oriental">Oriental</option>
                    <option value="geometri">Geométrico</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="alp-btn-primary" 
                  style={{ width: '100%', marginTop: '1rem', background: 'linear-gradient(135deg, #a80010 0%, #ff0000 100%)', color: 'white' }}
                  disabled={loading}
                >
                  {loading ? 'ENVIANDO...' : 'Quero Participar da Beta'}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="alp-section-full reveal-on-scroll" ref={addToRefs}>
          <div className="alp-cta-gradient"></div>
          <div className="alp-section" style={{ textAlign: 'center', padding: '10rem 1.5rem', maxWidth: '1000px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'var(--primary-red)', marginBottom: '2rem', display: 'block' }}>verified</span>
            <h2 className="alp-headline" style={{ fontSize: 'var(--fs-hero, 4.5rem)', fontWeight: 900, marginBottom: '2rem', lineHeight: 1.1 }}>
              Pronto para o <br/>
              <span className="alp-text-gradient">próximo nível?</span>
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--on-surface-variant)', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
              Junte-se à elite dos tatuadores que otimizaram sua gestão com o InkFlow.
            </p>
            <button className="alp-btn-primary" style={{ margin: '0 auto', padding: '1.25rem 3rem', fontSize: '1.1rem' }} onClick={scrollToRegister}>
              Comece Agora - É Grátis
            </button>
          </div>
        </section>

      </main>

      {/* Demo Modal */}
      {isDemoOpen && (
        <div className="alp-modal-overlay" onClick={() => setIsDemoOpen(false)}>
          <div className="alp-modal-container" onClick={e => e.stopPropagation()}>
            <button className="alp-modal-close" onClick={() => setIsDemoOpen(false)} style={{ top: '3rem' }}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="alp-video-wrapper">
              <iframe 
                src="https://www.youtube.com/embed/y6RoOLqiyGQ?autoplay=1" 
                title="InkFlow Demo" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.9)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 9999,
            cursor: 'zoom-out'
          }}
          onClick={() => setLightboxImg(null)}
        >
          <button 
            onClick={() => setLightboxImg(null)}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '3rem',
              height: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '1.5rem' }}>close</span>
          </button>
          <img 
            src={lightboxImg} 
            alt="Preview" 
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Toast Notification */}
      <div className="alp-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="alp-toast" style={{ background: toast.isError ? '#ff4444' : 'var(--surface-highest)' }}>
            <span className="material-symbols-outlined" style={{ color: toast.isError ? '#fff' : 'var(--primary-red)' }}>
              {toast.isError ? 'error' : 'bolt'}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{toast.msg}</span>
          </div>
        ))}
      </div>

    </div>
  )
}

export default ArtistLandingPage
