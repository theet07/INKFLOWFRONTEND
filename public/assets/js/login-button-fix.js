// Correção universal para o botão de login/logout
(function() {
    'use strict';
    
    function updateLoginButton() {
        // Detectar se estamos na raiz ou em pages/
        const isInPages = window.location.pathname.includes('/pages/');
        
        // Encontrar o link de login baseado na localização
        const loginLink = isInPages ? 
            document.querySelector('a[href="login.html"]') : 
            document.querySelector('a[href="pages/login.html"]');
            
        if (!loginLink) return;
        
        // Verificar se usuário está logado
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true' || 
                          localStorage.getItem('loginData') !== null;
        
        if (isLoggedIn) {
            // Usuário logado - mostrar nome e botão de logout
            const loginData = localStorage.getItem('loginData');
            let userName = 'Usuário';
            
            if (loginData) {
                try {
                    const parsed = JSON.parse(loginData);
                    userName = parsed.user?.name || parsed.user?.email?.split('@')[0] || 'Usuário';
                } catch (e) {
                    userName = 'Usuário';
                }
            }
            
            const savedAvatar = localStorage.getItem('userAvatar');
            if (savedAvatar) {
                loginLink.innerHTML = `<img src="${savedAvatar}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent-red);">`;
            } else {
                loginLink.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="white" style="background: var(--accent-red); border-radius: 50%; padding: 12px; width: 48px; height: 48px;"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
            }
            loginLink.href = '#';
            loginLink.style.display = 'flex';
            loginLink.style.alignItems = 'center';
            loginLink.style.padding = '0';
            loginLink.style.border = 'none';
            loginLink.onclick = function(e) {
                e.preventDefault();
                // Redirecionar para página de perfil
                window.location.href = isInPages ? 'perfil-new.html' : 'pages/perfil-new.html';
            };
            
            // Mostrar link "Meus Agendamentos" se existir
            const meusAgendamentosLink = document.getElementById('meus-agendamentos-link');
            if (meusAgendamentosLink) {
                meusAgendamentosLink.style.display = 'block';
            }
            
        } else {
            // Usuário não logado - mostrar botão de login
            loginLink.innerHTML = 'Login';
            loginLink.href = isInPages ? 'login.html' : 'pages/login.html';
            loginLink.onclick = null;
            loginLink.style.display = '';
            loginLink.style.alignItems = '';
            
            // Ocultar link "Meus Agendamentos" se existir
            const meusAgendamentosLink = document.getElementById('meus-agendamentos-link');
            if (meusAgendamentosLink) {
                meusAgendamentosLink.style.display = 'none';
            }
        }
    }
    
    // Atualizar quando a página carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateLoginButton);
    } else {
        updateLoginButton();
    }
    
    // Atualizar quando houver mudanças no localStorage
    window.addEventListener('storage', updateLoginButton);
    
    // Verificar periodicamente (fallback para mudanças na mesma aba)
    setInterval(updateLoginButton, 2000);
    
    // Expor função globalmente para uso manual se necessário
    window.updateLoginButton = updateLoginButton;
})();