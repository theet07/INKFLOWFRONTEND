// Correções para o sistema de login
document.addEventListener('DOMContentLoaded', function() {
    // Corrigir problemas de compatibilidade
    fixLoginCompatibility();
    
    // Atualizar navegação
    if (window.authSystem) {
        window.authSystem.updateNavigation();
    }
});

function fixLoginCompatibility() {
    // Migrar dados antigos se necessário
    const oldUserData = localStorage.getItem('userData');
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    
    if (userLoggedIn === 'true' && oldUserData && !localStorage.getItem('loginData')) {
        try {
            const userData = JSON.parse(oldUserData);
            const loginData = {
                isLoggedIn: true,
                user: userData,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('loginData', JSON.stringify(loginData));
        } catch (e) {
            console.log('Erro ao migrar dados de login');
        }
    }
    
    // Limpar dados inconsistentes
    if (!userLoggedIn || userLoggedIn !== 'true') {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userData');
    }
}

// Função global melhorada para verificar login
window.checkLoginForBooking = function() {
    const authSystem = window.authSystem;
    
    if (authSystem && authSystem.isLoggedIn()) {
        const isInPages = window.location.pathname.includes('/pages/');
        window.location.href = isInPages ? 'agendamento.html' : 'pages/agendamento.html';
    } else {
        const confirmLogin = confirm('Você precisa fazer login para agendar uma sessão. Deseja ir para a página de login?');
        if (confirmLogin) {
            const isInPages = window.location.pathname.includes('/pages/');
            const currentPage = window.location.pathname.split('/').pop();
            window.location.href = isInPages ? 
                `login.html?redirect=${currentPage}` : 
                `pages/login.html?redirect=pages/${currentPage}`;
        }
    }
};

// Função para logout seguro
window.safeLogout = function() {
    if (confirm('Deseja realmente sair?')) {
        // Limpar todos os dados de login
        localStorage.removeItem('loginData');
        sessionStorage.removeItem('loginData');
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userData');
        localStorage.removeItem('adminLoggedIn');
        
        alert('Logout realizado com sucesso!');
        
        // Redirecionar
        const isInPages = window.location.pathname.includes('/pages/');
        window.location.href = isInPages ? '../index.html' : 'index.html';
    }
};