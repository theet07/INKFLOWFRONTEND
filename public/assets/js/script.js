// Carrossel de imagens
class Carousel {
    constructor(selector) {
        this.carousel = document.querySelector(selector);
        if (!this.carousel) return;
        
        this.container = this.carousel.querySelector('.carousel-container');
        this.slides = this.carousel.querySelectorAll('.carousel-slide');
        this.prevBtn = this.carousel.querySelector('.carousel-prev');
        this.nextBtn = this.carousel.querySelector('.carousel-next');
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        
        this.init();
    }
    
    init() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Auto-play
        setInterval(() => this.nextSlide(), 5000);
    }
    
    updateCarousel() {
        const translateX = -this.currentSlide * 100;
        this.container.style.transform = `translateX(${translateX}%)`;
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }
    
    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.updateCarousel();
    }
}

// Filtros do portfólio
class PortfolioFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        
        this.init();
    }
    
    init() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterItems(filter);
                this.updateActiveButton(e.target);
            });
        });
    }
    
    filterItems(filter) {
        this.portfolioItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
    
    updateActiveButton(activeBtn) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
}

// Sistema de Login
class LoginSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users') || '[]');
        this.init();
    }
    
    init() {
        // Criar usuário demo se não existir
        if (this.users.length === 0) {
            this.users.push({
                id: 1,
                name: 'Cliente Demo',
                email: 'demo@inkflow.com',
                password: '123456',
                phone: '(11) 99999-9999'
            });
            localStorage.setItem('users', JSON.stringify(this.users));
        }
    }
    
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify(user));
            return true;
        }
        return false;
    }
    
    register(userData) {
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
            return { success: false, message: 'E-mail já cadastrado!' };
        }
        
        const newUser = {
            id: Date.now(),
            ...userData
        };
        
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        return { success: true, message: 'Cadastro realizado com sucesso!' };
    }
    
    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }
    
    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
    }
}

// Validação de formulários
class FormValidator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        if (!this.form) return;
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.submitForm();
            }
        });
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showError(input, 'Este campo é obrigatório');
                isValid = false;
            } else {
                this.clearError(input);
            }
            
            // Validação de email
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    this.showError(input, 'Email inválido');
                    isValid = false;
                }
            }
            
            // Validação de telefone
            if (input.type === 'tel' && input.value) {
                const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
                if (!phoneRegex.test(input.value)) {
                    this.showError(input, 'Formato: (11) 99999-9999');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    showError(input, message) {
        this.clearError(input);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#D00000';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '0.5rem';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = '#D00000';
    }
    
    clearError(input) {
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
        input.style.borderColor = '#444';
    }
    
    submitForm() {
        const formId = this.form.id;
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Processando...';
        submitBtn.disabled = true;
        
        if (formId === 'login-form') {
            this.handleLogin();
        } else if (formId === 'register-form') {
            this.handleRegister();
        } else {
            // Outros formulários
            setTimeout(() => {
                alert('Formulário enviado com sucesso!');
                this.form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    }
    
    handleLogin() {
        const email = this.form.querySelector('#login-email').value;
        const password = this.form.querySelector('#login-password').value;
        
        const loginSystem = new LoginSystem();
        
        setTimeout(() => {
            if (loginSystem.login(email, password)) {
                alert('Login realizado com sucesso!');
                window.location.href = 'meus-agendamentos.html';
            } else {
                alert('E-mail ou senha incorretos!');
                const submitBtn = this.form.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Entrar';
                submitBtn.disabled = false;
            }
        }, 1000);
    }
    
    handleRegister() {
        const formData = new FormData(this.form);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password')
        };
        
        const loginSystem = new LoginSystem();
        
        setTimeout(() => {
            const result = loginSystem.register(userData);
            alert(result.message);
            
            if (result.success) {
                // Fazer login automático após cadastro
                loginSystem.login(userData.email, userData.password);
                window.location.href = 'meus-agendamentos.html';
            } else {
                const submitBtn = this.form.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Criar Conta';
                submitBtn.disabled = false;
            }
        }, 1000);
    }
}

// Máscara para telefone
function phoneMask(input) {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
            value = value.replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3');
        }
        
        e.target.value = value;
    });
}

// Smooth scroll para links internos
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animações de entrada
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    document.querySelectorAll('.card, .portfolio-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistema de login
    const loginSystem = new LoginSystem();
    
    // Atualizar navegação se logado
    if (loginSystem.isLoggedIn()) {
        const profileIcon = document.querySelector('.profile-icon');
        if (profileIcon) {
            profileIcon.parentElement.href = 'meus-agendamentos.html';
            profileIcon.parentElement.title = 'Meus Agendamentos';
        }
    }
    
    // Inicializar carrossel
    new Carousel('.carousel');
    
    // Inicializar filtros do portfólio
    new PortfolioFilter();
    
    // Inicializar validação de formulários
    new FormValidator('#login-form');
    new FormValidator('#register-form');
    
    // Aplicar máscara de telefone
    document.querySelectorAll('input[type="tel"]').forEach(phoneMask);
    
    // Inicializar smooth scroll
    smoothScroll();
    
    // Inicializar animações
    animateOnScroll();
    
    // Menu mobile (se necessário)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});