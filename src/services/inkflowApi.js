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

export const clienteService = {
  login: (credentials) => api.post('/clientes/login', credentials),
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
  getAll: () => api.get('/agendamentos'),
  getById: (id) => api.get(`/agendamentos/${id}`),
  getByCliente: (clienteId) => api.get(`/agendamentos/cliente/${clienteId}`),
  getByArtista: (artistaId) => api.get(`/agendamentos/artista/${artistaId}`),
  getByStatus: (status) => api.get(`/agendamentos/status/${status}`),
  create: (agendamento) => api.post('/agendamentos', agendamento),
  update: (id, agendamento) => api.put(`/agendamentos/${id}`, agendamento),
  updateStatus: (id, data) => api.patch(`/agendamentos/${id}/status`, data),
  delete: (id) => api.delete(`/agendamentos/${id}`),
};

export const appointmentService = {
  create: (data) => api.post('/appointments', data),
};

export const artistaService = {
  getAllArtists: () => api.get('/artistas', { baseURL: API_BASE_URL.replace('/v1', '') }),
  getById: (id) => api.get(`/artistas/${id}`, { baseURL: API_BASE_URL.replace('/v1', '') }),
  getAvailability: (id) => api.get(`/artists/${id}/availability`),
  getSlots: (id, data) => api.get(`/artists/${id}/availability/slots`, { params: { data } }),
};

export const portfolioService = {
  getByArtista: (artistaId) => api.get(`/portfolio/artista/${artistaId}`),
  create: (data) => api.post('/portfolio', data),
  upload: (formData) => api.post('/portfolio/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/portfolio/${id}`),
};

export const testConnection = () => api.get('/test');

export default api;
