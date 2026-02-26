// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.currentTheme = localStorage.getItem('adminTheme') || 'dark';
        this.notifications = [];
        this.charts = {};
        this.appointments = [];
        this.filteredAppointments = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupTheme();
        this.loadDashboardData();
        this.loadAppointments();
        this.initCharts();
        this.loadNotifications();
        this.setupEventListeners();
        this.setupRealTimeSync();
        this.addQuickActionsToHeader();
        this.initPremiumFeatures();
    }
    
    initPremiumFeatures() {
        // Adicionar filtro global de período
        this.addGlobalPeriodFilter();
        
        // Melhorar notificações com sons
        this.setupNotificationSounds();
        
        // Adicionar WhatsApp integration
        this.setupWhatsAppIntegration();
    }
    
    addGlobalPeriodFilter() {
        // Filtro removido por preferência do usuário
    }
    
    setupNotificationSounds() {
        // Som para novas notificações
        this.notificationSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    }
    
    setupWhatsAppIntegration() {
        // Adicionar botões do WhatsApp nos agendamentos
        this.whatsappEnabled = true;
    }
    
    updateDashboardPeriod(period) {
        console.log('Atualizando período para:', period);
        // Recarregar dados com novo período
        this.loadDashboardData();
        this.updateCharts();
    }

    checkAuth() {
        // Verificar login administrativo separado
        const adminLoggedIn = localStorage.getItem('adminLoggedIn');
        const adminData = JSON.parse(localStorage.getItem('adminLoginData') || '{}');
        
        if (adminLoggedIn !== 'true' || !adminData.isAdmin) {
            alert('Acesso negado. Faça login como administrador.');
            window.location.href = 'login.html';
            return;
        }
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    loadDashboardData() {
        // Carregar dados do localStorage e APIs
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Simular dados financeiros
        const monthlyRevenue = this.calculateMonthlyRevenue(appointments);
        
        // Atualizar estatísticas
        this.updateStats({
            totalAppointments: appointments.length,
            todayAppointments: this.getTodayAppointments(appointments),
            pendingAppointments: appointments.filter(apt => apt.status === 'pending').length,
            monthlyRevenue: monthlyRevenue
        });

        // Carregar atividade recente
        this.loadRecentActivity();
    }

    updateStats(stats) {
        // Animar atualizações
        this.animateStatUpdate('totalAppointments', stats.totalAppointments);
        this.animateStatUpdate('todayAppointments', stats.todayAppointments);
        this.animateStatUpdate('pendingAppointments', stats.pendingAppointments);
        this.animateStatUpdate('monthlyRevenue', `R$ ${stats.monthlyRevenue.toLocaleString('pt-BR')}`);
        
        // Atualizar badge de agendamentos com animação
        const badge = document.getElementById('appointmentsBadge');
        if (badge) {
            const oldValue = parseInt(badge.textContent) || 0;
            const newValue = stats.pendingAppointments;
            
            if (oldValue !== newValue) {
                badge.textContent = newValue;
                badge.style.animation = 'pulse 0.5s ease-in-out';
                setTimeout(() => {
                    badge.style.animation = '';
                }, 500);
            }
        }
    }
    
    animateStatUpdate(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const oldValue = element.textContent;
        if (oldValue !== newValue.toString()) {
            element.textContent = newValue;
            
            // Adicionar animação ao cartão pai
            const statCard = element.closest('.stat-card');
            if (statCard) {
                statCard.classList.add('updated');
                setTimeout(() => {
                    statCard.classList.remove('updated');
                }, 1000);
            }
        }
    }

    getTodayAppointments(appointments) {
        const today = new Date().toDateString();
        return appointments.filter(apt => 
            apt.date && new Date(apt.date).toDateString() === today
        ).length;
    }

    calculateMonthlyRevenue(appointments) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return appointments
            .filter(apt => {
                const aptDate = new Date(apt.date);
                return aptDate.getMonth() === currentMonth && 
                       aptDate.getFullYear() === currentYear &&
                       apt.status === 'confirmed';
            })
            .reduce((total, apt) => total + (apt.price || 200), 0);
    }

    initCharts() {
        // Aguardar um pouco para garantir que os elementos estão renderizados
        setTimeout(() => {
            this.initAppointmentsChart();
            this.initTattooTypesChart();
        }, 100);
    }

    initAppointmentsChart() {
        const ctx = document.getElementById('appointmentsChart');
        if (!ctx) {
            console.log('Canvas appointmentsChart não encontrado');
            return;
        }

        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const monthlyData = this.getMonthlyAppointmentsData(appointments);

        // Destruir gráfico existente se houver
        if (this.charts.appointments) {
            this.charts.appointments.destroy();
        }

        this.charts.appointments = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthlyData.labels,
                datasets: [{
                    label: 'Agendamentos',
                    data: monthlyData.data,
                    borderColor: '#d00000',
                    backgroundColor: 'rgba(208, 0, 0, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#cccccc'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#cccccc'
                        },
                        grid: {
                            color: '#444444'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#cccccc'
                        },
                        grid: {
                            color: '#444444'
                        }
                    }
                }
            }
        });
    }

    initTattooTypesChart() {
        const ctx = document.getElementById('tattooTypesChart');
        if (!ctx) {
            console.log('Canvas tattooTypesChart não encontrado');
            return;
        }

        const tattooTypes = this.getTattooTypesData();

        // Destruir gráfico existente se houver
        if (this.charts.tattooTypes) {
            this.charts.tattooTypes.destroy();
        }

        this.charts.tattooTypes = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: tattooTypes.labels,
                datasets: [{
                    data: tattooTypes.data,
                    backgroundColor: [
                        '#d00000',
                        '#28a745',
                        '#ffc107',
                        '#17a2b8',
                        '#6f42c1'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#cccccc',
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    getMonthlyAppointmentsData(appointments) {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        const data = new Array(6).fill(0);
        
        // Simular dados para demonstração
        for (let i = 0; i < 6; i++) {
            data[i] = Math.floor(Math.random() * 20) + 5;
        }

        return { labels: months, data: data };
    }

    getTattooTypesData() {
        return {
            labels: ['Realismo', 'Tribal', 'Minimalista', 'Old School', 'Aquarela'],
            data: [35, 25, 20, 15, 5]
        };
    }

    loadRecentActivity() {
        // Carregar atividades reais do localStorage e gerar algumas simuladas
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        const activities = [];
        
        // Adicionar atividades baseadas em agendamentos recentes
        const recentAppointments = appointments
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 2);
            
        recentAppointments.forEach(apt => {
            activities.push({
                icon: 'fas fa-calendar-plus',
                text: `Novo agendamento criado por ${apt.name || 'Cliente'}`,
                time: this.getTimeAgo(apt.createdAt),
                type: 'success'
            });
        });
        
        // Adicionar atividades simuladas se não houver agendamentos suficientes
        if (activities.length < 4) {
            const simulatedActivities = [
                {
                    icon: 'fas fa-user-plus',
                    text: 'Cliente Maria Santos cadastrado',
                    time: '15 min atrás',
                    type: 'info'
                },
                {
                    icon: 'fas fa-dollar-sign',
                    text: 'Pagamento de R$ 350 recebido',
                    time: '1 hora atrás',
                    type: 'success'
                },
                {
                    icon: 'fas fa-exclamation-triangle',
                    text: 'Estoque de tinta preta baixo',
                    time: '2 horas atrás',
                    type: 'warning'
                }
            ];
            
            activities.push(...simulatedActivities.slice(0, 4 - activities.length));
        }

        const activityList = document.getElementById('activityList');
        if (activityList) {
            // Limpar conteúdo anterior
            activityList.innerHTML = '';
            
            // Adicionar cada atividade individualmente para evitar problemas de codificação
            activities.forEach(activity => {
                const activityElement = document.createElement('div');
                activityElement.className = `activity-item ${activity.type}`;
                
                activityElement.innerHTML = `
                    <div class="activity-icon">
                        <i class="${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <p>${this.escapeHtml(activity.text)}</p>
                        <span class="activity-time">${this.escapeHtml(activity.time)}</span>
                    </div>
                `;
                
                activityList.appendChild(activityElement);
            });
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    getTimeAgo(dateString) {
        if (!dateString) return 'Agora';
        
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Agora';
        if (diffMins < 60) return `${diffMins} min atrás`;
        if (diffHours < 24) return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
        return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
    }

    loadNotifications() {
        this.notifications = [
            {
                id: 1,
                title: 'Agendamento confirmado',
                message: 'Cliente João Silva confirmou agendamento para amanhã',
                time: '10 min atrás',
                read: false,
                type: 'success'
            },
            {
                id: 2,
                title: 'Estoque baixo',
                message: 'Tinta preta está com estoque crítico',
                time: '1 hora atrás',
                read: false,
                type: 'warning'
            },
            {
                id: 3,
                title: 'Novo cliente',
                message: 'Maria Santos se cadastrou no sistema',
                time: '2 horas atrás',
                read: true,
                type: 'info'
            }
        ];

        this.updateNotificationCount();
        this.renderNotifications();
    }

    updateNotificationCount() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const countElement = document.getElementById('notificationCount');
        if (countElement) {
            countElement.textContent = unreadCount;
            countElement.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    renderNotifications() {
        const notificationList = document.getElementById('notificationList');
        if (!notificationList) return;

        notificationList.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                <div class="notification-content">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    <span class="notification-time">${notification.time}</span>
                </div>
                <div class="notification-actions">
                    ${!notification.read ? `<button onclick="adminDashboard.markAsRead(${notification.id})"><i class="fas fa-check"></i></button>` : ''}
                    <button onclick="adminDashboard.deleteNotification(${notification.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Fechar dropdown de notificações ao clicar fora
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('notificationDropdown');
            const button = document.querySelector('.notification-btn');
            
            if (dropdown && !dropdown.contains(e.target) && !button.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }
    
    setupRealTimeSync() {
        // Escutar mudanças de agendamentos
        if (window.DataSync) {
            DataSync.subscribe('appointments', (data) => {
                console.log('Admin: Nova atualização de agendamento:', data);
                this.handleAppointmentUpdate(data);
            });
        }
        
        // Escutar eventos de sincronização entre abas
        window.addEventListener('dataSync', (event) => {
            if (event.detail.type === 'appointments') {
                console.log('Admin: Sincronização entre abas:', event.detail);
                this.handleAppointmentUpdate(event.detail);
            }
        });
        
        // Escutar mudanças no localStorage
        window.addEventListener('storage', (event) => {
            if (event.key === 'appointments') {
                console.log('Admin: LocalStorage atualizado');
                this.loadDashboardData();
                this.updateCharts();
            }
        });
        
        // Atualização periódica
        setInterval(() => {
            this.loadDashboardData();
        }, 30000); // A cada 30 segundos
    }
    
    handleAppointmentUpdate(data) {
        // Recarregar dados do dashboard
        this.loadDashboardData();
        
        // Recarregar agendamentos
        this.loadAppointments();
        
        // Atualizar gráficos
        this.updateCharts();
        
        // Adicionar notificação
        if (data.action === 'create') {
            this.addNotification({
                id: Date.now(),
                title: 'Novo Agendamento',
                message: `Novo agendamento recebido de ${data.data.name || 'Cliente'}`,
                time: 'Agora',
                read: false,
                type: 'success'
            });
        }
        
        // Atualizar atividade recente
        this.addRecentActivity({
            icon: 'fas fa-calendar-plus',
            text: `Novo agendamento: ${data.data.name || 'Cliente'} - ${data.data.service || 'Serviço'}`,
            time: 'Agora',
            type: 'success'
        });
    }
    
    addNotification(notification) {
        this.notifications.unshift(notification);
        // Manter apenas as últimas 10 notificações
        if (this.notifications.length > 10) {
            this.notifications = this.notifications.slice(0, 10);
        }
        this.updateNotificationCount();
        this.renderNotifications();
    }
    
    addRecentActivity(activity) {
        const activityList = document.getElementById('activityList');
        if (activityList) {
            // Criar elemento da atividade
            const activityElement = document.createElement('div');
            activityElement.className = `activity-item ${activity.type} new-activity`;
            
            activityElement.innerHTML = `
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${this.escapeHtml(activity.text)}</p>
                    <span class="activity-time">${this.escapeHtml(activity.time)}</span>
                </div>
            `;
            
            // Inserir no início da lista
            activityList.insertBefore(activityElement, activityList.firstChild);
            
            // Remover atividades antigas se houver muitas
            const activities = activityList.querySelectorAll('.activity-item');
            if (activities.length > 5) {
                activities[activities.length - 1].remove();
            }
            
            // Remover classe de destaque após animação
            setTimeout(() => {
                activityElement.classList.remove('new-activity');
            }, 3000);
        }
    }
    
    updateCharts() {
        // Recriar gráficos com novos dados
        setTimeout(() => {
            this.initAppointmentsChart();
            this.initTattooTypesChart();
        }, 100);
    }
    
    loadAppointments() {
        this.appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        this.filteredAppointments = [...this.appointments];
        this.renderAppointmentsTable();
        this.setupAppointmentFilters();
        this.updateStatusCounters();
    }
    
    setupAppointmentFilters() {
        const searchInput = document.getElementById('appointmentSearch');
        const statusFilter = document.getElementById('statusFilter');
        const dateFilter = document.getElementById('dateFilter');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterAppointments());
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterAppointments());
        }
        if (dateFilter) {
            dateFilter.addEventListener('change', () => this.filterAppointments());
        }
        
        this.addStatusCounters();
        this.addExtraFilters();
    }
    
    addStatusCounters() {
        const appointmentsSection = document.getElementById('appointments');
        const sectionHeader = appointmentsSection?.querySelector('.section-header');
        
        if (sectionHeader && !document.querySelector('.status-counters')) {
            const counters = document.createElement('div');
            counters.className = 'status-counters';
            counters.style.cssText = `
                display: flex;
                gap: 1rem;
                margin: 1rem 0;
                flex-wrap: wrap;
            `;
            
            sectionHeader.insertAdjacentElement('afterend', counters);
            this.updateStatusCounters();
        }
    }
    
    updateStatusCounters() {
        const counters = document.querySelector('.status-counters');
        if (!counters) return;
        
        const statusCounts = {
            pending: 0,
            confirmed: 0,
            completed: 0,
            cancelled: 0
        };
        
        this.appointments.forEach(apt => {
            const status = apt.status || 'pending';
            if (statusCounts.hasOwnProperty(status)) {
                statusCounts[status]++;
            }
        });
        
        counters.innerHTML = `
            <div class="status-counter pending">
                <span class="count">${statusCounts.pending}</span>
                <span class="label">Pendentes</span>
            </div>
            <div class="status-counter confirmed">
                <span class="count">${statusCounts.confirmed}</span>
                <span class="label">Confirmados</span>
            </div>
            <div class="status-counter completed">
                <span class="count">${statusCounts.completed}</span>
                <span class="label">Concluídos</span>
            </div>
            <div class="status-counter cancelled">
                <span class="count">${statusCounts.cancelled}</span>
                <span class="label">Cancelados</span>
            </div>
        `;
    }
    
    addExtraFilters() {
        const filtersContainer = document.querySelector('.appointments-filters .filter-group');
        if (filtersContainer && !document.getElementById('artistFilter')) {
            const artistFilter = document.createElement('select');
            artistFilter.id = 'artistFilter';
            artistFilter.className = 'filter-select';
            artistFilter.innerHTML = `
                <option value="">Todos os artistas</option>
                <option value="marcus">Marcus Silva</option>
                <option value="ana">Ana Costa</option>
                <option value="rafael">Rafael Santos</option>
                <option value="carla">Carla Mendes</option>
            `;
            artistFilter.addEventListener('change', () => this.filterAppointments());
            
            filtersContainer.appendChild(artistFilter);
        }
    }
    
    filterAppointments() {
        const searchTerm = document.getElementById('appointmentSearch')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const dateFilter = document.getElementById('dateFilter')?.value || '';
        const artistFilter = document.getElementById('artistFilter')?.value || '';
        
        this.filteredAppointments = this.appointments.filter(appointment => {
            const matchesSearch = !searchTerm || 
                appointment.name?.toLowerCase().includes(searchTerm) ||
                appointment.phone?.includes(searchTerm) ||
                appointment.userEmail?.toLowerCase().includes(searchTerm);
                
            const matchesStatus = !statusFilter || appointment.status === statusFilter;
            
            const matchesDate = !dateFilter || 
                (appointment.appointmentDate && appointment.appointmentDate === dateFilter) ||
                (appointment.createdAt && appointment.createdAt.startsWith(dateFilter));
                
            const matchesArtist = !artistFilter || appointment.artist === artistFilter;
                
            return matchesSearch && matchesStatus && matchesDate && matchesArtist;
        });
        
        this.currentPage = 1;
        this.renderAppointmentsTable();
    }
    
    renderAppointmentsTable() {
        const tbody = document.getElementById('appointmentsTableBody');
        if (!tbody) return;
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageAppointments = this.filteredAppointments.slice(startIndex, endIndex);
        
        if (pageAppointments.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-gray);">
                        Nenhum agendamento encontrado
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = pageAppointments.map(appointment => {
                const status = appointment.status || 'pendente';
                const artist = this.getArtistName(appointment.artist);
                const service = this.getServiceName(appointment.service);
                const dateTime = this.formatDateTime(appointment);
                const value = appointment.estimatedPrice || 'A definir';
                
                const artistColor = this.getArtistColor(appointment.artist);
                const whatsappBtn = appointment.phone ? `
                    <button class="action-btn whatsapp" onclick="adminDashboard.sendWhatsApp('${appointment.phone}', '${appointment.name}')" title="WhatsApp">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                ` : '';
                
                return `
                    <tr>
                        <td>#${appointment.id}</td>
                        <td>
                            <div>
                                <strong>${appointment.name || 'N/A'}</strong>
                                <br>
                                <small style="color: var(--text-gray);">${appointment.userEmail || ''}</small>
                            </div>
                        </td>
                        <td>${appointment.phone || 'N/A'}</td>
                        <td>${service}</td>
                        <td>${dateTime}</td>
                        <td>
                            <span style="color: ${artistColor}; font-weight: 600;">
                                <i class="fas fa-circle" style="font-size: 0.5rem; margin-right: 0.5rem;"></i>
                                ${artist}
                            </span>
                        </td>
                        <td>
                            <span class="status-badge status-${status}">${status}</span>
                        </td>
                        <td>R$ ${typeof value === 'number' ? value.toLocaleString('pt-BR') : value}</td>
                        <td>
                            <div class="action-buttons">
                                ${whatsappBtn}
                                <button class="action-btn view" onclick="adminDashboard.viewAppointment(${appointment.id})" title="Visualizar">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="action-btn edit" onclick="adminDashboard.editAppointment(${appointment.id})" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn delete" onclick="adminDashboard.deleteAppointment(${appointment.id})" title="Excluir">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }
        
        this.updatePagination();
    }
    
    getArtistName(artistSlug) {
        const artists = {
            'marcus': 'Marcus Silva',
            'ana': 'Ana Costa',
            'rafael': 'Rafael Santos',
            'carla': 'Carla Mendes'
        };
        return artists[artistSlug] || artistSlug || 'Sem preferência';
    }
    
    getArtistColor(artistSlug) {
        const colors = {
            'marcus': '#ff6b6b',
            'ana': '#4ecdc4',
            'rafael': '#45b7d1',
            'carla': '#96ceb4'
        };
        return colors[artistSlug] || '#666';
    }
    
    addQuickActionsToHeader() {
        const headerRight = document.querySelector('.header-right');
        if (headerRight && !document.querySelector('.quick-actions')) {
            const quickActions = document.createElement('div');
            quickActions.className = 'quick-actions';
            quickActions.innerHTML = `
                <button class="quick-action-btn" onclick="showSection('appointments')">
                    <i class="fas fa-plus"></i> Agendamento
                </button>
                <button class="quick-action-btn" onclick="showSection('clients')">
                    <i class="fas fa-user-plus"></i> Cliente
                </button>
                <button class="quick-action-btn" onclick="adminDashboard.exportData()">
                    <i class="fas fa-download"></i> Exportar
                </button>
            `;
            headerRight.insertBefore(quickActions, headerRight.firstChild);
        }
    }
    
    getServiceName(serviceSlug) {
        const services = {
            'tatuagem-artistica': 'Tatuagem Artística',
            'fine-line': 'Fine Line',
            'aquarela': 'Aquarela',
            'geometrica': 'Geométrica',
            'cover-up': 'Cover-up',
            'piercing': 'Piercing'
        };
        return services[serviceSlug] || serviceSlug || 'N/A';
    }
    
    formatDateTime(appointment) {
        if (appointment.appointmentDate && appointment.appointmentTime) {
            const date = new Date(appointment.appointmentDate).toLocaleDateString('pt-BR');
            return `${date} às ${appointment.appointmentTime}`;
        }
        if (appointment.createdAt) {
            return new Date(appointment.createdAt).toLocaleString('pt-BR');
        }
        return 'N/A';
    }
    
    updatePagination() {
        const totalItems = this.filteredAppointments.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        
        const paginationInfo = document.getElementById('appointmentsPaginationInfo');
        const currentPageInfo = document.getElementById('currentPageInfo');
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        
        if (paginationInfo) {
            const startItem = totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
            const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);
            paginationInfo.textContent = `Mostrando ${startItem} a ${endItem} de ${totalItems} agendamentos`;
        }
        
        if (currentPageInfo) {
            currentPageInfo.textContent = `Página ${this.currentPage} de ${Math.max(1, totalPages)}`;
        }
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= totalPages;
        }
    }
    
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderAppointmentsTable();
        }
    }
    
    nextPage() {
        const totalPages = Math.ceil(this.filteredAppointments.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderAppointmentsTable();
        }
    }
    
    viewAppointment(id) {
        const appointment = this.appointments.find(apt => apt.id == id);
        if (appointment) {
            alert(`Detalhes do Agendamento #${id}:\n\nCliente: ${appointment.name}\nTelefone: ${appointment.phone}\nServiço: ${this.getServiceName(appointment.service)}\nArtista: ${this.getArtistName(appointment.artist)}\nStatus: ${appointment.status}\nDescrição: ${appointment.description || 'N/A'}`);
        }
    }
    
    editAppointment(id) {
        const appointment = this.appointments.find(apt => apt.id == id);
        if (appointment) {
            const newStatus = prompt('Alterar status para:', appointment.status);
            if (newStatus && ['pendente', 'confirmado', 'cancelado', 'concluido'].includes(newStatus)) {
                AppointmentSync.updateAppointmentStatus(id, newStatus);
                this.loadAppointments();
            }
        }
    }
    
    deleteAppointment(id) {
        if (confirm('Tem certeza que deseja excluir este agendamento?')) {
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            const filtered = appointments.filter(apt => apt.id != id);
            localStorage.setItem('appointments', JSON.stringify(filtered));
            this.loadAppointments();
            
            if (window.DataSync) {
                DataSync.notify('appointments', { action: 'delete', data: { id } });
            }
        }
    }
    
    exportAppointments() {
        const data = {
            appointments: this.filteredAppointments,
            exportDate: new Date().toISOString(),
            totalCount: this.filteredAppointments.length
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agendamentos-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Métodos públicos
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (sidebar) {
            if (window.innerWidth <= 768) {
                // Mobile: mostrar/esconder completamente
                sidebar.classList.toggle('show');
            } else {
                // Desktop: colapsar/expandir
                sidebar.classList.toggle('collapsed');
                if (mainContent) {
                    mainContent.classList.toggle('sidebar-collapsed');
                }
            }
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('adminTheme', this.currentTheme);
        this.setupTheme();
    }

    toggleNotifications() {
        const dropdown = document.getElementById('notificationDropdown');
        dropdown.classList.toggle('show');
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.updateNotificationCount();
            this.renderNotifications();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.updateNotificationCount();
        this.renderNotifications();
    }

    deleteNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.updateNotificationCount();
        this.renderNotifications();
    }

    showSection(sectionName) {
        // Esconder todas as seções
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remover classe active de todos os nav-items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Mostrar seção selecionada
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Ativar nav-item correspondente
        const targetNavItem = document.querySelector(`[onclick="showSection('${sectionName}')"]`).closest('.nav-item');
        if (targetNavItem) {
            targetNavItem.classList.add('active');
        }

        // Fechar sidebar em mobile após selecionar item
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('show');
                sidebar.classList.add('collapsed');
            }
        }

        // Atualizar título da página
        const titles = {
            dashboard: 'Dashboard',
            appointments: 'Agendamentos',
            clients: 'Clientes',
            artists: 'Artistas',
            financial: 'Financeiro',
            inventory: 'Estoque',
            reports: 'Relatórios',
            settings: 'Configurações'
        };

        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            pageTitle.textContent = titles[sectionName] || 'Dashboard';
        }
        
        // Carregar dados específicos da seção
        if (sectionName === 'appointments') {
            this.loadAppointments();
        } else if (sectionName === 'clients' && window.clientManager) {
            window.clientManager.loadClients();
        } else if (sectionName === 'artists') {
            // Garantir que os artistas sejam carregados
            if (!window.artistManager) {
                // Criar dados diretamente se o manager não existir
                const artistsGrid = document.getElementById('artistsGrid');
                if (artistsGrid) {
                    const artists = [
                        { 
                            id: 1, 
                            name: 'Marcus Silva', 
                            title: 'Realismo & Cover-up',
                            specialties: ['Realismo', 'Cover-up'], 
                            experience: 12, 
                            status: 'ativo', 
                            bio: 'Especialista em realismo e cover-ups com mais de 12 anos transformando pele em arte. Suas obras são reconhecidas pela precisão e detalhamento.',
                            monthlyStats: { tattoos: 28, revenue: 14000, rating: 4.9 }
                        },
                        { 
                            id: 2, 
                            name: 'Ana Costa', 
                            title: 'Aquarela & Fine Line',
                            specialties: ['Aquarela', 'Minimalista', 'Fine Line'], 
                            experience: 8, 
                            status: 'ativo', 
                            bio: 'Especialista em aquarela e fine line. Suas criações delicadas e coloridas conquistam clientes que buscam arte sutil e elegante.',
                            monthlyStats: { tattoos: 35, revenue: 12250, rating: 4.8 }
                        },
                        { 
                            id: 3, 
                            name: 'Rafael Santos', 
                            title: 'Geométrico & Blackwork',
                            specialties: ['Geométrico', 'Tradicional', 'Blackwork'], 
                            experience: 10, 
                            status: 'ativo', 
                            bio: 'Mestre em desenhos geométricos e blackwork. Suas linhas precisas e formas perfeitas criam tatuagens de impacto visual único.',
                            monthlyStats: { tattoos: 26, revenue: 11700, rating: 4.7 }
                        },
                        { 
                            id: 4, 
                            name: 'Carla Mendes', 
                            title: 'Old School & Neo Tradicional',
                            specialties: ['Tradicional', 'Old School', 'Neo Tradicional'], 
                            experience: 7, 
                            status: 'ativo', 
                            bio: 'Especialista em old school e neo tradicional. Suas tatuagens clássicas com toque moderno são referência no estúdio.',
                            monthlyStats: { tattoos: 30, revenue: 10200, rating: 4.6 }
                        }
                    ];
                    
                    artistsGrid.innerHTML = artists.map(artist => `
                        <div class="artist-card">
                            <div class="artist-header">
                                <div class="artist-avatar">
                                    <i class="fas fa-palette"></i>
                                </div>
                                <div class="artist-info">
                                    <h4>${artist.name}</h4>
                                    <p class="artist-title">${artist.title}</p>
                                    <p class="artist-specialties">${artist.specialties.join(', ')}</p>
                                </div>
                                <span class="artist-status ${artist.status}">Ativo</span>
                            </div>
                            
                            <div class="artist-bio">
                                <p>${artist.bio}</p>
                            </div>
                            
                            <div class="artist-stats">
                                <div class="stat-item">
                                    <span class="stat-value">${artist.experience}</span>
                                    <span class="stat-label">Anos Exp.</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-value">${artist.monthlyStats.tattoos}</span>
                                    <span class="stat-label">Tatuagens/Mês</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-value">R$ ${artist.monthlyStats.revenue.toLocaleString()}</span>
                                    <span class="stat-label">Faturamento</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-value">${artist.monthlyStats.rating}★</span>
                                    <span class="stat-label">Avaliação</span>
                                </div>
                            </div>
                            
                            <div class="artist-actions">
                                <button class="action-btn-small primary" onclick="viewArtistAgenda(${artist.id})" title="Ver Agenda">
                                    <i class="fas fa-calendar"></i>
                                </button>
                                <button class="action-btn-small success" onclick="contactArtist(${artist.id})" title="WhatsApp">
                                    <i class="fab fa-whatsapp"></i>
                                </button>
                                <button class="action-btn-small info" onclick="editArtist(${artist.id})" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn-small warning" onclick="viewCommissions(${artist.id})" title="Comissões">
                                    <i class="fas fa-dollar-sign"></i>
                                </button>
                            </div>
                        </div>
                    `).join('');
                }
            } else {
                window.artistManager.loadArtists();
            }
        }
    }

    refreshActivity() {
        this.loadRecentActivity();
        
        // Mostrar feedback visual
        const button = event?.target || document.querySelector('.btn-secondary i');
        const icon = button?.querySelector ? button.querySelector('i') : button;
        
        if (icon) {
            icon.classList.add('fa-spin');
            setTimeout(() => {
                icon.classList.remove('fa-spin');
            }, 1000);
        }
        
        // Mostrar mensagem de sucesso
        this.showToast('Atividade recente atualizada!', 'success');
    }
    
    showToast(message, type = 'info') {
        // Criar elemento do toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
            <span>${message}</span>
        `;
        
        // Adicionar estilos inline se não existirem
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--secondary-dark);
            color: var(--text-light);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            border-left: 4px solid ${type === 'success' ? '#28a745' : '#17a2b8'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        document.body.appendChild(toast);
        
        // Remover após 3 segundos
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    sendWhatsApp(phone, clientName) {
        const message = encodeURIComponent(`Olá ${clientName}! Aqui é do Ink Flow Studios. Como posso ajudá-lo(a)?`);
        const cleanPhone = phone.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    }
    
    exportData() {
        const data = {
            appointments: JSON.parse(localStorage.getItem('appointments') || '[]'),
            users: JSON.parse(localStorage.getItem('users') || '[]'),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inkflow-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    logout() {
        if (confirm('Tem certeza que deseja sair do painel administrativo?')) {
            // Remover apenas dados do admin - NÃO afetar login de cliente
            localStorage.removeItem('adminLoginData');
            localStorage.removeItem('adminLoggedIn');
            
            // Manter dados de cliente intactos
            // localStorage.getItem('loginData') - PRESERVADO
            // localStorage.getItem('userLoggedIn') - PRESERVADO
            
            window.location.href = 'login.html';
        }
    }
}

// Funções globais para compatibilidade
function toggleSidebar() {
    adminDashboard.toggleSidebar();
}

function toggleTheme() {
    adminDashboard.toggleTheme();
}

function toggleNotifications() {
    adminDashboard.toggleNotifications();
}

function showSection(sectionName) {
    adminDashboard.showSection(sectionName);
}

function refreshActivity() {
    adminDashboard.refreshActivity();
}

function exportData() {
    adminDashboard.exportData();
}

function logout() {
    adminDashboard.logout();
}

function markAllAsRead() {
    adminDashboard.markAllAsRead();
}

function exportAppointments() {
    adminDashboard.exportAppointments();
}

function previousPage() {
    adminDashboard.previousPage();
}

function nextPage() {
    adminDashboard.nextPage();
}

function openAppointmentModal() {
    alert('Funcionalidade de novo agendamento será implementada em breve.');
}

function openArtistModal() {
    alert('Funcionalidade de novo artista será implementada em breve.');
}

function exportArtists() {
    const artists = [
        'Marcus Silva - Realismo & Cover-up',
        'Ana Costa - Aquarela & Fine Line', 
        'Rafael Santos - Geométrico & Blackwork',
        'Carla Mendes - Old School & Neo Tradicional'
    ];
    
    const data = `Relatório de Artistas - ${new Date().toLocaleDateString('pt-BR')}\n\n${artists.join('\n')}`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `artistas-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Inicializar dashboard
let adminDashboard;
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar carregamento completo do Chart.js
    if (typeof Chart !== 'undefined') {
        adminDashboard = new AdminDashboard();
    } else {
        setTimeout(() => {
            adminDashboard = new AdminDashboard();
        }, 500);
    }
});

// Responsividade mobile
window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.classList.contains('collapsed')) {
            sidebar.classList.remove('show');
        }
    }
});

