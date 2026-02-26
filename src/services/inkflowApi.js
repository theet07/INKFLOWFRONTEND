import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Serviços de Cliente
export const clienteService = {
  // Listar todos os clientes
  getAll: () => api.get('/api/clientes'),
  
  // Buscar cliente por ID
  getById: (id) => api.get(`/api/clientes/${id}`),
  
  // Criar novo cliente
  create: (cliente) => api.post('/api/clientes', cliente),
  
  // Atualizar cliente
  update: (id, cliente) => api.put(`/api/clientes/${id}`, cliente),
  
  // Deletar cliente
  delete: (id) => api.delete(`/api/clientes/${id}`)
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