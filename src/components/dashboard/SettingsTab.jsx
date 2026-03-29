import { useState, useRef } from 'react'

const SettingsTab = ({ showToast }) => {
  const [studioOpen, setStudioOpen] = useState(true)
  const [artistName, setArtistName] = useState('Elias Thorne')
  const [artistEmail, setArtistEmail] = useState('elias@inkflow.art')
  const [artistBio, setArtistBio] = useState('Especialista em Blackwork e Surrealismo. 8 anos de experiência transformando ideias em arte permanente na pele. Atendimento exclusivo em estúdio privado.')
  const [tags, setTags] = useState(['Blackwork', 'Surrealismo', 'Geométrico'])
  const [avatarPreview, setAvatarPreview] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuDsb9piO97rJv4Q2QNp7ZOaxehjex-WSnQJBOp5OmtVKdJNAH0tKRjzPlaIvrSAj1DOulBt-Vfn-bv2MPGYBrSc5Fj4z0CWAhr5LbY5uz6WlgkIKc2y6jm9PajFvhNcackvnBws0eNUj18AiQfzWXI1zzVfP-gSkmLqZD3ZrHlJyK5tSieAtkKJiZHX0Sn7lgwMM2HqY6qgL0V_lDjK3m8pw6upFQ4f4iS4ZoG9BGsxnt0IGVEJxHzW6lJFJW2Evm27GIS7xYqjwaM')
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

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setAvatarPreview(ev.target.result)
        showToast('Foto de perfil atualizada!')
      }
      reader.readAsDataURL(file)
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(prev => prev.filter(t => t !== tagToRemove))
  }

  const addTag = () => {
    const newTag = prompt('Digite a nova especialidade:')
    if (newTag && newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()])
    }
  }

  const toggleScheduleDay = (index) => {
    setSchedule(prev => prev.map((s, i) => i === index ? { ...s, active: !s.active } : s))
  }

  const updateScheduleTime = (index, field, value) => {
    setSchedule(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      showToast('Configurações salvas com sucesso!')
    }, 1000)
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
                <input className="ad-form-input" type="text" value={artistName} onChange={e => setArtistName(e.target.value)} />
              </div>
              <div>
                <label className="ad-form-label">E-mail Público</label>
                <input className="ad-form-input" type="email" value={artistEmail} onChange={e => setArtistEmail(e.target.value)} />
              </div>
              <div className="ad-form-full">
                <label className="ad-form-label">Bio / Descrição</label>
                <textarea className="ad-form-textarea" rows={4} value={artistBio} onChange={e => setArtistBio(e.target.value)} />
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
                  <button className="ad-tag-add" onClick={addTag}>+ Adicionar</button>
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
                      <input className="ad-schedule-time-input" type="text" value={day.start} onChange={e => updateScheduleTime(i, 'start', e.target.value)} />
                      <span style={{ color: 'var(--ad-on-surface-variant)', fontSize: '0.75rem' }}>—</span>
                      <input className="ad-schedule-time-input" type="text" value={day.end} onChange={e => updateScheduleTime(i, 'end', e.target.value)} />
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
