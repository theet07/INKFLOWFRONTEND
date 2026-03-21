import { useState, useEffect } from 'react'
import { agendamentoService, clienteService } from '../services/inkflowApi'
import { formatPhone } from '../utils/formatPhone'
import './Booking.css'

const Booking = () => {
    const [bookingState, setBookingState] = useState({
        style: 'BLACKWORK',
        artist: 'LUCAS M.',
        day: '12',
        time: 'TARDE'
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
        { name: 'LUCAS M.', role: 'Especialista Realismo', img: '/assets/portifolio_tatuadores/Tatuador_1.png', specialties: ['REALISTA'] },
        { name: 'LILLY K.', role: 'Realismo & Fine Line', img: '/assets/portifolio_tatuadores/Tatuadora_3.png', specialties: ['REALISTA'] },
        { name: 'RAFAEL S.', role: 'Blackwork & Ornamental', img: '/assets/portifolio_tatuadores/Tatuador_2.png', specialties: ['BLACKWORK', 'MAORI'] },
        { name: 'CAMILA R.', role: 'Fine Line & Floral', img: '/assets/portifolio_tatuadores/Tatuadora_5.png', specialties: ['FLORAL'] },
        { name: 'ANDRÉ V.', role: 'Oriental & Geek', img: '/assets/portifolio_tatuadores/Tatuador_4.png', specialties: ['ORIENTAL', 'GEEK'] }
    ]

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
        { id: 'MANHÃ', label: 'MANHÃ', time: '6h às 12h', icon: 'light_mode' },
        { id: 'TARDE', label: 'TARDE', time: '12h às 18h', icon: 'sunny' },
        { id: 'NOITE', label: 'NOITE', time: '18h às 00h', icon: 'dark_mode' }
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
            alert("Please complete the Style, Artist, Date, and Time selection steps above.");
            return;
        }
        if (!formData.name || !formData.phone || !formData.email || !formData.desc) {
            alert("Please fill in all your details.");
            return;
        }
        if (!formData.terms) {
            alert("You must agree to the booking terms to continue.");
            return;
        }

        setIsSubmitting(true)

        try {
            let clienteId
            const user = JSON.parse(localStorage.getItem('user') || '{}')

            if (user.id) {
                clienteId = user.id
            } else {
                const novoCliente = {
                    username: formData.email.split('@')[0],
                    email: formData.email,
                    password: '123456',
                    fullName: formData.name
                }
                const clienteResponse = await clienteService.create(novoCliente)
                clienteId = clienteResponse.data.id
            }

            const formattedDate = `2026-03-${bookingState.day.padStart(2, '0')}`
            let isoTime = '12:00:00'
            if (bookingState.time === 'MANHÃ') isoTime = '09:00:00'
            if (bookingState.time === 'TARDE') isoTime = '14:00:00'
            if (bookingState.time === 'NOITE') isoTime = '19:00:00'

            const dataHora = `${formattedDate}T${isoTime}`

            const novoAgendamento = {
                cliente: { id: clienteId },
                dataHora: dataHora,
                servico: `${bookingState.style} com ${bookingState.artist}`,
                descricao: formData.desc
            }

            await agendamentoService.create(novoAgendamento)

            showToast('Agendamento Confirmado!', 'success')

            setTimeout(() => {
                setFormData({ name: '', phone: '', email: '', desc: '', terms: false })
                window.scrollTo(0, 0)
            }, 3000)

        } catch (error) {
            console.error('Erro ao criar agendamento:', error)
            showToast('Error booking your session.', 'error')
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
                            { num: 1, label: 'ESTILO' },
                            { num: 2, label: 'ARTISTA' },
                            { num: 3, label: 'DATA & HORÁRIO' },
                            { num: 4, label: 'SEUS DADOS' }
                        ].map((step) => {
                            let statusClass = '';
                            if (currentStep === step.num) statusClass = 'active';
                            if (currentStep > step.num) statusClass = 'completed';
                            return (
                                <div key={step.num} className={`step-indicator ${statusClass}`}>
                                    <div className="step-number">{step.num}</div>
                                    <span className="step-label">{step.label}</span>
                                </div>
                            )
                        })}
                    </div>

                    <div className="sidebar-panel">
                        <h3><span className="material-symbols-outlined panel-icon">schedule</span> Horários</h3>
                        <div className="info-row"><span>Segunda a Sexta</span><span>9h às 18h</span></div>
                        <div className="info-row highlight"><span>Sábado</span><span>9h às 16h</span></div>
                        <div className="info-row"><span>Domingo</span><span>Fechado</span></div>
                    </div>

                    <div className="sidebar-panel" style={{marginTop: '1.5rem'}}>
                        <h3 style={{color: '#ff0000'}}><span className="material-symbols-outlined panel-icon">policy</span> Políticas</h3>
                        <div className="info-row" style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', justifyContent: 'flex-start', alignItems: 'flex-start'}}><span className="material-symbols-outlined" style={{color: '#ff0000', fontSize: '1rem', marginRight: '0.5rem', marginTop: '2px'}}>check</span> <span style={{textAlign: 'left'}}>Agendamento com 24h de antecedência</span></div>
                        <div className="info-row" style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', justifyContent: 'flex-start', alignItems: 'flex-start'}}><span className="material-symbols-outlined" style={{color: '#ff0000', fontSize: '1rem', marginRight: '0.5rem', marginTop: '2px'}}>check</span> <span style={{textAlign: 'left'}}>Sinal de 50% para confirmar</span></div>
                        <div className="info-row" style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', justifyContent: 'flex-start', alignItems: 'flex-start'}}><span className="material-symbols-outlined" style={{color: '#ff0000', fontSize: '1rem', marginRight: '0.5rem', marginTop: '2px'}}>check</span> <span style={{textAlign: 'left'}}>Cancelamento até 2h antes</span></div>
                        <div className="info-row" style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', justifyContent: 'flex-start', alignItems: 'flex-start'}}><span className="material-symbols-outlined" style={{color: '#ff0000', fontSize: '1rem', marginRight: '0.5rem', marginTop: '2px'}}>check</span> <span style={{textAlign: 'left'}}>Consulta inicial gratuita</span></div>
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
                                                    <span className="material-symbols-outlined">{ts.icon}</span>
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
                                    <label className="form-terms">
                                        <input id="form-terms" checked={formData.terms} onChange={handleChange} type="checkbox" />
                                        <span>Concordo com os <a href="#">termos de agendamento</a> e confirmo que sou maior de 18 anos.</span>
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