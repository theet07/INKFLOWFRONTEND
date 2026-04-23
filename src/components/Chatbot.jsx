import { useState, useRef, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL?.replace('/v1', '') || 'https://inkflowbackend-4w1g.onrender.com/api'

const Chatbot = () => {
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
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          messages: updatedMessages,
          sessionId: 'session_' + Date.now()
        })
      })

      if (res.status === 429) {
        setMessages(prev => [...prev, { role: 'model', content: 'Muitas mensagens em pouco tempo. Aguarde um momento.' }])
        return
      }

      if (!res.ok) throw new Error('Erro na resposta')

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'model', content: data.response }])
    } catch {
      setMessages(prev => [...prev, { role: 'model', content: 'Desculpe, ocorreu um erro. Tente novamente em instantes.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>
        <svg viewBox="0 0 1024 1024" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" style={{width: '24px', height: '24px'}}>
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M512 301.2m-10 0a10 10 0 1 0 20 0 10 10 0 1 0-20 0Z" fill="#000000"></path>
            <path d="M400.3 744.5c2.1-0.7 4.1-1.4 6.2-2-2 0.6-4.1 1.3-6.2 2z m0 0c2.1-0.7 4.1-1.4 6.2-2-2 0.6-4.1 1.3-6.2 2z" fill="#000000"></path>
            <path d="M511.8 256.6c24.4 0 44.2 19.8 44.2 44.2S536.2 345 511.8 345s-44.2-19.8-44.2-44.2 19.9-44.2 44.2-44.2m0-20c-35.5 0-64.2 28.7-64.2 64.2s28.7 64.2 64.2 64.2 64.2-28.7 64.2-64.2-28.7-64.2-64.2-64.2z" fill="#000000"></path>
            <path d="M730.7 529.5c0.4-8.7 0.6-17.4 0.6-26.2 0-179.6-86.1-339.1-219.3-439.5-133.1 100.4-219.2 259.9-219.2 439.5 0 8.8 0.2 17.5 0.6 26.1-56 56-90.6 133.3-90.6 218.7 0 61.7 18 119.1 49.1 167.3 30.3-49.8 74.7-90.1 127.7-115.3 39-18.6 82.7-29 128.8-29 48.3 0 93.9 11.4 134.3 31.7 52.5 26.3 96.3 67.7 125.6 118.4 33.4-49.4 52.9-108.9 52.9-173.1 0-85.4-34.6-162.6-90.5-218.6z" fill="#000000"></path>
            <path d="M512 819.3c8.7 0 24.7 22.9 24.7 60.4s-16 60.4-24.7 60.4-24.7-22.9-24.7-60.4 16-60.4 24.7-60.4m0-20c-24.7 0-44.7 36-44.7 80.4 0 44.4 20 80.4 44.7 80.4s44.7-36 44.7-80.4c0-44.4-20-80.4-44.7-80.4z" fill="#000000"></path>
          </g>
        </svg>
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
                {message.content}
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
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
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
