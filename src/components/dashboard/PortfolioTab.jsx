import React, { useState, useEffect, useRef } from 'react';
import { portfolioService } from '../../services/inkflowApi';

const PortfolioTab = ({ showToast }) => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const artistaId = user.artistaId || user.id;
        if (artistaId) {
          const res = await portfolioService.getByArtista(artistaId);
          setGallery(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error('Erro ao carregar portfólio:', err);
        // Se o endpoint não existir ainda, mantém galeria vazia
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  // Extrai categorias únicas dos dados reais
  const categories = ['Todos', ...new Set(gallery.map(item => item.categoria || item.category || 'Outros').filter(Boolean))];

  const filteredGallery = activeFilter === 'Todos'
    ? gallery
    : gallery.filter(item => (item.categoria || item.category || '') === activeFilter);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    document.body.style.overflow = '';
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('Formato inválido. Use PNG, JPG ou WEBP.', true);
      return;
    }

    setUploading(true);
    showToast('Enviando obra ao portfólio...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('artistaId', user.artistaId || user.id || '');
      formData.append('categoria', activeFilter !== 'Todos' ? activeFilter : 'Geral');

      const res = await portfolioService.upload(formData);
      
      // Adiciona a obra nova à galeria local
      if (res.data) {
        setGallery(prev => [res.data, ...prev]);
      }
      showToast('Obra adicionada com sucesso!');
    } catch (err) {
      console.error('Erro no upload:', err);
      const msg = err.response?.data?.message || err.response?.data || 'Erro ao enviar obra';
      showToast(typeof msg === 'string' ? msg : 'Erro ao enviar obra ao portfólio.', true);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await portfolioService.delete(itemId);
      setGallery(prev => prev.filter(item => item.id !== itemId));
      handleCloseModal();
      showToast('Obra removida do portfólio.');
    } catch (err) {
      showToast('Erro ao remover obra.', true);
    }
  };

  return (
    <div className="ad-port-layout fade-in">

      {/* Filters & Header */}
      <div className="ad-port-header-section">
        <div className="ad-port-header-text">
          <h3 className="ad-port-title">THE ARCHIVE.</h3>
          <p className="ad-port-subtitle">
            Curadoria de precisão cirúrgica e permanência. Cada peça é uma história gravada em obsidiana.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="ad-port-filters">
          {categories.map((f) => (
            <button
              key={f}
              className={`ad-port-filter-btn ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Hidden Upload Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Loading / Empty / Grid */}
      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.4)', padding: '4rem', textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem', animation: 'spin 1s linear infinite' }}>progress_activity</span>
          Carregando portfólio...
        </div>
      ) : gallery.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.15)', display: 'block', marginBottom: '1rem' }}>collections</span>
          <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>Galeria Vazia</h4>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Sua vitrine está esperando. Adicione suas melhores obras para atrair novos clientes.
          </p>
          <button 
            className="ad-btn-primary" 
            onClick={handleUploadClick}
            disabled={uploading}
            style={{ margin: '0 auto' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add_photo_alternate</span>
            {uploading ? 'Enviando...' : 'Adicionar Primeira Obra'}
          </button>
        </div>
      ) : (
        <>
          {/* Upload Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <button 
              className="ad-btn-primary" 
              onClick={handleUploadClick}
              disabled={uploading}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add_photo_alternate</span>
              {uploading ? 'Enviando...' : 'Nova Obra'}
            </button>
          </div>

          {/* Grid */}
          <div className="ad-port-grid">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                className="ad-port-item group"
                onClick={() => handleOpenModal(item)}
              >
                <img
                  className="ad-port-item-img group-hover:scale-110 group-hover:opacity-100"
                  src={item.imagemUrl || item.imgUrl || item.url}
                  alt={item.categoria || item.category || 'Obra'}
                  onError={(e) => { e.target.src = '/assets/portifolio_novo/Rosa-Dos-Ventos-1.webp' }}
                />
                <div className="ad-port-item-overlay group-hover:opacity-100">
                  <span className="ad-port-item-text">{item.categoria || item.category || 'Ver'}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="ad-port-modal modal-active">
          <div className="ad-port-modal-backdrop modal-bg-anim" onClick={handleCloseModal}></div>
          <div className="ad-port-modal-content modal-box-anim">

            <div className="ad-port-modal-img-area">
              <img 
                src={selectedItem.imagemUrl || selectedItem.imgUrl || selectedItem.url} 
                alt={selectedItem.categoria || 'Obra'} 
              />
            </div>

            <div className="ad-port-modal-details-area">
              <div className="ad-port-modal-header">
                <h4>{selectedItem.titulo || selectedItem.categoria || selectedItem.category || 'Obra do Portfólio'}</h4>
                <button className="ad-port-modal-close" onClick={handleCloseModal}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="ad-port-modal-scroll">
                <div className="ad-port-modal-section">
                  <p className="ad-port-modal-label">Detalhes do Projeto</p>
                  <p className="ad-port-modal-desc">
                    {selectedItem.descricao || selectedItem.description || 'Trabalho exclusivo realizado com técnicas de alta precisão para garantir durabilidade e contraste.'}
                  </p>
                </div>

                <div className="ad-port-modal-specs">
                  <div>
                    <p className="ad-port-modal-label">Categoria</p>
                    <p className="ad-port-modal-value">{selectedItem.categoria || selectedItem.category || 'Custom'}</p>
                  </div>
                  <div>
                    <p className="ad-port-modal-label">Artista</p>
                    <p className="ad-port-modal-value">{user.nome || user.fullName || 'Studio'}</p>
                  </div>
                </div>
              </div>

              <div className="ad-port-modal-footer">
                <button 
                  className="ad-port-share-btn" 
                  style={{ background: 'rgba(230,57,70,0.15)', color: '#e63946', border: '1px solid rgba(230,57,70,0.3)' }}
                  onClick={() => handleDelete(selectedItem.id)}
                >
                  <span className="material-symbols-outlined">delete</span> Remover
                </button>
                <button className="ad-port-share-btn" onClick={() => { navigator.clipboard.writeText(selectedItem.imagemUrl || selectedItem.imgUrl || ''); showToast('Link copiado!') }}>
                  <span className="material-symbols-outlined">share</span> Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PortfolioTab;
