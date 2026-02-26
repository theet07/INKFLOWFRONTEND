// Sistema de sincronização de agendamentos
class AppointmentSync {
    static init() {
        // Verificar se há agendamentos pendentes de sincronização
        this.syncPendingAppointments();
        
        // Configurar sincronização automática
        this.setupAutoSync();
    }
    
    static async syncPendingAppointments() {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const pendingSync = appointments.filter(apt => !apt.synced);
        
        for (const appointment of pendingSync) {
            try {
                await API.createAppointment(appointment);
                // Marcar como sincronizado
                appointment.synced = true;
                console.log('Agendamento sincronizado:', appointment.id);
            } catch (error) {
                console.log('Erro ao sincronizar agendamento:', appointment.id, error);
            }
        }
        
        // Atualizar localStorage
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }
    
    static setupAutoSync() {
        // Sincronizar a cada 30 segundos
        setInterval(() => {
            this.syncPendingAppointments();
        }, 30000);
        
        // Sincronizar quando a página ganha foco
        window.addEventListener('focus', () => {
            this.syncPendingAppointments();
        });
    }
    
    static async createAppointment(appointmentData) {
        // Adicionar timestamp e ID único
        appointmentData.id = appointmentData.id || Date.now();
        appointmentData.createdAt = appointmentData.createdAt || new Date().toISOString();
        appointmentData.synced = false;
        
        // Salvar localmente primeiro
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        appointments.push(appointmentData);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        // Tentar sincronizar imediatamente
        try {
            await API.createAppointment(appointmentData);
            appointmentData.synced = true;
            localStorage.setItem('appointments', JSON.stringify(appointments));
        } catch (error) {
            console.log('Agendamento salvo localmente, será sincronizado depois');
        }
        
        // Notificar outras abas
        if (window.DataSync) {
            DataSync.notify('appointments', { action: 'create', data: appointmentData });
        }
        
        return appointmentData;
    }
    
    static getAppointmentsByUser(userId) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        return appointments.filter(apt => 
            apt.userId === userId || 
            apt.userId === userId.toString() ||
            apt.userEmail === (typeof userId === 'object' ? userId.email : userId)
        );
    }
    
    static updateAppointmentStatus(appointmentId, newStatus) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const index = appointments.findIndex(apt => apt.id == appointmentId);
        
        if (index !== -1) {
            appointments[index].status = newStatus;
            appointments[index].updatedAt = new Date().toISOString();
            appointments[index].synced = false; // Marcar para re-sincronização
            
            localStorage.setItem('appointments', JSON.stringify(appointments));
            
            // Notificar mudança
            if (window.DataSync) {
                DataSync.notify('appointments', { 
                    action: 'update', 
                    data: appointments[index] 
                });
            }
            
            return appointments[index];
        }
        
        return null;
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    AppointmentSync.init();
});

// Exportar para uso global
window.AppointmentSync = AppointmentSync;