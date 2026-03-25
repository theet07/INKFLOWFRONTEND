import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos — garante que o finally sempre seja chamado
});

// Serviços de Cliente
export const clienteService = {
  // Login de cliente
  login: (credentials) => api.post('/clientes/login', credentials),
  
  // Listar todos os clientes
  getAll: () => api.get('/clientes'),
  
  // Buscar cliente por ID
  getById: (id) => api.get(`/clientes/${id}`),
  
  // Criar novo cliente
  create: (cliente) => api.post('/clientes', cliente),
  
  // Atualizar cliente
  update: (id, cliente) => api.put(`/clientes/${id}`, cliente),
  
  // Deletar cliente
  delete: (id) => api.delete(`/clientes/${id}`)
};

// Serviços de Agendamento
export const agendamentoService = {
  // Listar todos os agendamentos
  getAll: () => api.get('/agendamentos'),
  
  // Buscar agendamento por ID
  getById: (id) => api.get(`/agendamentos/${id}`),
  
  // Buscar por status
  getByStatus: (status) => api.get(`/agendamentos/status/${status}`),
  
  // Criar novo agendamento
  create: (agendamento) => api.post('/agendamentos', agendamento),
  
  // Atualizar agendamento
  update: (id, agendamento) => api.put(`/agendamentos/${id}`, agendamento),
  
  // Deletar agendamento
  delete: (id) => api.delete(`/agendamentos/${id}`)
};

// Teste de conexão
export const testConnection = () => api.get('/test');

export default api;
