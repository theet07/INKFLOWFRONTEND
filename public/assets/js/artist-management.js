// Gerenciamento de Artistas
class ArtistManager {
    constructor() {
        this.artists = [];
        this.filteredArtists = [];
        this.currentArtist = null;
        this.init();
    }

    async init() {
        await this.loadArtists();
        this.setupEventListeners();
        this.renderArtists();
    }

    async loadArtists() {
        // Sempre usar os dados de exemplo para garantir que apareçam
        this.artists = this.generateSampleArtists();
        this.filteredArtists = [...this.artists];
        
        // Renderizar imediatamente se o container existir
        if (document.getElementById('artistsGrid')) {
            this.renderArtists();
        }
    }

    generateSampleArtists() {
        const artists = [
            {
                id: 1,
                name: 'Marcus Silva',
                slug: 'marcus',
                phone: '(11) 99999-1111',
                email: 'marcus@inkflow.com',
                status: 'ativo',
                specialties: ['realismo', 'cover-up'],
                experience: 12,
                instagram: '@marcus_tattoo',
                bio: 'Fundador do Ink Flow Studios. Especialista em realismo e cover-ups com mais de 12 anos transformando pele em arte.',
                commission: 65,
                sessionTime: 4,
                station: 1,
                prices: { small: 250, medium: 500, large: 800 },
                schedule: {
                    monday: { active: true, start: '09:00', end: '18:00' },
                    tuesday: { active: true, start: '09:00', end: '18:00' },
                    wednesday: { active: true, start: '09:00', end: '18:00' },
                    thursday: { active: true, start: '09:00', end: '18:00' },
                    friday: { active: true, start: '09:00', end: '18:00' },
                    saturday: { active: true, start: '09:00', end: '16:00' }
                },
                maxDaily: 3,
                breakTime: 30,
                monthlyStats: {
                    tattoos: 28,
                    hours: 112,
                    revenue: 14000,
                    rating: 4.9
                }
            },
            {
                id: 2,
                name: 'Ana Costa',
                slug: 'ana',
                phone: '(11) 88888-2222',
                email: 'ana@inkflow.com',
                status: 'ativo',
                specialties: ['aquarela', 'minimalista', 'fine-line'],
                experience: 8,
                instagram: '@ana_watercolor',
                bio: 'Especialista em aquarela e fine line. Suas criações delicadas e coloridas conquistam clientes que buscam arte sutil e elegante.',
                commission: 60,
                sessionTime: 3,
                station: 2,
                prices: { small: 200, medium: 400, large: 650 },
                schedule: {
                    tuesday: { active: true, start: '10:00', end: '19:00' },
                    wednesday: { active: true, start: '10:00', end: '19:00' },
                    thursday: { active: true, start: '10:00', end: '19:00' },
                    friday: { active: true, start: '10:00', end: '19:00' },
                    saturday: { active: true, start: '09:00', end: '17:00' }
                },
                maxDaily: 4,
                breakTime: 20,
                monthlyStats: {
                    tattoos: 35,
                    hours: 105,
                    revenue: 12250,
                    rating: 4.8
                }
            },
            {
                id: 3,
                name: 'Rafael Santos',
                slug: 'rafael',
                phone: '(11) 77777-3333',
                email: 'rafael@inkflow.com',
                status: 'ativo',
                specialties: ['geometrico', 'tradicional', 'blackwork'],
                experience: 10,
                instagram: '@rafael_geometric',
                bio: 'Mestre em desenhos geométricos e blackwork. Suas linhas precisas e formas perfeitas criam tatuagens de impacto visual único.',
                commission: 62,
                sessionTime: 3.5,
                station: 3,
                prices: { small: 220, medium: 450, large: 700 },
                schedule: {
                    monday: { active: true, start: '08:00', end: '17:00' },
                    tuesday: { active: true, start: '08:00', end: '17:00' },
                    wednesday: { active: true, start: '08:00', end: '17:00' },
                    thursday: { active: true, start: '08:00', end: '17:00' },
                    friday: { active: true, start: '08:00', end: '17:00' }
                },
                maxDaily: 3,
                breakTime: 25,
                monthlyStats: {
                    tattoos: 26,
                    hours: 91,
                    revenue: 11700,
                    rating: 4.7
                }
            },
            {
                id: 4,
                name: 'Carla Mendes',
                slug: 'carla',
                phone: '(11) 66666-4444',
                email: 'carla@inkflow.com',
                status: 'ativo',
                specialties: ['tradicional', 'old-school', 'neo-tradicional'],
                experience: 7,
                instagram: '@carla_oldschool',
                bio: 'Especialista em old school e neo tradicional. Suas tatuagens clássicas com toque moderno são referência no estúdio.',
                commission: 58,
                sessionTime: 3,
                station: 4,
                prices: { small: 180, medium: 380, large: 600 },
                schedule: {
                    monday: { active: true, start: '13:00', end: '21:00' },
                    tuesday: { active: true, start: '13:00', end: '21:00' },
                    wednesday: { active: true, start: '13:00', end: '21:00' },
                    thursday: { active: true, start: '13:00', end: '21:00' },
                    friday: { active: true, start: '13:00', end: '21:00' },
                    saturday: { active: true, start: '10:00', end: '18:00' }
                },
                maxDaily: 4,
                breakTime: 20,
                monthlyStats: {
                    tattoos: 30,
                    hours: 90,
                    revenue: 10200,
                    rating: 4.6
                }
            }
        ];
        
        // Salvar no localStorage
        localStorage.setItem('artists', JSON.stringify(artists));
        return artists;
    }

