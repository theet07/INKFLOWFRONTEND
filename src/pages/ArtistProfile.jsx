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
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <p className="text-on-surface-variant font-body">Carregando perfil...</p>
    </div>
  )

  if (error || !artista) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <p className="text-on-surface-variant font-body">Artista não encontrado.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface text-on-surface pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">

        {/* Bloco 1 — Header */}
        <div className="glass-card p-8 mb-8 flex gap-8 flex-wrap items-start">
          {artista.fotoUrl ? (
            <img
              src={artista.fotoUrl}
              alt={artista.nome}
              className="w-36 h-36 rounded-full object-cover border-2 border-primary image-hover-effect"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-surface-container flex items-center justify-center border-2 border-primary text-5xl font-headline font-black text-primary">
              {artista.nome?.charAt(0)}
            </div>
          )}

          <div className="flex-1">
            <h1 className="font-headline font-black text-4xl uppercase tracking-wide mb-1">
              {artista.nome}
            </h1>
            <p className="text-primary font-body font-semibold mb-4">{artista.role}</p>

            {artista.bio && (
              <p className="text-on-surface-variant font-body leading-relaxed mb-6 max-w-xl">
                {artista.bio}
              </p>
            )}

            {artista.especialidades?.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-6">
                {artista.especialidades.map((esp, i) => (
                  <span
                    key={i}
                    className="text-[9px] uppercase tracking-widest bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-white"
                  >
                    {esp}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => navigate(`/agendamento?artistaId=${artista.id}`)}
              className="btn-modern px-8 py-3 font-headline font-black uppercase tracking-widest text-sm"
            >
              Agendar Sessão
            </button>
          </div>
        </div>

        {/* Bloco 2 — Portfolio */}
        {artista.portfolio?.length > 0 ? (
          <div>
            <h2 className="font-headline font-black text-2xl uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
              Portfólio
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {artista.portfolio.map(item => (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-surface-container border border-white/5"
                >
                  <img
                    src={item.imagemUrl}
                    alt={item.descricao || item.categoria}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {(item.categoria || item.descricao) && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.categoria && (
                        <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-1">
                          {item.categoria}
                        </p>
                      )}
                      {item.descricao && (
                        <p className="text-on-surface-variant text-sm">{item.descricao}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-on-surface-variant font-body">
              Este artista ainda não adicionou obras ao portfólio.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default ArtistProfile
