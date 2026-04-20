import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { artistaService } from '../services/inkflowApi'

const ArtistProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [artista, setArtista] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    artistaService.getById(id)
      .then(res => setArtista(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', color: 'white', textAlign: 'center' }}>
      <p>Carregando perfil...</p>
    </div>
  )

  if (error || !artista) return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', color: 'white', textAlign: 'center' }}>
      <p>Artista não encontrado.</p>
    </div>
  )

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', color: 'white', maxWidth: '1100px', margin: '0 auto', padding: '100px 24px 48px' }}>

      {/* Bloco 1 — Header do artista */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', marginBottom: '48px', flexWrap: 'wrap' }}>
        {artista.fotoUrl ? (
          <img src={artista.fotoUrl} alt={artista.nome}
            style={{ width: '140px', height: '140px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ff0000' }} />
        ) : (
          <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', border: '3px solid #ff0000' }}>
            {artista.nome?.charAt(0)}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '4px' }}>{artista.nome}</h1>
          <p style={{ color: '#ff0000', fontWeight: '600', marginBottom: '12px' }}>{artista.role}</p>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '16px', maxWidth: '600px' }}>{artista.bio}</p>

          {/* Especialidades */}
          {artista.especialidades?.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {artista.especialidades.map((esp, i) => (
                <span key={i} style={{ background: '#262626', border: '1px solid #484847', borderRadius: '20px', padding: '4px 12px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>
                  {esp}
                </span>
              ))}
            </div>
          )}

          {/* Botão Agendar */}
          <button
            onClick={() => navigate(`/agendamento?artistaId=${artista.id}`)}
            style={{ background: '#ff0000', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 32px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
            Agendar Sessão
          </button>
        </div>
      </div>

      {/* Bloco 2 — Portfolio */}
      {artista.portfolio?.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '24px', borderBottom: '1px solid #262626', paddingBottom: '12px' }}>
            Portfólio
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {artista.portfolio.map(item => (
              <div key={item.id} style={{ borderRadius: '12px', overflow: 'hidden', background: '#1a1919' }}>
                <img src={item.imagemUrl} alt={item.descricao || item.categoria}
                  style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
                {(item.categoria || item.descricao) && (
                  <div style={{ padding: '12px' }}>
                    {item.categoria && <p style={{ color: '#ff0000', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>{item.categoria}</p>}
                    {item.descricao && <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>{item.descricao}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio vazio */}
      {(!artista.portfolio || artista.portfolio.length === 0) && (
        <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.4)' }}>
          <p>Este artista ainda não adicionou obras ao portfólio.</p>
        </div>
      )}
    </div>
  )
}

export default ArtistProfile
