// Sistema de Autenticação Unificado
class AuthSystem {
    constructor() {
        this.init();
    }

    init() {
        this.updateNavigation();
        this.setupEventListeners();
    }

    isLoggedIn() {
        return localStorage.getItem('userLoggedIn') === 'true';
    }

    login(email, password) {
        // Simulação de login - em produção, validar com backend
        if (email && password) {
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    }

    updateNavigation() {
        const loginLink = document.querySelector('a[href="login.html"]');
        const meusAgendamentosLink = document.getElementById('meus-agendamentos-link');
        
        if (this.isLoggedIn()) {
            if (loginLink) {
                loginLink.textContent = 'Logout';
                loginLink.href = '#';
                loginLink.onclick = (e) => {
                    e.preventDefault();
                    this.logout();
                };
            }
            if (meusAgendamentosLink) {
                meusAgendamentosLink.style.display = 'block';
            }
        } else {
            if (loginLink) {
                loginLink.textContent = 'Login';
                loginLink.href = 'login.html';
                loginLink.onclick = null;
            }
            if (meusAgendamentosLink) {
                meusAgendamentosLink.style.display = 'none';
            }
        }
    }

    setupEventListeners() {
        // Verificar se precisa de login para agendamento
        window.checkLoginForBooking = () => {
            if (this.isLoggedIn()) {
                window.location.href = 'agendamento.html';
            } else {
                const currentUrl = encodeURIComponent(window.location.href);
                window.location.href = `login.html?redirect=agendamento.html`;
            }
        };
    }
}

// Inicializar sistema de autenticação
document.addEventListener('DOMContentLoaded', function() {
    window.authSystem = new AuthSystem();
});