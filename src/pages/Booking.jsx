import { useState, useEffect } from 'react'
import { agendamentoService, clienteService } from '../services/inkflowApi'
import './Booking.css'

const Booking = () => {
    const [bookingState, setBookingState] = useState({
        style: 'Blackwork',
        artist: 'Sasha K.',
        day: '12',
        time: '01:30 PM'
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

    const stylesOptions = [
        { name: 'Realism', artists: 3, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPLPjgMK9FYYycsAS-RoGWEouIFm6rwjICxkCo87EQAdpuLrbWMZNZuozsY9Pk6koWfEGbYpWfJc7wisgjFWuMq4QBJDUkN9uLEUDx9e9gYmuE6rJn6IUkFfiZDmbj1UKnbbfsRfCVaJ6NIkN2J4Lzpya4cXxD6nkIrfq-jdoWvoLAr9FH4O_QIIFGwbD6_c-LYYgPgf9CTJV30juolMrK-bVKVzpnmX1iUAbL2nenBGw6E999zhNxGEixCK73hkvd3NY5FD9yYDc' },
        { name: 'Blackwork', artists: 5, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkjpYAdUA2_WJ1yDEDzxLuB8OA9lcZsXnz71_aITrlK8oR9E0ga2rObC-6jmmd-FTxPw4Od5XbqFHB7vxXT_gcyk93c5vIPDwujOBaxxlKdXul4529pc-nZB1DEC7tsS4dpGoyB6-6c1VWq7lGZ4rHL77brCGsjUVrnhkAd_OxOtZoNOdVwUJpSGTsdDYenM9sG94cWarP_PIBFZa3PiH_EDIbNKI3pTvUiHjUSJtffrIeKoAlUHkYRHfcd1CsHe8G45KCt_ys1-g' },
        { name: 'Traditional', artists: 2, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3Gwkl0DNmMojl1mfs9YSdu7btaax-VOa5Xp17lF4qJHk8SKxgAeBGa48w5-6QR0KdOqExWcgE_PU1NYjmFmTLlLn9Y4U2La0I-kqnLuchA252nAajxD43VJXjlnGFPgZ-Fu8zcQF34nEv640A2VRQs53nCyGRwR3mmL_gEVi77uwkMJFLHFy3brmYCBjQgf-oO_XEdHUJ74QUcm1-XTKBFjFhLICvZrq3yuMWlsbi4ksyh68y_UZjXy_l33WnXPlD3jlaZamx7t4' },
        { name: 'Geometric', artists: 4, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUDQfNIYOBK4IsZokbpwD1uOE5-9jpsPLqD1IpqVeWEw0qisqUHXOg_p7AcQPGA4GebjAPBYtVZDRT5uuNO2Jwb8u8lbixq05FRfoE2IPRoMAI8bRTXRnMHfI2yp2U2kJRftbznZx8g4DvkT5oj6zXorE8YDZT8wr_u0yzZY6-TDGt1-L-WDLGtbFcKMMQ7WStblhFrNPZM8EE9mj6LBzTlziC2Q8PPQB1wB8nCk4ZLbKInG8rpJpAn0gNuk1bmZTi6Jk04NH7AAs' }
    ]

    const artistsOptions = [
        { name: 'Marcos Silva', role: 'Realismo & Blackwork', img: '/assets/portifolio_tatuadores/Tatuador_1.png' },
        { name: 'Julio Costa', role: 'Geométrico', img: '/assets/portifolio_tatuadores/Tatuador_2.png' },
        { name: 'Sasha Mendes', role: 'Minimalista & Fine Line', img: '/assets/portifolio_tatuadores/Tatuadora_3.png' },
        { name: 'Lucas Pereira', role: 'Tradicional', img: '/assets/portifolio_tatuadores/Tatuador_4.png' },
        { name: 'Nina Ferreira', role: 'Aquarela', img: '/assets/portifolio_tatuadores/Tatuadora_5.png' }
    ]

    const days = [
        { day: '1', active: true }, { day: '2', active: true }, { day: '3', active: true }, { day: '4', active: true },
        { day: '5', active: true }, { day: '6', active: false }, { day: '7', active: true }, { day: '8', active: true },
        { day: '9', active: true }, { day: '10', active: true }, { day: '11', active: true }, { day: '12', active: true },
        { day: '13', active: false }, { day: '14', active: true, content: '•', isDot: true }, { day: '15', active: true },
    ]

    const timeSlots = ['10:00 AM', '01:30 PM', '04:00 PM']

    const showToast = (message, type = 'success') => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
    }

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id.replace('form-', '')]: type === 'checkbox' ? checked : value
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

            const formattedDate = `2024-10-${bookingState.day.padStart(2, '0')}`
            let [hour, minutePeriod] = bookingState.time.split(':')
            let [minute, period] = minutePeriod.split(' ')
            let h = parseInt(hour)
            if (period === 'PM' && h !== 12) h += 12
            if (period === 'AM' && h === 12) h = 0
            const dataHora = `${formattedDate}T${h.toString().padStart(2, '0')}:${minute}:00`

            const novoAgendamento = {
                cliente: { id: clienteId },
                dataHora: dataHora,
                servico: `${bookingState.style} with ${bookingState.artist}`,
                descricao: formData.desc
            }

            await agendamentoService.create(novoAgendamento)

            showToast('Booking Confirmed!', 'success')

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
                            { num: 1, label: 'Style Selection' },
                            { num: 2, label: 'Choose Artist' },
                            { num: 3, label: 'Date & Time' },
                            { num: 4, label: 'Details' }
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
                        <h3><span className="material-symbols-outlined panel-icon">schedule</span> Opening Hours</h3>
                        <div className="info-row"><span>Mon - Fri</span><span>11:00 - 20:00</span></div>
                        <div className="info-row highlight"><span>Saturday</span><span>10:00 - 22:00</span></div>
                        <div className="info-row"><span>Sunday</span><span>Closed</span></div>
                    </div>
                </aside>

                {/* Main Booking Content */}
                <div className="booking-content">
                    {/* Step 1: Styles */}
                    <section id="styles-section">
                        <div className="section-header">
                            <div>
                                <h2>Choose Your Vibe</h2>
                                <p>Select a style to filter our specialized artists.</p>
                            </div>
                            <span className="step-badge">Step 01 / 04</span>
                        </div>

                        <div className="styles-grid">
                            {stylesOptions.map(style => (
                                <div
                                    key={style.name}
                                    onClick={() => setBookingState(prev => ({ ...prev, style: style.name }))}
                                    className={`style-card ${bookingState.style === style.name ? 'selected' : ''}`}
                                >
                                    <div className="style-card-overlay"></div>
                                    <img src={style.img} alt={style.name} />
                                    <div className="style-card-info">
                                        <h3>{style.name}</h3>
                                        <span>{style.artists} Artists</span>
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
                                <h2>The Masters</h2>
                                <p>Specialized in Blackwork and Fine Line.</p>
                            </div>
                            <span className="step-badge">Step 02 / 04</span>
                        </div>

                        <div className="artists-grid">
                            {artistsOptions.map(artist => (
                                <div
                                    key={artist.name}
                                    onClick={() => setBookingState(prev => ({ ...prev, artist: artist.name }))}
                                    className={`artist-card ${bookingState.artist === artist.name ? 'selected' : ''}`}
                                >
                                    <div className="artist-avatar">
                                        <img src={artist.img} alt={artist.name} />
                                    </div>
                                    <div className="artist-info">
                                        <h4>{artist.name}</h4>
                                        <p>{artist.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Step 3 & 4: Calendar and Info */}
                    <section id="datetime-section">
                        <div className="steps-3-4-grid">
                            {/* Date Selection */}
                            <div className="booking-calendar-wrap">
                                <div className="section-header">
                                    <h2>The Session</h2>
                                    <span className="step-badge">Step 03</span>
                                </div>
                                <div className="calendar-panel">
                                    <div className="calendar-nav">
                                        <button><span className="material-symbols-outlined">chevron_left</span></button>
                                        <span>October 2024</span>
                                        <button><span className="material-symbols-outlined">chevron_right</span></button>
                                    </div>
                                    <div className="calendar-weekdays">
                                        <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
                                    </div>
                                    <div className="calendar-days">
                                        <div className="calendar-day empty">28</div><div className="calendar-day empty">29</div><div className="calendar-day empty">30</div><div className="calendar-day empty">31</div>
                                        {days.map((d, i) => (
                                            <div
                                                key={i}
                                                onClick={() => d.active && setBookingState(prev => ({ ...prev, day: d.day }))}
                                                className={`calendar-day ${!d.active ? 'disabled' : ''} ${bookingState.day === d.day ? 'selected' : ''}`}
                                            >
                                                {d.isDot ? d.content : d.day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="time-slots-section">
                                        <h4>Available Slots</h4>
                                        <div className="time-periods-grid">
                                            {timeSlots.map(time => (
                                                <div
                                                    key={time}
                                                    onClick={() => setBookingState(prev => ({ ...prev, time }))}
                                                    className={`time-period ${bookingState.time === time ? 'selected' : ''}`}
                                                >
                                                    <span className="time-period-label">{time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Section */}
                            <div className="booking-details-wrap">
                                <div className="section-header">
                                    <h2>Your Detail</h2>
                                    <span className="step-badge">Step 04</span>
                                </div>
                                <form className="form-section-booking" onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Full Name</label>
                                            <input id="form-name" value={formData.name} onChange={handleChange} placeholder="John Doe" type="text" required />
                                        </div>
                                        <div className="form-field">
                                            <label>Phone</label>
                                            <input id="form-phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" type="tel" required />
                                        </div>
                                    </div>
                                    <div className="form-field">
                                        <label>Email</label>
                                        <input id="form-email" value={formData.email} onChange={handleChange} placeholder="hello@inkflow.com" type="email" required />
                                    </div>
                                    <div className="form-field">
                                        <label>Project Description</label>
                                        <textarea id="form-desc" value={formData.desc} onChange={handleChange} placeholder="Tell us about the size, placement, and your idea..." rows="4" required></textarea>
                                    </div>
                                    <label className="form-terms">
                                        <input id="form-terms" checked={formData.terms} onChange={handleChange} type="checkbox" />
                                        <span>I agree to the <a href="#">booking terms</a> and confirm I am 18+ years of age.</span>
                                    </label>
                                    <button disabled={isSubmitting} className="booking-submit-btn" type="submit">
                                        {isSubmitting ? (
                                            <>PROCESSING...</>
                                        ) : (
                                            <>Confirm Booking</>
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