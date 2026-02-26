// Sistema de Chatbot para Ink Flow
class InkFlowChatbot {
    constructor() {
        this.isOpen = false;
        this.conversationHistory = [];
        this.userContext = {
            name: null,
            interests: [],
            previousQuestions: [],
            mood: 'neutral'
        };
        this.responses = {
            'horario': 'Opa! 🕘 Funcionamos de segunda a sábado das 9h às 18h. Domingo só se você implorar muito (com agendamento) 😏',
            'preco': 'Eita, quer saber o preço né? 💸 Depende do tamanho da arte, meu chapa! Vai de R$200 até "vendeu o rim". Melhor agendar uma consulta pra não chorar depois! 😂',
            'agendamento': 'Ah, finalmente decidiu se tatuar? 🎉 Clica em "Agendamento" no menu ou faz login logo, que tô esperando aqui ó... *bate o pé* ⏰',
            'cuidados': 'Escuta aqui, criança! 👶 Depois da tattoo: limpa direito, passa pomada, NADA de sol por 30 dias senão eu te assombro! ☀️👻 E não fica cutucando, pelo amor!',
            'estilos': 'Temos de tudo, meu bem! 🎨 Realismo (pra quem é chique), Aquarela (pra quem gosta de cor), Geométrico (pra quem curte matemática), Blackwork (gótico raiz), Fine Line (delicadinha) e Tradicional (old school raiz)!',
            'local': 'Estamos na Rua Augusta, coração de SP! 📍 Se não achar, é porque não quer mesmo... Vai na página de Contato que tem mapa e tudo, preguiçoso! 😤',
            'tempo': 'Depende né, gênio! 🤔 Tattoo pequena: 1-2h (rapidinho). Média: 3-5h (dá pra maratonar Netflix). Grande: várias sessões (prepara o psicológico e a carteira) 💪',
            'dor': 'Vai doer sim, não vou mentir! 😈 Mas relaxa, nossos tatuadores são feras e sabem como amenizar. Se não aguentar, a culpa não é nossa! 🤷‍♀️',
            'idade': 'Só maiores de 18, bebê! 🔞 Menor de idade precisa dos pais junto (e eles assinando um monte de papel). Sem choro!',
            'retoque': 'Retoque grátis em 30 dias, mas só se você cuidou direitinho! 😏 Se fez merda e estragou, aí é problema seu, amigão! 💅',
            'portfolio': 'Quer ver nossos trabalhos? 📸 Vai no Instagram @inkflowsp ou clica em "Portfólio" no menu! Tem coisa linda que vai te deixar babando! 🤤',
            'pagamento': 'Aceitamos dinheiro, PIX, cartão... até alma se for bonita! 💳 Parcelamos em até 12x (com juros que nem empréstimo do agiota) 😅',
            'desconto': 'Desconto? 🤑 Só se você trouxer 10 amigos, fizer propaganda no TikTok e me elogiar por 1 hora! Brincadeira... ou não! 😈',
            'cicatrizacao': 'Cicatrização leva uns 15-30 dias. Vai descascar igual cobra trocando de pele! 🐍 É normal, não surta!',
            'sol': 'Sol na tattoo nova? 🌞 Só se quiser que ela fique igual aquelas camisetas desbotadas da feira! Protetor solar é vida!',
            'exercicio': 'Academia? 💪 Espera pelo menos 1 semana, senão vai suar igual porco e estragar tudo! Paciência, Schwarzenegger!',
            'piscina': 'Piscina, mar, banheira... 🏊 NADA de água por 2 semanas! Sua tattoo não é peixe, querido!',
            'tamanho': 'Tamanho importa sim! 📏 Pequena cabe no pulso, grande cobre as costas. Use o bom senso, não sou calculadora!',
            'cores': 'Colorida fica linda mas desbota mais! 🌈 Preto e cinza é eterno igual diamante... ou barata! 🪳',
            'remocao': 'Remoção? 😱 Custa mais caro que fazer e dói 10x mais! Pensa bem antes, não sou mágica!',
            'cover': 'Cover-up é possível mas depende da tattoo velha! 🎭 Se for muito escura, vai virar um borrão artístico!'
        };
        this.init();
        this.loadContext();
        window.chatbot = this; // Referência global
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
            } catch (e) {
                console.log('Erro ao carregar contexto da Lily');
            }
        }
    }
    
    async callGeminiAPI(message) {
        const prompt = `Você é a Lily, assistente do Ink Flow Studios (estúdio de tatuagem em São Paulo). Seja profissional, divertida e use emojis. Responda de forma direta e concisa sobre tatuagens, preços, cuidados, estilos. Mantenha o tom descontraído mas profissional. Mensagens curtas e objetivas. Mensagem do usuário: ${message}`;
        
        try {
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY
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
                        <h3>Lily - Assistente Virtual 🎨</h3>
                        <button id="chatbot-close" class="chatbot-close">&times;</button>
                    </div>
                    <div id="chatbot-messages" class="chatbot-messages">
                        <div class="message bot-message">
                            Oi! 😊 Sou a Lily do Ink Flow! Como posso te ajudar hoje? 🎨
                            <div class="quick-buttons">
                                <button class="quick-btn" data-question="horario">Horários</button>
                                <button class="quick-btn" data-question="preco">Preços</button>
                                <button class="quick-btn" data-question="estilos">Estilos</button>
                                <button class="quick-btn" data-question="agendamento">Agendar</button>
                                <button class="quick-btn" data-question="cuidados">Cuidados</button>
                                <button class="quick-btn" data-question="portfolio">Portfólio</button>
                                <button class="quick-btn" data-question="lily">Quem é Lily?</button>
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

        button.addEventListener('click', () => this.toggleChatbot());
        closeBtn.addEventListener('click', () => this.closeChatbot());
        sendBtn.addEventListener('click', () => this.sendMessage());
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Quick buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-btn')) {
                const question = e.target.dataset.question;
                this.handleQuickQuestion(question);
            }
        });
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
        if (this.responses[question]) {
            this.addMessage(this.responses[question], 'bot');
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
        
        // Detectar contexto
        this.analyzeUserContext(msg);
        
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
        let response = this.getContextualResponse(msg);
        this.conversationHistory.push({ type: 'bot', message: response, timestamp: Date.now() });
        return response;
    }
    
    analyzeUserContext(msg) {
        // Detectar nome
        if (msg.includes('meu nome é') || msg.includes('me chamo')) {
            const nameMatch = msg.match(/(?:meu nome é|me chamo)\s+(\w+)/);
            if (nameMatch) this.userContext.name = nameMatch[1];
        }
        
        // Detectar interesses
        if (msg.includes('gosto de') || msg.includes('curto')) {
            if (msg.includes('realismo')) this.userContext.interests.push('realismo');
            if (msg.includes('aquarela')) this.userContext.interests.push('aquarela');
            if (msg.includes('blackwork')) this.userContext.interests.push('blackwork');
        }
        
        // Detectar humor
        if (msg.includes('nervoso') || msg.includes('ansioso')) this.userContext.mood = 'nervous';
        if (msg.includes('animado') || msg.includes('empolgado')) this.userContext.mood = 'excited';
        if (msg.includes('com medo')) this.userContext.mood = 'scared';
        
        // Salvar pergunta
        this.userContext.previousQuestions.push(msg);
        if (this.userContext.previousQuestions.length > 10) {
            this.userContext.previousQuestions.shift();
        }
    }
    
    getContextualResponse(msg) {
        // Respostas baseadas no contexto
        const userName = this.userContext.name ? this.userContext.name : '';
        const lastQuestions = this.userContext.previousQuestions.slice(-3);
        
        // Respostas de seguimento
        if (this.conversationHistory.length > 2) {
            const lastBotMessage = this.conversationHistory[this.conversationHistory.length - 2];
            
            if (lastBotMessage.message.includes('primeira tattoo') && (msg.includes('sim') || msg.includes('é'))) {
                return `Primeira vez é especial! Que estilo você está pensando? 🎨`;
            }
            
            if (lastBotMessage.message.includes('que estilo') && msg.includes('realismo')) {
                return `Realismo é ótimo! Retrato ou animal? Nosso Marcus é especialista! 😊`;
            }
            
            if (msg.includes('obrigad') || msg.includes('valeu')) {
                const responses = [
                    `De nada! Sempre aqui pra ajudar! 😊`,
                    `Imagina! Pra isso que estou aqui! 👍`,
                    `Disponha sempre! 😉`
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
        
        // Respostas baseadas no humor
        if (this.userContext.mood === 'nervous') {
            if (msg.includes('dor') || msg.includes('doi')) {
                return `Nossos tatuadores são cuidadosos! A dor é suportável! 😊`;
            }
        }
        
        if (this.userContext.mood === 'excited') {
            if (msg.includes('quando') || msg.includes('agendar')) {
                return `Que bom que está animado! Clica em "Agendamento"! 😊`;
            }
        }
        
        // Respostas contextuais baseadas em conversa anterior
        if (this.hasAskedBefore('preco') && msg.includes('caro')) {
            return `É pra vida toda! Melhor investir bem! 💰`;
        }
        
        if (this.hasAskedBefore('tempo') && msg.includes('demora')) {
            return `Depende do tamanho! Pequena é rápida, grande demora mais! ⏱️`;
        }
        
        // Palavras-chave para respostas
        if (msg.includes('horario') || msg.includes('funciona') || msg.includes('aberto')) {
            return this.responses.horario;
        }
        if (msg.includes('preco') || msg.includes('valor') || msg.includes('custa') || msg.includes('quanto')) {
            return this.responses.preco;
        }
        if (msg.includes('agendar') || msg.includes('marcar') || msg.includes('consulta')) {
            return this.responses.agendamento;
        }
        if (msg.includes('cuidado') || msg.includes('cicatriz') || msg.includes('pomada')) {
            return this.responses.cuidados;
        }
        if (msg.includes('estilo') || msg.includes('tipo') || msg.includes('realismo') || msg.includes('aquarela')) {
            return this.responses.estilos;
        }
        if (msg.includes('onde') || msg.includes('local') || msg.includes('endereco')) {
            return this.responses.local;
        }
        if (msg.includes('tempo') || msg.includes('demora') || msg.includes('sessao')) {
            return this.responses.tempo;
        }
        if (msg.includes('dor') || msg.includes('doi') || msg.includes('machuca')) {
            return this.responses.dor;
        }
        if (msg.includes('idade') || msg.includes('menor') || msg.includes('anos')) {
            return this.responses.idade;
        }
        if (msg.includes('retoque') || msg.includes('garantia') || msg.includes('refazer')) {
            return this.responses.retoque;
        }
        if (msg.includes('portfolio') || msg.includes('trabalho') || msg.includes('instagram')) {
            return this.responses.portfolio;
        }
        if (msg.includes('pagamento') || msg.includes('pagar') || msg.includes('cartao') || msg.includes('pix')) {
            return this.responses.pagamento;
        }
        if (msg.includes('desconto') || msg.includes('promocao') || msg.includes('barato')) {
            return this.responses.desconto;
        }
        if (msg.includes('cicatrizacao') || msg.includes('descascar') || msg.includes('casquinha')) {
            return this.responses.cicatrizacao;
        }
        if (msg.includes('sol') || msg.includes('praia') || msg.includes('bronzear')) {
            return this.responses.sol;
        }
        if (msg.includes('exercicio') || msg.includes('academia') || msg.includes('musculacao')) {
            return this.responses.exercicio;
        }
        if (msg.includes('piscina') || msg.includes('mar') || msg.includes('agua') || msg.includes('banho')) {
            return this.responses.piscina;
        }
        if (msg.includes('tamanho') || msg.includes('grande') || msg.includes('pequena')) {
            return this.responses.tamanho;
        }
        if (msg.includes('cor') || msg.includes('colorida') || msg.includes('preto')) {
            return this.responses.cores;
        }
        if (msg.includes('remocao') || msg.includes('tirar') || msg.includes('apagar')) {
            return this.responses.remocao;
        }
        if (msg.includes('cover') || msg.includes('cobrir') || msg.includes('esconder')) {
            return this.responses.cover;
        }
        
        // Respostas extras
        if (msg.includes('medo') || msg.includes('nervoso') || msg.includes('ansioso')) {
            return 'Nossos tatuadores são gentis e experientes! 😊';
        }
        if (msg.includes('primeira') || msg.includes('primeiro') || msg.includes('vez')) {
            return 'Primeira tattoo? Vamos cuidar bem de você! 😊';
        }
        if (msg.includes('obrigad') || msg.includes('valeu') || msg.includes('brigad')) {
            const responses = [
                `De nada! 😊`,
                `Disponha sempre! 👍`,
                `Imagina! 😉`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        if (msg.includes('tchau') || msg.includes('bye') || msg.includes('flw')) {
            const responses = [
                'Tchau! Volte sempre! 😊',
                'Até mais! 👋',
                'Tchau! Estarei aqui quando precisar! 😉'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Respostas extras
        if (msg.includes('linda') || msg.includes('bonita')) {
            return `Obrigada! Você vai ficar lindo tatuado! 😊`;
        }
        
        if (msg.includes('solteira') || msg.includes('disponível') || msg.includes('namorada')) {
            return `Sou assistente virtual! Que tal focar na sua tattoo? 🎨`;
        }
        
        if (msg.includes('encontro') || msg.includes('sair') || msg.includes('date')) {
            return `Que tal marcar um horário para sua tattoo? 😊`;
        }
        if (msg.includes('lily') || msg.includes('quem') || msg.includes('voce')) {
            const responses = [
                `Sou a Lily! Assistente do Ink Flow Studios! 😊`,
                `Lily aqui! Sua assistente virtual para tatuagens! 🎨`,
                `Oi! Sou a Lily, assistente do estúdio! 😉`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        if (msg.includes('amor') || msg.includes('namoro') || msg.includes('casal')) {
            return 'Tattoo de casal? Fazemos sim! Pense bem antes! 💕';
        }
        if (msg.includes('arrependimento') || msg.includes('erro') || msg.includes('feio')) {
            return 'Por isso existe consulta! Vem conversar antes! 😊';
        }
        if (msg.includes('famoso') || msg.includes('celebridade') || msg.includes('artista')) {
            return 'Já tatuamos famosos sim! Sigilo profissional! 🌟';
        }
        if (msg.includes('drunk') || msg.includes('bebado') || msg.includes('alcool')) {
            return 'Não fazemos tattoo em pessoas alteradas! Segurança primeiro! 😊';
        }
        
        // Saudações
        if (msg.includes('oi') || msg.includes('ola') || msg.includes('bom dia') || msg.includes('boa tarde')) {
            const saudacoes = [
                `Oi! Como posso ajudar? 😊`,
                `Olá! Bem-vindo ao Ink Flow! 🎨`,
                `E aí! Pronto para sua tattoo? 😉`,
                `Opa! Em que posso te ajudar? 👋`
            ];
            return saudacoes[Math.floor(Math.random() * saudacoes.length)];
        }
        
        // Respostas padrão
        const respostasContextuais = [
            `Não entendi. Pode reformular? 🤔`,
            `Pergunta sobre tatuagens que eu ajudo melhor! 🎨`,
            `Não compreendi. Fale sobre o estúdio! 😊`,
            `Sou especialista em tatuagens! 😉`
        ];
        return respostasContextuais[Math.floor(Math.random() * respostasContextuais.length)];
    }
    
    hasAskedBefore(topic) {
        return this.userContext.previousQuestions.some(q => q.includes(topic));
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
            userContext: window.chatbot.userContext
        }));
    }
}, 30000); // Salva a cada 30 segundos