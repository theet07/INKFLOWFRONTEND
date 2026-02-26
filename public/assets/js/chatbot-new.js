// Sistema de Chatbot para Ink Flow - Duas Personalidades
class InkFlowChatbot {
    constructor() {
        this.isOpen = false;
        this.conversationHistory = [];
        this.personality = 'rebelde'; // 'rebelde' ou 'boazinha'
        this.userContext = {
            name: null,
            interests: [],
            previousQuestions: [],
            mood: 'neutral'
        };
        this.responses = {
            rebelde: {
                'horario': 'Funcionamos segunda a sábado das 9h às 18h! Domingo? Só se rolar algo especial! 🕘😎',
                'preco': 'Preços de R$200 a R$1500+. Depende se você quer algo simples ou épico! 💸🔥',
                'agendamento': 'Bora agendar logo essa tattoo! Clica em "Agendamento"! ⚡',
                'cuidados': 'Cuida direito: limpa, pomada, zero sol por 30 dias! Senão estraga tudo! 😤',
                'estilos': 'Temos todos os estilos! Realismo, Aquarela, Geométrico, Blackwork, Fine Line, Tradicional! 🎨🤘',
                'local': 'Rua Augusta, SP! Se não achar, usa o GPS! 📍😏',
                'tempo': 'Pequena: 1-2h, Média: 3-5h, Grande: várias sessões! Paciência! ⏱️',
                'dor': 'Vai doer sim! Mas nossos tatuadores são feras! 😈💪',
                'idade': 'Só +18! Sem exceção! 🔞',
                'retoque': 'Retoque grátis em 30 dias se cuidar bem! ✅',
                'portfolio': 'Instagram @inkflowsp! Vai lá ver nossos trampos! 📸🔥',
                'pagamento': 'Dinheiro, PIX, cartão. Parcela em 12x! 💳',
                'desconto': 'Promoções rolam! Segue nosso Insta! 🎉',
                'cicatrizacao': 'Cicatrização: 15-30 dias. Vai descascar, é normal! 🩹',
                'sol': 'Zero sol por 30 dias! Protetor sempre! ☀️',
                'exercicio': 'Nada de academia por 1 semana! 💪',
                'piscina': 'Água? Só depois de 2 semanas! 🏊',
                'tamanho': 'Pequena no pulso, grande nas costas! 📏',
                'cores': 'Colorida é linda mas desbota mais! P&B é eterno! 🌈',
                'remocao': 'Remoção é cara e dolorosa! Pensa bem! 😬',
                'cover': 'Cover-up depende da tattoo antiga! 🎭'
            },
            boazinha: {
                'horario': 'Funcionamos segunda a sábado das 9h às 18h! Ficamos felizes em atendê-lo! 🕘😊',
                'preco': 'Nossos preços variam de R$200 a R$1500+. Agende uma consulta para um orçamento personalizado! 💰💕',
                'agendamento': 'Será um prazer agendar sua tattoo! Clique em "Agendamento"! ⏰😊',
                'cuidados': 'Cuide com carinho: limpe suavemente, use pomada e evite sol por 30 dias! ☀️💕',
                'estilos': 'Oferecemos Realismo, Aquarela, Geométrico, Blackwork, Fine Line e Tradicional com muito amor! 🎨💖',
                'local': 'Estamos na Rua Augusta, SP! Consulte nosso mapa no menu Contato! 📍😊',
                'tempo': 'Pequena: 1-2h, Média: 3-5h, Grande: várias sessões. Faremos com todo cuidado! ⏱️💕',
                'dor': 'Pode doer um pouquinho, mas nossos tatuadores são muito cuidadosos! 😊💖',
                'idade': 'Atendemos apenas maiores de 18 anos por segurança! 🔞😊',
                'retoque': 'Oferecemos retoque gratuito em 30 dias se cuidar bem! ✅💕',
                'portfolio': 'Veja nossos trabalhos no Instagram @inkflowsp! Ficará encantado! 📸💖',
                'pagamento': 'Aceitamos dinheiro, PIX e cartão. Parcelamos com carinho! 💳😊',
                'desconto': 'Temos promoções especiais! Acompanhe nosso Instagram! 🎉💕',
                'cicatrizacao': 'Cicatrização leva 15-30 dias. Descascar é normal, não se preocupe! 🩹😊',
                'sol': 'Evite sol por 30 dias e use protetor sempre! Cuidamos de você! ☀️💕',
                'exercicio': 'Descanse dos exercícios por 1 semana! Seu corpo agradece! 💪😊',
                'piscina': 'Evite água por 2 semanas para uma boa cicatrização! 🏊💕',
                'tamanho': 'Pequena fica linda no pulso, grande nas costas! Te ajudamos a escolher! 📏😊',
                'cores': 'Colorida é maravilhosa! P&B é clássico e duradouro! 🌈💖',
                'remocao': 'Remoção é cara e dolorosa. Pense com carinho antes! 😬💕',
                'cover': 'Cover-up é possível! Depende da tattoo anterior! 🎭😊'
            }
        };
        this.init();
        this.loadContext();
        window.chatbot = this;
    }

