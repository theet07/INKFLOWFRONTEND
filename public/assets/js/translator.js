// Sistema de Tradução
class SiteTranslator {
    constructor() {
        this.currentLang = localStorage.getItem('site_language') || 'pt';
        this.originalTexts = new Map();
        this.useAutoTranslate = true;
        this.init();
        
        // Observar mudanças no DOM para re-traduzir
        this.setupDOMObserver();
    }

    init() {
        const translateBtn = document.getElementById('translate-btn');
        if (translateBtn) {
            translateBtn.addEventListener('click', () => this.toggleLanguage());
        }
        
        // Aplicar idioma salvo
        if (this.currentLang === 'en') {
            setTimeout(() => this.translatePage(), 100);
        }
        this.updateButton();
    }
    
    setupDOMObserver() {
        // Observar mudanças no DOM para re-traduzir automaticamente
        const observer = new MutationObserver((mutations) => {
            if (this.currentLang === 'en') {
                let shouldRetranslate = false;
                
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                                shouldRetranslate = true;
                            }
                        });
                    }
                });
                
                if (shouldRetranslate) {
                    setTimeout(() => this.translateNewContent(), 500);
                }
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
    
    async translateNewContent() {
        // Traduzir apenas novos elementos que não foram traduzidos
        const allTextElements = document.querySelectorAll('*');
        
        for (const element of allTextElements) {
            if (this.shouldSkipElement(element)) continue;
            
            const textNodes = this.getTextNodes(element);
            
            for (const textNode of textNodes) {
                // Se já foi traduzido, pular
                if (this.originalTexts.has(textNode)) continue;
                
                const text = textNode.textContent.trim();
                if (!text || text.length < 2) continue;
                
                // Salvar texto original
                this.originalTexts.set(textNode, text);
                
                // Traduzir
                try {
                    const translatedText = await this.translateText(text);
                    if (translatedText && translatedText !== text) {
                        textNode.textContent = translatedText;
                    }
                } catch (error) {
                    console.log('Erro na tradução:', error);
                }
            }
        }
    }

    async toggleLanguage() {
        this.currentLang = this.currentLang === 'pt' ? 'en' : 'pt';
        
        // Salvar preferência
        localStorage.setItem('site_language', this.currentLang);
        
        await this.translatePage();
        this.updateButton();
    }

    async translatePage() {
        if (this.currentLang === 'pt') {
            // Restaurar textos originais
            this.originalTexts.forEach((originalText, element) => {
                if (element && element.textContent !== originalText) {
                    element.textContent = originalText;
                }
            });
            return;
        }
        
        // Traduzir TODOS os elementos de texto
        const allTextElements = document.querySelectorAll('*');
        
        for (const element of allTextElements) {
            // Pular elementos que não devem ser traduzidos
            if (this.shouldSkipElement(element)) continue;
            
            const textNodes = this.getTextNodes(element);
            
            for (const textNode of textNodes) {
                const text = textNode.textContent.trim();
                if (!text || text.length < 2) continue;
                
                // Salvar texto original
                if (!this.originalTexts.has(textNode)) {
                    this.originalTexts.set(textNode, text);
                }
                
                // Traduzir
                try {
                    const translatedText = await this.translateText(text);
                    if (translatedText && translatedText !== text) {
                        textNode.textContent = translatedText;
                    }
                } catch (error) {
                    console.log('Erro na tradução:', error);
                }
            }
        }
    }
    
    shouldSkipElement(element) {
        // Pular scripts, styles, etc
        const skipTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'META', 'LINK'];
        if (skipTags.includes(element.tagName)) return true;
        
        // Pular elementos com classes específicas
        if (element.classList.contains('no-translate')) return true;
        
        // Pular se é apenas números/símbolos
        const text = element.textContent.trim();
        if (/^[0-9+%\s\-\.,!@#$%^&*()_+={}\[\]|\\:;"'<>?/~`]*$/.test(text)) return true;
        
        return false;
    }
    
    getTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Pular nós de texto vazios ou só com espaços
                    if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
                    // Pular se o pai é um elemento que não deve ser traduzido
                    const parent = node.parentElement;
                    if (parent && ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );
        
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        return textNodes;
    }
    
    async translateText(text) {
        // Traduções manuais para termos específicos
        const manualTranslations = {
            'Home': 'Home',
            'Sobre Nós': 'About Us',
            'Portfólio': 'Portfolio',
            'Serviços': 'Services',
            'Agendamento': 'Booking',
            'Contato': 'Contact',
            'Login': 'Login',
            'Transformando pele em arte desde 2025': 'Transforming skin into art since 2025',
            'Ver Portfólio': 'View Portfolio',
            'Agendar Sessão': 'Book Session',
            'Arte na Pele': 'Art on Skin',
            'Destaques do Portfólio': 'Portfolio Highlights',
            'Veja mais no nosso': 'See more in our',
            'portfólio': 'portfolio',
            'completo': 'complete',
            'Blackwork': 'Blackwork',
            'Arte em preto puro e intenso': 'Pure and intense black art',
            'Aquarela': 'Watercolor',
            'Cores vibrantes e fluidas': 'Vibrant and fluid colors',
            'Realismo': 'Realism',
            'Detalhes fotográficos perfeitos': 'Perfect photographic details',
            'Mandala': 'Mandala',
            'Geometria sagrada e espiritual': 'Sacred and spiritual geometry',
            'Geométrica': 'Geometric',
            'Formas e padrões modernos': 'Modern shapes and patterns',
            'Fine Line': 'Fine Line',
            'Traços delicados e minimalistas': 'Delicate and minimalist strokes',
            'Diferenciais Competitivos': 'Competitive Advantages',
            'Solicite seu Orçamento': 'Request Your Quote',
            'Experiência Comprovada': 'Proven Experience',
            'Protocolos de Segurança': 'Safety Protocols',
            'Tecnologia de Ponta': 'Cutting-edge Technology',
            'Agendar Consulta': 'Schedule Consultation',
            'Ver Portfólio Completo': 'View Complete Portfolio',
            'Conheça alguns dos nossos trabalhos mais representativos em diferentes técnicas e estilos artísticos': 'Discover some of our most representative works in different artistic techniques and styles',
            'Mais de uma década de atuação no mercado com equipe especializada em técnicas avançadas de tatuagem artística e realismo fotográfico.': 'More than a decade in the market with a team specialized in advanced artistic tattoo techniques and photographic realism.',
            'Rigoroso cumprimento de normas sanitárias da ANVISA, materiais descartáveis certificados e ambiente completamente esterilizado.': 'Strict compliance with ANVISA sanitary standards, certified disposable materials and completely sterilized environment.',
            'Equipamentos de última geração importados, tintas premium de marcas reconhecidas mundialmente e técnicas inovadoras do mercado.': 'Imported state-of-the-art equipment, premium inks from world-renowned brands and innovative market techniques.',
            'Agende uma consulta técnica gratuita com nossa equipe especializada e desenvolva seu projeto personalizado': 'Schedule a free technical consultation with our specialized team and develop your personalized project',
            'Instagram': 'Instagram',
            'TikTok': 'TikTok',
            'WhatsApp': 'WhatsApp',
            'Email': 'Email',
            'Todos os direitos reservados': 'All rights reserved',
            'São Paulo, SP - Brasil': 'São Paulo, SP - Brazil',
            'Deus seja louvado, Amém': 'God be praised, Amen',
            'INK FLOW': 'INK FLOW',
            'Estúdio de Tatuagem Ltda': 'Tattoo Studio Ltd',
            'CNPJ': 'Tax ID',
            'Meus Agendamentos': 'My Appointments',
            'Editar perfil': 'Edit profile',
            'agendamentos': 'appointments',
            'sessões': 'sessions',
            'tatuagens': 'tattoos',
            'Cliente Ink Flow': 'Ink Flow Client',
            'AGENDAMENTOS': 'APPOINTMENTS',
            'HISTÓRICO': 'HISTORY',
            'FAVORITOS': 'FAVORITES',
            'Próximo Agendamento': 'Next Appointment',
            'Artista': 'Artist',
            'Braço direito': 'Right arm',
            'Nenhum favorito ainda': 'No favorites yet',
            'Alterar foto do perfil': 'Change profile picture',
            'Área de Transferência': 'Clipboard',
            'Carregadas': 'Uploaded',
            'Exibir todos os arquivos': 'Show all files',
            'Carregando': 'Loading',
            'Verificando clipboard': 'Checking clipboard',
            'Nenhuma imagem na área de transferência': 'No images in clipboard',
            'Copie uma imagem primeiro': 'Copy an image first',
            'Nenhuma imagem carregada': 'No images uploaded',
            'Nenhuma imagem copiada encontrada': 'No copied images found'
        };
        
        if (manualTranslations[text]) {
            return manualTranslations[text];
        }
        
        // Para textos não mapeados, usar tradução automática
        return await this.autoTranslate(text) || this.simpleTranslate(text);
    }
    
    async autoTranslate(text) {
        // Tradução automática usando Google Translate (se disponível)
        try {
            if (window.google && window.google.translate) {
                return await this.googleTranslate(text);
            }
        } catch (error) {
            console.log('Auto translate not available');
        }
        return null;
    }
    
    simpleTranslate(text) {
        // Traduções básicas para palavras comuns
        const wordMap = {
            'Galeria': 'Gallery',
            'trabalhos': 'works',
            'disponível': 'available',
            'seção': 'section',
            'Visual': 'Visual',
            'anos': 'years',
            'mercado': 'market',
            'equipe': 'team',
            'técnicas': 'techniques',
            'avançadas': 'advanced',
            'artística': 'artistic',
            'realismo': 'realism',
            'fotográfico': 'photographic',
            'normas': 'standards',
            'materiais': 'materials',
            'certificados': 'certified',
            'ambiente': 'environment',
            'esterilizado': 'sterilized',
            'equipamentos': 'equipment',
            'geração': 'generation',
            'importados': 'imported',
            'tintas': 'inks',
            'premium': 'premium',
            'marcas': 'brands',
            'reconhecidas': 'recognized',
            'mundialmente': 'worldwide',
            'inovadoras': 'innovative',
            'consulta': 'consultation',
            'técnica': 'technical',
            'gratuita': 'free',
            'especializada': 'specialized',
            'desenvolva': 'develop',
            'projeto': 'project',
            'personalizado': 'personalized',
            'diferentes': 'different',
            'estilos': 'styles',
            'artísticos': 'artistic',
            'representativos': 'representative',
            'Conheça': 'Discover',
            'alguns': 'some',
            'nossos': 'our',
            'mais': 'most',
            'em': 'in',

            'de': 'of',
            'da': 'of the',
            'do': 'of the',
            'com': 'with',
            'para': 'for',
            'uma': 'a',
            'um': 'a',
            'seu': 'your',
            'sua': 'your',
            'todos': 'all',
            'todas': 'all',
            'direitos': 'rights',
            'reservados': 'reserved'
        };
        
        let translated = text;
        Object.keys(wordMap).forEach(pt => {
            const en = wordMap[pt];
            translated = translated.replace(new RegExp(pt, 'gi'), en);
        });
        
        return translated;
    }

    updateButton() {
        const btn = document.getElementById('translate-btn');
        if (btn) {
            btn.innerHTML = this.currentLang === 'pt' ? '🇺🇸 EN' : '🇧🇷 PT';
            btn.title = this.currentLang === 'pt' ? 'Translate to English' : 'Traduzir para Português';
        }
    }
}

// Inicializar tradutor
document.addEventListener('DOMContentLoaded', () => {
    new SiteTranslator();
});