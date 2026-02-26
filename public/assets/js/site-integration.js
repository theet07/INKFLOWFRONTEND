// Sistema de Integração Site Principal <-> Painel Admin
class SiteIntegration {
    constructor() {
        this.init();
    }

    init() {
        this.setupDataListeners();
        this.syncPortfolio();
        this.syncArtists();
        this.updateAvailableSlots();
    }

    setupDataListeners() {
        // Escutar mudanças no portfólio
        DataSync.subscribe('portfolio', (data) => {
            this.updatePortfolioDisplay(data);
        });

        // Escutar mudanças nos artistas
        DataSync.subscribe('artists', (data) => {
            this.updateArtistsDisplay(data);
        });

        // Escutar mudanças nos agendamentos
        DataSync.subscribe('appointments', (data) => {
            this.updateAvailableSlots();
        });
    }

    async syncPortfolio() {
        try {
            const portfolioItems = await API.getPortfolioItems();
            this.renderPortfolio(portfolioItems);
        } catch (error) {
            console.error('Erro ao sincronizar portfólio:', error);
        }
    }

    renderPortfolio(items) {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (!portfolioGrid) return;

        portfolioGrid.innerHTML = items.map(item => `
            <div class="portfolio-item" data-category="${item.category || 'all'}">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="portfolio-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.artist || 'Ink Flow Studios'}</p>
                    <span class="category">${item.category || 'Tatuagem'}</span>
                </div>
            </div>
        `).join('');
    }

    updatePortfolioDisplay(data) {
        if (data.action === 'create') {
            this.addPortfolioItem(data.data);
        }
    }

    addPortfolioItem(item) {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (!portfolioGrid) return;

        const itemElement = document.createElement('div');
        itemElement.className = 'portfolio-item';
        itemElement.setAttribute('data-category', item.category || 'all');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="portfolio-overlay">
                <h3>${item.title}</h3>
                <p>${item.artist || 'Ink Flow Studios'}</p>
                <span class="category">${item.category || 'Tatuagem'}</span>
            </div>
        `;
        portfolioGrid.appendChild(itemElement);
    }

    async syncArtists() {
        try {
            const artists = await API.getArtists();
            this.renderArtists(artists);
        } catch (error) {
            console.error('Erro ao sincronizar artistas:', error);
        }
    }

    renderArtists(artists) {
        const artistsContainer = document.querySelector('.artists-container');
        if (!artistsContainer) return;

        artistsContainer.innerHTML = artists.map(artist => `
            <div class="artist-card">
                <img src="${artist.photo || '/assets/images/default-artist.jpg'}" alt="${artist.name}">
                <h3>${artist.name}</h3>
                <p>${artist.specialty || 'Tatuador'}</p>
                <div class="artist-social">
                    ${artist.instagram ? `<a href="${artist.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                </div>
            </div>
        `).join('');
    }

    updateArtistsDisplay(data) {
        if (data.action === 'create') {
            this.addArtist(data.data);
        }
    }

    addArtist(artist) {
        const artistsContainer = document.querySelector('.artists-container');
        if (!artistsContainer) return;

        const artistElement = document.createElement('div');
        artistElement.className = 'artist-card';
        artistElement.innerHTML = `
            <img src="${artist.photo || '/assets/images/default-artist.jpg'}" alt="${artist.name}">
            <h3>${artist.name}</h3>
            <p>${artist.specialty || 'Tatuador'}</p>
            <div class="artist-social">
                ${artist.instagram ? `<a href="${artist.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
            </div>
        `;
        artistsContainer.appendChild(artistElement);
    }

    async updateAvailableSlots() {
        try {
            const appointments = await API.getAppointments();
            this.updateCalendarAvailability(appointments);
        } catch (error) {
            console.error('Erro ao atualizar disponibilidade:', error);
        }
    }

    updateCalendarAvailability(appointments) {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        const timeSelects = document.querySelectorAll('select[name="time"]');
        
        // Atualizar disponibilidade de datas e horários
        const bookedSlots = appointments.map(apt => ({
            date: apt.date ? apt.date.split('T')[0] : null,
            time: apt.time
        })).filter(slot => slot.date);

        // Implementar lógica de disponibilidade
        this.markUnavailableSlots(bookedSlots);
    }

    markUnavailableSlots(bookedSlots) {
        const timeSelects = document.querySelectorAll('select[name="time"]');
        
        timeSelects.forEach(select => {
            const selectedDate = document.querySelector('input[name="date"]')?.value;
            
            Array.from(select.options).forEach(option => {
                const isBooked = bookedSlots.some(slot => 
                    slot.date === selectedDate && slot.time === option.value
                );
                
                if (isBooked) {
                    option.disabled = true;
                    option.textContent += ' (Ocupado)';
                } else {
                    option.disabled = false;
                    option.textContent = option.textContent.replace(' (Ocupado)', '');
                }
            });
        });
    }
}

// Inicializar integração quando o site carregar
document.addEventListener('DOMContentLoaded', function() {
    if (typeof DataSync !== 'undefined') {
        window.siteIntegration = new SiteIntegration();
    }
});

window.SiteIntegration = SiteIntegration;