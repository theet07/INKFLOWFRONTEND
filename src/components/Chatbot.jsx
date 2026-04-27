import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { chatService } from '../services/inkflowApi'
import ReactMarkdown from 'react-markdown'

const Chatbot = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'model', content: 'Olá! Sou o assistente do InkFlow. Como posso ajudar você hoje?' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const quickReplies = [
    'Quero agendar',
    'Ver preços',
    'Estilos disponíveis',
    'Portfólio',
    'Sobre o estúdio',
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text) => {
    const userText = text || inputValue.trim()
    if (!userText) return

    const userMessage = { role: 'user', content: userText }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInputValue('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const res = await chatService.sendMessage({
        messages: updatedMessages,
        sessionId: 'session_' + Date.now()
      })

      const data = res.data
      setMessages(prev => [...prev, { role: 'model', content: data.response }])
    } catch (error) {
      if (error.response?.status === 429) {
        setMessages(prev => [...prev, { role: 'model', content: 'Muitas mensagens em pouco tempo. Aguarde um momento.' }])
      } else {
        setMessages(prev => [...prev, { role: 'model', content: 'Desculpe, ocorreu um erro. Tente novamente em instantes.' }])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>
        <img src="/FAVORICON-INKFLOW.png" alt="InkFlow" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
      </div>

      {isOpen && (
        <div className="chatbot-window" style={{ display: 'flex' }}>
          <div className="chatbot-header">
            <h3>Ink Flow - Atendimento</h3>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}>
                {message.role === 'model'
                  ? <ReactMarkdown
                      components={{
                        a: ({ href, children }) => (
                          <a
                            onClick={(e) => {
                              e.preventDefault()
                              setIsOpen(false)
                              navigate(href)
                            }}
                            style={{ color: '#E21B3C', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}
                          >
                            {children}
                          </a>
                        )
                      }}
                    >{message.content}</ReactMarkdown>
                  : message.content
                }
              </div>
            ))}
            {loading && (
              <div className="message bot-message" style={{ opacity: 0.6 }}>
                Digitando...
              </div>
            )}
            <div ref={messagesEndRef} />

            {messages.length === 1 && (
              <div className="quick-buttons">
                {quickReplies.map((reply, index) => (
                  <button key={index} className="quick-btn" onClick={() => handleSend(reply)}>
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
              placeholder="Digite sua mensagem..."
              disabled={loading}
            />
            <button onClick={() => handleSend()} disabled={loading}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chatbot
