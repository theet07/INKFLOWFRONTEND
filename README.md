# InkFlow — Frontend

Interface web da plataforma **InkFlow**, sistema para estúdios de tatuagem. Permite que clientes descubram artistas, façam agendamentos e acompanhem histórico, enquanto artistas gerenciam sua agenda, portfólio e mensagens.

---

## Tecnologias

| Tecnologia | Versão |
|---|---|
| React | 18.2.0 |
| Vite | 5.0.0 |
| React Router DOM | 6.20.1 |
| Axios | 1.6.2 |
| Chart.js | 4.5.1 |
| react-chartjs-2 | 5.3.1 |
| react-markdown | 9.1.0 |
| JavaScript (ES Modules) | — |

---

## Estrutura do Projeto

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
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── ParticleBackground.jsx
│   └── Testimonials.jsx
├── contexts/
│   └── AuthContext.jsx     # Contexto global de autenticação JWT
├── hooks/
│   └── useScrollAnimation.js
├── pages/
│   ├── ArtistLandingPage/  # Landing page individual do artista
│   ├── About.jsx
│   ├── AdminDashboard.jsx  # Painel administrativo
│   ├── ArtistDashboard.jsx # Painel do artista
│   ├── ArtistProfile.jsx   # Perfil público do artista
│   ├── Artists.jsx         # Listagem/exploração de artistas
│   ├── Booking.jsx         # Fluxo de agendamento
│   ├── Contact.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Portfolio.jsx
│   ├── Profile.jsx         # Perfil do cliente
│   └── Services.jsx
├── services/
│   └── inkflowApi.js       # Todas as chamadas à API
├── styles/
│   ├── enhanced-effects.css
│   └── modern-theme.css
└── utils/
    ├── formatPhone.js
    └── imageUtils.js
```

---

## Páginas e Funcionalidades

| Página | Rota | Descrição |
|---|---|---|
| Home | `/` | Landing page principal com hero, portfólio e depoimentos |
| Artistas | `/artistas` | Exploração e busca de artistas cadastrados |
| Perfil do Artista | `/artistas/:id` | Portfólio, bio e botão de agendamento |
| Landing do Artista | `/artistas/:id/page` | Landing page personalizada do artista |
| Agendamento | `/agendar/:artistaId` | Seleção de data, horário e estilo |
| Login | `/login` | Autenticação de clientes e artistas |
| Perfil | `/perfil` | Dados do cliente autenticado |
| Dashboard Artista | `/dashboard` | Painel completo de gestão do artista |
| Dashboard Admin | `/admin` | Painel administrativo do sistema |
| Portfólio | `/portfolio` | Galeria geral da plataforma |
| Serviços | `/servicos` | Página de serviços e estilos |
| Sobre | `/sobre` | Sobre a plataforma |
| Contato | `/contato` | Formulário de contato |

---

## Autenticação

Gerenciada pelo `AuthContext` (`src/contexts/AuthContext.jsx`):

- Token JWT armazenado no `localStorage`
- Interceptor no Axios injeta o `Authorization: Bearer <token>` em todas as requisições autenticadas
- Redirecionamento automático para `/` em caso de sessão inválida (403)
- Suporte a perfis: **cliente**, **artista** e **admin**

---

## Serviços de API (`src/services/inkflowApi.js`)

Todos os serviços utilizam Axios com base em `VITE_API_URL`:

| Serviço | Descrição |
|---|---|
| `clienteService` | Login, CRUD de clientes, upload de foto |
| `agendamentoService` | Criar, listar, atualizar status e avaliar agendamentos |
| `artistaService` | Listar artistas, disponibilidade, slots, atualização |
| `portfolioService` | Upload e gerenciamento de itens do portfólio |
| `disponibilidadeService` | Gerenciar horários disponíveis por artista |
| `mensagemService` / `mensagemServiceExtended` | Chat entre artista e cliente |
| `adminService` | Stats, usuários, agendamentos, aprovação de artistas, backup |
| `chatService` | Envio de mensagem ao chatbot IA |
| `contatoService` | Formulário de contato |
| `leadService` | Captação de lead de artista |
| `authService` | Verificação OTP, minha conta |
| `uploadService` | Upload de imagem para Cloudinary via backend |

---

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_API_URL=https://inkflowbackend-4w1g.onrender.com/api
VITE_CLOUDINARY_CLOUD_NAME=<cloud_name>
VITE_CLOUDINARY_UPLOAD_PRESET=<upload_preset>
```

---

## Como Executar

```bash
# Clonar o repositório
git clone <url-do-repo>
cd INKFLOWFRONTEND-LIMPO

# Instalar dependências
npm install

# Configurar .env.local com as variáveis acima

# Iniciar em modo de desenvolvimento
npm run dev
```

A aplicação ficará disponível em `http://localhost:3001`.

### Build para Produção

```bash
npm run build
```

O script `build.js` customizado é executado antes do build padrão do Vite.

### Preview do Build

```bash
npm run preview
```

---

## Configuração do Vite

- Porta de desenvolvimento: **3001**
- Proxy: `/api` → `http://localhost:8080` (evita CORS em desenvolvimento)
- Code splitting manual: `vendor` (react, react-dom) e `router` (react-router-dom)

---

## Deploy

O frontend está hospedado no **Vercel**. Configuração em `vercel.json`:

- Todas as rotas redirecionadas para `index.html` (SPA)
- Build automático a partir da branch principal

---

## Licença

Distribuído sob a licença presente no arquivo [LICENSE](./LICENSE).