    setupEventListeners() {
        document.getElementById('artistSearch')?.addEventListener('input', () => this.filterArtists());
        document.getElementById('artistStatusFilter')?.addEventListener('change', () => this.filterArtists());
        document.getElementById('specialtyFilter')?.addEventListener('change', () => this.filterArtists());
    }

    filterArtists() {
        const search = document.getElementById('artistSearch')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('artistStatusFilter')?.value || '';
        const specialtyFilter = document.getElementById('specialtyFilter')?.value || '';

        this.filteredArtists = this.artists.filter(artist => {
            const matchesSearch = !search || 
                artist.name.toLowerCase().includes(search) ||
                artist.specialties.some(s => s.includes(search));

            const matchesStatus = !statusFilter || artist.status === statusFilter;
            const matchesSpecialty = !specialtyFilter || artist.specialties.includes(specialtyFilter);

            return matchesSearch && matchesStatus && matchesSpecialty;
        });

        this.renderArtists();
    }

    renderArtists() {
        const container = document.getElementById('artistsGrid');
        if (!container) {
            console.log('Container artistsGrid não encontrado');
            return;
        }
        
        console.log('Renderizando', this.filteredArtists.length, 'artistas');

        if (this.filteredArtists.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-palette"></i>
                    <h3>Nenhum artista encontrado</h3>
                    <p>Tente ajustar os filtros ou adicione um novo artista</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredArtists.map(artist => `
            <div class="artist-card" onclick="openArtistProfile(${artist.id})">
                <div class="artist-header">
                    <div class="artist-avatar">
                        <i class="fas fa-palette"></i>
                    </div>
                    <div class="artist-info">
                        <h4>${artist.name}</h4>
                        <p class="artist-specialties">${artist.specialties.map(s => this.getSpecialtyLabel(s)).join(', ')}</p>
                    </div>
                    <span class="artist-status ${artist.status}">${this.getStatusLabel(artist.status)}</span>
                </div>
                
                <div class="artist-stats">
                    <div class="stat-item">
                        <span class="stat-value">${artist.experience}</span>
                        <span class="stat-label">Anos</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${artist.monthlyStats.tattoos}</span>
                        <span class="stat-label">Tatuagens/Mês</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${artist.monthlyStats.rating}</span>
                        <span class="stat-label">Avaliação</span>
                    </div>
                </div>
                
                <div class="artist-indicators">
                    <div class="indicator">
                        <i class="fas fa-calendar-day"></i>
                        <span>Hoje: ${this.getTodayAppointments(artist.id)} agendamentos</span>
                    </div>
                    <div class="indicator">
                        <i class="fas fa-clock"></i>
                        <span>Próximo: ${this.getNextAppointment(artist.id)}</span>
                    </div>
                </div>
                
                <div class="artist-actions">
                    <button class="action-btn-small primary" onclick="event.stopPropagation(); viewArtistSchedule(${artist.id})" title="Agenda">
                        <i class="fas fa-calendar"></i>
                    </button>
                    <button class="action-btn-small success" onclick="event.stopPropagation(); sendArtistWhatsApp('${artist.phone}')" title="WhatsApp">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                    <button class="action-btn-small info" onclick="event.stopPropagation(); editArtist(${artist.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn-small warning" onclick="event.stopPropagation(); viewCommissions(${artist.id})" title="Comissões">
                        <i class="fas fa-dollar-sign"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    getStatusLabel(status) {
        const labels = {
            'ativo': 'Ativo',
            'ferias': 'Férias',
            'afastado': 'Afastado',
            'inativo': 'Inativo'
        };
        return labels[status] || status;
    }

    getSpecialtyLabel(specialty) {
        const labels = {
            'realismo': 'Realismo',
            'tradicional': 'Tradicional',
            'geometrico': 'Geométrico',
            'aquarela': 'Aquarela',
            'minimalista': 'Minimalista',
            'cover-up': 'Cover-up',
            'fine-line': 'Fine Line',
            'blackwork': 'Blackwork',
            'old-school': 'Old School',
            'neo-tradicional': 'Neo Tradicional'
        };
        return labels[specialty] || specialty;
    }

    getTodayAppointments(artistId) {
        // Simular agendamentos do dia
        return Math.floor(Math.random() * 4);
    }

    getNextAppointment(artistId) {
        const times = ['14:00', '15:30', '16:00', 'Livre'];
        return times[Math.floor(Math.random() * times.length)];
    }

    async saveArtist() {
        const specialties = Array.from(document.querySelectorAll('#artistForm input[type="checkbox"]:checked'))
            .map(cb => cb.value);

        const formData = {
            name: document.getElementById('artistName').value,
            phone: document.getElementById('artistPhone').value,
            email: document.getElementById('artistEmail').value,
            status: document.getElementById('artistStatus').value,
            specialties: specialties,
            experience: parseInt(document.getElementById('artistExperience').value) || 0,
            instagram: document.getElementById('artistInstagram').value,
            bio: document.getElementById('artistBio').value,
            commission: parseInt(document.getElementById('artistCommission').value) || 50,
            sessionTime: parseInt(document.getElementById('artistSessionTime').value) || 3,
            station: parseInt(document.getElementById('artistStation').value) || 1,
            prices: {
                small: parseInt(document.getElementById('priceSmall').value) || 150,
                medium: parseInt(document.getElementById('priceMedium').value) || 300,
                large: parseInt(document.getElementById('priceLarge').value) || 500
            },
            maxDaily: parseInt(document.getElementById('artistMaxDaily').value) || 3,
            breakTime: parseInt(document.getElementById('artistBreakTime').value) || 30
        };

        try {
            if (this.currentArtist) {
                await API.updateArtist(this.currentArtist.id, formData);
                const index = this.artists.findIndex(a => a.id === this.currentArtist.id);
                if (index !== -1) {
                    this.artists[index] = { ...this.artists[index], ...formData };
                }
            } else {
                const newArtist = await API.createArtist(formData);
                this.artists.push(newArtist);
            }

            this.filterArtists();
            this.closeArtistModal();
            this.showNotification('Artista salvo com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao salvar artista:', error);
            this.showNotification('Erro ao salvar artista', 'error');
        }
    }

    showNotification(message, type = 'info') {
        console.log(`${type}: ${message}`);
    }

    closeArtistModal() {
        document.getElementById('artistModal').style.display = 'none';
        this.currentArtist = null;
        document.getElementById('artistForm').reset();
    }
}

// Funções globais
function openArtistModal() {
    document.getElementById('artistModal').style.display = 'flex';
    document.getElementById('artistModalTitle').textContent = 'Novo Artista';
    showArtistTab('basic');
}

function closeArtistModal() {
    artistManager.closeArtistModal();
}

function showArtistTab(tabName) {
    document.querySelectorAll('.artist-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.artist-modal .tab-content').forEach(content => content.classList.remove('active'));

    document.querySelector(`[onclick="showArtistTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

function saveArtist() {
    artistManager.saveArtist();
}

function editArtist(artistId) {
    const artist = artistManager.artists.find(a => a.id === artistId);
    if (!artist) return;

    artistManager.currentArtist = artist;
    
    // Preencher formulário
    document.getElementById('artistName').value = artist.name || '';
    document.getElementById('artistPhone').value = artist.phone || '';
    document.getElementById('artistEmail').value = artist.email || '';
    document.getElementById('artistStatus').value = artist.status || 'ativo';
    document.getElementById('artistExperience').value = artist.experience || 0;
    document.getElementById('artistInstagram').value = artist.instagram || '';
    document.getElementById('artistBio').value = artist.bio || '';
    document.getElementById('artistCommission').value = artist.commission || 50;
    document.getElementById('artistSessionTime').value = artist.sessionTime || 3;
    document.getElementById('artistStation').value = artist.station || 1;
    
    if (artist.prices) {
        document.getElementById('priceSmall').value = artist.prices.small || 150;
        document.getElementById('priceMedium').value = artist.prices.medium || 300;
        document.getElementById('priceLarge').value = artist.prices.large || 500;
    }
    
    document.getElementById('artistMaxDaily').value = artist.maxDaily || 3;
    document.getElementById('artistBreakTime').value = artist.breakTime || 30;

    // Marcar especialidades
    if (artist.specialties) {
        artist.specialties.forEach(specialty => {
            const checkbox = document.querySelector(`input[value="${specialty}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }

    document.getElementById('artistModal').style.display = 'flex';
    document.getElementById('artistModalTitle').textContent = 'Editar Artista';
}

function openArtistProfile(artistId) {
    const artist = artistManager.artists.find(a => a.id === artistId);
    if (!artist) return;

    document.getElementById('profileArtistName').textContent = artist.name;
    document.getElementById('profileArtistStatus').textContent = artistManager.getStatusLabel(artist.status);
    document.getElementById('profileArtistStatus').className = `artist-status-badge ${artist.status}`;
    
    document.getElementById('profileTotalTattoos').textContent = artist.monthlyStats.tattoos;
    document.getElementById('profileTotalHours').textContent = `${artist.monthlyStats.hours}h`;
    document.getElementById('profileRevenue').textContent = `R$ ${artist.monthlyStats.revenue.toLocaleString()}`;
    document.getElementById('profileRating').textContent = artist.monthlyStats.rating;

    document.getElementById('artistProfileModal').style.display = 'flex';
}

function closeArtistProfileModal() {
    document.getElementById('artistProfileModal').style.display = 'none';
}

function viewArtistSchedule(artistId) {
    console.log('Ver agenda do artista:', artistId);
}

function addArtistBreak(artistId) {
    console.log('Adicionar folga para artista:', artistId);
}

function viewCommissions(artistId) {
    console.log('Ver comissões do artista:', artistId);
}

function sendArtistWhatsApp(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
}

function exportArtists() {
    console.log('Exportar artistas');
}

// Inicializar
let artistManager;
document.addEventListener('DOMContentLoaded', () => {
    // Sempre inicializar o artistManager
    artistManager = new ArtistManager();
});

// Garantir que os artistas sejam carregados quando a seção for mostrada
window.addEventListener('load', () => {
    if (!artistManager) {
        artistManager = new ArtistManager();
    }
});

// CSS para artistas
const artistStyles = `
.artists-filters {
    background: var(--card-bg);
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    box-shadow: var(--shadow-sm);
}

.artists-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 1.5rem;
}

.artist-card {
    background: var(--card-bg);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
    cursor: pointer;
    border: 1px solid var(--border-color);
}

.artist-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.artist-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.artist-avatar {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #d00000, #ff6b6b);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
}

.artist-info {
    flex: 1;
}

.artist-info h4 {
    margin: 0 0 0.25rem 0;
    color: var(--text-primary);
    font-size: 1.1rem;
}

.artist-specialties {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.85rem;
}

.artist-status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.artist-status.ativo { background: #e8f5e8; color: #388e3c; }
.artist-status.ferias { background: #fff3e0; color: #f57c00; }
.artist-status.afastado { background: #fce4ec; color: #c2185b; }
.artist-status.inativo { background: #fafafa; color: #757575; }

.artist-stats {
    display: flex;
    justify-content: space-around;
    padding: 1rem 0;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    margin: 1rem 0;
}

.artist-stats .stat-item {
    text-align: center;
}

.artist-stats .stat-value {
    display: block;
    font-weight: 600;
    color: var(--primary-color);
    font-size: 1rem;
}

.artist-stats .stat-label {
    display: block;
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
}

.artist-indicators {
    margin-bottom: 1rem;
}

.indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-secondary);
}

.indicator i {
    width: 16px;
    color: var(--primary-color);
}

.artist-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
}

.artist-modal .modal-content {
    max-width: 900px;
    width: 95%;
}

.artist-tabs {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 1.5rem;
}

.artist-tabs .tab-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    background: none;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
}

.artist-tabs .tab-btn.active {
    border-bottom-color: var(--primary-color);
    color: var(--primary-color);
}

.price-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.price-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.price-item label {
    font-size: 0.85rem;
    font-weight: 500;
}

.schedule-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.schedule-day {
    display: grid;
    grid-template-columns: 120px 1fr auto 1fr;
    gap: 0.5rem;
    align-items: center;
}

.schedule-day label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.portfolio-upload {
    border: 2px dashed var(--border-color);
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    transition: all 0.2s ease;
}

.portfolio-upload:hover {
    border-color: var(--primary-color);
    background: rgba(208, 0, 0, 0.05);
}

.upload-preview {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.artist-profile-modal .modal-content {
    max-width: 700px;
}

.artist-profile-header {
    display: flex;
    align-items: center;
    gap: 1rem;
}

@media (max-width: 768px) {
    .artists-grid {
        grid-template-columns: 1fr;
    }
    
    .artist-header {
        flex-wrap: wrap;
    }
    
    .artist-stats {
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .price-grid {
        grid-template-columns: 1fr;
    }
    
    .schedule-day {
        grid-template-columns: 1fr;
        gap: 0.25rem;
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = artistStyles;
document.head.appendChild(styleSheet);