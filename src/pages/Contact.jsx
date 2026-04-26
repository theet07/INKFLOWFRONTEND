import { useState } from 'react'
import emailjs from '@emailjs/browser'

const Contact = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: ''
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', isError: false })

  const showToast = (message, isError = false) => {
    setToast({ show: true, message, isError })
    setTimeout(() => setToast({ show: false, message: '', isError: false }), 3000)
  }

  const formatTelefone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})$/, '$1-$2')
      .slice(0, 15)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await emailjs.send(
        'SERVICE_ID',      // substituir após configurar no EmailJS
        'TEMPLATE_ID',     // substituir após configurar no EmailJS
        {
          from_name: formData.nome,
          from_email: formData.email,
          phone: formData.telefone,
          message: formData.mensagem,
          to_email: 'inkflowstudios07@gmail.com',
        },
        'PUBLIC_KEY'       // substituir após configurar no EmailJS
      )
      showToast('Mensagem enviada com sucesso!')
      setFormData({ nome: '', email: '', telefone: '', mensagem: '' })
    } catch (err) {
      console.error('Erro ao enviar e-mail:', err)
      showToast('Erro ao enviar mensagem. Tente novamente.', true)
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
    <div className="contact">
      <section className="section" style={{ paddingTop: '8rem' }}>
        <h2>Contato</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#ccc' }}>
          Entre em contato com a equipe INKFLOW para dúvidas sobre a plataforma. Para dúvidas sobre agendamentos ou tatuagens, fale diretamente com o artista através do seu perfil.
        </p>
        
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Telefone</label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Mensagem *</label>
              <textarea
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
            </div>
            
            <button type="submit" className="btn" disabled={loading} style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>Ou fale conosco diretamente:</p>
            <a
              href={`https://wa.me/15144373894?text=${encodeURIComponent('Olá! Vim pelo site InkFlow e gostaria de mais informações.')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#25D366',
                color: '#fff',
                padding: '1rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#1da851'}
              onMouseLeave={(e) => e.target.style.background = '#25D366'}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" fill="#ffffff"/>
              </svg>
              Falar pelo WhatsApp
            </a>
          </div>
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: toast.isError ? '#e8192c' : '#10b981',
            color: '#fff',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 9999,
            animation: 'slideIn 0.3s ease-out'
          }}>
            {toast.message}
          </div>
        )}
      </section>
    </div>
  )
}

export default Contact