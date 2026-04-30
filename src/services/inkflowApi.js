import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Deixa o browser gerar o Content-Type com boundary correto para FormData
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      const isSessionError = error.response?.data?.message?.includes('sessão')
        || !localStorage.getItem('token');
      if (isSessionError) {
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
)

export const clienteService = {
  login: (credentials) => api.post('/auth/login', credentials),
  getAll: () => api.get('/clientes'),
  getById: (id) => api.get(`/clientes/${id}`),
  getByEmail: (email) => api.get(`/clientes/email/${encodeURIComponent(email)}`),
  create: (cliente) => api.post('/clientes', cliente),
  update: (id, cliente) => api.put(`/clientes/${id}`, cliente),
  delete: (id) => api.delete(`/clientes/${id}`),
  uploadFoto: (id, formData) => api.post(`/clientes/${id}/foto`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteFoto: (id) => api.delete(`/clientes/${id}/foto`),
};

export const agendamentoService = {
  getAll: () => api.get('/admin/agendamentos'),
  getById: (id) => api.get(`/agendamentos/${id}`),
  getByCliente: (clienteId) => api.get(`/agendamentos/cliente/${clienteId}`),
  getByArtista: (artistaId) => api.get(`/agendamentos/artista/${artistaId}`),
  getMeus: () => api.get('/appointments/meus'),
  getByStatus: (status) => api.get(`/agendamentos/status/${status}`),
  create: (agendamento) => api.post('/appointments', agendamento),
  update: (id, agendamento) => api.put(`/agendamentos/${id}`, agendamento),
  updateStatus: (id, data) => api.patch(`/agendamentos/${id}/status`, data),
  avaliar: (id, data) => api.put(`/appointments/${id}/avaliar`, data),
  delete: (id) => api.delete(`/agendamentos/${id}`),
};

export const artistaService = {
  getAllArtists: () => api.get('/artists', { baseURL: API_BASE_URL.replace('/v1', '') }),
  getById: (id) => api.get(`/artists/${id}`, { baseURL: API_BASE_URL.replace('/v1', '') }),
  getAvailability: (id, ano, mes) => api.get(`/artists/${id}/availability`, { params: { ano, mes }, baseURL: API_BASE_URL.replace('/v1', '') }),
  getSlots: (id, data) => api.get(`/artists/${id}/availability/slots`, { params: { data }, baseURL: API_BASE_URL.replace('/v1', '') }),
  update: (id, data) => api.put(`/artistas/${id}`, data, { baseURL: API_BASE_URL.replace('/v1', '') }),
  uploadFoto: (id, formData) => api.post(`/artistas/${id}/foto`, formData, {
    baseURL: API_BASE_URL.replace('/v1', ''),
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const portfolioService = {
  getByArtista: (artistaId) => api.get(`/portfolio/artista/${artistaId}`),
  create: (data) => api.post('/portfolio', data),
  upload: (formData) => api.post('/portfolio/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/portfolio/${id}`),
};

export const disponibilidadeService = {
  getByArtista: (artistaId) => api.get(`/disponibilidade/artista/${artistaId}`, { baseURL: API_BASE_URL.replace('/v1', '') }),
  salvar: (artistaId, payload) => api.post(`/disponibilidade/artista/${artistaId}`, payload, { baseURL: API_BASE_URL.replace('/v1', '') }),
  remover: (id) => api.delete(`/disponibilidade/${id}`, { baseURL: API_BASE_URL.replace('/v1', '') }),
};

export const mensagemService = {
  enviar: (data) => api.post('/mensagens', data),
  getConversa: (outroUsuarioId) => api.get(`/mensagens/conversa/${outroUsuarioId}`),
  getNovas: (desde) => api.get(`/mensagens/novas?desde=${desde}`),
  marcarLida: (id) => api.patch(`/mensagens/${id}/lida`),
  countNaoLidas: () => api.get('/mensagens/nao-lidas/count'),
  getConversas: () => api.get('/mensagens/conversas'),
};

export const adminService = {
  exportBackup: () => api.get('/api/v1/admin/backup/download', { responseType: 'blob', baseURL: API_BASE_URL.replace(/\/api.*$/, '') }),
  getBackupStatus: () => api.get('/api/v1/admin/backup/status', { baseURL: API_BASE_URL.replace(/\/api.*$/, '') }),
  getStats: () => api.get('/admin/stats', { baseURL: API_BASE_URL.replace('/v1', '') }),
  getUsuarios: () => api.get('/admin/usuarios', { baseURL: API_BASE_URL.replace('/v1', '') }),
  getAgendamentos: () => api.get('/admin/agendamentos', { baseURL: API_BASE_URL.replace('/v1', '') }),
  getArtistas: () => api.get('/admin/artistas', { baseURL: API_BASE_URL.replace('/v1', '') }),
  getClientes: () => api.get('/admin/clientes', { baseURL: API_BASE_URL.replace('/v1', '') }),
};

export const testConnection = () => api.get('/api/health', { baseURL: API_BASE_URL.replace(/\/api.*$/, '') });

// Serviços de Mensagens (sem /v1)
export const mensagemServiceExtended = {
  getNaoLidas: () => api.get('/mensagens/nao-lidas', { baseURL: API_BASE_URL.replace('/v1', '') }),
  marcarTodasLidas: () => api.patch('/mensagens/marcar-todas-lidas', {}, { baseURL: API_BASE_URL.replace('/v1', '') }),
  getConversa: (artistaId, clienteId) => api.get(`/mensagens/conversa/${artistaId}/${clienteId}`, { baseURL: API_BASE_URL.replace('/v1', '') }),
  getConversaSimples: (outroUsuarioId) => api.get(`/mensagens/conversa/${outroUsuarioId}`, { baseURL: API_BASE_URL.replace('/v1', '') }),
  marcarLidasPorRemetente: (remetenteId) => api.patch(`/mensagens/marcar-lidas-por-remetente/${remetenteId}`, {}, { baseURL: API_BASE_URL.replace('/v1', '') }),
  getNovas: (desde) => api.get(`/mensagens/novas?desde=${desde}`, { baseURL: API_BASE_URL.replace('/v1', '') }),
  enviar: (data) => api.post('/mensagens', data, { baseURL: API_BASE_URL.replace('/v1', '') }),
  marcarLida: (id) => api.patch(`/mensagens/${id}/lida`, {}, { baseURL: API_BASE_URL.replace('/v1', '') }),
  getConversas: () => api.get('/mensagens/conversas', { baseURL: API_BASE_URL.replace('/v1', '') }),
};

// Serviços de Chatbot
export const chatService = {
  sendMessage: (message) => api.post('/chat', { message }, { baseURL: API_BASE_URL.replace('/v1', '') }),
};

// Serviços de Contato
export const contatoService = {
  enviar: (data) => api.post('/contato', data, { baseURL: API_BASE_URL.replace('/v1', '') }),
};

// Serviços de Leads
export const leadService = {
  criarLeadArtista: (data) => api.post('/leads/artista', data, { baseURL: API_BASE_URL.replace('/v1', '') }),
};

// Serviços de Autenticação (sem /v1)
export const authService = {
  solicitarCodigo: (data) => api.post('/clientes/solicitar-codigo', data, { baseURL: API_BASE_URL.replace('/v1', '') }),
  verificarCodigo: (data) => api.post('/clientes/verificar-codigo', data, { baseURL: API_BASE_URL.replace('/v1', '') }),
  getMinhaContaCliente: () => api.get('/clientes/minha-conta', { baseURL: API_BASE_URL.replace('/v1', '') }),
  deleteMinhaContaCliente: (password) => api.delete('/clientes/minha-conta', { 
    data: { password }, 
    baseURL: API_BASE_URL.replace('/v1', '') 
  }),
};

// Serviço de Upload (proxy para Cloudinary)
export const uploadService = {
  uploadImage: (file, folder = 'portfolio') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return api.post('/upload', formData, { 
      baseURL: API_BASE_URL.replace('/v1', ''),
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export default api;
