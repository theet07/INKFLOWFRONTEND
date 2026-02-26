// Módulos Administrativos Completos
class AdminModules {
    constructor() {
        this.currentModule = 'dashboard';
        this.init();
    }

    init() {
        this.setupModuleHandlers();
        this.loadInitialData();
    }

    setupModuleHandlers() {
        // Agendamentos
        this.setupAppointmentsModule();
        // Clientes
        this.setupClientsModule();
        // Artistas
        this.setupArtistsModule();
        // Financeiro
        this.setupFinancialModule();
        // Estoque
        this.setupInventoryModule();
        // Portfólio
        this.setupPortfolioModule();
    }

    async loadInitialData() {
        // Carregar dados iniciais para todos os módulos
        await this.loadAppointments();
        await this.loadClients();
        await this.loadArtists();
        await this.loadInventory();
        await this.loadPortfolio();
    }

    // MÓDULO AGENDAMENTOS
    setupAppointmentsModule() {
        const appointmentsSection = document.getElementById('appointments');
        if (!appointmentsSection) return;

        appointmentsSection.innerHTML = `
            <div class="module-header">
                <h2>Gerenciar Agendamentos</h2>
                <div class="module-actions">
                    <button class="btn-primary" onclick="adminModules.openAppointmentModal()">
                        <i class="fas fa-plus"></i> Novo Agendamento
                    </button>
                    <button class="btn-secondary" onclick="adminModules.exportAppointments()">
                        <i class="fas fa-download"></i> Exportar
                    </button>
                </div>
            </div>
            
            <div class="module-filters">
                <input type="text" id="appointmentSearch" placeholder="Buscar por cliente, telefone..." onkeyup="adminModules.filterAppointments()">
                <select id="statusFilter" onchange="adminModules.filterAppointments()">
                    <option value="">Todos os status</option>
                    <option value="pending">Pendente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="completed">Concluído</option>
                    <option value="cancelled">Cancelado</option>
                </select>
                <input type="date" id="dateFilter" onchange="adminModules.filterAppointments()">
            </div>

            <div class="data-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Contato</th>
                            <th>Serviço</th>
                            <th>Data/Hora</th>
                            <th>Artista</th>
                            <th>Status</th>
                            <th>Valor</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="appointmentsTableBody">
                        <!-- Dados carregados dinamicamente -->
                    </tbody>
                </table>
            </div>

            <!-- Modal de Agendamento -->
            <div id="appointmentModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Novo Agendamento</h3>
                        <button class="modal-close" onclick="adminModules.closeModal('appointmentModal')">&times;</button>
                    </div>
                    <form id="appointmentForm" onsubmit="adminModules.saveAppointment(event)">
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Cliente</label>
                                <input type="text" name="clientName" required>
                            </div>
                            <div class="form-group">
                                <label>Telefone</label>
                                <input type="tel" name="phone" required>
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" name="email">
                            </div>
                            <div class="form-group">
                                <label>Serviço</label>
                                <select name="service" required>
                                    <option value="">Selecione...</option>
                                    <option value="tatuagem-pequena">Tatuagem Pequena</option>
                                    <option value="tatuagem-media">Tatuagem Média</option>
                                    <option value="tatuagem-grande">Tatuagem Grande</option>
                                    <option value="retoque">Retoque</option>
                                    <option value="consulta">Consulta</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Data</label>
                                <input type="date" name="date" required>
                            </div>
                            <div class="form-group">
                                <label>Horário</label>
                                <select name="time" required>
                                    <option value="">Selecione...</option>
                                    <option value="09:00">09:00</option>
                                    <option value="10:00">10:00</option>
                                    <option value="11:00">11:00</option>
                                    <option value="14:00">14:00</option>
                                    <option value="15:00">15:00</option>
                                    <option value="16:00">16:00</option>
                                    <option value="17:00">17:00</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Artista</label>
                                <select name="artist" required>
                                    <option value="">Selecione...</option>
                                    <option value="carlos">Carlos Silva</option>
                                    <option value="ana">Ana Santos</option>
                                    <option value="pedro">Pedro Costa</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Valor (R$)</label>
                                <input type="number" name="price" step="0.01" min="0">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Descrição</label>
                            <textarea name="description" rows="3"></textarea>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn-secondary" onclick="adminModules.closeModal('appointmentModal')">Cancelar</button>
                            <button type="submit" class="btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    async loadAppointments() {
        try {
            const appointments = await API.getAppointments();
            this.renderAppointments(appointments);
        } catch (error) {
            console.error('Erro ao carregar agendamentos:', error);
        }
    }

    renderAppointments(appointments) {
        const tbody = document.getElementById('appointmentsTableBody');
        if (!tbody) return;

        tbody.innerHTML = appointments.map(apt => `
            <tr>
                <td>#${apt.id}</td>
                <td>${apt.name || apt.clientName || 'N/A'}</td>
                <td>${apt.phone || 'N/A'}</td>
                <td>${apt.service || 'N/A'}</td>
                <td>${this.formatDateTime(apt.date, apt.time)}</td>
                <td>${apt.artist || 'N/A'}</td>
                <td><span class="status-badge status-${apt.status || 'pending'}">${this.getStatusText(apt.status)}</span></td>
                <td>R$ ${(apt.price || 0).toFixed(2)}</td>
                <td class="table-actions">
                    <button class="btn-action btn-success" onclick="adminModules.updateAppointmentStatus('${apt.id}', 'confirmed')" title="Confirmar">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn-action btn-info" onclick="adminModules.editAppointment('${apt.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-danger" onclick="adminModules.deleteAppointment('${apt.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // MÓDULO CLIENTES
    setupClientsModule() {
        const clientsSection = document.getElementById('clients');
        if (!clientsSection) return;

        clientsSection.innerHTML = `
            <div class="module-header">
                <h2>Gerenciar Clientes</h2>
                <div class="module-actions">
                    <button class="btn-primary" onclick="adminModules.openClientModal()">
                        <i class="fas fa-user-plus"></i> Novo Cliente
                    </button>
                </div>
            </div>
            
            <div class="clients-grid" id="clientsGrid">
                <!-- Clientes carregados dinamicamente -->
            </div>

            <!-- Modal de Cliente -->
            <div id="clientModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Novo Cliente</h3>
                        <button class="modal-close" onclick="adminModules.closeModal('clientModal')">&times;</button>
                    </div>
                    <form id="clientForm" onsubmit="adminModules.saveClient(event)">
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Nome Completo</label>
                                <input type="text" name="name" required>
                            </div>
                            <div class="form-group">
                                <label>Telefone</label>
                                <input type="tel" name="phone" required>
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" name="email">
                            </div>
                            <div class="form-group">
                                <label>Data de Nascimento</label>
                                <input type="date" name="birthDate">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Observações Médicas</label>
                            <textarea name="medicalNotes" rows="3" placeholder="Alergias, medicamentos, condições especiais..."></textarea>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn-secondary" onclick="adminModules.closeModal('clientModal')">Cancelar</button>
                            <button type="submit" class="btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    // Métodos auxiliares
    formatDateTime(date, time) {
        if (!date) return 'N/A';
        const dateObj = new Date(date);
        const dateStr = dateObj.toLocaleDateString('pt-BR');
        return time ? `${dateStr} ${time}` : dateStr;
    }

    getStatusText(status) {
        const statusMap = {
            pending: 'Pendente',
            confirmed: 'Confirmado',
            completed: 'Concluído',
            cancelled: 'Cancelado'
        };
        return statusMap[status] || 'Pendente';
    }

    // Métodos de ação
    openAppointmentModal() {
        document.getElementById('appointmentModal').style.display = 'flex';
    }

    openClientModal() {
        document.getElementById('clientModal').style.display = 'flex';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    async saveAppointment(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const appointmentData = Object.fromEntries(formData);
        
        try {
            await API.createAppointment(appointmentData);
            this.closeModal('appointmentModal');
            this.loadAppointments();
            alert('Agendamento criado com sucesso!');
        } catch (error) {
            alert('Erro ao criar agendamento: ' + error.message);
        }
    }

    async updateAppointmentStatus(id, status) {
        try {
            await API.updateAppointment(id, { status });
            this.loadAppointments();
            alert('Status atualizado com sucesso!');
        } catch (error) {
            alert('Erro ao atualizar status: ' + error.message);
        }
    }

    async deleteAppointment(id) {
        if (confirm('Tem certeza que deseja excluir este agendamento?')) {
            try {
                await API.deleteAppointment(id);
                this.loadAppointments();
                alert('Agendamento excluído com sucesso!');
            } catch (error) {
                alert('Erro ao excluir agendamento: ' + error.message);
            }
        }
    }

    filterAppointments() {
        // Implementar filtros
        const search = document.getElementById('appointmentSearch').value.toLowerCase();
        const status = document.getElementById('statusFilter').value;
        const date = document.getElementById('dateFilter').value;
        
        // Lógica de filtro será implementada
    }

    // Métodos placeholder para outros módulos
    setupClientsModule() { /* Implementar */ }
    setupArtistsModule() { /* Implementar */ }
    setupFinancialModule() { /* Implementar */ }
    setupInventoryModule() { /* Implementar */ }
    setupPortfolioModule() { /* Implementar */ }
    
    async loadClients() { /* Implementar */ }
    async loadArtists() { /* Implementar */ }
    async loadInventory() { /* Implementar */ }
    async loadPortfolio() { /* Implementar */ }
}

// CSS adicional para os módulos
const moduleStyles = `
<style>
.module-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--border-color);
}

.module-actions {
    display: flex;
    gap: 1rem;
}

.module-filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.module-filters input,
.module-filters select {
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--secondary-color);
    color: var(--text-light);
}

.data-table-container {
    overflow-x: auto;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--secondary-color);
}

.data-table th {
    background: var(--primary-color);
    color: white;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
}

.data-table td {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-light);
}

.data-table tr:hover {
    background: rgba(208, 0, 0, 0.05);
}

.table-actions {
    display: flex;
    gap: 0.5rem;
}

.btn-action {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: var(--transition);
}

.btn-action.btn-success { background: var(--success-color); color: white; }
.btn-action.btn-info { background: var(--info-color); color: white; }
.btn-action.btn-danger { background: var(--danger-color); color: white; }

.btn-action:hover {
    transform: scale(1.1);
}

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: var(--secondary-color);
    border-radius: var(--border-radius);
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-gray);
    cursor: pointer;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    padding: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-weight: 600;
    color: var(--text-light);
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--background-dark);
    color: var(--text-light);
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1.5rem;
    border-top: 1px solid var(--border-color);
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
}

.status-pending { background: #ffc107; color: #000; }
.status-confirmed { background: #28a745; color: #fff; }
.status-completed { background: #17a2b8; color: #fff; }
.status-cancelled { background: #dc3545; color: #fff; }
</style>
`;

document.head.insertAdjacentHTML('beforeend', moduleStyles);

// Inicializar módulos
let adminModules;
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin-dashboard')) {
        adminModules = new AdminModules();
        window.adminModules = adminModules;
    }
});