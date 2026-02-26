// API para comunicação com o banco de dados (usando localStorage como fallback)
// const API_BASE = 'http://localhost:3001'; // Desabilitado para produção

// Sistema de sincronização em tempo real
class DataSync {
    static listeners = new Map();
    
    static subscribe(dataType, callback) {
        if (!this.listeners.has(dataType)) {
            this.listeners.set(dataType, new Set());
        }
        this.listeners.get(dataType).add(callback);
    }
    
    static unsubscribe(dataType, callback) {
        if (this.listeners.has(dataType)) {
            this.listeners.get(dataType).delete(callback);
        }
    }
    
    static notify(dataType, data) {
        if (this.listeners.has(dataType)) {
            this.listeners.get(dataType).forEach(callback => callback(data));
        }
        // Disparar evento customizado para sincronização entre abas
        window.dispatchEvent(new CustomEvent('dataSync', {
            detail: { type: dataType, data: data }
        }));
    }
}

class API {
    // Usuários
    static async getUsers() {
        // Usando localStorage diretamente
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    static async createUser(userData) {
        // Usando localStorage diretamente
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        userData.id = Date.now();
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        return userData;
    }

    static async getUserByEmail(email) {
        // Usando localStorage diretamente
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.find(user => user.email === email) || null;
    }

    // Agendamentos
    static async getAppointments() {
        return JSON.parse(localStorage.getItem('appointments') || '[]');
    }

    static async getAppointmentsByUser(userId) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        return appointments.filter(apt => apt.userId === userId || apt.userId === userId.toString());
    }

    static async createAppointment(appointmentData) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        appointmentData.id = Date.now();
        appointments.push(appointmentData);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        DataSync.notify('appointments', { action: 'create', data: appointmentData });
        return appointmentData;
    }

    static async updateAppointment(id, appointmentData) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const index = appointments.findIndex(apt => apt.id == id);
        if (index !== -1) {
            appointments[index] = { ...appointments[index], ...appointmentData };
            localStorage.setItem('appointments', JSON.stringify(appointments));
            DataSync.notify('appointments', { action: 'update', data: appointments[index] });
            return appointments[index];
        }
        return null;
    }

    static async deleteAppointment(id) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const filtered = appointments.filter(apt => apt.id != id);
        localStorage.setItem('appointments', JSON.stringify(filtered));
        DataSync.notify('appointments', { action: 'delete', data: { id } });
        return true;
    }

    // Clientes
    static async getClients() {
        return JSON.parse(localStorage.getItem('clients') || '[]');
    }

    static async createClient(clientData) {
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        clientData.id = Date.now();
        clients.push(clientData);
        localStorage.setItem('clients', JSON.stringify(clients));
        DataSync.notify('clients', { action: 'create', data: clientData });
        return clientData;
    }

    // Artistas
    static async getArtists() {
        return JSON.parse(localStorage.getItem('artists') || '[]');
    }

    static async createArtist(artistData) {
        const artists = JSON.parse(localStorage.getItem('artists') || '[]');
        artistData.id = Date.now();
        artists.push(artistData);
        localStorage.setItem('artists', JSON.stringify(artists));
        DataSync.notify('artists', { action: 'create', data: artistData });
        return artistData;
    }

    // Portfólio
    static async getPortfolioItems() {
        return JSON.parse(localStorage.getItem('portfolio') || '[]');
    }

    static async createPortfolioItem(portfolioData) {
        const portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
        portfolioData.id = Date.now();
        portfolio.push(portfolioData);
        localStorage.setItem('portfolio', JSON.stringify(portfolio));
        DataSync.notify('portfolio', { action: 'create', data: portfolioData });
        return portfolioData;
    }

    // Artistas - Métodos avançados
    static async updateArtist(id, artistData) {
        const artists = JSON.parse(localStorage.getItem('artists') || '[]');
        const index = artists.findIndex(artist => artist.id == id);
        if (index !== -1) {
            artists[index] = { ...artists[index], ...artistData };
            localStorage.setItem('artists', JSON.stringify(artists));
            DataSync.notify('artists', { action: 'update', data: artists[index] });
            return artists[index];
        }
        return null;
    }

    static async deleteArtist(id) {
        const artists = JSON.parse(localStorage.getItem('artists') || '[]');
        const filtered = artists.filter(artist => artist.id != id);
        localStorage.setItem('artists', JSON.stringify(filtered));
        DataSync.notify('artists', { action: 'delete', data: { id } });
        return true;
    }

    static async getArtistAppointments(artistId) {
        const appointments = await this.getAppointments();
        return appointments.filter(apt => apt.artist === artistId);
    }

    // Clientes - Métodos avançados
    static async updateClient(id, clientData) {
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        const index = clients.findIndex(client => client.id == id);
        if (index !== -1) {
            clients[index] = { ...clients[index], ...clientData };
            localStorage.setItem('clients', JSON.stringify(clients));
            DataSync.notify('clients', { action: 'update', data: clients[index] });
            return clients[index];
        }
        return null;
    }

    static async deleteClient(id) {
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        const filtered = clients.filter(client => client.id != id);
        localStorage.setItem('clients', JSON.stringify(filtered));
        DataSync.notify('clients', { action: 'delete', data: { id } });
        return true;
    }

    static async getClientHistory(clientId) {
        const appointments = await this.getAppointments();
        return appointments.filter(apt => apt.clientId == clientId);
    }

    // Estoque
    static async getInventory() {
        return JSON.parse(localStorage.getItem('inventory') || '[]');
    }

    static async updateInventoryItem(id, itemData) {
        const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        const index = inventory.findIndex(item => item.id == id);
        if (index !== -1) {
            inventory[index] = { ...inventory[index], ...itemData };
            localStorage.setItem('inventory', JSON.stringify(inventory));
            DataSync.notify('inventory', { action: 'update', data: inventory[index] });
            return inventory[index];
        }
        return null;
    }
}


window.API = API;
window.DataSync = DataSync;

// Sincronização entre abas
window.addEventListener('storage', (e) => {
    if (e.key && e.newValue) {
        const dataType = e.key;
        const data = JSON.parse(e.newValue);
        DataSync.notify(dataType, { action: 'sync', data });
    }
});

// Listener para eventos customizados
window.addEventListener('dataSync', (e) => {
    console.log('Data sync event:', e.detail);
});