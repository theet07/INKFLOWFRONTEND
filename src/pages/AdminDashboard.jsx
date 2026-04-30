import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminService, agendamentoService } from '../services/inkflowApi'
import { useAuth } from '../contexts/AuthContext'
import './AdminDashboard.css'

const STATUS_CONFIG = {
  'PENDENTE':     { label: 'Pendente',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  'AGENDADO':     { label: 'Agendado',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  'CONFIRMADO':   { label: 'Confirmado',   color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  'EM_ANDAMENTO': { label: 'Em Andamento', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  'REALIZADO':    { label: 'Realizado',    color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  'FINALIZADO':   { label: 'Finalizado',   color: '#14b8a6', bg: 'rgba(20,184,166,0.12)' },
  'CANCELADO':    { label: 'Cancelado',    color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [usuarios, setUsuarios] = useState([])
  const [agendamentos, setAgendamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [backupStatus, setBackupStatus] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [toast, setToast] = useState(null)

  const navigate = useNavigate()
  const { token, loading: authLoading, logout } = useAuth()

  // ── Auth guard ─────────────────────────────────────────────
  useEffect(() => {
    if (authLoading) return
    if (!token) { navigate('/login'); return }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.role !== 'ROLE_ADMIN') { navigate('/login'); return }
    } catch { navigate('/login'); return }
    loadData()
  }, [token, authLoading, navigate])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, agRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsuarios(),
        adminService.getAgendamentos(),
      ])
      setStats(statsRes.data)
      setUsuarios(usersRes.data || [])
      setAgendamentos(agRes.data || [])
    } catch (err) {
      console.error('Erro ao carregar dados admin:', err)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Ações ──────────────────────────────────────────────────
  const handleUpdateStatus = async (id, status) => {
    try {
      await agendamentoService.updateStatus(id, { status })
      setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status } : a))
      showToast(`Status atualizado para ${STATUS_CONFIG[status]?.label || status}`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Erro ao atualizar status', true)
    }
  }

  const handleDeleteAgendamento = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento permanentemente?')) return
    try {
      await agendamentoService.delete(id)
      setAgendamentos(prev => prev.filter(a => a.id !== id))
      showToast('Agendamento excluído')
    } catch (err) {
      showToast('Erro ao excluir agendamento', true)
    }
  }

  const handleDownloadBackup = async () => {
    setIsDownloading(true)
    try {
      const response = await adminService.exportBackup()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'inkflow_full_backup.sql')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      showToast('Backup gerado com sucesso')
    } catch {
      showToast('Falha ao gerar backup', true)
    } finally {
      setIsDownloading(false)
    }
  }

  // ── Filtros ────────────────────────────────────────────────
  const filteredUsuarios = useMemo(() => {
    return usuarios.filter(u => {
      const matchSearch = !search ||
        (u.nome || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase())
      const matchTipo = filterTipo === 'all' || u.tipo === filterTipo
      return matchSearch && matchTipo
    })
  }, [usuarios, search, filterTipo])

  const filteredAgendamentos = useMemo(() => {
    return agendamentos.filter(a => {
      const matchStatus = filterStatus === 'all' || a.status === filterStatus
      const matchSearch = !search ||
        (a.cliente?.fullName || a.cliente?.nome || '').toLowerCase().includes(search.toLowerCase()) ||
        (a.artista?.nome || '').toLowerCase().includes(search.toLowerCase())
      return matchStatus && matchSearch
    })
  }, [agendamentos, filterStatus, search])

  const formatDate = (dt) => {
    if (!dt) return '—'
    return new Date(dt).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  }
  const formatDateTime = (dt) => {
    if (!dt) return '—'
    return new Date(dt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  // ── Sidebar tabs ───────────────────────────────────────────
  const tabs = [
    { key: 'dashboard', icon: 'dashboard', label: 'Painel' },
    { key: 'usuarios', icon: 'group', label: 'Usuários' },
    { key: 'agendamentos', icon: 'calendar_month', label: 'Agendamentos' },
    { key: 'seguranca', icon: 'shield', label: 'Segurança' },
  ]

  if (authLoading || loading) {
    return (
      <div className="ap-loading">
        <div className="ap-spinner" />
        <p>Carregando painel...</p>
      </div>
    )
  }

  return (
    <div className="ap-root">
      {/* Toast */}
      {toast && (
        <div className={`ap-toast ${toast.isError ? 'ap-toast-error' : ''}`}>
          <span className="material-symbols-outlined">{toast.isError ? 'error' : 'check_circle'}</span>
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <aside className="ap-sidebar">
        <div className="ap-sidebar-brand">
          <span className="ap-brand-icon">⬡</span>
          <span className="ap-brand-text">INK FLOW</span>
          <span className="ap-brand-sub">Admin</span>
        </div>
        <nav className="ap-sidebar-nav">
          {tabs.map(t => (
            <button key={t.key} className={`ap-nav-btn ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => { setActiveTab(t.key); setSearch(''); setFilterTipo('all'); setFilterStatus('all') }}>
              <span className="material-symbols-outlined">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="ap-sidebar-footer">
          <button className="ap-nav-btn" onClick={() => { logout(); navigate('/login') }}>
            <span className="material-symbols-outlined">logout</span>
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ap-main">
        {activeTab === 'dashboard' && stats && <DashboardView stats={stats} agendamentos={agendamentos} formatDateTime={formatDateTime} />}
        {activeTab === 'usuarios' && (
          <UsuariosView
            usuarios={filteredUsuarios}
            search={search} setSearch={setSearch}
            filterTipo={filterTipo} setFilterTipo={setFilterTipo}
            formatDate={formatDate}
            totalCount={usuarios.length}
          />
        )}
        {activeTab === 'agendamentos' && (
          <AgendamentosView
            agendamentos={filteredAgendamentos}
            search={search} setSearch={setSearch}
            filterStatus={filterStatus} setFilterStatus={setFilterStatus}
            formatDateTime={formatDateTime}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteAgendamento}
            totalCount={agendamentos.length}
          />
        )}
        {activeTab === 'seguranca' && (
          <SegurancaView
            onDownload={handleDownloadBackup}
            isDownloading={isDownloading}
          />
        )}
      </main>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Dashboard View
// ═══════════════════════════════════════════════════════════════
const DashboardView = ({ stats, agendamentos, formatDateTime }) => {
  const cards = [
    { icon: 'group', label: 'Total Usuários', value: stats.totalUsuarios, color: '#3b82f6' },
    { icon: 'brush', label: 'Artistas', value: stats.totalArtistas, color: '#8b5cf6' },
    { icon: 'person', label: 'Clientes', value: stats.totalClientes, color: '#10b981' },
    { icon: 'calendar_month', label: 'Agendamentos', value: stats.totalAgendamentos, color: '#f59e0b' },
    { icon: 'pending', label: 'Pendentes', value: stats.pendentes, color: '#ef4444' },
    { icon: 'today', label: 'Hoje', value: stats.agendamentosHoje, color: '#14b8a6' },
  ]

  const recentAg = [...agendamentos]
    .sort((a, b) => new Date(b.dataHora || b.createdAt) - new Date(a.dataHora || a.createdAt))
    .slice(0, 6)

  return (
    <>
      <header className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Painel Administrativo</h1>
          <p className="ap-page-sub">Visão geral da plataforma InkFlow</p>
        </div>
      </header>

      <div className="ap-stats-grid">
        {cards.map(c => (
          <div key={c.label} className="ap-stat-card">
            <div className="ap-stat-icon" style={{ background: c.color + '18', color: c.color }}>
              <span className="material-symbols-outlined">{c.icon}</span>
            </div>
            <div className="ap-stat-info">
              <span className="ap-stat-value">{c.value}</span>
              <span className="ap-stat-label">{c.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="ap-row">
        <div className="ap-card ap-card-flex">
          <h3 className="ap-card-title">Distribuição de Status</h3>
          <div className="ap-status-bars">
            {[
              { label: 'Pendentes', value: stats.pendentes, color: '#f59e0b' },
              { label: 'Confirmados', value: stats.confirmados, color: '#3b82f6' },
              { label: 'Concluídos', value: stats.concluidos, color: '#10b981' },
              { label: 'Cancelados', value: stats.cancelados, color: '#ef4444' },
            ].map(s => (
              <div key={s.label} className="ap-bar-row">
                <span className="ap-bar-label">{s.label}</span>
                <div className="ap-bar-track">
                  <div className="ap-bar-fill" style={{
                    width: `${stats.totalAgendamentos ? (s.value / stats.totalAgendamentos * 100) : 0}%`,
                    background: s.color
                  }} />
                </div>
                <span className="ap-bar-value">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ap-card ap-card-flex">
          <h3 className="ap-card-title">Métricas</h3>
          <div className="ap-metrics">
            <div className="ap-metric">
              <span className="material-symbols-outlined" style={{ color: '#f59e0b' }}>star</span>
              <div>
                <span className="ap-metric-value">{stats.mediaAvaliacao || '—'}</span>
                <span className="ap-metric-label">Avaliação Média</span>
              </div>
            </div>
            <div className="ap-metric">
              <span className="material-symbols-outlined" style={{ color: '#10b981' }}>person_add</span>
              <div>
                <span className="ap-metric-value">{stats.novosClientes30d}</span>
                <span className="ap-metric-label">Novos (30 dias)</span>
              </div>
            </div>
            <div className="ap-metric">
              <span className="material-symbols-outlined" style={{ color: '#3b82f6' }}>event_available</span>
              <div>
                <span className="ap-metric-value">{stats.concluidos}</span>
                <span className="ap-metric-label">Sessões Concluídas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent */}
      <div className="ap-card">
        <h3 className="ap-card-title">Últimos Agendamentos</h3>
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Cliente</th><th>Artista</th><th>Data/Hora</th><th>Serviço</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAg.map(a => {
                const sc = STATUS_CONFIG[a.status] || { label: a.status, color: '#888', bg: 'rgba(136,136,136,0.12)' }
                return (
                  <tr key={a.id}>
                    <td>{a.cliente?.fullName || a.cliente?.nome || '—'}</td>
                    <td>{a.artista?.nome || '—'}</td>
                    <td>{formatDateTime(a.dataHora)}</td>
                    <td>{a.servico || '—'}</td>
                    <td><span className="ap-badge" style={{ color: sc.color, background: sc.bg }}>{sc.label}</span></td>
                  </tr>
                )
              })}
              {recentAg.length === 0 && <tr><td colSpan={5} className="ap-empty">Nenhum agendamento</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
// Usuarios View
// ═══════════════════════════════════════════════════════════════
const UsuariosView = ({ usuarios, search, setSearch, filterTipo, setFilterTipo, formatDate, totalCount }) => (
  <>
    <header className="ap-page-header">
      <div>
        <h1 className="ap-page-title">Gerenciar Usuários</h1>
        <p className="ap-page-sub">Gerencie os usuários e suas permissões na plataforma</p>
      </div>
      <span className="ap-header-count">{totalCount} usuários</span>
    </header>

    <div className="ap-toolbar">
      <div className="ap-search-box">
        <span className="material-symbols-outlined">search</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou email..." />
      </div>
      <div className="ap-filter-group">
        {['all', 'CLIENTE', 'ARTISTA'].map(v => (
          <button key={v} className={`ap-filter-btn ${filterTipo === v ? 'active' : ''}`}
            onClick={() => setFilterTipo(v)}>
            {v === 'all' ? 'Todos' : v === 'CLIENTE' ? 'Clientes' : 'Artistas'}
          </button>
        ))}
      </div>
    </div>

    <div className="ap-card">
      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Usuário</th><th>Email</th><th>Tipo</th><th>Telefone</th><th>Status</th><th>Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={`${u.tipo}-${u.id}`}>
                <td>
                  <div className="ap-user-cell">
                    {u.foto
                      ? <img src={u.foto} alt="" className="ap-avatar" />
                      : <div className="ap-avatar-fallback">{(u.nome || '?').charAt(0).toUpperCase()}</div>
                    }
                    <span>{u.nome || 'Sem nome'}</span>
                  </div>
                </td>
                <td className="ap-text-dim">{u.email || '—'}</td>
                <td>
                  <span className="ap-badge" style={{
                    color: u.tipo === 'ARTISTA' ? '#8b5cf6' : '#3b82f6',
                    background: u.tipo === 'ARTISTA' ? 'rgba(139,92,246,0.12)' : 'rgba(59,130,246,0.12)'
                  }}>{u.tipo === 'ARTISTA' ? 'Artista' : 'Cliente'}</span>
                </td>
                <td className="ap-text-dim">{u.telefone || '—'}</td>
                <td>
                  <span className="ap-badge" style={{
                    color: u.verificado ? '#10b981' : '#ef4444',
                    background: u.verificado ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'
                  }}>{u.verificado ? 'Ativo' : 'Inativo'}</span>
                </td>
                <td className="ap-text-dim">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
            {usuarios.length === 0 && <tr><td colSpan={6} className="ap-empty">Nenhum usuário encontrado</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  </>
)

// ═══════════════════════════════════════════════════════════════
// Agendamentos View
// ═══════════════════════════════════════════════════════════════
const AgendamentosView = ({ agendamentos, search, setSearch, filterStatus, setFilterStatus, formatDateTime, onUpdateStatus, onDelete, totalCount }) => (
  <>
    <header className="ap-page-header">
      <div>
        <h1 className="ap-page-title">Agendamentos</h1>
        <p className="ap-page-sub">Gerencie todos os agendamentos da plataforma</p>
      </div>
      <span className="ap-header-count">{totalCount} agendamentos</span>
    </header>

    <div className="ap-toolbar">
      <div className="ap-search-box">
        <span className="material-symbols-outlined">search</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente ou artista..." />
      </div>
      <div className="ap-filter-group ap-filter-scroll">
        {['all', 'PENDENTE', 'CONFIRMADO', 'EM_ANDAMENTO', 'REALIZADO', 'CANCELADO'].map(v => (
          <button key={v} className={`ap-filter-btn ${filterStatus === v ? 'active' : ''}`}
            onClick={() => setFilterStatus(v)}>
            {v === 'all' ? 'Todos' : STATUS_CONFIG[v]?.label || v}
          </button>
        ))}
      </div>
    </div>

    <div className="ap-card">
      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Cliente</th><th>Artista</th><th>Data/Hora</th><th>Serviço</th><th>Status</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map(a => {
              const sc = STATUS_CONFIG[a.status] || { label: a.status, color: '#888', bg: 'rgba(136,136,136,0.12)' }
              const nextFlow = { 'PENDENTE': 'CONFIRMADO', 'AGENDADO': 'CONFIRMADO', 'CONFIRMADO': 'EM_ANDAMENTO', 'EM_ANDAMENTO': 'REALIZADO' }
              const next = nextFlow[a.status]

              return (
                <tr key={a.id}>
                  <td>{a.cliente?.fullName || a.cliente?.nome || '—'}</td>
                  <td>{a.artista?.nome || '—'}</td>
                  <td>{formatDateTime(a.dataHora)}</td>
                  <td className="ap-text-dim">{a.servico || '—'}</td>
                  <td><span className="ap-badge" style={{ color: sc.color, background: sc.bg }}>{sc.label}</span></td>
                  <td>
                    <div className="ap-actions">
                      {next && (
                        <button className="ap-action-btn ap-action-advance" title={`Avançar para ${STATUS_CONFIG[next]?.label}`}
                          onClick={() => onUpdateStatus(a.id, next)}>
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                      )}
                      {a.status !== 'CANCELADO' && a.status !== 'FINALIZADO' && a.status !== 'REALIZADO' && (
                        <button className="ap-action-btn ap-action-cancel" title="Cancelar"
                          onClick={() => onUpdateStatus(a.id, 'CANCELADO')}>
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      )}
                      <button className="ap-action-btn ap-action-delete" title="Excluir"
                        onClick={() => onDelete(a.id)}>
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {agendamentos.length === 0 && <tr><td colSpan={6} className="ap-empty">Nenhum agendamento encontrado</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  </>
)

// ═══════════════════════════════════════════════════════════════
// Seguranca View
// ═══════════════════════════════════════════════════════════════
const SegurancaView = ({ onDownload, isDownloading }) => (
  <>
    <header className="ap-page-header">
      <div>
        <h1 className="ap-page-title">Segurança</h1>
        <p className="ap-page-sub">Gerenciamento de backups e dados</p>
      </div>
    </header>

    <div className="ap-row">
      <div className="ap-card ap-card-flex">
        <div className="ap-seg-icon">
          <span className="material-symbols-outlined">database</span>
        </div>
        <h3 className="ap-card-title">Recuperação de Dados</h3>
        <p className="ap-text-dim" style={{ margin: '0.75rem 0 1.5rem', lineHeight: 1.6 }}>
          Gere uma cópia completa do banco de dados em formato SQL para fins de segurança e conformidade.
        </p>
        <button className="ap-btn-primary" onClick={onDownload} disabled={isDownloading}>
          <span className="material-symbols-outlined">{isDownloading ? 'hourglass_empty' : 'download'}</span>
          {isDownloading ? 'Gerando...' : 'Baixar Backup (.sql)'}
        </button>
      </div>

      <div className="ap-card ap-card-flex">
        <div className="ap-seg-icon">
          <span className="material-symbols-outlined">update</span>
        </div>
        <h3 className="ap-card-title">Backup Automático</h3>
        <p className="ap-text-dim" style={{ margin: '0.75rem 0 1rem', lineHeight: 1.6 }}>
          Backups automáticos ocorrem diariamente às 00:00 (BRT). Realize backups manuais antes de manutenções.
        </p>
        <div className="ap-alert">
          <span className="material-symbols-outlined">warning</span>
          <span>Certifique-se de realizar backups antes de migrações de dados.</span>
        </div>
      </div>
    </div>
  </>
)

export default AdminDashboard