import { useState, useEffect, useRef, useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const API_BASE = import.meta.env.VITE_API_URL?.replace('/v1', '') || 'https://inkflowbackend-4w1g.onrender.com/api'

const formatTime = (dt) => {
  if (!dt) return ''
  return new Date(dt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })
}

const MessagesTab = ({ showToast }) => {
  const { user, token } = useAuth()
  const [conversas, setConversas] = useState([]) // [{ clienteId, nome, fotoUrl, ultimaMsg, naoLidas }]
  const [clienteSelecionado, setClienteSelecionado] = useState(null)
  const [mensagens, setMensagens] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const pollingRef = useRef(null)
  const ultimoTimestampRef = useRef(new Date().toISOString())
  const messagesEndRef = useRef(null)

  const artistaId = user?.artistaId || user?.id

  const headers = useMemo(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }), [token])

  // Carrega lista de conversas
  const carregarConversas = async () => {
    try {
      const res = await fetch(`${API_BASE}/mensagens/conversas`, { headers })
      const lista = await res.json() // [{ clienteId, nome, fotoUrl }]
      const enriquecida = await Promise.all(lista.map(async (c) => {
        const r = await fetch(`${API_BASE}/mensagens/conversa/${c.clienteId}`, { headers })
        const msgs = await r.json()
        const ultima = msgs[msgs.length - 1]
        const naoLidas = msgs.filter(m => !m.lida && m.destinatarioId === artistaId).length
        return { ...c, ultimaMsg: ultima?.conteudo || '', naoLidas, createdAt: ultima?.createdAt }
      }))
      setConversas(enriquecida.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } catch { } finally {
      setLoading(false)
    }
  }

  // Carrega histórico da conversa selecionada
  const carregarConversa = async (clienteId) => {
    try {
      const res = await fetch(`${API_BASE}/mensagens/conversa/${clienteId}`, { headers })
      const msgs = await res.json()
      setMensagens(msgs)
      if (msgs.length > 0) {
        ultimoTimestampRef.current = msgs[msgs.length - 1].createdAt
      }
      // Marcar como lidas
      msgs.filter(m => !m.lida && m.destinatarioId === artistaId)
          .forEach(m => fetch(`${API_BASE}/mensagens/${m.id}/lida`, { method: 'PATCH', headers }))
    } catch { }
  }

  // Polling de novas mensagens
  const iniciarPolling = (clienteId) => {
    pararPolling()
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/mensagens/novas?desde=${ultimoTimestampRef.current}`, { headers })
        const novas = await res.json()
        if (novas.length > 0) {
          setMensagens(prev => [...prev, ...novas])
          ultimoTimestampRef.current = novas[novas.length - 1].createdAt
          novas.filter(m => !m.lida && m.destinatarioId === artistaId)
               .forEach(m => fetch(`${API_BASE}/mensagens/${m.id}/lida`, { method: 'PATCH', headers }))
        }
      } catch { }
    }, 5000)
  }

  const pararPolling = () => {
    if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null }
  }

  useEffect(() => {
    carregarConversas()
    return () => pararPolling()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  const selecionarCliente = async (clienteId) => {
    setClienteSelecionado(clienteId)
    await carregarConversa(clienteId)
    iniciarPolling(clienteId)
  }

  const enviarMensagem = async () => {
    if (!input.trim() || !clienteSelecionado) return
    setEnviando(true)
    try {
      const res = await fetch(`${API_BASE}/mensagens`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ remetenteId: artistaId, destinatarioId: clienteSelecionado, conteudo: input.trim() })
      })
      if (!res.ok) {
        const err = await res.json()
        showToast(err.message || 'Erro ao enviar mensagem', true)
        return
      }
      const nova = await res.json()
      setMensagens(prev => [...prev, nova])
      ultimoTimestampRef.current = nova.createdAt
      setInput('')
    } catch { showToast('Erro ao enviar mensagem', true) }
    finally { setEnviando(false) }
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', background: '#0e0e0e' }}>

      {/* Lista de conversas */}
      <div style={{ width: 280, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p style={{ fontSize: '0.65rem', color: '#e63946', textTransform: 'uppercase', letterSpacing: 2, margin: 0 }}>Mensagens</p>
          <h2 style={{ margin: '4px 0 0', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Conversas</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Carregando...</div>
          ) : conversas.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>chat_bubble</span>
              Nenhuma conversa ainda.
            </div>
          ) : conversas.map(c => (
            <div key={c.clienteId} onClick={() => selecionarCliente(c.clienteId)}
              style={{ padding: '14px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.04)', background: clienteSelecionado === c.clienteId ? 'rgba(230,57,70,0.08)' : 'transparent', transition: 'background 0.15s' }}
              onMouseEnter={e => { if (clienteSelecionado !== c.clienteId) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
              onMouseLeave={e => { if (clienteSelecionado !== c.clienteId) e.currentTarget.style.background = 'transparent' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e63946', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', color: '#fff', flexShrink: 0, overflow: 'hidden' }}>
                {c.fotoUrl
                  ? <img src={c.fotoUrl} alt={c.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                  : (c.nome || '?').charAt(0).toUpperCase()
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{c.nome || 'Cliente'}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.ultimaMsg || '...'}</p>
              </div>
              {c.naoLidas > 0 && (
                <span style={{ background: '#e63946', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>{c.naoLidas}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Área da conversa */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!clienteSelecionado ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', flexDirection: 'column', gap: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '3rem' }}>chat_bubble_outline</span>
            <p style={{ fontSize: '0.9rem' }}>Selecione uma conversa</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 12 }}>
              {(() => {
                const c = conversas.find(x => x.clienteId === clienteSelecionado)
                return (
                  <>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e63946', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', overflow: 'hidden', flexShrink: 0 }}>
                      {c?.fotoUrl
                        ? <img src={c.fotoUrl} alt={c.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                        : (c?.nome || '?').charAt(0).toUpperCase()
                      }
                    </div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{c?.nome || 'Cliente'}</p>
                  </>
                )
              })()}
            </div>

            {/* Mensagens */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mensagens.map(m => {
                const isArtista = m.remetenteId === artistaId
                return (
                  <div key={m.id} style={{ display: 'flex', justifyContent: isArtista ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: isArtista ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: isArtista ? '#e63946' : 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.875rem', lineHeight: 1.5 }}>
                      <p style={{ margin: 0 }}>{m.conteudo}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '0.65rem', opacity: 0.6, textAlign: 'right' }}>{formatTime(m.createdAt)}</p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 12 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !enviando && enviarMensagem()}
                placeholder="Digite uma mensagem..."
                disabled={enviando}
                style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 16px', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
              />
              <button onClick={enviarMensagem} disabled={enviando || !input.trim()}
                style={{ background: '#e63946', border: 'none', borderRadius: 10, padding: '10px 20px', color: '#fff', fontWeight: 700, cursor: enviando || !input.trim() ? 'not-allowed' : 'pointer', opacity: enviando || !input.trim() ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>send</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MessagesTab
