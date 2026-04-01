import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { agendamentoService, clienteService } from '../services/inkflowApi'
import { formatPhone } from '../utils/formatPhone'
import './Booking.css'

const Booking = () => {
    const [bookingState, setBookingState] = useState({
        style: '',
        artist: '',
        day: '',
        time: ''
    })

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        desc: '',
        terms: false
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toasts, setToasts] = useState([])
    const [showTerms, setShowTerms] = useState(false)

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            try {
                const user = JSON.parse(userData)
                if (user && user.id) {
                    setFormData(prev => ({
                        ...prev,
                        name: user.fullName || user.nome || prev.name,
                        email: user.email || prev.email,
                        phone: user.telefone || prev.phone
                    }))
                }
            } catch (e) {
                console.error(e)
            }
        }
    }, [])

    const stylesOptions = [
        { name: 'REALISTA', img: '/assets/portifolio_novo/Rosto.webp' },
        { name: 'BLACKWORK', img: '/assets/portifolio_novo/Caveira.webp' },
        { name: 'GEEK', img: '/assets/portifolio_novo/HomemDeFerro.webp' },
        { name: 'ORIENTAL', img: '/assets/portifolio_novo/tigrao.webp' },
        { name: 'MAORI', img: '/assets/portifolio_novo/Rosa-Dos-Ventos-1.webp' },
        { name: 'FLORAL', img: '/assets/portifolio_novo/Tattoo-Cobra-Floral.webp' }
    ]

    const artistsOptions = [
        { id: 1002, name: 'LUCAS M.', role: 'Especialista Realismo', img: '/assets/portifolio_tatuadores/Tatuador_1.png', specialties: ['REALISTA'] },
        { id: 1003, name: 'LILLY K.', role: 'Realismo & Fine Line', img: '/assets/portifolio_tatuadores/Tatuadora_3.png', specialties: ['REALISTA'] },
        { id: 1004, name: 'RAFAEL S.', role: 'Blackwork & Ornamental', img: '/assets/portifolio_tatuadores/Tatuador_2.png', specialties: ['BLACKWORK', 'MAORI'] },
        { id: 1005, name: 'CAMILA R.', role: 'Fine Line & Floral', img: '/assets/portifolio_tatuadores/Tatuadora_5.png', specialties: ['FLORAL'] },
        { id: 1006, name: 'ANDRÉ V.', role: 'Oriental & Geek', img: '/assets/portifolio_tatuadores/Tatuador_4.png', specialties: ['ORIENTAL', 'GEEK'] },
        { id: 1007, name: 'ELENA M.', role: 'Geek & Floral', img: '/assets/portifolio_tatuadores/Tatuadora_6.png', specialties: ['GEEK', 'FLORAL'] }
    ]

    const location = useLocation()

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const artistaId = params.get('artistaId')
        
        if (artistaId) {
            const foundArtist = artistsOptions.find(a => a.id.toString() === artistaId)
            if (foundArtist) {
                setBookingState(prev => ({ ...prev, artist: foundArtist.name }))
            }
        }
    }, [location.search])

    const days = [
        { day: '1', active: false }, { day: '2', active: true }, { day: '3', active: true }, { day: '4', active: true },
        { day: '5', active: true }, { day: '6', active: true }, { day: '7', active: true }, { day: '8', active: false },
        { day: '9', active: true }, { day: '10', active: true }, { day: '11', active: true }, { day: '12', active: true, content: '12', isDot: false },
        { day: '13', active: true }, { day: '14', active: true }, { day: '15', active: false }, { day: '16', active: true },
        { day: '17', active: true }, { day: '18', active: true }, { day: '19', active: true }, { day: '20', active: true },
        { day: '21', active: true }, { day: '22', active: false }, { day: '23', active: true }, { day: '24', active: true },
        { day: '25', active: true }, { day: '26', active: true }, { day: '27', active: true }, { day: '28', active: true },
        { day: '29', active: false }, { day: '30', active: true }, { day: '31', active: true }
    ]

    const timeSlots = [
        { id: 'MANHÃ', label: 'MANHÃ', time: '6h às 12h', icon: 'light_mode', customSvg: false },
        { id: 'TARDE', label: 'TARDE', time: '12h às 18h', icon: null, customSvg: true },
        { id: 'NOITE', label: 'NOITE', time: '18h às 00h', icon: 'dark_mode', customSvg: false }
    ]

    const showToast = (message, type = 'success') => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
    }

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        const key = id.replace('form-', '');
        let finalValue = type === 'checkbox' ? checked : value;
        
        if (key === 'phone') {
            finalValue = formatPhone(value);
        }

        setFormData(prev => ({
            ...prev,
            [key]: finalValue
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!bookingState.style || !bookingState.artist || !bookingState.day || !bookingState.time) {
            alert('Por favor, complete as etapas de Estilo, Artista, Data e Horário.');
            return;
        }
        if (!formData.name || !formData.phone || !formData.email || !formData.desc) {
            alert('Por favor, preencha todos os seus dados.');
            return;
        }
        if (!formData.terms) {
            alert('Você precisa aceitar os termos de agendamento para continuar.');
            return;
        }

        setIsSubmitting(true)

        try {
            let clienteId
            const user = JSON.parse(localStorage.getItem('user') || '{}')

            if (user && user.id) {
                clienteId = user.id
            } else {
                try {
                    const novoCliente = {
                        username: formData.email.split('@')[0],
                        email: formData.email,
                        password: '123456',
                        fullName: formData.name
                    }
                    const clienteResponse = await clienteService.create(novoCliente)
                    clienteId = clienteResponse.data.id
                } catch (clienteError) {
                    const status = clienteError.response?.status
                    if (status === 409 || status === 400) {
                        try {
                            const existingResponse = await clienteService.getByEmail(formData.email)
                            clienteId = existingResponse.data.id
                        } catch {
                            throw new Error('Não foi possível identificar o cliente. Tente fazer login antes de agendar.')
                        }
                    } else {
                        throw clienteError
                    }
                }
            }

            const formattedDate = `2026-03-${bookingState.day.padStart(2, '0')}`
            let isoTime = '12:00:00'
            if (bookingState.time === 'MANHÃ') isoTime = '09:00:00'
            if (bookingState.time === 'TARDE') isoTime = '14:00:00'
            if (bookingState.time === 'NOITE') isoTime = '19:00:00'

            const dataHora = `${formattedDate}T${isoTime}`

            const artistaSelecionado = artistsOptions.find(a => a.name === bookingState.artist)

            const novoAgendamento = {
                cliente: { id: clienteId },
                artista: artistaSelecionado ? { id: artistaSelecionado.id } : null,
                dataHora: dataHora,
                servico: artistaSelecionado ? `${bookingState.style} com ${artistaSelecionado.name}` : bookingState.style,
                descricao: formData.desc
            }

            await agendamentoService.create(novoAgendamento)

            showToast('Agendamento Confirmado! Entraremos em contato em breve.', 'success')

            setTimeout(() => {
                setFormData({ name: '', phone: '', email: '', desc: '', terms: false })
                setBookingState({ style: '', artist: '', day: '', time: '' })
                window.scrollTo(0, 0)
            }, 3000)

        } catch (error) {
            console.error('Erro ao criar agendamento:', error)
            const backendMsg = error.response?.data?.message || error.response?.data || error.message
            const userMsg = typeof backendMsg === 'string' && backendMsg.length < 200
                ? backendMsg
                : 'Erro ao confirmar agendamento. Tente novamente.'
            showToast(userMsg, 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const getActiveStep = () => {
        if (!bookingState.style) return 1
        if (!bookingState.artist) return 2
        if (!bookingState.day || !bookingState.time) return 3
        return 4
    }
    const currentStep = getActiveStep()

    return (
        <div className="booking-page">
            <div className="booking-layout">
                {/* Sidebar Navigation */}
                <aside className="booking-sidebar">
                    <div className="step-indicators">
                        {[
                            { num: 1, label: 'ESTILO', done: !!bookingState.style },
                            { num: 2, label: 'ARTISTA', done: !!bookingState.artist },
                            { num: 3, label: 'DATA & HORÁRIO', done: !!bookingState.day && !!bookingState.time },
                            { num: 4, label: 'SEUS DADOS', done: !!formData.name && !!formData.phone && !!formData.email && !!formData.desc && formData.terms }
                        ].map((step) => {
                            return (
                                <div key={step.num} className={`step-indicator ${step.done ? 'completed' : ''}`}>
                                    <div className="step-number">{step.num}</div>
                                    <span className="step-label">{step.label}</span>
                                </div>
                            )
                        })}
                    </div>

                    <div className="sidebar-panel">
                        <h3><span className="material-symbols-outlined panel-icon">schedule</span> Horários</h3>
                        <div className="info-row" style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', justifyContent: 'flex-start', alignItems: 'flex-start'}}><span className="material-symbols-outlined" style={{color: '#ff0000', fontSize: '1rem', marginRight: '0.5rem', marginTop: '2px'}}>info</span> <span style={{textAlign: 'left'}}>Cada artista define seus próprios horários disponíveis.</span></div>
                        <div className="info-row" style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', justifyContent: 'flex-start', alignItems: 'flex-start'}}><span className="material-symbols-outlined" style={{color: '#ff0000', fontSize: '1rem', marginRight: '0.5rem', marginTop: '2px'}}>calendar_month</span> <span style={{textAlign: 'left'}}>Consulte o calendário após selecionar um tatuador.</span></div>
                    </div>

                    <div className="sidebar-panel" style={{marginTop: '1.5rem'}}>
                        <h3 style={{color: '#ff0000'}}><span className="material-symbols-outlined panel-icon">policy</span> Políticas</h3>
                        <div className="info-row" style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', justifyContent: 'flex-start', alignItems: 'flex-start'}}><span className="material-symbols-outlined" style={{color: '#ff0000', fontSize: '1rem', marginRight: '0.5rem', marginTop: '2px'}}>info</span> <span style={{textAlign: 'left'}}>Cada artista define suas próprias políticas de cancelamento e sinal de pagamento.</span></div>
                        <div className="info-row" style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', justifyContent: 'flex-start', alignItems: 'flex-start'}}><span className="material-symbols-outlined" style={{color: '#ff0000', fontSize: '1rem', marginRight: '0.5rem', marginTop: '2px'}}>verified_user</span> <span style={{textAlign: 'left'}}>Consulte as regras do artista após confirmar a reserva.</span></div>
                    </div>
                </aside>

                {/* Main Booking Content */}
                <div className="booking-content">
                    {/* Step 1: Styles */}
                    <section id="styles-section">
                        <div className="section-header">
                            <div>
                                <h2>ESCOLHA SEU ESTILO</h2>
                                <p>Selecione o estilo de tatuagem para seu agendamento.</p>
                            </div>
                            <span className="step-badge">ETAPA 01 / 04</span>
                        </div>

                        <div className="styles-grid">
                            {stylesOptions.map(style => (
                                <div
                                    key={style.name}
                                    onClick={() => setBookingState(prev => ({ ...prev, style: prev.style === style.name ? '' : style.name }))}
                                    className={`style-card ${bookingState.style === style.name ? 'selected' : ''}`}
                                >
                                    <div className="style-card-overlay"></div>
                                    <img src={style.img} alt={style.name} />
                                    <div className="style-card-info">
                                        <h3>{style.name}</h3>
                                    </div>
                                    {bookingState.style === style.name && (
                                        <div className="style-checkmark">
                                            <span className="material-symbols-outlined text-sm">check</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Step 2: Artists */}
                    <section id="artists-section">
                        <div className="section-header">
                            <div>
                                <h2>NOSSOS ARTISTAS</h2>
                                <p>Escolha o profissional para sua sessão.</p>
                            </div>
                            <span className="step-badge">ETAPA 02 / 04</span>
                        </div>

                        <div className="artists-grid">
                            {[...artistsOptions].sort((a, b) => {
                                if (!bookingState.style) return 0;
                                const aRec = a.specialties.includes(bookingState.style);
                                const bRec = b.specialties.includes(bookingState.style);
                                if (aRec && !bRec) return -1;
                                if (!aRec && bRec) return 1;
                                return 0;
                            }).map(artist => {
                                const isRecommended = bookingState.style && artist.specialties.includes(bookingState.style);
                                const isDimmed = bookingState.style && !isRecommended;
                                const isSelected = bookingState.artist === artist.name;

                                return (
                                    <div
                                        key={artist.name}
                                        onClick={() => setBookingState(prev => ({ ...prev, artist: isSelected ? '' : artist.name }))}
                                        className={`artist-card ${isSelected ? 'selected' : ''} ${isDimmed ? 'dimmed' : ''}`}
                                    >
                                        <div className="artist-avatar">
                                            <img src={artist.img} alt={artist.name} />
                                        </div>
                                        <div className="artist-info">
                                            <h4>{artist.name}</h4>
                                            <p>{artist.role}</p>
                                            {isRecommended && (
                                                <span className="recommended-badge"><span className="material-symbols-outlined text-xs" style={{fontSize: '12px'}}>check</span> Recomendado</span>
                                            )}
                                            {isSelected && (
                                                <span className="artist-selected-text">ARTISTA SELECIONADO</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    {/* Step 3 & 4: Calendar and Info */}
                    <section id="datetime-section">
                        <div className="steps-3-4-grid">
                            {/* Date Selection */}
                            <div className="booking-calendar-wrap">
                                <div className="section-header">
                                    <h2>A SESSÃO</h2>
                                    <span className="step-badge">ETAPA 03</span>
                                </div>
                                <div className="calendar-panel">
                                    <div className="calendar-nav">
                                        <button><span className="material-symbols-outlined">chevron_left</span></button>
                                        <span>MARÇO DE 2026</span>
                                        <button><span className="material-symbols-outlined">chevron_right</span></button>
                                    </div>
                                    <div className="calendar-weekdays">
                                        <span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SÁB</span><span>DOM</span>
                                    </div>
                                    <div className="calendar-days">
                                        <div className="calendar-day empty">28</div><div className="calendar-day empty">29</div><div className="calendar-day empty">30</div><div className="calendar-day empty">31</div>
                                        {days.map((d, i) => (
                                            <div
                                                key={i}
                                                onClick={() => d.active && setBookingState(prev => ({ ...prev, day: prev.day === d.day ? '' : d.day }))}
                                                className={`calendar-day ${!d.active ? 'disabled' : ''} ${bookingState.day === d.day ? 'selected' : ''}`}
                                            >
                                                {d.isDot ? d.content : d.day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="time-slots-section">
                                        <h4>HORÁRIO PREFERENCIAL</h4>
                                        <div className="time-periods-grid">
                                            {timeSlots.map(ts => (
                                                <div
                                                    key={ts.id}
                                                    onClick={() => setBookingState(prev => ({ ...prev, time: prev.time === ts.id ? '' : ts.id }))}
                                                    className={`time-period ${bookingState.time === ts.id ? 'selected' : ''}`}
                                                >
                                                    {ts.customSvg ? (
                                                        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M21,12h-3c0-1.3-0.4-2.5-1.1-3.5l0.8-0.8c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0l-0.8,0.8c-0.7-0.5-1.6-0.9-2.5-1V5c0-0.6-0.4-1-1-1s-1,0.4-1,1v1.1c-0.9,0.2-1.7,0.5-2.5,1L7.7,6.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l0.8,0.8C6.4,9.5,6,10.7,6,12H3c-0.6,0-1,0.4-1,1s0.4,1,1,1h4.1h9.8H21c0.6,0,1-0.4,1-1S21.6,12,21,12z M8,12c0-2.2,1.8-4,4-4s4,1.8,4,4H8z"/>
                                                            <path d="M15,15H9c-0.6,0-1,0.4-1,1s0.4,1,1,1h6c0.6,0,1-0.4,1-1S15.6,15,15,15z"/>
                                                            <path d="M13,20h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S13.6,20,13,20z"/>
                                                        </svg>
                                                    ) : (
                                                        <span className="material-symbols-outlined">{ts.icon}</span>
                                                    )}
                                                    <span className="time-period-label">{ts.label}</span>
                                                    <span className="time-period-hours">{ts.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Section */}
                            <div className="booking-details-wrap">
                                <div className="section-header">
                                    <h2>SEUS DADOS</h2>
                                    <span className="step-badge">ETAPA 04</span>
                                </div>
                                <form className="form-section-booking" onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>NOME COMPLETO</label>
                                            <input id="form-name" value={formData.name} onChange={handleChange} placeholder="João da Silva" type="text" required />
                                        </div>
                                        <div className="form-field">
                                            <label>TELEFONE</label>
                                            <input id="form-phone" value={formData.phone} onChange={handleChange} placeholder="(11) 99999-9999" type="tel" required />
                                        </div>
                                    </div>
                                    <div className="form-field">
                                        <label>EMAIL</label>
                                        <input id="form-email" value={formData.email} onChange={handleChange} placeholder="nome@exemplo.com" type="email" required />
                                    </div>
                                    <div className="form-field">
                                        <label>DESCRIÇÃO DO PROJETO</label>
                                        <textarea id="form-desc" value={formData.desc} onChange={handleChange} placeholder="Descreva sua ideia de tatuagem, tamanho aproximado e local no corpo..." rows="4" required></textarea>
                                    </div>
                                    <label className="form-terms" onClick={(e) => { if (!formData.terms) { e.preventDefault(); setShowTerms(true); } }}>
                                        <input id="form-terms" checked={formData.terms} onChange={handleChange} type="checkbox" />
                                        <span>Concordo com os <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTerms(true); }}>termos de agendamento</a> e confirmo que sou maior de 18 anos.</span>
                                    </label>
                                    <button disabled={isSubmitting} className="booking-submit-btn" type="submit">
                                        {isSubmitting ? (
                                            <>PROCESSANDO...</>
                                        ) : (
                                            <><span className="material-symbols-outlined">edit</span> CONFIRMAR AGENDAMENTO</>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Modal de Termos */}
            {showTerms && (
                <div className="terms-modal-overlay" onClick={() => setShowTerms(false)}>
                    <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="terms-modal-header">
                            <h2>TERMOS DE AGENDAMENTO</h2>
                            <button className="terms-modal-close" onClick={() => setShowTerms(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="terms-modal-body">
                            <h3>1. Agendamento</h3>
                            <p>O agendamento deve ser realizado com no mínimo <strong>24 horas de antecedência</strong>. Agendamentos feitos com menos de 24h estão sujeitos à disponibilidade do artista.</p>

                            <h3>2. Confirmação</h3>
                            <p>Para confirmar seu agendamento, é necessário o pagamento de um <strong>sinal de 50% do valor estimado</strong> da sessão. O sinal não é reembolsável em caso de não comparecimento sem aviso prévio.</p>

                            <h3>3. Cancelamento</h3>
                            <p>O cancelamento pode ser feito <strong>até 2 horas antes</strong> do horário agendado sem perda do sinal. Cancelamentos após esse prazo resultarão na perda do valor do sinal.</p>

                            <h3>4. Atrasos</h3>
                            <p>Toleramos um atraso máximo de <strong>15 minutos</strong>. Após esse período, o agendamento poderá ser cancelado e o sinal não será devolvido.</p>

                            <h3>5. Consulta Inicial</h3>
                            <p>A <strong>consulta inicial é gratuita</strong> e pode ser realizada presencialmente ou por meio dos nossos canais digitais para alinhar sua ideia com o artista.</p>

                            <h3>6. Idade Mínima</h3>
                            <p>É obrigatório ter <strong>18 anos ou mais</strong> para realizar uma tatuagem. Menores de idade não serão atendidos, mesmo com autorização dos responsáveis.</p>

                            <h3>7. Cuidados Pós-Sessão</h3>
                            <p>O estúdio fornecerá orientações de cuidados pós-tatuagem. O não cumprimento dessas orientações pode comprometer o resultado final, e o estúdio não se responsabiliza por danos causados por negligência do cliente.</p>

                            <h3>8. Saúde</h3>
                            <p>O cliente deve informar condições de saúde relevantes (alergias, doenças de pele, uso de medicamentos, etc.) antes da sessão. O estúdio se reserva o direito de recusar o atendimento caso julgue haver risco à saúde do cliente.</p>
                        </div>
                        <div className="terms-modal-footer">
                            <button className="terms-accept-btn" onClick={() => { setShowTerms(false); setFormData(prev => ({ ...prev, terms: true })); }}>LI E ACEITO OS TERMOS</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toasts */}
            {toasts.map(toast => (
                <div key={toast.id} className="booking-toast">
                    {toast.message}
                </div>
            ))}
        </div>
    )
}

export default Booking