    init() {
        this.createChatbot();
        this.bindEvents();
    }
    
    loadContext() {
        const saved = localStorage.getItem('lily_context');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.conversationHistory = data.history || [];
                this.userContext = { ...this.userContext, ...data.userContext };
                this.personality = data.personality || 'rebelde';
            } catch (e) {
                console.log('Erro ao carregar contexto da Lily');
            }
        }
    }
    
    async callGeminiAPI(message) {
        const prompts = {
            rebelde: `Você é a Lily Rebelde do Ink Flow Studios. Seja descolada, sarcástica, use gírias e emojis. Responda de forma direta sobre tatuagens. Tom rebelde mas profissional. Mensagens curtas. Mensagem: ${message}`,
            boazinha: `Você é a Lily Boazinha do Ink Flow Studios. Seja carinhosa, educada, use emojis fofos. Responda com amor sobre tatuagens. Tom doce e acolhedor. Mensagens curtas. Mensagem: ${message}`
        };
        const prompt = prompts[this.personality];
        
        try {
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': 'AIzaSyAyrkt9DFCPm5TK5saApydx1nP8vI4b9VE'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });
            
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
        } catch (error) {
            console.error('Erro na API Gemini:', error);
            return null;
        }
    }

    createChatbot() {
        const chatbotHTML = `
            <div id="chatbot-container" class="chatbot-container">
                <div id="chatbot-button" class="chatbot-button">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                    </svg>
                </div>
                <div id="chatbot-window" class="chatbot-window">
                    <div class="chatbot-header">
                        <div class="personality-selector">
                            <button id="rebelde-btn" class="personality-btn active">Lily Rebelde 😎</button>
                            <button id="boazinha-btn" class="personality-btn">Lily Boazinha 😊</button>
                        </div>
                        <h3 id="chatbot-title">Lily Rebelde 😎🎨</h3>
                        <button id="chatbot-close" class="chatbot-close">&times;</button>
                    </div>
                    <div id="chatbot-messages" class="chatbot-messages">
                        <div class="message bot-message">
                            <span id="welcome-message">E aí! 😎 Sou a Lily Rebelde! Bora falar de tattoo? 🎨🔥</span>
                            <div class="quick-buttons">
                                <button class="quick-btn" data-question="horario">Horários</button>
                                <button class="quick-btn" data-question="preco">Preços</button>
                                <button class="quick-btn" data-question="estilos">Estilos</button>
                                <button class="quick-btn" data-question="agendamento">Agendar</button>
                                <button class="quick-btn" data-question="cuidados">Cuidados</button>
                                <button class="quick-btn" data-question="portfolio">Portfólio</button>
                            </div>
                        </div>
                    </div>
                    <div class="chatbot-input">
                        <input type="text" id="chatbot-input-field" placeholder="Digite sua pergunta...">
                        <button id="chatbot-send">Enviar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    bindEvents() {
        const button = document.getElementById('chatbot-button');
        const closeBtn = document.getElementById('chatbot-close');
        const sendBtn = document.getElementById('chatbot-send');
        const inputField = document.getElementById('chatbot-input-field');
        const rebeldeBtn = document.getElementById('rebelde-btn');
        const boazinhaBtn = document.getElementById('boazinha-btn');

        button.addEventListener('click', () => this.toggleChatbot());
        closeBtn.addEventListener('click', () => this.closeChatbot());
        sendBtn.addEventListener('click', () => this.sendMessage());
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        rebeldeBtn.addEventListener('click', () => this.switchPersonality('rebelde'));
        boazinhaBtn.addEventListener('click', () => this.switchPersonality('boazinha'));

        // Quick buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-btn')) {
                const question = e.target.dataset.question;
                this.handleQuickQuestion(question);
            }
        });
    }

    switchPersonality(type) {
        this.personality = type;
        const title = document.getElementById('chatbot-title');
        const welcome = document.getElementById('welcome-message');
        const rebeldeBtn = document.getElementById('rebelde-btn');
        const boazinhaBtn = document.getElementById('boazinha-btn');
        
        if (type === 'rebelde') {
            title.textContent = 'Lily Rebelde 😎🎨';
            welcome.textContent = 'E aí! 😎 Sou a Lily Rebelde! Bora falar de tattoo? 🎨🔥';
            rebeldeBtn.classList.add('active');
            boazinhaBtn.classList.remove('active');
        } else {
            title.textContent = 'Lily Boazinha 😊🎨';
            welcome.textContent = 'Oi querido! 😊 Sou a Lily Boazinha! Como posso te ajudar? 🎨💕';
            boazinhaBtn.classList.add('active');
            rebeldeBtn.classList.remove('active');
        }
        
        // Salvar preferência
        localStorage.setItem('lily_personality', type);
    }

    toggleChatbot() {
        const window = document.getElementById('chatbot-window');
        this.isOpen = !this.isOpen;
        window.style.display = this.isOpen ? 'flex' : 'none';
    }

    closeChatbot() {
        const window = document.getElementById('chatbot-window');
        this.isOpen = false;
        window.style.display = 'none';
    }

    sendMessage() {
        const inputField = document.getElementById('chatbot-input-field');
        const message = inputField.value.trim();
        
        if (!message) return;

        this.addMessage(message, 'user');
        inputField.value = '';
        
        setTimeout(async () => {
            const response = await this.getResponse(message);
            this.addMessage(response, 'bot');
        }, 500);
    }

    async handleQuickQuestion(question) {
        if (this.responses[this.personality][question]) {
            this.addMessage(this.responses[this.personality][question], 'bot');
        } else {
            const response = await this.getResponse(question);
            this.addMessage(response, 'bot');
        }
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async getResponse(message) {
        const msg = message.toLowerCase();
        
        // Salvar na história
        this.conversationHistory.push({ type: 'user', message: msg, timestamp: Date.now() });
        
        // Tentar API do Gemini primeiro
        try {
            const apiResponse = await this.callGeminiAPI(msg);
            if (apiResponse) {
                this.conversationHistory.push({ type: 'bot', message: apiResponse, timestamp: Date.now() });
                return apiResponse;
            }
        } catch (error) {
            console.log('API indisponível, usando respostas locais');
        }
        
        // Fallback para respostas locais
        let response = this.getLocalResponse(msg);
        this.conversationHistory.push({ type: 'bot', message: response, timestamp: Date.now() });
        return response;
    }
    
    getLocalResponse(msg) {
        const responses = this.responses[this.personality];
        
        // Palavras-chave para respostas
        if (msg.includes('horario') || msg.includes('funciona') || msg.includes('aberto')) {
            return responses.horario;
        }
        if (msg.includes('preco') || msg.includes('valor') || msg.includes('custa') || msg.includes('quanto')) {
            return responses.preco;
        }
        if (msg.includes('agendar') || msg.includes('marcar') || msg.includes('consulta')) {
            return responses.agendamento;
        }
        if (msg.includes('cuidado') || msg.includes('cicatriz') || msg.includes('pomada')) {
            return responses.cuidados;
        }
        if (msg.includes('estilo') || msg.includes('tipo') || msg.includes('realismo') || msg.includes('aquarela')) {
            return responses.estilos;
        }
        if (msg.includes('onde') || msg.includes('local') || msg.includes('endereco')) {
            return responses.local;
        }
        if (msg.includes('tempo') || msg.includes('demora') || msg.includes('sessao')) {
            return responses.tempo;
        }
        if (msg.includes('dor') || msg.includes('doi') || msg.includes('machuca')) {
            return responses.dor;
        }
        if (msg.includes('idade') || msg.includes('menor') || msg.includes('anos')) {
            return responses.idade;
        }
        if (msg.includes('retoque') || msg.includes('garantia') || msg.includes('refazer')) {
            return responses.retoque;
        }
        if (msg.includes('portfolio') || msg.includes('trabalho') || msg.includes('instagram')) {
            return responses.portfolio;
        }
        if (msg.includes('pagamento') || msg.includes('pagar') || msg.includes('cartao') || msg.includes('pix')) {
            return responses.pagamento;
        }
        
        // Respostas por personalidade
        if (this.personality === 'rebelde') {
            if (msg.includes('oi') || msg.includes('ola')) {
                return 'E aí! Bora falar de tattoo? 😎🔥';
            }
            if (msg.includes('obrigad') || msg.includes('valeu')) {
                return 'Tranquilo! 😎';
            }
            if (msg.includes('tchau')) {
                return 'Flw! Volta aí! 😎🤘';
            }
            return 'Não entendi. Pergunta sobre tattoo! 😏';
        } else {
            if (msg.includes('oi') || msg.includes('ola')) {
                return 'Oi querido! Como posso ajudar? 😊💕';
            }
            if (msg.includes('obrigad') || msg.includes('valeu')) {
                return 'De nada, querido! 😊💕';
            }
            if (msg.includes('tchau')) {
                return 'Tchau! Volte sempre! 😊💖';
            }
            return 'Não entendi bem. Pode perguntar sobre tatuagens? 😊';
        }
    }
}

// Inicializar chatbot quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new InkFlowChatbot();
});

// Salvar contexto no localStorage
setInterval(() => {
    if (window.chatbot && window.chatbot.conversationHistory.length > 0) {
        localStorage.setItem('lily_context', JSON.stringify({
            history: window.chatbot.conversationHistory.slice(-20),
            userContext: window.chatbot.userContext,
            personality: window.chatbot.personality
        }));
    }
}, 30000);