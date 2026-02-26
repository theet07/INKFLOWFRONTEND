// Script global para manter autenticação em todas as páginas
(function() {
    'use strict';
    
    // Função para inicializar autenticação em qualquer página
    function initGlobalAuth() {
        // Aguardar o authSystem estar disponível
        if (typeof window.authSystem !== 'undefined') {
            window.authSystem.updateNavigation();
        } else {
            // Tentar novamente após um pequeno delay
            setTimeout(initGlobalAuth, 100);
        }
    }
    
    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGlobalAuth);
    } else {
        initGlobalAuth();
    }
    
    // Também inicializar quando a página carregar completamente
    window.addEventListener('load', initGlobalAuth);
    
    // Função global para verificar se está logado
    window.isUserLoggedIn = function() {
        const loginData = localStorage.getItem('loginData') || sessionStorage.getItem('loginData');
        const userLoggedIn = localStorage.getItem('userLoggedIn');
        return loginData !== null || userLoggedIn === 'true';
    };
    
    // Função global para obter usuário atual
    window.getCurrentLoggedUser = function() {
        const loginData = localStorage.getItem('loginData') || sessionStorage.getItem('loginData');
        if (loginData) {
            const parsed = JSON.parse(loginData);
            return parsed.user || parsed;
        }
        
        const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('currentUser');
        if (userEmail) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            return users.find(u => u.email === userEmail);
        }
        
        return null;
    };
    
    // Função global para logout
    window.globalLogout = function() {
        if (confirm('Deseja realmente sair?')) {
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
    };
    
})();