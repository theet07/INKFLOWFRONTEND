// Gerenciamento de Clientes
class ClientManager {
    constructor() {
        this.clients = [];
        this.filteredClients = [];
        this.currentClient = null;
        this.init();
    }

    async init() {
        await this.loadClients();
        this.setupEventListeners();
        this.renderClients();
    }

    async loadClients() {
        try {
            this.clients = await API.getClients();
            this.filteredClients = [...this.clients];
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            this.clients = this.generateSampleClients();
            this.filteredClients = [...this.clients];
        }
    }

    generateSampleClients() {
        return [
            {
                id: 1,
                name: 'Maria Silva',
                phone: '(11) 99999-1111',
                email: 'maria@email.com',
                status: 'vip',
                preferredArtist: 'Ana Costa',
                totalSpent: 2500,
                lastVisit: '2024-01-15',
                totalTattoos: 5,
                birthdate: '1990-05-15',
                instagram: '@maria_silva',
                source: 'instagram'
            },
            {
                id: 2,
                name: 'João Santos',
                phone: '(11) 88888-2222',
                email: 'joao@email.com',
                status: 'recorrente',
                preferredArtist: 'Marcus Silva',
                totalSpent: 1800,
                lastVisit: '2024-01-10',
                totalTattoos: 3,
                birthdate: '1985-08-22',
                instagram: '@joao_santos',
                source: 'indicacao'
            }
        ];
    }

    setupEventListeners() {
        // Busca
        document.getElementById('clientSearch')?.addEventListener('input', (e) => {
            this.filterClients();
        });

        // Filtros
        document.getElementById('clientStatusFilter')?.addEventListener('change', () => {
            this.filterClients();
        });

        document.getElementById('artistFilter')?.addEventListener('change', () => {
            this.filterClients();
        });
    }

    filterClients() {
        const search = document.getElementById('clientSearch')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('clientStatusFilter')?.value || '';
        const artistFilter = document.getElementById('artistFilter')?.value || '';

        this.filteredClients = this.clients.filter(client => {
            const matchesSearch = !search || 
                client.name.toLowerCase().includes(search) ||
                client.phone.includes(search) ||
                (client.email && client.email.toLowerCase().includes(search));

            const matchesStatus = !statusFilter || client.status === statusFilter;
            const matchesArtist = !artistFilter || client.preferredArtist === artistFilter;

            return matchesSearch && matchesStatus && matchesArtist;
        });

        this.renderClients();
    }

