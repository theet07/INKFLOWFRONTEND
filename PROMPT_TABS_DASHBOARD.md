# CONTEXTO COMPLETO PARA O CLAUDE OPUS — SISTEMA DE ABAS NO DASHBOARD DO TATUADOR

## Objetivo:
Transformar o `ArtistDashboard.jsx` atual em um dashboard com **sistema de navegação por abas**, onde ao clicar nos itens da sidebar (Dashboard, Requests, Schedule, Portfolio, Settings), o conteúdo principal muda dinamicamente **SEM trocar de rota**.

---

## Arquitetura da Solução:

### 1. Estado de Navegação
Adicionar um `useState` para controlar qual aba está ativa:

```jsx
const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'requests', 'schedule', 'portfolio', 'settings'
```

### 2. Sidebar Interativa
Atualizar os links da sidebar para:
- Usar `onClick` em vez de `href`
- Aplicar classe `text-white border-l-4 border-[#e63946] bg-gradient-to-r from-[#e63946]/10` no item ativo
- Aplicar classe `text-[#adaaaa] hover:text-white hover:bg-[#262626]` nos inativos

Exemplo:
```jsx
<button 
  onClick={() => setActiveTab('dashboard')}
  className={activeTab === 'dashboard' 
    ? "flex items-center gap-4 px-4 py-3 text-white border-l-4 border-[#e63946] bg-gradient-to-r from-[#e63946]/10 to-transparent transition-all duration-300 font-headline text-sm font-bold uppercase tracking-widest w-full text-left"
    : "flex items-center gap-4 px-4 py-3 text-[#adaaaa] hover:text-white hover:bg-[#262626] transition-all duration-300 font-headline text-sm font-bold uppercase tracking-widest w-full text-left"
  }
>
  <span className="material-symbols-outlined">dashboard</span>
  <span>Dashboard</span>
</button>
```

### 3. Renderização Condicional do Conteúdo
Criar uma função que retorna o JSX correto baseado no `activeTab`:

```jsx
const renderContent = () => {
  switch(activeTab) {
    case 'dashboard':
      return <DashboardContent />;
    case 'requests':
      return <RequestsContent />;
    case 'schedule':
      return <ScheduleContent />;
    case 'portfolio':
      return <PortfolioContent />;
    case 'settings':
      return <SettingsContent />;
    default:
      return <DashboardContent />;
  }
};
```

No JSX principal:
```jsx
<main className="md:pl-64 pt-24 pb-24 md:pb-20 px-6 min-h-screen">
  {renderContent()}
</main>
```

---

## Conteúdo de Cada Aba:

### ✅ ABA 1: Dashboard (já existe)
Manter o conteúdo atual do `ArtistDashboard.jsx`:
- Cards de resumo (Pendentes, Confirmados, Completados, Rating)
- Agenda de Hoje
- Solicitações Pendentes
- Clientes Recentes

**Componente:** `<DashboardContent />`

---

### ✅ ABA 2: Settings (já tenho o HTML)
Converter o arquivo `Configuracoes.html` que já foi anexado para React:

**Componente:** `<SettingsContent />`

**Estrutura:**
- **Status do Estúdio** (toggle Aceitando/Pausado)
- **Perfil do Artista:**
  - Upload de avatar
  - Nome artístico
  - E-mail público
  - Bio/Descrição
  - Tags de especialidade (adicionar/remover)
- **Notificações:**
  - Alertas por e-mail (toggle)
  - Push notifications (toggle)
  - Desktop audio (toggle)
- **Disponibilidade:**
  - Horários semanais (Seg-Sex com toggle ativo/pausado)
  - Inputs de horário (10:00 - 18:00)
- **Galeria do Estúdio** (card visual)
- **Botões de ação:** Descartar / Salvar Alterações

**Lógica JavaScript do HTML para converter em React:**
1. Toast notifications
2. Toggle de status do estúdio
3. Preview de avatar upload
4. Adicionar/remover tags de especialidade
5. Toggle de disponibilidade por dia da semana
6. Submit do formulário com loading state

---

### 🆕 ABA 3: Requests (criar do zero)
Tela para gerenciar solicitações de agendamento dos clientes.

**Componente:** `<RequestsContent />`

**Estrutura sugerida:**
- Header: "Solicitações de Agendamento"
- Filtros: Todos / Pendentes / Aprovados / Recusados
- Lista de cards com:
  - Foto do cliente
  - Nome do cliente
  - Serviço solicitado
  - Data/hora preferida
  - Descrição do pedido
  - Botões: Aprovar / Recusar / Ver Detalhes
- Modal de detalhes ao clicar em "Ver Detalhes"

**Dados hardcoded (exemplo):**
```jsx
const requests = [
  {
    id: 1,
    clientName: "Maria Silva",
    clientPhoto: "https://...",
    service: "Tatuagem Blackwork",
    preferredDate: "2024-02-15",
    preferredTime: "14:00",
    description: "Gostaria de uma tatuagem de mandala no antebraço",
    status: "pending"
  },
  // ... mais 4-5 exemplos
];
```

---

### 🆕 ABA 4: Schedule (criar do zero)
Calendário visual com os agendamentos confirmados.

**Componente:** `<ScheduleContent />`

**Estrutura sugerida:**
- Header: "Agenda do Estúdio"
- Calendário mensal (pode ser simples, sem biblioteca externa)
- Lista de agendamentos do dia selecionado:
  - Horário
  - Nome do cliente
  - Serviço
  - Status (Confirmado / Realizado / Cancelado)
- Botão: "Adicionar Bloqueio de Horário"

