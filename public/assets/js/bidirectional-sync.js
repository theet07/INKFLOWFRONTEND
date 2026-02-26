// Sincronização Bidirecional Completa
class BidirectionalSync {
    constructor() {
        this.init();
    }

    init() {
        this.setupSiteToAdminSync();
        this.setupAdminToSiteSync();
        this.setupCrossTabSync();
    }

    // SITE → ADMIN: Quando algo muda no site, atualiza no admin
    setupSiteToAdminSync() {
        // Interceptar agendamentos do site
        this.interceptSiteAppointments();
        
        // Interceptar cadastros de usuários
        this.interceptUserRegistrations();
        
        // Interceptar interações do portfólio
        this.interceptPortfolioViews();
    }

    interceptSiteAppointments() {
        // Sobrescrever função de agendamento do site
        const originalCreateAppointment = window.API?.createAppointment;
        if (originalCreateAppointment) {
            window.API.createAppointment = async (appointmentData) => {
                const result = await originalCreateAppointment.call(window.API, appointmentData);
                
                // Notificar admin em tempo real
                this.notifyAdmin('new_appointment', result);
                
                // Atualizar disponibilidade no site
                this.updateSiteAvailability();
                
                return result;
            };
        }

        // Interceptar formulário de agendamento
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'appointment-form' || e.target.classList.contains('appointment-form')) {
                this.handleSiteAppointmentSubmit(e);
            }
        });
    }

    async handleSiteAppointmentSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const appointmentData = Object.fromEntries(formData);
        
        // Adicionar timestamp e ID único
        appointmentData.id = Date.now();
        appointmentData.createdAt = new Date().toISOString();
        appointmentData.source = 'website';
        appointmentData.status = 'pending';
        
        try {
            // Salvar no localStorage (sincronização instantânea)
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            appointments.push(appointmentData);
            localStorage.setItem('appointments', JSON.stringify(appointments));
            
            // Notificar todas as abas/painéis
            DataSync.notify('appointments', { action: 'create', data: appointmentData });
            
            // Mostrar confirmação no site
            this.showSiteNotification('Agendamento realizado com sucesso! Aguarde confirmação.', 'success');
            
            // Limpar formulário
            event.target.reset();
            
        } catch (error) {
            this.showSiteNotification('Erro ao realizar agendamento. Tente novamente.', 'error');
        }
    }

    // ADMIN → SITE: Quando algo muda no admin, atualiza no site
    setupAdminToSiteSync() {
        // Escutar mudanças do admin
        DataSync.subscribe('appointments', (data) => {
            this.syncAppointmentsToSite(data);
        });

        DataSync.subscribe('portfolio', (data) => {
            this.syncPortfolioToSite(data);
        });

        DataSync.subscribe('artists', (data) => {
            this.syncArtistsToSite(data);
        });
    }

    syncAppointmentsToSite(data) {
        // Atualizar disponibilidade de horários no site
        this.updateSiteAvailability();
        
        // Se for confirmação de agendamento, mostrar notificação
        if (data.action === 'update' && data.data.status === 'confirmed') {
            this.showSiteNotification('Seu agendamento foi confirmado!', 'success');
        }
    }

    syncPortfolioToSite(data) {
        if (data.action === 'create') {
            // Adicionar nova imagem ao portfólio do site
            this.addPortfolioItemToSite(data.data);
        }
    }

    syncArtistsToSite(data) {
        if (data.action === 'create') {
            // Adicionar novo artista às opções do site
            this.addArtistToSiteOptions(data.data);
        }
    }

    // SINCRONIZAÇÃO ENTRE ABAS
    setupCrossTabSync() {
        // Escutar mudanças no localStorage (entre abas)
        window.addEventListener('storage', (e) => {
            if (e.key && e.newValue) {
                const data = JSON.parse(e.newValue);
                this.handleCrossTabUpdate(e.key, data);
            }
        });

        // Escutar eventos customizados
        window.addEventListener('dataSync', (e) => {
            this.handleDataSyncEvent(e.detail);
        });
    }

    handleCrossTabUpdate(key, data) {
        switch (key) {
            case 'appointments':
                this.updateSiteAvailability();
                this.refreshAdminDashboard();
                break;
            case 'portfolio':
                this.refreshSitePortfolio();
                break;
            case 'artists':
                this.refreshSiteArtists();
                break;
        }
    }

    // MÉTODOS DE ATUALIZAÇÃO DO SITE
    updateSiteAvailability() {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const bookedSlots = appointments.map(apt => ({
            date: apt.date,
            time: apt.time,
            artist: apt.artist
        }));

        // Atualizar seletores de horário
        const timeSelects = document.querySelectorAll('select[name="time"], select[name="horario"]');
        timeSelects.forEach(select => {
            this.updateTimeSelectAvailability(select, bookedSlots);
        });
    }

    updateTimeSelectAvailability(select, bookedSlots) {
        const selectedDate = document.querySelector('input[name="date"], input[name="data"]')?.value;
        const selectedArtist = document.querySelector('select[name="artist"], select[name="artista"]')?.value;

        Array.from(select.options).forEach(option => {
            const isBooked = bookedSlots.some(slot => 
                slot.date === selectedDate && 
                slot.time === option.value &&
                (!selectedArtist || slot.artist === selectedArtist)
            );

            if (isBooked) {
                option.disabled = true;
                option.textContent = option.textContent.replace(' (Ocupado)', '') + ' (Ocupado)';
            } else {
                option.disabled = false;
                option.textContent = option.textContent.replace(' (Ocupado)', '');
            }
        });
    }

    addPortfolioItemToSite(item) {
        const portfolioGrid = document.querySelector('.portfolio-grid, .gallery-grid');
        if (!portfolioGrid) return;

        const itemElement = document.createElement('div');
        itemElement.className = 'portfolio-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="portfolio-overlay">
                <h3>${item.title}</h3>
                <p>${item.artist || 'Ink Flow Studios'}</p>
            </div>
        `;
        
        // Adicionar com animação
        itemElement.style.opacity = '0';
        itemElement.style.transform = 'scale(0.8)';
        portfolioGrid.appendChild(itemElement);
        
        setTimeout(() => {
            itemElement.style.transition = 'all 0.3s ease';
            itemElement.style.opacity = '1';
            itemElement.style.transform = 'scale(1)';
        }, 100);
    }

    addArtistToSiteOptions(artist) {
        const artistSelects = document.querySelectorAll('select[name="artist"], select[name="artista"]');
        artistSelects.forEach(select => {
            const option = document.createElement('option');
            option.value = artist.id;
            option.textContent = artist.name;
            select.appendChild(option);
        });
    }

    // NOTIFICAÇÕES VISUAIS
    showSiteNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `site-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;

        // Adicionar estilos se não existirem
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .site-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--secondary-dark);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                    max-width: 400px;
                }
                .site-notification.success { border-left: 4px solid #28a745; }
                .site-notification.error { border-left: 4px solid #dc3545; }
                .site-notification.info { border-left: 4px solid #17a2b8; }
                .notification-content { display: flex; align-items: center; gap: 0.5rem; flex: 1; }
                .notification-close { background: none; border: none; color: var(--text-gray); cursor: pointer; }
                @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // MÉTODOS AUXILIARES
    notifyAdmin(type, data) {
        // Enviar notificação para o painel admin se estiver aberto
        const adminWindows = this.getAdminWindows();
        adminWindows.forEach(win => {
            win.postMessage({ type, data }, '*');
        });
    }

    getAdminWindows() {
        // Implementar lógica para encontrar janelas do admin abertas
        return [];
    }

    refreshAdminDashboard() {
        // Atualizar dashboard se estiver na página admin
        if (window.location.pathname.includes('admin') && window.adminDashboard) {
            window.adminDashboard.loadDashboardData();
        }
    }

    refreshSitePortfolio() {
        // Recarregar portfólio do site
        if (window.siteIntegration) {
            window.siteIntegration.syncPortfolio();
        }
    }

    refreshSiteArtists() {
        // Recarregar artistas do site
        if (window.siteIntegration) {
            window.siteIntegration.syncArtists();
        }
    }
}

// Inicializar sincronização bidirecional
document.addEventListener('DOMContentLoaded', function() {
    window.bidirectionalSync = new BidirectionalSync();
});

window.BidirectionalSync = BidirectionalSync;