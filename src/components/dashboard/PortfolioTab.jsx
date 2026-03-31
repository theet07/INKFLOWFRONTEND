import React, { useState } from 'react';

const mockGallery = [
  { id: 1, category: 'Realismo', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNAf9jgjLNEHlMDRfB3lHBBGegXrcp-I-D36qEDO7QL8RODlXOtQUX4GYU3Q9i7EJQDdbfd-_hnbJnxIFQZsBf3cTK4TTDCfYVHLDZdfWXsMdm_61XfjGdr7RtqEa2sl2zSDYQ14xwf-FNWsk87z2ggfk3XoUvleeAqyFx5nA_7gd8GuC2zMxJUmAXjsk1-Ds1SWy66_knT6NGGfXMtZ04Y-EuccUe0pnroEYHTtU48ru2jxnn6kGlFHHiheBsGfCg1v1edhRQvpM' },
  { id: 2, category: 'Blackwork', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5wxwQYjTzAQq97JRhJQxKjvpluewHwwdFCiLqnCRqTNs4DD_4bnWcwKniFqxhDdC_SNWHwg2c2rEo0cglSZHRIvpm8IAefuDKqNJdYrH6xiCvSzk8vKD05n_1e7M5qbwHWbfZwgVFYMt5J-4XTG_3-T9tk43W4_qHSybQO7nAhUN4jha4KbRBJVJk8P5m73JaMkRRalORdWtT9af4a5VPTPJgL1GkWngj75UcE_W_uNEpn9iHSBVqPGJLnU9vWHteapNX8M5TBXc' },
  { id: 3, category: 'Aquarela', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACn3ZYJMn9RyxPQRF1wRb-OcgPU2_e75EzSy9ACPBJ5dRFgeOnspXyFrpJyFoew4KaYaTTkMPgwC8oDpuqcetTO9ErrPAUpyo-b9nc3nB6cNmjX7EjI85w00E6O0_81gMaYipBhTd20c0HesEGXD3xQf7AVZujczkTzD2mGE9qSGXv16zDQqnOiQvn-DA7t49V90hJvBPXBT2yG--1F3APhJQIHWS_AaSVi0okXTl-DSRA4cp_l3bfhMLDPMxmneRo_6ahBEztKos' },
  { id: 4, category: 'Fine Line', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNt6ah9YEdfyY7zZCVObzWgAGeXRJT_FAjmp-xjM4DIQnYKs2-rV1Q8vyCwgL5Kz0qXRQyIIBBOSlhmKCH08q9Y4g5_2D3M9EBaILjIbP8QLgFDloEdlj4k1DsrfDGpfcK2Va-IxhzIxJiPOiOVn68pyn9bb3PGBg8G_7h-tchZguyb9MbwKP4Ont4yoCePVxZ7e1NlEGgfSB1cd3kuT4gcr2o-KOXYdJYUQ7IM91z1CP2D-TMrSCfu5OKHXn1-S49LGRM3FA6UwE' },
  { id: 5, category: 'Traditional', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWgtlmoPCL-AakzyU0h-8jeVJ5l1yr64Tys7wYJTNs8MbN-DXYLqETNtagxtkdRvADl4551kEZeoHgL8vI_otf-4resU3akWKh-tWMqH3NWa3a-RYbxu1z9wO2AuQXJRG3EKoetGMsvNXRoyp4GfVdWK-wbnyYbKkc4AnNoWnsjfha_sx4A3sH-8wyoauaK6cMmfsEc1beG-zGHwbcN41lRZ0YcLUetMqqtLJ7cLMYP5dHbFPSGXmpEQZNV_Kemi1fkWr7JLiyuVg' },
  { id: 6, category: 'Realismo', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAajH3XyXL2Ek6NYmMvHjfAMx8b2dLLy_QJ-7W3K-3KXJdxYGxBWstjmqhd8StHDpuDN-dJ2Kc56sueC3uTeYNeK8m5WvQ60jLiLs_J3hbVG6Cr799YUQO1HJRlBMZdifFs53AsbopvvnWvRAJ4teS1FpfDtn1KAbApWNpq5ZFNBn-QUqR-XYbLDPPNNgMoKQpTWml0jLhTvxDE9qzs7NnRnzkEwq024rWLTGGqNKfo1czrIXtbgQEgCtKzpDaD0WXBJ-7PSXihuaM' },
];

const filters = ['Todos', 'Blackwork', 'Realismo', 'Fine Line', 'Aquarela', 'Traditional'];

const PortfolioTab = () => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredGallery = activeFilter === 'Todos' 
    ? mockGallery 
    : mockGallery.filter(item => item.category === activeFilter);

  const handleOpenModal = (imgSrc) => {
    setSelectedImage(imgSrc);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = '';
  };

  return (
    <div className="ad-port-layout fade-in">
      
      {/* Filters & Header */}
      <div className="ad-port-header-section">
        <div className="ad-port-header-text">
          <h3 className="ad-port-title">THE ARCHIVE.</h3>
          <p className="ad-port-subtitle">
            Curating a legacy of surgical precision and permanence. Every piece is a story etched in obsidian.
          </p>
        </div>
        
        {/* Filter Chips */}
        <div className="ad-port-filters">
          {filters.map((f) => (
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

      {/* Full Grid Gallery */}
      <div className="ad-port-grid">
        {filteredGallery.map((item) => (
          <div 
            key={item.id} 
            className="ad-port-item group"
            onClick={() => handleOpenModal(item.imgUrl)}
          >
            <img 
              className="ad-port-item-img group-hover:scale-110 group-hover:opacity-100" 
              src={item.imgUrl} 
              alt={item.category} 
            />
            <div className="ad-port-item-overlay group-hover:opacity-100">
              <span className="ad-port-item-text">Ver Detalhes</span>
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Detail Modal (Lightbox) */}
      {selectedImage && (
        <div className="ad-port-modal modal-active">
          <div className="ad-port-modal-backdrop modal-bg-anim" onClick={handleCloseModal}></div>
          <div className="ad-port-modal-content modal-box-anim">
            
            <div className="ad-port-modal-img-area">
              <img src={selectedImage} alt="Obra Selecionada" />
            </div>
            
            <div className="ad-port-modal-details-area">
              <div className="ad-port-modal-header">
                <h4>Obra Selecionada</h4>
                <button className="ad-port-modal-close" onClick={handleCloseModal}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="ad-port-modal-scroll">
                <div className="ad-port-modal-section">
                  <p className="ad-port-modal-label">Detalhes do Projeto</p>
                  <p className="ad-port-modal-desc">
                    Trabalho exclusivo realizado em única sessão. Combinação de técnicas de sombreamento suave e traços precisos para garantir durabilidade e contraste.
                  </p>
                </div>
                
                <div className="ad-port-modal-specs">
                  <div>
                    <p className="ad-port-modal-label">Estilo</p>
                    <p className="ad-port-modal-value">Custom Design</p>
                  </div>
                  <div>
                    <p className="ad-port-modal-label">Tempo</p>
                    <p className="ad-port-modal-value">~ 4 Horas</p>
                  </div>
                </div>
              </div>

              <div className="ad-port-modal-footer">
                <button className="ad-port-share-btn">
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
