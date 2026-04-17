import { useState, useEffect, useRef } from 'react'
import './ArtistLandingPage.css'

const ArtistLandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null)
  const [toasts, setToasts] = useState([])
  const [isDemoOpen, setIsDemoOpen] = useState(false)
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

  const showToast = (msg) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, msg }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const scrollToRegister = () => {
    registerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    showToast('Interesse registrado! Entraremos em contato via WhatsApp.')
    e.target.reset()
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
                  <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Próxima Sessão</p>
                  <p style={{ fontWeight: 700 }}>Realismo - Braço Esquerdo</p>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <p style={{ color: 'var(--primary-red)', fontWeight: 600 }}>14:00</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Hoje</p>
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
                <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>Seu cartão de visitas digital brutalista. Links, regras do estúdio e disponibilidade clara e direta.</p>
              </div>
              <div style={{ height: '100px', background: 'var(--surface-color)', borderRadius: '4px', marginTop: '2rem', border: '1px solid var(--outline-variant)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', height: '8px', background: 'rgba(255,141,140,0.1)', borderRadius: '4px' }}></div>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', height: '100px', marginTop: '2rem' }}>
                <div style={{ background: '#222', borderRadius: '4px' }}></div>
                <div style={{ background: '#222', borderRadius: '4px' }}></div>
              </div>
            </div>

            <div className="alp-card reveal-on-scroll alp-delay-300" ref={addToRefs}>
              <div>
                <div className="alp-icon-box">
                  <span className="material-symbols-outlined">edit_document</span>
                </div>
                <h3 className="alp-headline" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. Requests</h3>
                <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>Formulários de orçamento precisos. Tamanho, local, referência. Chega de "quanto custa uma tattoo?".</p>
              </div>
              <div style={{ height: '100px', background: 'var(--surface-color)', borderRadius: '4px', marginTop: '2rem', border: '1px solid var(--outline-variant)', padding: '1rem' }}>
                 <div style={{ height: '8px', width: '40%', background: 'rgba(255,141,140,0.2)', marginBottom: '0.5rem' }}></div>
                 <div style={{ height: '8px', width: '70%', background: 'rgba(255,141,140,0.1)' }}></div>
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
              <button className="alp-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => showToast('Explorando novos mundos...')}>
                Explorar Funcionalidades
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="alp-card reveal-on-scroll" ref={addToRefs} style={{ minHeight: 'auto', flexDirection: 'row', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ width: '300px', height: '180px', background: 'var(--surface-highest)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'rgba(255,141,140,0.3)' }}>event_upcoming</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--primary-red)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>01 / Agenda</p>
                  <h3 className="alp-headline" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Digital Agenda</h3>
                  <p style={{ color: 'var(--on-surface-variant)', maxWidth: '600px' }}>Controle total sobre seus horários. Sincronização inteligente, lembretes automáticos para clientes e bloqueio de horários com um clique.</p>
                </div>
              </div>

              <div className="alp-card reveal-on-scroll" ref={addToRefs} style={{ minHeight: 'auto', flexDirection: 'row-reverse', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ width: '300px', height: '180px', background: 'var(--surface-highest)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'rgba(255,141,140,0.3)' }}>rule</span>
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--primary-red)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>02 / Workflow</p>
                  <h3 className="alp-headline" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Status Management</h3>
                  <p style={{ color: 'var(--on-surface-variant)', maxWidth: '600px', marginLeft: 'auto' }}>Crie funis de atendimento. "Aguardando Referência", "Arte em Criação", "Pronto para Agendar". Saiba exatamente em que etapa cada cliente está.</p>
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
          id="register"
        >
           <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="alp-headline" style={{ fontSize: '3rem', fontWeight: 800 }}>Garanta seu acesso prioritário</h2>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.1rem', marginTop: '1rem' }}>Estamos liberando o acesso gradualmente. Cadastre seu estúdio para entrar na lista.</p>
          </div>

          <div className="alp-form-container">
            <form onSubmit={handleRegisterSubmit}>
              <div className="alp-form-group">
                <label>Nome Completo</label>
                <input type="text" placeholder="Seu nome completo" required />
              </div>
              <div className="alp-form-group">
                <label>Nome do Estúdio</label>
                <input type="text" placeholder="Ex: Sullen Tattoo Studio" required />
              </div>
              <div className="alp-form-group">
                <label>WhatsApp (com DDD)</label>
                <input type="tel" placeholder="(11) 99999-9999" required />
              </div>
              <div className="alp-form-group">
                <label>Especialidade Principal (Estilo)</label>
                <select required>
                  <option value="">Selecione seu estilo principal</option>
                  <option value="realismo">Realismo</option>
                  <option value="blackwork">Blackwork</option>
                  <option value="fineline">Fine Line</option>
                  <option value="oriental">Oriental</option>
                  <option value="geometri">Geométrico</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <button type="submit" className="alp-btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'linear-gradient(135deg, #a80010 0%, #ff0000 100%)', color: 'white' }}>
                Quero Participar da Beta
              </button>
            </form>
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
            <button className="alp-modal-close" onClick={() => setIsDemoOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="alp-video-wrapper">
              <iframe 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="InkFlow Demo" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div className="alp-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="alp-toast">
            <span className="material-symbols-outlined" style={{ color: 'var(--primary-red)' }}>bolt</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{toast.msg}</span>
          </div>
        ))}
      </div>

    </div>
  )
}

export default ArtistLandingPage
