// Configuração do Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Inicializar cliente Supabase
let supabaseClient;
try {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase inicializado');
    } else {
        console.error('❌ Supabase não carregado');
    }
} catch (error) {
    console.error('❌ Erro ao inicializar Supabase:', error);
}

// Função para criar agendamento no Supabase
async function criarAgendamento(dadosAgendamento) {
    console.log('🔄 Iniciando criação de agendamento:', dadosAgendamento);
    
    // Verificar se Supabase está disponível
    if (!supabaseClient) {
        throw new Error('❌ Supabase não inicializado. Verifique se a biblioteca foi carregada.');
    }
    
    try {
        const agendamento = {
            nome_cliente: dadosAgendamento.clientName,
            email: dadosAgendamento.email,
            telefone: dadosAgendamento.phone,
            idade: parseInt(dadosAgendamento.age),
            servico: dadosAgendamento.service,
            data_agendamento: dadosAgendamento.date,
            horario: dadosAgendamento.time,
            descricao: `Artista: ${dadosAgendamento.artist || 'Sem preferência'} | Tamanho: ${dadosAgendamento.size || 'N/A'} | Local: ${dadosAgendamento.location || 'N/A'} | Orçamento: ${dadosAgendamento.budget || 'N/A'} | Primeira tatuagem: ${dadosAgendamento.firstTattoo ? 'Sim' : 'Não'} | Descrição: ${dadosAgendamento.description || 'N/A'}`,
            status: 'pendente'
        };
        
        console.log('📤 Enviando para Supabase:', agendamento);
        
        const { data, error } = await supabaseClient
            .from('agendamentos')
            .insert([agendamento])
            .select();

        if (error) {
            console.error('❌ Erro do Supabase:', error);
            
            // Erros específicos
            if (error.code === '42P01') {
                throw new Error('❌ Tabela "agendamentos" não existe. Execute o SQL no Supabase.');
            }
            if (error.code === '42501') {
                throw new Error('❌ Sem permissão. Configure as políticas RLS no Supabase.');
            }
            if (error.message.includes('JWT')) {
                throw new Error('❌ Chave de API inválida. Verifique SUPABASE_ANON_KEY.');
            }
            
            throw new Error(`❌ Erro do Supabase: ${error.message}`);
        }

        console.log('✅ Agendamento criado no Supabase:', data);
        return { success: true, data };
    } catch (error) {
        console.error('❌ Erro ao criar agendamento:', error);
        throw error; // Re-throw para mostrar erro específico
    }
}

// Função de fallback para localStorage
function salvarNoLocalStorage(dadosAgendamento) {
    try {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const novoAgendamento = {
            id: Date.now(),
            ...dadosAgendamento,
            status: 'pendente',
            createdAt: new Date().toISOString()
        };
        appointments.push(novoAgendamento);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        console.log('✅ Agendamento salvo no localStorage:', novoAgendamento);
        return { success: true, data: [novoAgendamento], fallback: true };
    } catch (error) {
        console.error('❌ Erro ao salvar no localStorage:', error);
        return { success: false, error: error.message };
    }
}

// Função para listar agendamentos
async function listarAgendamentos() {
    if (!supabaseClient) {
        throw new Error('❌ Supabase não inicializado.');
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('agendamentos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro do Supabase ao listar:', error);
            throw new Error(`❌ Erro ao listar: ${error.message}`);
        }
        
        return { success: true, data };
    } catch (error) {
        console.error('Erro ao listar agendamentos:', error);
        throw error;
    }
}

// Função para login de cliente
async function fazerLogin(email, senha) {
    if (!supabaseClient) {
        throw new Error('❌ Supabase não inicializado.');
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('clientes')
            .select('*')
            .eq('email', email)
            .eq('senha', senha)
            .single();

        if (error) {
            throw new Error('❌ Email ou senha incorretos.');
        }

        console.log('✅ Login cliente realizado:', data);
        return { success: true, user: { ...data, tipo: 'cliente' } };
    } catch (error) {
        console.error('❌ Erro no login:', error);
        throw error;
    }
}

// Função para login de admin
async function fazerLoginAdmin(email, senha) {
    if (!supabaseClient) {
        throw new Error('❌ Supabase não inicializado.');
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('administradores')
            .select('*')
            .eq('email', email)
            .eq('senha', senha)
            .single();

        if (error) {
            throw new Error('❌ Credenciais de administrador inválidas.');
        }

        // Atualizar último login
        await supabaseClient
            .from('administradores')
            .update({ ultimo_login: new Date().toISOString() })
            .eq('id', data.id);

        console.log('✅ Login admin realizado:', data);
        return { success: true, user: { ...data, tipo: 'admin' } };
    } catch (error) {
        console.error('❌ Erro no login admin:', error);
        throw error;
    }
}

// Função para criar cliente
async function criarCliente(dadosCliente) {
    if (!supabaseClient) {
        throw new Error('❌ Supabase não inicializado.');
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('clientes')
            .insert([{
                nome: dadosCliente.nome,
                email: dadosCliente.email,
                senha: dadosCliente.senha,
                telefone: dadosCliente.telefone || null
            }])
            .select();

        if (error) {
            if (error.code === '23505') {
                throw new Error('❌ Email já cadastrado.');
            }
            throw new Error(`❌ Erro: ${error.message}`);
        }

        console.log('✅ Cliente criado:', data);
        return { success: true, user: data[0] };
    } catch (error) {
        console.error('❌ Erro ao criar cliente:', error);
        throw error;
    }
}

// Função para alterar status de agendamento
async function alterarStatusAgendamento(id, novoStatus) {
    if (!supabaseClient) {
        throw new Error('❌ Supabase não inicializado.');
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('agendamentos')
            .update({ status: novoStatus })
            .eq('id', id)
            .select();

        if (error) {
            throw new Error(`❌ Erro ao alterar status: ${error.message}`);
        }

        console.log('✅ Status alterado:', data);
        return { success: true, data };
    } catch (error) {
        console.error('❌ Erro ao alterar status:', error);
        throw error;
    }
}

// Exportar funções
window.supabaseAgendamento = {
    criarAgendamento,
    listarAgendamentos,
    fazerLogin,
    fazerLoginAdmin,
    criarCliente,
    alterarStatusAgendamento
};