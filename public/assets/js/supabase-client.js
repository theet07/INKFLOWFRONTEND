// Cliente Supabase para frontend
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Funções para usar no frontend
export async function loginUser(email, password) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nome, email, criado_em')
    .eq('email', email)
    .eq('senha', password)
  
  if (error) throw error
  return data.length > 0 ? { success: true, user: data[0] } : { success: false }
}

export async function createUser(nome, email, senha) {
  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ nome, email, senha }])
  
  if (error) throw error
  return { success: true }
}

export async function createAppointment(appointment) {
  const { data, error } = await supabase
    .from('agendamentos')
    .insert([appointment])
  
  if (error) throw error
  return { success: true }
}

export async function getUserAppointments(email) {
  const { data, error } = await supabase
    .from('agendamentos')
    .select('*')
    .eq('email', email)
    .order('data_agendamento', { ascending: true })
  
  if (error) throw error
  return data
}

export async function deleteAppointment(id) {
  const { error } = await supabase
    .from('agendamentos')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return { success: true }
}

export async function deleteUserAccount(email) {
  // Deletar agendamentos primeiro
  await supabase
    .from('agendamentos')
    .delete()
    .eq('email', email)
  
  // Deletar usuário
  const { error } = await supabase
    .from('usuarios')
    .delete()
    .eq('email', email)
  
  if (error) throw error
  return { success: true }
}