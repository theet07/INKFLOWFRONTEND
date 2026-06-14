import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { contatoService } from '../services/inkflowApi'
import './Contact.css'

const Contact = () => {
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: ''
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', isError: false })

  // Auto-preencher formulário com dados do usuário logado
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nome: user.nome || user.fullName || prev.nome,
        email: user.email || prev.email,
        telefone: user.telefone ? formatTelefone(user.telefone) : prev.telefone
      }))
    }
  }, [user])

  const showToast = (message, isError = false) => {
    setToast({ show: true, message, isError })
    setTimeout(() => setToast({ show: false, message: '', isError: false }), 3000)
  }

  const formatTelefone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await contatoService.enviar(formData)
      showToast('Mensagem enviada com sucesso!')
      setFormData({ nome: '', email: '', telefone: '', mensagem: '' })
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err)
      const errorMsg = err.response?.data?.error || 'Erro ao enviar mensagem. Tente novamente.'
      showToast(errorMsg, true)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'telefone' ? formatTelefone(value) : value
    })
  }

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1 className="contact-title">CONTATO</h1>
          <p className="contact-subtitle">
            Entre em contato com a equipe INKFLOW para dúvidas sobre a plataforma. Para dúvidas sobre agendamentos ou tatuagens, fale diretamente com o artista através do seu perfil.
          </p>
        </div>

        <div className="contact-card">
          <form onSubmit={handleSubmit}>
            <div className="contact-form-grid">
              <div className="contact-form-group">
                <label className="contact-label">NOME *</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="contact-input"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: '#ffffff', colorScheme: 'dark' }}
                  maxLength={60}
                  required
                />
                <p style={{ textAlign: 'right', fontSize: '0.7rem', color: formData.nome.length > 54 ? '#E21B3C' : 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                  {formData.nome.length}/60
                </p>
              </div>
              
              <div className="contact-form-group">
                <label className="contact-label">EMAIL *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="contact-input"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: '#ffffff', colorScheme: 'dark' }}
                  maxLength={50}
                  required
                />
                <p style={{ textAlign: 'right', fontSize: '0.7rem', color: formData.email.length > 45 ? '#E21B3C' : 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                  {formData.email.length}/50
                </p>
              </div>
              
              <div className="contact-form-group">
                <label className="contact-label">TELEFONE</label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="contact-input"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: '#ffffff', colorScheme: 'dark' }}
                />
              </div>
            </div>
            
            <div className="contact-form-group-full">
              <label className="contact-label">MENSAGEM *</label>
              <textarea
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                className="contact-textarea"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: '#ffffff', colorScheme: 'dark' }}
                maxLength={1000}
                required
              ></textarea>
              <p style={{ textAlign: 'right', fontSize: '0.7rem', color: formData.mensagem.length > 900 ? '#E21B3C' : 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                {formData.mensagem.length}/1000
              </p>
            </div>
            
            <div className="contact-buttons">
              <button type="submit" className="contact-btn-primary" disabled={loading}>
                {loading ? 'ENVIANDO...' : 'ENVIAR MENSAGEM'}
              </button>
              
              <a
                href={`https://wa.me/15144373894?text=${encodeURIComponent('Olá! Vim pelo site InkFlow e gostaria de mais informações.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn-whatsapp"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" fill="#ffffff"/>
                </svg>
                FALAR PELO WHATSAPP
              </a>
            </div>
          </form>
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <div className={`contact-toast ${toast.isError ? 'error' : ''}`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  )
}

export default Contact