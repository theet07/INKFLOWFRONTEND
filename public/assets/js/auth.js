// Sistema de Autenticação
class AuthSystem {
    constructor() {
        this.initializeDefaultUsers();
    }

    // Inicializar usuários padrão para demonstração
    async initializeDefaultUsers() {
        try {
            const users = await API.getUsers();
            // Usuários já existem no banco
        } catch (error) {
            console.log('Usando localStorage como fallback');
            const users = this.getUsers();
            if (users.length === 0) {
                const defaultUsers = [
                    {
                        id: 1,
                        name: 'Cliente Demo',
                        email: 'demo@inkflow.com',
                        password: 'demo123',
                        phone: '(11) 99999-9999',
                        birth: '1990-01-01',
                        createdAt: new Date().toISOString()
                    }
                ];
                localStorage.setItem('users', JSON.stringify(defaultUsers));
            }
        }
    }

    // Obter todos os usuários
    async getUsers() {
        try {
            return await API.getUsers();
        } catch (error) {
            return JSON.parse(localStorage.getItem('users') || '[]');
        }
    }

    // Verificar se usuário está logado
    isLoggedIn() {
        const loginData = localStorage.getItem('loginData') || sessionStorage.getItem('loginData');
        const userLoggedIn = localStorage.getItem('userLoggedIn');
        return loginData !== null || userLoggedIn === 'true';
    }

    // Obter dados do usuário logado
    getCurrentUser() {
        const loginData = localStorage.getItem('loginData') || sessionStorage.getItem('loginData');
        if (loginData) {
            const parsed = JSON.parse(loginData);
            return parsed.user || parsed;
        }
        
        // Fallback para sistema antigo
        const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('currentUser');
        if (userEmail) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            return users.find(u => u.email === userEmail);
        }
        
        return null;
    }

    // Fazer logout
    logout() {
        localStorage.removeItem('loginData');
        sessionStorage.removeItem('loginData');
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('adminLoggedIn');
        
        alert('Logout realizado com sucesso!');
        
        // Redirecionar para home
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '/index.html') {
            window.location.reload();
        } else if (currentPath.includes('/pages/')) {
            window.location.href = '../index.html';
        } else {
            window.location.href = 'index.html';
        }
    }

    // Proteger páginas que requerem login
    requireAuth(redirectPage = null) {
        if (!this.isLoggedIn()) {
            alert('Você precisa fazer login para acessar esta página.');
            const currentPage = redirectPage || window.location.pathname.split('/').pop();
            window.location.href = `login.html?redirect=${currentPage}`;
            return false;
        }
        return true;
    }

    // Atualizar navegação baseada no status de login
    updateNavigation() {
        const loginLinks = document.querySelectorAll('a[href*="login.html"], a[href="pages/login.html"]');
        const meusAgendamentosLink = document.getElementById('meus-agendamentos-link');
        
        if (this.isLoggedIn()) {
            // Usuário logado - mostrar botão de logout
            loginLinks.forEach(loginLink => {
                if (loginLink) {
                    const user = this.getCurrentUser();
                    const userName = user ? (user.nome || user.name || user.email.split('@')[0]) : 'Usuário';
                    loginLink.innerHTML = `${userName} | Sair`;
                    loginLink.onclick = (e) => {
                        e.preventDefault();
                        if (confirm('Deseja realmente sair?')) {
                            this.logout();
                        }
                    };
                    loginLink.href = '#';
                }
            });
            
            // Mostrar link "Meus Agendamentos" se existir
            if (meusAgendamentosLink) {
                meusAgendamentosLink.style.display = 'block';
            }
            
            // Adicionar link do perfil se não existir
            const navLinks = document.querySelector('.nav-links');
            if (navLinks && !document.getElementById('perfil-link')) {
                const perfilLink = document.createElement('li');
                // Corrigir href baseado na localização atual
                const currentPath = window.location.pathname;
                let perfilHref = 'perfil.html';
                if (currentPath === '/' || currentPath === '/index.html') {
                    perfilHref = 'pages/perfil.html';
                } else if (currentPath.includes('/pages/')) {
                    perfilHref = 'perfil.html';
                } else {
                    perfilHref = 'pages/perfil.html';
                }
                perfilLink.innerHTML = `<a href="${perfilHref}" id="perfil-link">Perfil</a>`;
                navLinks.appendChild(perfilLink);
            }
        } else {
            // Usuário não logado - mostrar botão de login
            loginLinks.forEach(loginLink => {
                if (loginLink) {
                    loginLink.innerHTML = 'Login';
                    loginLink.onclick = null;
                    // Corrigir href baseado na localização atual
                    const currentPath = window.location.pathname;
                    if (currentPath === '/' || currentPath === '/index.html') {
                        loginLink.href = 'pages/login.html';
                    } else if (currentPath.includes('/pages/')) {
                        loginLink.href = 'login.html';
                    } else {
                        loginLink.href = 'pages/login.html';
                    }
                }
            });
            
            // Ocultar link "Meus Agendamentos" se existir
            if (meusAgendamentosLink) {
                meusAgendamentosLink.style.display = 'none';
            }
        }
    }
}

// Inicializar sistema de autenticação globalmente
window.authSystem = new AuthSystem();

// Conexão com banco desabilitada para produção

// Função global para verificar login antes de agendar
window.checkLoginForBooking = function() {
    if (window.authSystem && window.authSystem.isLoggedIn()) {
        // Redirecionar para agendamento baseado na localização atual
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '/index.html') {
            window.location.href = 'pages/agendamento.html';
        } else if (currentPath.includes('/pages/')) {
            window.location.href = 'agendamento.html';
        } else {
            window.location.href = 'pages/agendamento.html';
        }
    } else {
        alert('Você precisa fazer login para agendar uma sessão.');
        // Redirecionar para login baseado na localização atual
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '/index.html') {
            window.location.href = 'pages/login.html';
        } else if (currentPath.includes('/pages/')) {
            window.location.href = 'login.html';
        } else {
            window.location.href = 'pages/login.html';
        }
    }
};

// Atualizar navegação quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    if (window.authSystem) {
        window.authSystem.updateNavigation();
    }
});

// Atualizar navegação quando mudar de página
window.addEventListener('load', function() {
    if (window.authSystem) {
        window.authSystem.updateNavigation();
    }
});