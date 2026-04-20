import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { artistaService } from '../services/inkflowApi'
import './ArtistProfile.css'

const ArtistProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [artista, setArtista] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    artistaService.getById(id)
      .then(res => setArtista(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <p className="text-on-surface-variant font-body">Carregando perfil...</p>
    </div>
  )

  if (error || !artista) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <p className="text-on-surface-variant font-body">Artista não encontrado.</p>
    </div>
  )

  const handleBook = () => navigate(`/agendamento?artistaId=${artista.id}`)

  return (
    <div className="bg-background text-on-surface font-body antialiased selection:bg-primary-dim selection:text-on-primary overflow-x-hidden min-h-screen flex flex-col">
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto space-y-24 flex-grow w-full">
          
          {/* Hero Section */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
              <div className="lg:col-span-7 space-y-8 relative z-10">
                  <div className="space-y-2">
                      <span className="font-label text-sm uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                          <span className="w-8 h-[1px] bg-primary"></span>
                          {artista.role || "Artista"}
                      </span>
                      <h1 className="font-[Epilogue] font-headline text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none text-glow-primary">
                          {artista.nome}
                      </h1>
                  </div>
                  <p className="font-[Inter] font-body text-lg text-on-surface-variant max-w-xl leading-relaxed">
                      {artista.bio || "Este artista ainda não publicou uma biografia completa."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button 
                         onClick={handleBook}
                         className="bg-gradient-to-br from-primary to-primary-dim text-on-primary font-label font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-lg box-glow-primary hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
                          Agendar Sessão
                      </button>
                      <button 
                          onClick={() => navigate('/artistas')}
                          className="border border-outline-variant/30 text-primary font-label font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-lg hover:bg-surface-container-high active:scale-95 transition-all flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                          Voltar
                      </button>
                  </div>

                  {artista.especialidades && (
                      <div className="bg-surface-container-low border border-white/5 p-6 rounded flex flex-col justify-between hover:bg-surface-container-highest transition-colors mt-4">
                          <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Signature Style</span>
                          <span className="font-[Epilogue] font-headline text-3xl font-bold tracking-tight uppercase leading-none mt-2">
                              {typeof artista.especialidades === 'string'
                                  ? artista.especialidades.split(',')[0].trim()
                                  : artista.especialidades[0]}
                              <br/><span className="text-primary">Tattoo</span>
                          </span>
                      </div>
                  )}
              </div>
              
              <div className="lg:col-span-5 relative">
                  <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full z-0"></div>
                  <div className="relative z-10 bg-surface-container-highest rounded overflow-hidden aspect-[3/4] border border-white/5">
                      {artista.fotoUrl ? (
                        <img 
                           className="w-full h-full object-cover mix-blend-luminosity opacity-80 hover:opacity-100 transition-opacity duration-700 hover:scale-105 transform" 
                           src={artista.fotoUrl} 
                           alt={artista.nome} 
                        />
                      ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center border-2 border-primary border-opacity-10 text-9xl font-[Epilogue] font-headline font-black text-primary bg-surface-container-low">
                            {artista.nome?.charAt(0)}
                         </div>
                      )}
                  </div>
              </div>
          </section>

          {/* Portfolio Masonry (The Ledger) */}
          <section className="space-y-8">
              <div className="flex items-end justify-between border-b border-outline-variant/10 pb-4">
                  <h2 className="font-[Epilogue] font-headline text-3xl font-bold uppercase tracking-tight">O Catálogo</h2>
                  <a className="font-label text-xs md:text-sm uppercase text-primary hover:text-primary-dim transition-colors flex items-center gap-1 cursor-pointer">
                      Arquivo Completo
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
              </div>
              
              {artista.portfolio?.length > 0 ? (
                 <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                     {artista.portfolio.map((item) => (
                         <div 
                           key={item.id} 
                           onClick={() => setSelectedImage(item.imagemUrl)}
                           className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded border border-white/5 bg-surface-container-low"
                         >
                             <img 
                               className="w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                               src={item.imagemUrl} 
                               alt={item.descricao || item.categoria || 'Portfólio do Artista'} 
                             />
                             <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                 <span className="material-symbols-outlined text-primary text-4xl transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-100">
                                    zoom_in
                                 </span>
                             </div>
                         </div>
                     ))}
                 </div>
              ) : (
                 <div className="text-center py-16 bg-surface-container-low border border-white/5 rounded">
                    <p className="text-on-surface-variant font-[Inter] font-body">Este artista ainda não adicionou obras ao portfólio.</p>
                 </div>
              )}
          </section>

      </main>

      {/* Lightbox Modal */}
      <div 
        className={`fixed inset-0 z-[100] items-center justify-center p-4 md:p-10 transition-all duration-300 ease-out ${selectedImage ? 'flex opacity-100 pointer-events-auto' : 'hidden opacity-0 pointer-events-none'}`}
      >
          {/* Backdrop */}
          <div 
             onClick={() => setSelectedImage(null)}
             className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
          ></div>
          
          {/* Image Container */}
          <div className={`relative z-10 w-full h-full max-h-[85vh] flex items-center justify-center pointer-events-none transition-transform duration-300 ${selectedImage ? 'scale-100' : 'scale-95'}`}>
              {selectedImage && (
                 <img 
                    src={selectedImage} 
                    className="max-w-full max-h-full object-contain rounded-sm shadow-[0_0_50px_rgba(255,141,140,0.1)] pointer-events-auto border border-white/5"
                    alt="Zoom Obra"
                 />
              )}
              
              <button 
                 onClick={() => setSelectedImage(null)}
                 className="absolute top-0 right-0 md:-top-4 md:-right-4 text-on-surface-variant hover:text-primary bg-surface-container-highest/80 hover:bg-surface-container-highest rounded-full p-2 backdrop-blur-md pointer-events-auto transition-all shadow-lg active:scale-90"
              >
                  <span className="material-symbols-outlined">close</span>
              </button>
          </div>
      </div>
      
    </div>
  )
}

export default ArtistProfile
