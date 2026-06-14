# 🎨 InkFlow — Frontend

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?style=flat-square&logo=javascript)
![Axios](https://img.shields.io/badge/Axios-1.6-5A29E4?style=flat-square&logo=axios)
![Vercel](https://img.shields.io/badge/Vercel-deploy-black?style=flat-square&logo=vercel)

O **InkFlow** é uma plataforma completa para estúdios de tatuagem que conecta clientes e artistas em um único ecossistema digital. O frontend entrega uma experiência moderna e fluida para os três perfis da plataforma — **Cliente**, **Artista** e **Administrador** — centralizando agendamentos, portfólio, mensagens e gestão em uma interface visualmente refinada.

---

## 🌟 Funcionalidades e Recursos do Sistema

### 🏠 Landing Page e Vitrine de Artistas
Página inicial com apresentação da plataforma, portfólio geral, depoimentos e seção de captação de leads para novos artistas. Cada artista possui uma **landing page personalizada** (`/artistas/:id/page`) com seu portfólio, bio e botão de agendamento direto.

### 📅 Fluxo de Agendamento Completo
O cliente navega pelos artistas disponíveis, visualiza o portfólio e a disponibilidade em tempo real por um calendário interativo, seleciona o horário desejado e finaliza o agendamento com descrição do estilo e referências. Validação de cancelamento com janela de 24h após a criação.

### 🎨 Dashboard do Artista
Painel completo de gestão com abas dedicadas para:
- **Painel** — visão geral com próximas sessões e coleção do portfólio
- **Agenda** — calendário com toggle mensal/semanal e controle de disponibilidade
- **Solicitações** — gerenciamento de agendamentos com controle de status e histórico do cliente
- **Portfólio** — upload de imagens via Cloudinary e organização da galeria
- **Mensagens** — chat em tempo real com clientes, badge de não lidas e polling automático
- **Configurações** — edição de bio, foto de perfil e preferências de notificação

### 🛡️ Dashboard Administrativo
Painel de controle completo com estatísticas em tempo real via Chart.js, gestão de usuários (clientes e artistas), aprovação de requisições de novos artistas com validação de senha, controle de agendamentos, exportação de backup do banco e visualização de métricas operacionais.

### 💬 Chat e Mensagens
Sistema de mensagens entre artistas e clientes com polling de 5s na lista de conversas, badge de não lidas por conversa, marcação granular de leitura por remetente e notificação sonora ao receber novas mensagens. O sino no header exibe prévia das mensagens não lidas com navegação direta para a conversa.

### 🤖 Chatbot com IA
Chatbot integrado ao backend (Groq AI) com renderização de markdown nas respostas, links clicáveis com navegação interna e visual estilizado. Acessível de qualquer página da plataforma.

### 👤 Perfil do Cliente
Visualização e edição de dados cadastrais, foto de perfil, histórico de agendamentos com avaliação de sessões concluídas, troca de conta e exclusão de conta com confirmação.

### 📬 Contato e Leads
Formulário de contato integrado ao backend com auto-preenchimento para usuários logados e contadores de caracteres. Captação de leads de artistas com máscara de telefone e integração direta com a API.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|---|---|
| Framework | React 18.2 |
| Build | Vite 5.0 |
| Roteamento | React Router DOM 6.20 |
| HTTP | Axios 1.6 |
| Gráficos | Chart.js 4.5 + react-chartjs-2 |
| Markdown | react-markdown 9.1 |
| Linguagem | JavaScript (ES Modules) |
| Deploy | Vercel |

---

## 🏗️ Arquitetura do Sistema

```
src/
├── components/
│   ├── dashboard/          # Tabs do painel do artista
│   │   ├── DashboardTab.jsx
│   │   ├── MessagesTab.jsx
│   │   ├── PortfolioTab.jsx
│   │   ├── RequestsTab.jsx
│   │   ├── ScheduleTab.jsx
│   │   └── SettingsTab.jsx
│   ├── Calendar.jsx
│   ├── Carousel.jsx
│   ├── Chatbot.jsx
│   ├── ErrorBoundary.jsx
│   ├── Header.jsx
│   └── Footer.jsx
├── contexts/
│   └── AuthContext.jsx     # Contexto global de autenticação JWT
├── pages/
│   ├── ArtistLandingPage/  # Landing page individual do artista
│   ├── AdminDashboard.jsx  # Painel administrativo
│   ├── ArtistDashboard.jsx # Painel do artista
│   ├── ArtistProfile.jsx   # Perfil público do artista
│   ├── Artists.jsx         # Exploração de artistas
│   ├── Booking.jsx         # Fluxo de agendamento
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Profile.jsx
│   └── Contact.jsx
├── services/
│   └── inkflowApi.js       # Todas as chamadas à API centralizadas
├── styles/
│   ├── enhanced-effects.css
│   └── modern-theme.css
└── utils/
    ├── formatPhone.js
    └── imageUtils.js
```

---

## 📡 Serviços de API

Todos centralizados em `src/services/inkflowApi.js` com interceptors JWT automáticos:

| Serviço | Descrição |
|---|---|
| `clienteService` | Login, CRUD, foto de perfil |
| `agendamentoService` | Criar, listar, status, avaliar |
| `artistaService` | Artistas, disponibilidade, slots |
| `portfolioService` | Upload e gerenciamento de portfólio |
| `disponibilidadeService` | Horários disponíveis por artista |
| `mensagemService` | Chat entre artista e cliente |
| `adminService` | Painel admin, backup, aprovações |
| `chatService` | Chatbot IA |
| `contatoService` | Formulário de contato |
| `leadService` | Captação de lead de artista |
| `authService` | OTP, minha conta |
| `uploadService` | Upload via Cloudinary |

---

## ▶️ Como Executar

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_API_URL=https://inkflowbackend-4w1g.onrender.com/api
VITE_CLOUDINARY_CLOUD_NAME=<cloud_name>
VITE_CLOUDINARY_UPLOAD_PRESET=<upload_preset>
```

### Localmente

```bash
git clone <url-do-repo>
cd INKFLOWFRONTEND-LIMPO
npm install
npm run dev
```

Disponível em `http://localhost:3001`.

### Build para Produção

```bash
npm run build
```

---

## 🌐 Deploy

O frontend está hospedado no **Vercel** com redirecionamento de todas as rotas para `index.html` (SPA).

---

## 👤 Autores

**Matheus** & **Nathan**

---

## 📄 Licença

Copyright © 2025 InkFlow. Todos os direitos reservados.

Este software e seu código-fonte são propriedade exclusiva dos autores. É proibida a reprodução, distribuição, modificação ou uso comercial, total ou parcial, sem autorização expressa por escrito dos autores.
