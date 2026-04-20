import { useState, useRef } from 'react'
import { artistaService } from '../../services/inkflowApi'

const SettingsTab = ({ showToast }) => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')

  const [studioOpen, setStudioOpen] = useState(true)
  const [artistName, setArtistName] = useState(storedUser.nome || storedUser.fullName || '')
  const [artistEmail, setArtistEmail] = useState(storedUser.email || '')
  const [artistBio, setArtistBio] = useState(storedUser.bio || '')
  const [tags, setTags] = useState(
    storedUser.especialidades
      ? storedUser.especialidades.split(',').map(t => t.trim()).filter(Boolean)
      : []
  )
  const [avatarPreview, setAvatarPreview] = useState(storedUser.fotoUrl || '')
  const [saving, setSaving] = useState(false)

  const [notifications, setNotifications] = useState({ email: true, push: true, audio: false })

  const [schedule, setSchedule] = useState([
    { day: 'Seg', active: true, start: '10:00', end: '18:00' },
    { day: 'Ter', active: true, start: '10:00', end: '18:00' },
    { day: 'Qua', active: true, start: '10:00', end: '18:00' },
    { day: 'Qui', active: false, start: '10:00', end: '18:00' },
    { day: 'Sex', active: true, start: '10:00', end: '22:00' },
  ])

  const avatarInputRef = useRef(null)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => setAvatarPreview(ev.target.result)
    reader.readAsDataURL(file)

    try {
      const uploadData = new FormData()
      uploadData.append('file', file)
      const response = await artistaService.uploadFoto(user.artistaId || user.id, uploadData)
      showToast('Foto de perfil atualizada!')
      if (response.data?.fotoUrl) {
        const updatedUser = { ...user, fotoUrl: response.data.fotoUrl }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    } catch (err) {
      console.error('Erro ao fazer upload da foto:', err)
      showToast('Erro ao atualizar foto. Tente novamente.', true)
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(prev => prev.filter(t => t !== tagToRemove))
  }

  const [newTag, setNewTag] = useState('')

  const addTag = () => {
    const tag = newTag.trim()
    if (tag && !tags.includes(tag)) {
      setTags(prev => [...prev, tag])
    }
    setNewTag('')
  }

  const toggleScheduleDay = (index) => {
    setSchedule(prev => prev.map((s, i) => i === index ? { ...s, active: !s.active } : s))
  }

  const updateScheduleTime = (index, field, value) => {
    setSchedule(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await artistaService.update(user.artistaId || user.id, {
        nome: artistName,
        bio: artistBio,
        especialidades: tags.join(',')
      })
      showToast('Configurações salvas com sucesso!')
    } catch (err) {
      console.error('Erro ao salvar configurações:', err)
      showToast('Erro ao salvar configurações. Tente novamente.', true)
    } finally {
      setSaving(false)
    }
  }

  const handleDiscard = () => {
    if (confirm('Tem certeza que deseja descartar as alterações não salvas?')) {
      showToast('Alterações descartadas.', true)
    }
  }

  return (
    <>
      {/* Header */}
      <section className="ad-header-section">
        <div className="ad-header-text">
          <span className="ad-overview-label">Studio Control</span>
          <h1 className="ad-page-title">
            Configurações
          </h1>
        </div>
        {/* Status Toggle */}
        <div className="ad-settings-status-card">
          <div>
            <p className="ad-settings-status-label">Status do Estúdio</p>
            <p className={`ad-settings-status-text ${studioOpen ? '' : 'paused'}`}>
              {studioOpen ? 'Aceitando Agendamentos' : 'Agendamentos Pausados'}
            </p>
          </div>
          <label className="ad-toggle-large">
            <input type="checkbox" checked={studioOpen} onChange={(e) => {
              setStudioOpen(e.target.checked)
              showToast(e.target.checked ? 'Estúdio aberto para agendamentos' : 'Agendamentos pausados', !e.target.checked)
            }} />
            <span className="ad-toggle-track"></span>
          </label>
        </div>
      </section>

      <div className="ad-settings-grid">
        {/* Left Column */}
        <div className="ad-settings-col-left">

          {/* Artist Profile */}
          <div className="ad-settings-panel">
            <div className="ad-settings-panel-header">
              <span className="material-symbols-outlined" style={{ color: 'var(--ad-primary)' }}>person</span>
              <h3>Perfil do Artista</h3>
            </div>

            {/* Avatar */}
            <div className="ad-settings-avatar-section">
              <label className="ad-settings-avatar-upload" onClick={() => avatarInputRef.current?.click()}>
                <img src={avatarPreview} alt="Avatar" />
                <div className="ad-settings-avatar-hover">
                  <span className="material-symbols-outlined">upload</span>
                </div>
              </label>
              <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 4 }}>Foto de Perfil</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--ad-on-surface-variant)', marginBottom: 12 }}>PNG, JPG ou WEBP. Máx 2MB.</p>
                <button className="ad-btn-outline-small" onClick={() => avatarInputRef.current?.click()}>Alterar Imagem</button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="ad-settings-form-grid">
              <div>
                <label className="ad-form-label">Nome Artístico</label>
                <input className="ad-form-input" type="text" value={artistName || ''} onChange={e => setArtistName(e.target.value)} autoComplete="off" />
              </div>
              <div>
                <label className="ad-form-label">E-mail Público</label>
                <input className="ad-form-input" type="email" value={artistEmail || ''} onChange={e => setArtistEmail(e.target.value)} autoComplete="off" />
              </div>
              <div className="ad-form-full">
                <label className="ad-form-label">Bio / Descrição</label>
                <textarea className="ad-form-textarea" rows={4} value={artistBio || ''} onChange={e => setArtistBio(e.target.value)} autoComplete="off" />
              </div>
              <div className="ad-form-full">
                <label className="ad-form-label">Tags de Especialidade</label>
                <div className="ad-tags-container">
                  {tags.map(tag => (
                    <span key={tag} className="ad-tag">
                      {tag}
                      <span className="material-symbols-outlined ad-tag-remove" onClick={() => removeTag(tag)}>close</span>
                    </span>
                  ))}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTag()}
                      placeholder="Nova especialidade..."
                      className="ad-form-input"
                      style={{ flex: 1 }}
                    />
                    <button onClick={addTag} className="ad-btn-outline-small">Adicionar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="ad-settings-panel">
            <div className="ad-settings-panel-header">
              <span className="material-symbols-outlined" style={{ color: 'var(--ad-primary)' }}>notifications_active</span>
              <h3>Notificações</h3>
            </div>
            <div className="ad-settings-notification-list">
              {[
                { key: 'email', title: 'Alertas por E-mail', desc: 'Receba resumos diários e novos pedidos.' },
                { key: 'push', title: 'Push Notifications', desc: 'Alertas no navegador e celular.' },
                { key: 'audio', title: 'Desktop Audio', desc: 'Sinal sonoro para novas mensagens.' },
              ].map(n => (
                <div key={n.key} className="ad-settings-notification-item">
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{n.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--ad-on-surface-variant)' }}>{n.desc}</p>
                  </div>
                  <label className="ad-toggle">
                    <input type="checkbox" checked={notifications[n.key]} onChange={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key] }))} />
                    <span className="ad-toggle-track-sm"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="ad-settings-col-right">

          {/* Availability */}
          <div className="ad-settings-panel">
            <div className="ad-settings-panel-header">
              <span className="material-symbols-outlined" style={{ color: 'var(--ad-primary)' }}>schedule</span>
              <h3>Disponibilidade</h3>
            </div>
            <div className="ad-schedule-rows">
              {schedule.map((day, i) => (
                <div key={day.day} className="ad-schedule-row">
                  <span className={`ad-schedule-day-label ${!day.active ? 'paused' : ''}`}>{day.day}</span>
                  {day.active ? (
                    <div className="ad-schedule-time-inputs">
                      <input className="ad-schedule-time-input" type="text" value={day.start || ''} onChange={e => updateScheduleTime(i, 'start', e.target.value)} autoComplete="off" />
                      <span style={{ color: 'var(--ad-on-surface-variant)', fontSize: '0.75rem' }}>—</span>
                      <input className="ad-schedule-time-input" type="text" value={day.end || ''} onChange={e => updateScheduleTime(i, 'end', e.target.value)} autoComplete="off" />
                    </div>
                  ) : (
                    <div className="ad-schedule-paused">PAUSADO</div>
                  )}
                  <label className="ad-toggle-small">
                    <input type="checkbox" checked={day.active} onChange={() => toggleScheduleDay(i)} />
                    <span className="ad-toggle-track-xs"></span>
                  </label>
                </div>
              ))}
            </div>
            <div className="ad-schedule-info-box">
              <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', color: 'var(--ad-primary)' }}>info</span>
              <p>As alterações no horário semanal não afetam agendamentos já confirmados, apenas novas solicitações.</p>
            </div>
          </div>

          {/* Gallery Card */}
          <div className="ad-settings-gallery-card" onClick={() => showToast('Abrindo gerenciador de galeria...')}>
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiOPlnuw0EiTf19Kk2sGebpOT-L3mhUXcquQCO2PGsYLT-d5knirK8hD3aeFl9AtV_UvaYen96VeqQVmimX7O72j2MGaxCAZqUC6QfUZveFkYnNeRQ3NWcJfBR88RHFqatHYWqQ5CByYFKD1fqMPVOfTE5ovPKJHPDjo2pBc_Tv34V3vOn3Ks-Sa-vsDUmIU14N2TAyz7mw2uS_mJ2w7xAKzSCx41Ctn-wsDyYXkd70S2_7cyKNLtC0-JIMb4frXd_eRIsBPRR5OU" alt="Gallery" />
            <div className="ad-settings-gallery-overlay"></div>
            <div className="ad-settings-gallery-text">
              <p className="ad-overview-label" style={{ marginBottom: 4 }}>Studio Preview</p>
              <h4>Galeria do Estúdio</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="ad-settings-action-bar">
        <button className="ad-btn-discard" onClick={handleDiscard}>Descartar</button>
        <button className="ad-btn-save" onClick={handleSave} disabled={saving}>
          {saving ? (
            <><span className="material-symbols-outlined ad-spin" style={{ fontSize: '1rem' }}>sync</span> Salvando</>
          ) : 'Salvar Alterações'}
        </button>
      </div>
    </>
  )
}

export default SettingsTab
