import { useState } from 'react';
import { testConnection, clienteService, agendamentoService } from '../services/inkflowApi';

function TestConnection() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    try {
      const response = await testConnection();
      setResult(`✅ Conexão OK: ${response.data.message}`);
    } catch (error) {
      setResult(`❌ Erro: ${error.message}`);
    }
    setLoading(false);
  };

  const handleTestClientes = async () => {
    setLoading(true);
    try {
      const response = await clienteService.getAll();
      setResult(`✅ Clientes: ${response.data.length} encontrados`);
    } catch (error) {
      setResult(`❌ Erro clientes: ${error.message}`);
    }
    setLoading(false);
  };

  const handleTestAgendamentos = async () => {
    setLoading(true);
    try {
      const response = await agendamentoService.getAll();
      setResult(`✅ Agendamentos: ${response.data.length} encontrados`);
    } catch (error) {
      setResult(`❌ Erro agendamentos: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Teste de Conexão Backend</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleTest} disabled={loading}>
          Testar Conexão
        </button>
        <button onClick={handleTestClientes} disabled={loading} style={{ marginLeft: '10px' }}>
          Testar Clientes
        </button>
        <button onClick={handleTestAgendamentos} disabled={loading} style={{ marginLeft: '10px' }}>
          Testar Agendamentos
        </button>
      </div>

      {loading && <p>Carregando...</p>}
      {result && <p>{result}</p>}
    </div>
  );
}

export default TestConnection;