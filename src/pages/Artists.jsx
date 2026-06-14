import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { artistaService } from '../services/inkflowApi';
import { getSafeImageUrl } from '../utils/imageUtils';
import './Artists.css';

const getFallbackImage = (especialidade) => {
    const s = (especialidade || '').toLowerCase();
    if (s.includes('floral') || s.includes('botâni')) return '/assets/portifolio_novo/Tattoo-Cobra-Floral.webp';
    if (s.includes('realist') || s.includes('realismo')) return '/assets/portifolio_novo/Rosto.webp';
    if (s.includes('colorid') || s.includes('aquarela')) return '/assets/portifolio_novo/Borboleta-Colorida.webp';
    if (s.includes('anime') || s.includes('geek')) return '/assets/portifolio_novo/HomemDeFerro.webp';
    if (s.includes('pet') || s.includes('animal') || s.includes('cachorro')) return '/assets/portifolio_novo/Dog.webp';
    if (s.includes('oriental')) return '/assets/portifolio_novo/tigrao.webp';
    if (s.includes('preto e cinza') || s.includes('caveira') || s.includes('black')) return '/assets/portifolio_novo/Caveira.webp';
    return '/assets/portifolio_novo/Rosa-Dos-Ventos-1.webp';
};

const Artists = () => {
    const navigate = useNavigate();
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentFilter, setCurrentFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await artistaService.getAllArtists();
                setArtists(response.data);
            } catch (error) {
                console.error("Erro ao puxar dados dos artistas:", error);
                showToast("Erro ao carregar artistas");
            } finally {
                setLoading(false);
            }
        };
        fetchArtists();
    }, []);

    const showToast = (message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    const handleAgendar = (artistId) => {
        navigate(`/artista/${artistId}`);
    };

    // Filtros de Galeria
    const filteredArtists = artists.filter(artist => {
        const nome = (artist.nome || '').toLowerCase();
        const role = (artist.role || '').toLowerCase();
        const especialidades = (artist.especialidades || []).map(s => s.toLowerCase());
        
        const matchesFilter = currentFilter === 'all' || (artist.especialidades || []).some(s => s.toUpperCase() === currentFilter.toUpperCase());
        const matchesSearch = nome.includes(searchTerm) || 
                              role.includes(searchTerm) || 
                              especialidades.some(s => s.includes(searchTerm));

        return matchesFilter && matchesSearch;
    });

    return (
        <div className="dark bg-surface text-on-surface font-body overflow-x-hidden w-full min-h-screen">
            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
                {/* Gallery Header */}
                <section className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <span className="text-xs uppercase tracking-[0.3em] text-primary mb-4 block font-bold">Curated Masters</span>
                            <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                                Explore the <br/><span className="text-on-surface-variant/40">Collective</span>
                            </h1>
                        </div>
                        <div className="flex gap-4 border-l border-white/5 pl-8 hidden lg:flex">
                            <div className="text-right flex flex-col justify-end">
                                <span className="text-[0.65rem] uppercase tracking-widest text-on-surface-variant mb-0.9">Estúdio Ativo</span>
                                <span className="font-headline font-bold text-lg m-0">24h Flow</span>
                            </div>
                            <div className="text-right flex flex-col justify-end">
                                <span className="text-[0.65rem] uppercase tracking-widest text-on-surface-variant mb-0.9">Total Residencies</span>
                                <span className="font-headline font-bold text-lg m-0">{artists.length} Masters</span>
                            </div>
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="mt-6 flex items-center justify-start">
                        <div className="relative group w-full sm:w-80">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                            <input 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value.toLowerCase().trim())}
                                className="bg-surface-container-highest border border-white/5 text-xs py-3 pl-10 pr-4 w-full focus:ring-1 focus:ring-primary/50 rounded-lg text-white outline-none placeholder-on-surface-variant transition-all hover:bg-surface-container" 
                                placeholder="Buscar artistas ou estilos..." 
                                type="text"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mt-8 flex flex-wrap gap-3 overflow-x-auto no-scrollbar pb-2">
                        {['all', 'REALISMO', 'BLACKWORK', 'FINE LINE', 'ORIENTAL', 'GEEK', 'FLORAL'].map((filter) => (
                            <button 
                                key={filter}
                                onClick={() => setCurrentFilter(filter)}
                                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${currentFilter === filter ? 'bg-primary text-black border-transparent' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border-white/5'}`}
                            >
                                {filter === 'all' ? 'All Styles' : filter}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Loading State or Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
                        <span className="material-symbols-outlined text-4xl animate-spin mb-4 text-primary">progress_activity</span>
                        <p className="text-xs uppercase font-bold tracking-[0.2em]">Sincronizando Galeria...</p>
                    </div>
                ) : filteredArtists.length === 0 ? (
                    /* No Results Message */
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-4xl text-surface-container-highest mb-4">search_off</span>
                        <h3 className="text-xl font-headline font-bold text-on-surface-variant uppercase tracking-widest">Nenhum artista encontrado</h3>
                        <p className="text-sm text-outline mt-2">Tente ajustar sua busca ou filtros.</p>
                    </div>
                ) : (
                    <>
                    {/* Featured Artist — Destaque da Semana */}
                    {artists.length > 0 && currentFilter === 'all' && searchTerm === '' && (() => {
                        const featured = artists[Math.floor(Date.now() / 86400000) % artists.length]; // rotaciona por dia
                        return (
                            <section className="mb-16">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-primary text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                                    <h2 className="font-headline text-xl font-black uppercase tracking-widest text-white">Destaque da Semana</h2>
                                </div>
                                <div 
                                    className="group relative w-full overflow-hidden rounded-2xl border border-white/5 cursor-pointer"
                                    style={{ height: 'clamp(320px, 45vw, 480px)' }}
                                    onClick={() => handleAgendar(featured.id)}
                                >
                                    <img 
                                        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 group-hover:opacity-50 transition-all duration-1000" 
                                        src={getSafeImageUrl(featured?.fotoUrl, featured?.nome)} 
                                        onError={(e) => { e.target.onerror = null; e.target.src = getFallbackImage(featured?.especialidades?.[0]) }}
                                        alt={featured?.nome || 'Featured'}
                                        style={{ objectPosition: 'center' }}
                                    />
                                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.1) 100%)' }}></div>
                                    
                                    <div className="absolute inset-0 flex items-center z-10 px-8 md:px-14">
                                        <div className="max-w-lg">
                                            <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold block mb-3">
                                                <span className="material-symbols-outlined text-sm align-middle mr-1" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                                                Artista em Destaque
                                            </span>
                                            <h2 className="font-headline text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-[1.1] mb-3">
                                                Conheça o traço de<br/><span className="text-primary">{featured.nome}</span>
                                            </h2>
                                            <p className="text-sm text-on-surface-variant mb-2 max-w-md leading-relaxed">
                                                {featured.bio || 'Artista especializado em transformar ideias em arte permanente.'}
                                            </p>
                                            <div className="flex items-center gap-2 mb-6">
                                                <span className="material-symbols-outlined text-primary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                                <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">5.0 • Agenda Aberta</span>
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleAgendar(featured.id); }}
                                                className="px-8 py-4 text-black font-headline font-black uppercase tracking-widest text-xs rounded-lg shadow-xl transition-all hover:brightness-110 active:scale-[0.97] bg-gradient-to-r from-primary to-primary-container"
                                            >
                                                <span className="material-symbols-outlined text-sm align-middle mr-2">calendar_month</span>
                                                Agendar com {featured.nome?.split(' ')[0]}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Avatar flutuante no canto */}
                                    <div className="absolute bottom-6 right-6 md:right-10 z-10 hidden md:flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-3 rounded-full border border-white/10">
                                        <div className="w-10 h-10 rounded-full border border-primary overflow-hidden">
                                            <img 
                                                className="w-full h-full object-cover" 
                                                src={getSafeImageUrl(featured?.fotoUrl, featured?.nome)} 
                                                onError={(e) => { e.target.onerror = null; e.target.src = getSafeImageUrl(null, featured?.nome) }}
                                                alt="avatar"
                                                style={{ objectPosition: 'center' }}
                                            />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-white block">{featured.nome}</span>
                                            <span className="text-[9px] uppercase tracking-widest text-on-surface-variant">{(featured.especialidades?.[0]) || 'Resident'}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        );
                    })()}
                    <div className="grid gap-10" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                        {filteredArtists.map((artist, idx) => {
                            const [mainStyle, subStyle] = (artist.role || '').split(',').map(s => s.trim());
                            return (
                                <div key={artist.id || idx} className="group relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-surface-container-low border border-white/5 animate-fade" style={{ maxWidth: '400px', margin: '0 auto' }}>
                                    <img 
                                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700" 
                                        src={getSafeImageUrl(artist?.fotoUrl, artist?.nome)} 
                                        onError={(e) => { e.target.onerror = null; e.target.src = getFallbackImage(artist?.especialidades?.[0]) }}
                                        alt={artist?.nome || 'Artista'}
                                        style={{ objectPosition: 'center' }}
                                    />
                                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)' }}></div>
                                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full border border-primary overflow-hidden shadow-lg">
                                                <img 
                                                    className="w-full h-full object-cover rounded-full" 
                                                    src={getSafeImageUrl(artist?.fotoUrl, artist?.nome)} 
                                                    onError={(e) => { e.target.onerror = null; e.target.src = getSafeImageUrl(null, artist?.nome) }}
                                                    alt="avatar"
                                                    style={{ objectPosition: 'center' }}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-headline font-bold text-xl tracking-tight text-white mb-0.5">{artist.nome}</h3>
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[12px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                                                    <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant drop-shadow-md">{artist.especialidades?.[0] || mainStyle || 'ARTISTA'} • VERIFIED</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="flex flex-wrap gap-1.5 mb-6 justify-start items-center">
                                            {(artist.especialidades || []).slice(0, 3).map((esp, i) => (
                                                <span key={i} className="text-[9px] uppercase tracking-widest bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-white">{esp.toUpperCase()}</span>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => handleAgendar(artist.id)} 
                                            className="w-full py-4 text-black font-headline font-black uppercase tracking-widest text-xs rounded-lg shadow-lg active:scale-[0.98] transition-all bg-gradient-to-r from-primary to-primary-container hover:brightness-110"
                                        >
                                            Ver Perfil e Agendar
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    </>
                )}
            </main>

            {/* Toast Container for dynamic injection */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map(toast => (
                    <div key={toast.id} className="flex items-center gap-3 px-6 py-4 rounded shadow-2xl transition-all duration-300 pointer-events-auto bg-surface-container-highest border border-white/10">
                        <span className="material-symbols-outlined text-primary">info</span>
                        <span className="text-xs font-headline font-bold uppercase tracking-widest text-white">{toast.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Artists;