**Dados hardcoded (exemplo):**
```jsx
const appointments = [
  {
    id: 1,
    date: "2024-02-10",
    time: "10:00",
    clientName: "João Pedro",
    service: "Tatuagem Geométrica",
    status: "confirmed"
  },
  // ... mais exemplos
];
```

---

### 🆕 ABA 5: Portfolio (criar do zero)
Galeria de trabalhos realizados pelo tatuador.

**Componente:** `<PortfolioContent />`

**Estrutura sugerida:**
- Header: "Meu Portfólio"
- Botão: "+ Adicionar Trabalho"
- Grid de imagens (3 colunas desktop, 2 mobile):
  - Foto do trabalho
  - Título/descrição
  - Tags (estilo, tamanho)
  - Botões: Editar / Excluir
- Modal de upload ao clicar em "Adicionar Trabalho"

**Dados hardcoded (exemplo):**
```jsx
const portfolioItems = [
  {
    id: 1,
    image: "https://...",
    title: "Mandala Blackwork",
    tags: ["Blackwork", "Grande"],
    date: "2024-01-20"
  },
  // ... mais 8-10 exemplos
];
```

---

## Requisitos Técnicos:

### Conversão HTML → JSX (para Settings):
- Trocar `class=` por `className=`
- Fechar todas as tags (`<img />`, `<input />`)
- Manter Tailwind CSS exatamente igual
- Remover `<script>` e converter para React hooks

### Estrutura de Componentes:
```
ArtistDashboard.jsx (componente principal)
  ├─ useState: activeTab, isMobileSidebarOpen, isDrawerOpen, toasts
  ├─ Sidebar (desktop + mobile)
  ├─ TopAppBar
  ├─ Main Content:
  │   ├─ DashboardContent (já existe)
  │   ├─ SettingsContent (converter de Configuracoes.html)
  │   ├─ RequestsContent (criar do zero)
  │   ├─ ScheduleContent (criar do zero)
  │   └─ PortfolioContent (criar do zero)
  └─ BottomNavBar (mobile)
```

### Estados Necessários:
```jsx
const [activeTab, setActiveTab] = useState('dashboard');
const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
const [toasts, setToasts] = useState([]);
```

### Função de Toast (manter a existente e reutilizar):
```jsx
const showToast = (message, icon = 'check_circle', isAlert = false) => {
  const newToast = { id: Date.now(), message, icon, isAlert };
  setToasts(prev => [...prev, newToast]);
  setTimeout(() => {
    setToasts(prev => prev.filter(t => t.id !== newToast.id));
  }, 3000);
};
```

---

## Navegação Mobile (BottomNavBar):
Atualizar os botões do bottom nav para também usar `onClick` e `activeTab`:

```jsx
<button 
  onClick={() => setActiveTab('dashboard')}
  className={`flex flex-col items-center gap-1 transition-colors ${
    activeTab === 'dashboard' ? 'text-[#e63946]' : 'text-[#adaaaa] hover:text-white'
  }`}
>
  <span className="material-symbols-outlined" style={activeTab === 'dashboard' ? {fontVariationSettings: "'FILL' 1"} : {}}>
    dashboard
  </span>
  <span className="text-[8px] font-bold uppercase">Home</span>
</button>
```

---

## Detalhes Importantes:

### Manter do Dashboard Atual:
- ✅ Tailwind config customizado (cores primary, surface, etc)
- ✅ Google Material Symbols
- ✅ Fontes Epilogue + Inter
- ✅ Animações e transições
- ✅ Responsividade mobile-first
- ✅ Sistema de toasts
- ✅ Drawer lateral (se ainda for usado)

### Adicionar:
- ✅ Sistema de abas com `activeTab`
- ✅ Sidebar com highlight do item ativo
- ✅ 5 componentes de conteúdo (Dashboard, Settings, Requests, Schedule, Portfolio)
- ✅ Dados hardcoded para todas as abas
- ✅ Transições suaves ao trocar de aba

### NÃO Fazer:
- ❌ Integrar com API (ainda é Etapa 2)
- ❌ Criar rotas separadas no React Router
- ❌ Remover funcionalidades existentes do dashboard

---

## Fluxo de Teste:

1. Usuário faz login como tatuador (`tatuador@inkflow.com` / `123456`)
2. É redirecionado para `/artist-dashboard`
3. Vê a aba "Dashboard" ativa por padrão
4. Clica em "Settings" na sidebar → conteúdo muda para tela de configurações
5. Clica em "Requests" → vê lista de solicitações pendentes
6. Clica em "Schedule" → vê calendário de agendamentos
7. Clica em "Portfolio" → vê galeria de trabalhos
8. Navegação funciona tanto na sidebar (desktop) quanto no bottom nav (mobile)

---

## Arquivo HTML de Referência:
O arquivo `Configuracoes.html` já foi anexado e contém:
- Estrutura completa da tela de Settings
- Lógica JavaScript vanilla para converter em React
- Estilos Tailwind customizados
- Componentes interativos (toggles, upload, tags, etc)

---

## Entrega Esperada:

Um único arquivo `ArtistDashboard.jsx` atualizado com:
1. Sistema de abas funcionando
2. 5 componentes de conteúdo (Dashboard, Settings, Requests, Schedule, Portfolio)
3. Sidebar com highlight do item ativo
4. Bottom nav mobile sincronizado
5. Todos os dados hardcoded
6. Todas as interações funcionando (toasts, toggles, modals, etc)
7. 100% responsivo
8. Código limpo e comentado

---

**IMPORTANTE:** Manter a mesma estética visual do dashboard atual. As novas abas devem seguir o mesmo design system (cores, tipografia, espaçamentos, animações).
