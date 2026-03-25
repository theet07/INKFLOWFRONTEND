import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Envia o token JWT automaticamente em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Serviços de Cliente
export const clienteService = {
  login: (credentials) => api.post('/clientes/login', credentials),
  getAll: () => api.get('/clientes'),
  getById: (id) => api.get(`/clientes/${id}`),
  getByEmail: (email) => api.get(`/clientes/email/${encodeURIComponent(email)}`),
  create: (cliente) => api.post('/clientes', cliente),
  update: (id, cliente) => api.put(`/clientes/${id}`, cliente),
  delete: (id) => api.delete(`/clientes/${id}`),
};

// Serviços de Agendamento
export const agendamentoService = {
  getAll: () => api.get('/agendamentos'),
  getById: (id) => api.get(`/agendamentos/${id}`),
  getByStatus: (status) => api.get(`/agendamentos/status/${status}`),
  create: (agendamento) => api.post('/agendamentos', agendamento),
  update: (id, agendamento) => api.put(`/agendamentos/${id}`, agendamento),
  delete: (id) => api.delete(`/agendamentos/${id}`),
};

export const testConnection = () => api.get('/test');

export default api;
