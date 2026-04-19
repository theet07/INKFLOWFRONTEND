import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { agendamentoService, clienteService, artistaService, portfolioService, appointmentService } from '../services/inkflowApi'
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
        regiao: '',
        largura: '',
        altura: '',
        tags: [],
        imagemReferenciaFile: null,
        terms: false
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toasts, setToasts] = useState([])
    const [showTerms, setShowTerms] = useState(false)
    const [availableDays, setAvailableDays] = useState([])
    const [availableSlots, setAvailableSlots] = useState([])
    const [isLoadingAvailability, setIsLoadingAvailability] = useState(false)
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)

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
        { name: 'REALISMO', img: '/assets/portifolio_novo/Rosto.webp' },
        { name: 'BLACKWORK', img: '/assets/portifolio_novo/Caveira.webp' },
        { name: 'FINE LINE', img: '/assets/portifolio_novo/Borboleta-Colorida.webp' },
        { name: 'GEEK', img: '/assets/portifolio_novo/HomemDeFerro.webp' },
        { name: 'ORIENTAL', img: '/assets/portifolio_novo/tigrao.webp' },
        { name: 'FLORAL', img: '/assets/portifolio_novo/Tattoo-Cobra-Floral.webp' }
    ]

    const [artistsOptions, setArtistsOptions] = useState([])
    
    useEffect(() => {
        const styleKeywords = {
            'REALISMO': ['realismo', 'realista', 'realis'],
            'BLACKWORK': ['blackwork', 'black work', 'preto'],
            'FINE LINE': ['fine line', 'fineline', 'traço fino'],
            'GEEK': ['geek', 'anime', 'nerd', 'pop'],
            'ORIENTAL': ['oriental', 'japonês', 'japones', 'irezumi'],
            'FLORAL': ['floral', 'botâni', 'botanical']
        }

        artistaService.getAllArtists().then(res => {
            const artistsData = res.data || []
            const mapped = (Array.isArray(artistsData) ? artistsData : []).map(a => {
                const especialidades = (a?.especialidades || []).map(s => s.toLowerCase())
                const matched = Object.entries(styleKeywords)
                    .filter(([, keywords]) => keywords.some(kw => especialidades.some(e => e.includes(kw))))
                    .map(([style]) => style)

                return {
                    id: a?.id,
                    name: a?.nome || 'Artista Indonhecido',
                    role: a?.role || 'Artista Convidado',
                    img: a?.fotoUrl || `https://ui-avatars.com/api/?background=1a1919&color=ff8d8c&name=${encodeURIComponent(a?.nome || 'User')}`,
                    specialties: matched.length > 0 ? matched : ['GERAL']
                }
            })
            setArtistsOptions(mapped)
        }).catch(err => {
            console.error("Erro ao puxar artistas agendamento:", err)
            setArtistsOptions([])
        })
    }, [])

    const location = useLocation()

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const artistaId = params.get('artistaId')
        
        if (artistaId && artistsOptions.length > 0) {
            const foundArtist = artistsOptions.find(a => a?.id?.toString() === artistaId)
            if (foundArtist) {
                setBookingState(prev => ({ ...prev, artist: foundArtist.name }))
            }
        }
    }, [location.search, artistsOptions])

    // Efeito para carregar disponibilidade do artista
    useEffect(() => {
        const artistaSelecionado = artistsOptions.find(a => a?.name === bookingState.artist)
        if (artistaSelecionado) {
            setAvailableDays([]) // Limpa dados antigos
            setBookingState(prev => ({ ...prev, day: '', time: '' })) // Reseta seleção
            setIsLoadingAvailability(true)
            artistaService.getAvailability(artistaSelecionado.id)
                .then(res => {
                    const mappedDays = (res.data || []).map(d => ({
                        day: d.data.split('-')[2].replace(/^0/, ''),
                        fullDate: d.data,
                        active: d.disponivel
                    }))
                    setAvailableDays(mappedDays)
                })
                .catch(err => console.error("Erro ao carregar disponibilidade:", err))
                .finally(() => setIsLoadingAvailability(false))
        }
    }, [bookingState.artist, artistsOptions])

    // Efeito para carregar slots do dia selecionado
    useEffect(() => {
        const artistaSelecionado = artistsOptions.find(a => a?.name === bookingState.artist)
        if (artistaSelecionado && bookingState.day) {
            const dayObj = availableDays.find(d => d.day === bookingState.day)
            if (dayObj) {
                setAvailableSlots([]) // Limpa slots antigos
                setBookingState(prev => ({ ...prev, time: '' })) // Reseta seleção de horário
                setIsLoadingSlots(true)
                artistaService.getSlots(artistaSelecionado.id, dayObj.fullDate)
                    .then(res => {
                        const mappedSlots = (res.data || []).map(s => ({
                            id: s.horario,
                            label: s.horario,
                            active: s.disponivel
                        }))
                        setAvailableSlots(mappedSlots)
                    })
                    .catch(err => console.error("Erro ao carregar slots:", err))
                    .finally(() => setIsLoadingSlots(false))
            }
        }
    }, [bookingState.day, bookingState.artist, artistsOptions, availableDays])

    const brTime = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));
    const currentMonth = brTime.getMonth();
    const currentYear = brTime.getFullYear();
    const todayDate = brTime.getDate();
    const currentHourBr = brTime.getHours();

    const monthNames = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
    const currentMonthName = monthNames[currentMonth];

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const startPadding = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const prevMonthDaysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const emptyDays = Array.from({ length: startPadding }, (_, i) => prevMonthDaysInMonth - startPadding + i + 1);

    const days = availableDays.length > 0 ? availableDays : Array.from({ length: daysInMonth }, (_, i) => {
        const d = i + 1;
        const dayOfWeek = new Date(currentYear, currentMonth, d).getDay();
        let active = true;
        if (dayOfWeek === 0) active = false; // Domingos fechados
        if (d < todayDate) active = false; // Dias passados bloqueados

        return {
            day: d.toString(),
            active,
            isDot: d === todayDate,
            content: d.toString()
        };
    });

    const timeSlots = availableSlots.length > 0 ? availableSlots : Array.from({ length: 12 }, (_, i) => {
        const hour = i + 9;
        const timeString = `${hour.toString().padStart(2, '0')}:00`;
        return {
            id: timeString,
            label: timeString,
            time: '',
            icon: 'schedule',
            customSvg: false
        };
    });

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

    const handleTagToggle = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag) 
                ? prev.tags.filter(t => t !== tag) 
                : [...prev.tags, tag]
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                imagemReferenciaFile: e.target.files[0]
            }));
        }
    };

    const uploadImagemReferencia = async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'inkflow_referencias')

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/dzluvaqiy/image/upload`,
            { method: 'POST', body: formData }
        )

        if (!response.ok) throw new Error('Falha no upload da imagem de referência.')

        const data = await response.json()
        return data.secure_url
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
            // 1. Upload da imagem de referência direto no Cloudinary
            let imagemUrl = null
            if (formData.imagemReferenciaFile) {
                imagemUrl = await uploadImagemReferencia(formData.imagemReferenciaFile)
            }

            const mm = (currentMonth + 1).toString().padStart(2, '0');
            const formattedDate = `${currentYear}-${mm}-${bookingState.day.padStart(2, '0')}`;
            const isoTime = bookingState.time ? `${bookingState.time}:00` : '12:00:00';
            const dataHora = `${formattedDate}T${isoTime}`;
            const artistaSelecionado = artistsOptions.find(a => a?.name === bookingState.artist)
            const servico = artistaSelecionado
                ? `${bookingState.style} com ${artistaSelecionado.name}`
                : bookingState.style

            const user = JSON.parse(localStorage.getItem('user') || '{}')

            if (user?.id) {
                // 2. Usuário logado — payload direto com clienteId
                await appointmentService.create({
                    cliente: { id: user.id },
                    artista: artistaSelecionado ? { id: artistaSelecionado.id } : null,
                    dataHora,
                    servico,
                    descricao: formData.desc,
                    regiao: formData.regiao || null,
                    largura: formData.largura ? parseFloat(formData.largura) : null,
                    altura: formData.altura ? parseFloat(formData.altura) : null,
                    tags: formData.tags.length > 0 ? formData.tags.join(',') : null,
                    imagemReferenciaUrl: imagemUrl
                })
            } else {
                // 3. Usuário não logado — backend cria cliente com senha segura
                await appointmentService.create({
                    clienteNome: formData.name,
                    clienteEmail: formData.email,
                    clienteTelefone: formData.phone,
                    artistId: artistaSelecionado?.id,
                    date: formattedDate,
                    time: bookingState.time,
                    description: formData.desc,
                    estilo: bookingState.style,
                    regiao: formData.regiao || null,
                    largura: formData.largura ? parseFloat(formData.largura) : null,
                    altura: formData.altura ? parseFloat(formData.altura) : null,
                    tags: formData.tags.length > 0 ? formData.tags.join(',') : null,
                    imagemReferenciaUrl: imagemUrl
                })
            }


            showToast('Solicitação Enviada! O artista analisará sua referência em breve.', 'success')

            setTimeout(() => {
                setFormData({ name: '', phone: '', email: '', desc: '', terms: false, regiao: '', largura: '', altura: '', tags: [], imagemReferenciaFile: null })
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
                                const aRec = a?.specialties?.includes(bookingState.style);
                                const bRec = b?.specialties?.includes(bookingState.style);
                                if (aRec && !bRec) return -1;
                                if (!aRec && bRec) return 1;
                                return 0;
                            }).map(artist => {
                                const isRecommended = bookingState.style && artist?.specialties?.includes(bookingState.style);
                                const isDimmed = bookingState.style && !isRecommended;
                                const isSelected = bookingState.artist === artist?.name;

                                return (
                                    <div
                                        key={artist?.id || artist?.name}
                                        onClick={() => setBookingState(prev => ({ ...prev, artist: isSelected ? '' : artist?.name }))}
                                        className={`artist-card ${isSelected ? 'selected' : ''} ${isDimmed ? 'dimmed' : ''}`}
                                    >
                                        <div className="artist-avatar">
                                            <img src={artist?.img} alt={artist?.name} />
                                        </div>
                                        <div className="artist-info">
                                            <h4>{artist?.name || 'Artista'}</h4>
                                            <p>{artist?.role || 'Residente'}</p>
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
                                        <span>{`${currentMonthName} DE ${currentYear}`}</span>
                                        <button><span className="material-symbols-outlined">chevron_right</span></button>
                                    </div>
                                    <div className="calendar-weekdays">
                                        <span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SÁB</span><span>DOM</span>
                                    </div>
                                    <div className="calendar-days">
                                        {emptyDays.map((d, i) => <div key={`empty-${i}`} className="calendar-day empty">{d}</div>)}
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
                                            {timeSlots.map(ts => {
                                                const currentHour = currentHourBr;
                                                const slotHour = parseInt(ts.label.split(':')[0], 10);
                                                const isToday = bookingState.day === todayDate.toString();
                                                const isPast = isToday && slotHour <= currentHour;

                                                return (
                                                    <div
                                                        key={ts.id}
                                                        onClick={() => {
                                                            if (isPast) return;
                                                            setBookingState(prev => ({ ...prev, time: prev.time === ts.id ? '' : ts.id }));
                                                        }}
                                                        className={`time-period ${bookingState.time === ts.id ? 'selected' : ''} ${isPast ? 'disabled' : ''}`}
                                                        style={isPast ? { opacity: 0.3, cursor: 'not-allowed', backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.05)' } : {}}
                                                    >
                                                        <span className="time-period-label">{ts.label}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="tags-section" style={{marginTop: '2rem'}}>
                                        <h4 style={{fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '1rem'}}>TAGS DO PROJETO (OPCIONAL)</h4>
                                        <div className="tags-grid">
                                            {['Primeira Tatuagem', 'Colorido', 'Preto e Cinza', 'Cover-up', 'Design Personalizado', 'Tenho Referência'].map(tag => (
                                                <div 
                                                    key={tag} 
                                                    className={`tag-chip ${formData.tags.includes(tag) ? 'selected' : ''}`}
                                                    onClick={() => handleTagToggle(tag)}
                                                >
                                                    {formData.tags.includes(tag) && <span className="material-symbols-outlined tag-check">check</span>}
                                                    {tag}
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
                                        <textarea id="form-desc" value={formData.desc} onChange={handleChange} placeholder="Descreva sua ideia de tatuagem..." rows="4" required></textarea>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>REGIÃO (OPCIONAL)</label>
                                            <input id="form-regiao" value={formData.regiao} onChange={handleChange} list="regioes-list" placeholder="Ex: Antebraço" type="text" />
                                            <datalist id="regioes-list">
                                                <option value="Antebraço" />
                                                <option value="Costela" />
                                                <option value="Escápula" />
                                                <option value="Perna" />
                                                <option value="Braço" />
                                                <option value="Costas" />
                                                <option value="Pescoço" />
                                                <option value="Tornozelo" />
                                            </datalist>
                                        </div>
                                        <div className="form-field">
                                            <label>TAMANHO EM CM (OPC.)</label>
                                            <div style={{display: 'flex', gap: '0.5rem', height: '100%'}}>
                                                <input id="form-largura" value={formData.largura} onChange={handleChange} placeholder="Larg. cm" type="number" step="0.1" style={{height: '100%'}}/>
                                                <input id="form-altura" value={formData.altura} onChange={handleChange} placeholder="Alt. cm" type="number" step="0.1" style={{height: '100%'}}/>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="form-field">
                                        <label>IMAGEM DE REFERÊNCIA (OPCIONAL)</label>
                                        <div className="file-upload-wrapper">
                                            <input type="file" id="imagem-ref" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} className="file-input-hidden" key={formData.imagemReferenciaFile ? 'has-file' : 'empty'} />
                                            <label htmlFor="imagem-ref" className="file-upload-label">
                                                <span className="material-symbols-outlined">upload_file</span>
                                                {formData.imagemReferenciaFile ? (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        {formData.imagemReferenciaFile.name}
                                                        <button 
                                                            type="button" 
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setFormData(prev => ({ ...prev, imagemReferenciaFile: null }));
                                                            }} 
                                                            className="clear-file-btn"
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>close</span>
                                                        </button>
                                                    </span>
                                                ) : "Clique para anexar PNG, JPG ou WEBP"}
                                            </label>
                                        </div>
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