    renderClients() {
        const container = document.getElementById('clientsGrid');
        if (!container) return;

        if (this.filteredClients.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>Nenhum cliente encontrado</h3>
                    <p>Tente ajustar os filtros ou adicione um novo cliente</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredClients.map(client => `
            <div class="client-card" onclick="openClientProfile(${client.id})">
                <div class="client-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="client-info">
                    <h4>${client.name}</h4>
                    <p class="client-contact">
                        <i class="fas fa-phone"></i> ${client.phone}
                    </p>
                    ${client.email ? `<p class="client-email"><i class="fas fa-envelope"></i> ${client.email}</p>` : ''}
                </div>
                <div class="client-stats">
                    <div class="stat-item">
                        <span class="stat-value">${client.totalTattoos || 0}</span>
                        <span class="stat-label">Tatuagens</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">R$ ${(client.totalSpent || 0).toLocaleString()}</span>
                        <span class="stat-label">Total Gasto</span>
                    </div>
                </div>
                <div class="client-meta">
                    <span class="client-status ${client.status}">${this.getStatusLabel(client.status)}</span>
                    <span class="last-visit">Última visita: ${this.formatDate(client.lastVisit)}</span>
                </div>
                <div class="client-actions">
                    <button class="action-btn-small primary" onclick="event.stopPropagation(); scheduleClientAppointment(${client.id})" title="Agendar">
                        <i class="fas fa-calendar-plus"></i>
                    </button>
                    <button class="action-btn-small success" onclick="event.stopPropagation(); sendClientWhatsApp('${client.phone}')" title="WhatsApp">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                    <button class="action-btn-small info" onclick="event.stopPropagation(); editClient(${client.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    getStatusLabel(status) {
        const labels = {
            'novo': 'Novo',
            'recorrente': 'Recorrente',
            'vip': 'VIP',
            'inativo': 'Inativo'
        };
        return labels[status] || status;
    }

    formatDate(dateString) {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    async saveClient() {
        const formData = {
            name: document.getElementById('clientName').value,
            phone: document.getElementById('clientPhone').value,
            email: document.getElementById('clientEmail').value,
            cpf: document.getElementById('clientCpf').value,
            birthdate: document.getElementById('clientBirthdate').value,
            status: document.getElementById('clientStatus').value,
            instagram: document.getElementById('clientInstagram').value,
            source: document.getElementById('clientSource').value,
            preferredArtist: document.getElementById('preferredArtist').value,
            allergies: document.getElementById('clientAllergies').value,
            notes: document.getElementById('clientNotes').value,
            preferredPayment: document.getElementById('preferredPayment').value
        };

        try {
            if (this.currentClient) {
                await API.updateClient(this.currentClient.id, formData);
                const index = this.clients.findIndex(c => c.id === this.currentClient.id);
                if (index !== -1) {
                    this.clients[index] = { ...this.clients[index], ...formData };
                }
            } else {
                const newClient = await API.createClient(formData);
                this.clients.push(newClient);
            }

            this.filterClients();
            this.closeClientModal();
            this.showNotification('Cliente salvo com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            this.showNotification('Erro ao salvar cliente', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Implementar sistema de notificações
        console.log(`${type}: ${message}`);
    }

    closeClientModal() {
        document.getElementById('clientModal').style.display = 'none';
        this.currentClient = null;
        document.getElementById('clientForm').reset();
    }
}

// Funções globais
function openClientModal() {
    document.getElementById('clientModal').style.display = 'flex';
    document.getElementById('clientModalTitle').textContent = 'Novo Cliente';
    showClientTab('basic');
}

function closeClientModal() {
    clientManager.closeClientModal();
}

function showClientTab(tabName) {
    // Remover classe active de todas as abas
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Ativar aba selecionada
    document.querySelector(`[onclick="showClientTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

function saveClient() {
    clientManager.saveClient();
}

function editClient(clientId) {
    const client = clientManager.clients.find(c => c.id === clientId);
    if (!client) return;

    clientManager.currentClient = client;
    
    // Preencher formulário
    document.getElementById('clientName').value = client.name || '';
    document.getElementById('clientPhone').value = client.phone || '';
    document.getElementById('clientEmail').value = client.email || '';
    document.getElementById('clientCpf').value = client.cpf || '';
    document.getElementById('clientBirthdate').value = client.birthdate || '';
    document.getElementById('clientStatus').value = client.status || 'novo';
    document.getElementById('clientInstagram').value = client.instagram || '';
    document.getElementById('clientSource').value = client.source || '';
    document.getElementById('preferredArtist').value = client.preferredArtist || '';
    document.getElementById('clientAllergies').value = client.allergies || '';
    document.getElementById('clientNotes').value = client.notes || '';
    document.getElementById('preferredPayment').value = client.preferredPayment || 'dinheiro';

    document.getElementById('clientModal').style.display = 'flex';
    document.getElementById('clientModalTitle').textContent = 'Editar Cliente';
}

function openClientProfile(clientId) {
    const client = clientManager.clients.find(c => c.id === clientId);
    if (!client) return;

    // Preencher dados do perfil
    document.getElementById('profileClientName').textContent = client.name;
    document.getElementById('profileClientStatus').textContent = clientManager.getStatusLabel(client.status);
    document.getElementById('profileClientStatus').className = `client-status-badge ${client.status}`;
    
    document.getElementById('profilePhone').textContent = client.phone || '-';
    document.getElementById('profileEmail').textContent = client.email || '-';
    document.getElementById('profileInstagram').textContent = client.instagram || '-';
    
    document.getElementById('profileTotalTattoos').textContent = client.totalTattoos || 0;
    document.getElementById('profileTotalSpent').textContent = `R$ ${(client.totalSpent || 0).toLocaleString()}`;
    document.getElementById('profileLastVisit').textContent = clientManager.formatDate(client.lastVisit);

    document.getElementById('clientProfileModal').style.display = 'flex';
}

function closeClientProfileModal() {
    document.getElementById('clientProfileModal').style.display = 'none';
}

function scheduleClientAppointment(clientId) {
    // Implementar agendamento direto
    console.log('Agendar para cliente:', clientId);
}

function sendClientWhatsApp(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
}

function exportClients() {
    // Implementar exportação
    console.log('Exportar clientes');
}

// Inicializar quando a página carregar
let clientManager;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('clientsGrid')) {
        clientManager = new ClientManager();
    }
});

// CSS adicional para os clientes
const clientStyles = `
.clients-filters {
    background: var(--card-bg);
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    box-shadow: var(--shadow-sm);
}

.clients-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
}

.client-card {
    background: var(--card-bg);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
}

.client-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.client-avatar {
    width: 60px;
    height: 60px;
    background: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.client-info h4 {
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
    font-size: 1.1rem;
}

.client-contact, .client-email {
    margin: 0.25rem 0;
    color: var(--text-secondary);
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.client-stats {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
    padding: 1rem 0;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
}

.client-stats .stat-item {
    text-align: center;
}

.client-stats .stat-value {
    display: block;
    font-weight: 600;
    color: var(--primary-color);
    font-size: 0.9rem;
}

.client-stats .stat-label {
    display: block;
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
}

.client-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.client-status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
}

.client-status.novo { background: #e3f2fd; color: #1976d2; }
.client-status.recorrente { background: #e8f5e8; color: #388e3c; }
.client-status.vip { background: #fff3e0; color: #f57c00; }
.client-status.inativo { background: #fafafa; color: #757575; }

.last-visit {
    font-size: 0.8rem;
    color: var(--text-secondary);
}

.client-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
}

.action-btn-small {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
}

.action-btn-small.primary { background: var(--primary-color); color: white; }
.action-btn-small.success { background: #25d366; color: white; }
.action-btn-small.info { background: var(--info-color); color: white; }

.action-btn-small:hover {
    transform: scale(1.1);
}

.client-modal .modal-content {
    max-width: 800px;
    width: 90%;
}

.client-tabs {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 1.5rem;
}

.tab-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    background: none;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
}

.tab-btn.active {
    border-bottom-color: var(--primary-color);
    color: var(--primary-color);
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
}

.checkbox-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.5rem;
}

.checkbox-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
}

.client-profile-modal .modal-content {
    max-width: 600px;
}

.client-profile-header {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.profile-actions {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.profile-section {
    margin-bottom: 2rem;
}

.profile-section h4 {
    margin-bottom: 1rem;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.5rem;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.info-item {
    display: flex;
    justify-content: space-between;
}

.info-label {
    font-weight: 500;
    color: var(--text-secondary);
}

.stats-grid-small {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.stat-card-small {
    text-align: center;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: 8px;
}

.stat-card-small .stat-number {
    display: block;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--primary-color);
}

.stat-card-small .stat-label {
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
}

.empty-state {
    text-align: center;
    padding: 3rem;
    color: var(--text-secondary);
}

.empty-state i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

@media (max-width: 768px) {
    .clients-grid {
        grid-template-columns: 1fr;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .profile-actions {
        justify-content: center;
    }
}
`;

// Adicionar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = clientStyles;
document.head.appendChild(styleSheet);