// CSS adicional para atividades e notificações
const additionalStyles = `
<style>
.activity-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 0.75rem;
    border-left: 4px solid transparent;
}

.activity-item.success { border-left-color: var(--success-color); }
.activity-item.warning { border-left-color: var(--warning-color); }
.activity-item.info { border-left-color: var(--info-color); }

.activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--border-color);
    color: var(--text-light);
}

.activity-content p {
    margin: 0;
    font-size: 0.875rem;
}

.activity-time {
    font-size: 0.75rem;
    color: var(--text-gray);
}

.notification-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
}

.notification-item.unread {
    background: rgba(208, 0, 0, 0.05);
}

.notification-content {
    flex: 1;
}

.notification-content h4 {
    margin: 0 0 0.25rem 0;
    font-size: 0.875rem;
    font-weight: 600;
}

.notification-content p {
    margin: 0 0 0.25rem 0;
    font-size: 0.8rem;
    color: var(--text-gray);
}

.notification-time {
    font-size: 0.75rem;
    color: var(--text-gray);
}

.notification-actions {
    display: flex;
    gap: 0.5rem;
}

.notification-actions button {
    background: none;
    border: none;
    color: var(--text-gray);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: var(--transition);
}

.notification-actions button:hover {
    background: var(--border-color);
    color: var(--text-light);
}

.new-activity {
    animation: slideInAndHighlight 3s ease-out;
    border-left-color: var(--accent-red) !important;
    background: rgba(208, 0, 0, 0.1);
}

@keyframes slideInAndHighlight {
    0% {
        transform: translateX(-100%);
        opacity: 0;
    }
    20% {
        transform: translateX(0);
        opacity: 1;
        background: rgba(208, 0, 0, 0.2);
    }
    100% {
        background: rgba(208, 0, 0, 0.05);
    }
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.stats-grid .stat-card {
    transition: all 0.3s ease;
}

.stats-grid .stat-card.updated {
    animation: pulse 1s ease-in-out;
}

.stat-icon {
    transition: all 0.3s ease;
}

.stat-card:hover .stat-icon {
    transform: scale(1.1) rotate(5deg);
}

.stat-card.primary .stat-icon i {
    animation: bounce 2s infinite;
}

.stat-card.success .stat-icon i {
    animation: pulse-icon 2s infinite;
}

.stat-card.warning .stat-icon i {
    animation: shake 3s infinite;
}

.stat-card.info .stat-icon i {
    animation: glow 2s infinite;
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-5px); }
    60% { transform: translateY(-3px); }
}

@keyframes pulse-icon {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
    20%, 40%, 60%, 80% { transform: translateX(2px); }
}

@keyframes glow {
    0%, 100% { text-shadow: 0 0 5px currentColor; }
    50% { text-shadow: 0 0 10px currentColor, 0 0 15px currentColor; }
}

.logo i {
    animation: crown-glow 3s ease-in-out infinite;
}

@keyframes crown-glow {
    0%, 100% { 
        color: var(--accent-red);
        filter: drop-shadow(0 0 5px var(--accent-red));
    }
    50% { 
        color: #ff6b6b;
        filter: drop-shadow(0 0 10px #ff6b6b);
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.02);
        box-shadow: 0 0 20px rgba(208, 0, 0, 0.3);
    }
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
}

.section-actions {
    display: flex;
    gap: 1rem;
}

.appointments-filters {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: var(--secondary-dark);
    border-radius: 8px;
    border: 1px solid var(--border-color);
}

.filter-group {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
}

.search-input, .filter-select, .filter-date {
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--primary-dark);
    color: var(--text-light);
    font-size: 0.875rem;
}

.search-input {
    min-width: 250px;
    flex: 1;
}

.filter-select, .filter-date {
    min-width: 150px;
}

.appointments-table-container {
    background: var(--secondary-dark);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    overflow: hidden;
    margin-bottom: 1rem;
}

.appointments-table {
    width: 100%;
    border-collapse: collapse;
}

.appointments-table th,
.appointments-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
}

.appointments-table th {
    background: linear-gradient(135deg, var(--primary-dark) 0%, #8b0000 100%);
    font-weight: 600;
    color: var(--text-light);
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    position: sticky;
    top: 0;
    z-index: 10;
}

.appointments-table td {
    color: var(--text-gray);
    font-size: 0.875rem;
}

.appointments-table tbody tr:nth-child(even) {
    background: rgba(255,255,255,0.02);
}

.appointments-table tbody tr:hover {
    background: rgba(208, 0, 0, 0.08);
    transform: scale(1.001);
    transition: all 0.2s ease;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.status-pendente, .status-pending {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
    border: 1px solid #ffc107;
}

.status-confirmado, .status-confirmed {
    background: rgba(40, 167, 69, 0.2);
    color: #28a745;
    border: 1px solid #28a745;
}

.status-cancelado, .status-cancelled {
    background: rgba(220, 53, 69, 0.2);
    color: #dc3545;
    border: 1px solid #dc3545;
}

.status-concluido, .status-completed {
    background: rgba(23, 162, 184, 0.2);
    color: #17a2b8;
    border: 1px solid #17a2b8;
}

.status-em-espera {
    background: rgba(108, 117, 125, 0.2);
    color: #6c757d;
    border: 1px solid #6c757d;
}

.action-buttons {
    display: flex;
    gap: 0.5rem;
}

.action-btn {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.75rem;
}

.action-btn.view {
    background: rgba(23, 162, 184, 0.2);
    color: #17a2b8;
}

.action-btn.edit {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
}

.action-btn.delete {
    background: rgba(220, 53, 69, 0.2);
    color: #dc3545;
}

.action-btn.whatsapp {
    background: rgba(37, 211, 102, 0.2);
    color: #25d366;
}

.period-filter {
    font-size: 0.875rem;
}

.status-counters {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
    flex-wrap: wrap;
}

.status-counter {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem 1rem;
    background: var(--secondary-dark);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    min-width: 80px;
    transition: all 0.2s ease;
}

.status-counter:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.status-counter .count {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.25rem;
}

.status-counter .label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-gray);
}

.status-counter.pending .count {
    color: #ffc107;
}

.status-counter.confirmed .count {
    color: #28a745;
}

.status-counter.completed .count {
    color: #17a2b8;
}

.status-counter.cancelled .count {
    color: #dc3545;
}

.action-btn {
    padding: 0.6rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    position: relative;
    min-width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
}

.artist-card {
    background: var(--secondary-dark);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid var(--border-color);
    margin-bottom: 1rem;
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
    color: var(--text-light);
}

.artist-specialties {
    margin: 0;
    color: var(--text-gray);
    font-size: 0.85rem;
}

.artist-status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.artist-status.ativo {
    background: #e8f5e8;
    color: #388e3c;
}

.artist-stats {
    display: flex;
    justify-content: space-around;
    padding: 1rem 0;
    border-top: 1px solid var(--border-color);
}

.artist-stats .stat-item {
    text-align: center;
}

.artist-stats .stat-value {
    display: block;
    font-weight: 600;
    color: var(--accent-red);
    font-size: 1rem;
}

.artist-stats .stat-label {
    display: block;
    font-size: 0.75rem;
    color: var(--text-gray);
    margin-top: 0.25rem;
}

.artist-title {
    margin: 0;
    color: var(--accent-red);
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
}

.artist-bio {
    margin: 1rem 0;
    padding: 1rem;
    background: rgba(0,0,0,0.2);
    border-radius: 8px;
    border-left: 3px solid var(--accent-red);
}

.artist-bio p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-gray);
    line-height: 1.4;
}

.artist-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
}

.action-btn-small {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
}

.action-btn-small.primary { background: rgba(23, 162, 184, 0.2); color: #17a2b8; }
.action-btn-small.success { background: rgba(37, 211, 102, 0.2); color: #25d366; }
.action-btn-small.info { background: rgba(255, 193, 7, 0.2); color: #ffc107; }
.action-btn-small.warning { background: rgba(220, 53, 69, 0.2); color: #dc3545; }

.action-btn-small:hover {
    transform: scale(1.1);
}

.action-btn.view {
    border-color: rgba(23, 162, 184, 0.3);
}

.action-btn.edit {
    border-color: rgba(255, 193, 7, 0.3);
}

.action-btn.delete {
    border-color: rgba(220, 53, 69, 0.3);
}

.action-btn.whatsapp {
    border-color: rgba(37, 211, 102, 0.3);
}

.action-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.table-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--secondary-dark);
    border-radius: 8px;
    border: 1px solid var(--border-color);
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.pagination-controls button {
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    background: var(--primary-dark);
    color: var(--text-light);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.pagination-controls button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-controls button:not(:disabled):hover {
    background: var(--accent-red);
}

.charts-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
}

.chart-card {
    background: var(--secondary-dark);
    border-radius: 12px;
    border: 1px solid var(--border-color);
    padding: 1.5rem;
    min-height: 400px;
    display: flex;
    flex-direction: column;
}

.chart-card canvas {
    flex: 1;
    max-height: 300px;
}

.sidebar {
    width: 280px;
    transition: all 0.3s ease;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 100;
}

.sidebar.collapsed {
    width: 70px;
}

.sidebar.collapsed .sidebar-nav span {
    display: none;
}

.sidebar.collapsed .logo span {
    display: none;
}

.sidebar.collapsed .user-details {
    display: none;
}

.sidebar.collapsed .badge {
    display: none;
}

.sidebar.collapsed .sidebar-nav a {
    justify-content: center;
    padding: 1rem 0.5rem;
}

.sidebar.collapsed .sidebar-nav i {
    margin: 0;
}

.sidebar-header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
}

.sidebar-toggle {
    background: none;
    border: none;
    color: var(--text-light);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.sidebar-toggle:hover {
    background: rgba(255,255,255,0.1);
}

.sidebar.collapsed .logo {
    display: flex;
    justify-content: center;
}

.sidebar.collapsed .sidebar-header {
    justify-content: center;
}

.main-content {
    margin-left: 280px;
    transition: margin-left 0.3s ease;
    min-height: 100vh;
}

.main-content.sidebar-collapsed {
    margin-left: 70px;
}

.main-header {
    position: sticky;
    top: 0;
    background: var(--primary-dark);
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--border-color);
    z-index: 100;
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.quick-actions {
    display: flex;
    gap: 0.5rem;
}

.quick-action-btn {
    padding: 0.5rem 1rem;
    background: rgba(208, 0, 0, 0.1);
    border: 1px solid var(--accent-red);
    color: var(--accent-red);
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.quick-action-btn:hover {
    background: var(--accent-red);
    color: white;
    transform: translateY(-1px);
}

@media (max-width: 768px) {
    .quick-actions {
        display: none;
    }
}

.content-section {
    padding: 2rem;
}

.mobile-menu-btn {
    display: none;
}

@media (max-width: 768px) {
    .mobile-menu-btn {
        display: block;
    }
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.activity-section {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    margin-top: 2rem;
}

.chart-card {
    height: 400px;
}

.chart-card canvas {
    width: 100% !important;
    height: 300px !important;
}

@media (max-width: 768px) {
    .charts-row {
        grid-template-columns: 1fr;
    }
    
    .sidebar {
        position: fixed;
        left: -100%;
        width: 280px;
        z-index: 1000;
    }
    
    .sidebar.show {
        left: 0;
    }
    
    .sidebar.collapsed {
        left: -100%;
        width: 280px;
    }
    
    .main-content {
        margin-left: 0;
    }
    
    .main-content.sidebar-collapsed {
        margin-left: 0;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Funções dos botões dos artistas
function viewArtistAgenda(artistId) {
    const artists = {
        1: 'Marcus Silva',
        2: 'Ana Costa', 
        3: 'Rafael Santos',
        4: 'Carla Mendes'
    };
    
    const today = new Date().toLocaleDateString('pt-BR');
    const appointments = [
        '09:00 - Cliente João (Realismo)',
        '14:00 - Cliente Maria (Cover-up)',
        '16:30 - Cliente Pedro (Consulta)'
    ];
    
    alert(`Agenda de ${artists[artistId]} - ${today}:\n\n${appointments.join('\n')}\n\nTotal: ${appointments.length} agendamentos`);
}

function contactArtist(artistId) {
    const contacts = {
        1: '11999991111',
        2: '11999992222',
        3: '11999993333', 
        4: '11999994444'
    };
    
    const artists = {
        1: 'Marcus Silva',
        2: 'Ana Costa',
        3: 'Rafael Santos', 
        4: 'Carla Mendes'
    };
    
    const phone = contacts[artistId];
    const name = artists[artistId];
    const message = encodeURIComponent(`Olá ${name}! Mensagem do dashboard administrativo.`);
    
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
}

function editArtist(artistId) {
    const artists = {
        1: 'Marcus Silva',
        2: 'Ana Costa',
        3: 'Rafael Santos',
        4: 'Carla Mendes'
    };
    
    const name = artists[artistId];
    const newName = prompt(`Editar nome do artista:`, name);
    
    if (newName && newName !== name) {
        alert(`Nome atualizado: ${name} → ${newName}`);
    }
}

function viewCommissions(artistId) {
    const artists = {
        1: 'Marcus Silva',
        2: 'Ana Costa', 
        3: 'Rafael Santos',
        4: 'Carla Mendes'
    };
    
    const commissions = {
        1: { rate: 65, thisMonth: 14000, lastMonth: 12500 },
        2: { rate: 60, thisMonth: 12250, lastMonth: 11800 },
        3: { rate: 62, thisMonth: 11700, lastMonth: 10900 },
        4: { rate: 58, thisMonth: 10200, lastMonth: 9800 }
    };
    
    const data = commissions[artistId];
    const name = artists[artistId];
    
    alert(`Comissões de ${name}:\n\nTaxa: ${data.rate}%\nEste mês: R$ ${data.thisMonth.toLocaleString()}\nMês anterior: R$ ${data.lastMonth.toLocaleString()}\nComissão atual: R$ ${(data.thisMonth * data.rate / 100).toLocaleString()}`);
}