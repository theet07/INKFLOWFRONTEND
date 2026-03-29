import { useState } from 'react'

const DashboardTab = ({ showToast, openDrawer }) => {

  const handleActionBtn = (e, action) => {
    e.stopPropagation()
    showToast(action)
  }

  const handleAccept = (e, clientName) => {
    e.stopPropagation()
    showToast(`Solicitação de ${clientName} aceita!`)
  }

  const handleDecline = (e, clientName) => {
    e.stopPropagation()
    showToast(`Solicitação de ${clientName} recusada.`, true)
  }

  const handleTableRowClick = (e, clientName) => {
    if (e.target.closest('button')) return
    openDrawer(clientName)
  }

  const handleNewSession = () => showToast('Abrindo formulário de nova sessão...')

  const todayAgenda = [
    {
      time: '10:00', period: 'AM', name: 'Marcus Vane',
      desc: 'Realismo Manga • 4h', status: 'Confirmado',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLosEgOfR996MZgw8U40BofUpn5KmZd5naxciO1RxsHR_EnzwT9NxoVrqfldIO5CBJi9nAotFwGLfkbQKBe-ifK7qc2f-88gxEVtCgHr_Rx9FeqN0w_qeP-bA-WJPVY__nTU1V5Q_hO1WrCOqq-l33NlOEJvz-iTexOUR4pX-ARSc9hxbC-LbfSriA0u4p8SEVYemwo62nnSIAndFsax6XhZ64mQ-ZJzdWBw3tyZKS60V_DLkfItMXy5fQGfA1V4dCZHvCyWZYC9g',
      primaryBorder: true
    },
    {
      time: '02:30', period: 'PM', name: 'Sienna Cole',
      desc: 'Linha Fina Script • 1.5h', status: 'Confirmado',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB5HUmNuLmwR2Q5kTDgXK6m2d6gDTreEbbJ02ge0NklbvHeBYork9Eg7JwoWmwvVyG1AhQluK96NtLJxpdia0oGVjuheGbQlL-g01FlKMMft3gVSSsUHjNQ-9k42MSa5tzDz0imYshpNFe32mgmjBdNMJst4W71E9OzHfC96FzCiZePItU_ssYb4p_0FghTr61H7EijQTsIJprIJUk2r4gyhVKBIQ8OXKMDJ3sMGQOtWcN3-qwUMTeyB6mucWk9tuMEDGBT324INQ',
    },
    {
      time: '05:00', period: 'PM', name: 'Julian Reed',
      desc: 'Tradicional Flash • 2h', status: 'Confirmado',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwZ1MWlsX9D3Qxd_3FulhGvtW-RnWLa2Pnyf5haq39djNgEvfw-wbpLYlyUf6LOgZkdcrMAY3nBDgpVKKm9MclPMUVCUhTn-7q0dVNVOaMaWs5reSfkUqOMTh2wpRcaiu3fYWFxxrvvD75t32jHlc9t_mLGUYpJsHoNn5WclQwPskE6BPOLCJc9bpwn7rvmLk4cQla3TJUm2hr-aWvi6qUMEFI2rI3saLyr-sU-g8nehl_u9_C33_6xJsgKkU4srwrfTurTNsFSXc',
    },
  ]

  const tableRows = [
    {
      name: 'Elena Rossi', email: 'elenar@example.com',
      date: '24 OUT', time: '11:00',
      style: 'Neo-Tradicional', area: 'Antebraço',
      status: 'Pendente', badgeClass: 'ad-badge-yellow',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvysmsMMs6kAZAOLzyGlpnw8IOhEFDjT_dPp2TyzQiqqoBOROzsujR855nm483E0zxN3dMOIeUGi0JQtVjZVDoUdBcGLGOSKlIObX59qF87AngqouHea8WGgOtwfRCSiLGIs38zKZVipjspHVvgTleAPy-RNa-DuNngtVm7NclXS4s2h4mNAX53Vd6mAh3YUJmbsaJsCRDBtpkmWfbSq6_wUKN8-6u6Xs3iz-vaKpi6MfSYgLlDVUt6nG4xtgJMNEzQt3FgOhIOyo',
      hasPendingActions: true,
    },
    {
      name: 'Dominic Thorne', email: 'dom.t@web.me',
      date: '26 OUT', time: '15:00',
      style: 'Blackwork Geométrico', area: 'Escápula',
      status: 'Confirmado', badgeClass: 'ad-badge-green',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUowRouJ5D9txEpmNUYLG6kgtuZ66V1-OadOkYSFUjkrMB7Uy6c7WNe1vzPS1e9idl8uxNuMCMRlKhieV0Bf0wZEEHJQwqAf3H02QWZB1ZiNUMRHtr-eJdxcFp98bP0pkqOxVQB3fNndPhcjRFTI3Q_BUSf43wej6Db3skRWievLJwYKkDw3pOGc3UcPRy_IVicQwym-I5EtLxIw3Fhp4j7rGR2nhMlmYT-JTE9AoUIsgklRaohB7AuWpO_lZkowatTH4259-Faew',
      hasPendingActions: false,
    },
    {
      name: 'Clara West', email: 'clara.w@inkmail.com',
      date: '28 OUT', time: '13:00',
      style: 'Lettering', area: 'Costela',
      status: 'Cancelado', badgeClass: 'ad-badge-red',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDr-p8KaFfH1vT_YIsETVkeJXtrDyk9lEN8J0G5jqAsF29wvE_8mUFUo48YhNdr9bdLmr1IPmjT3fTbaxd_k7OpM5TtCi_T1JJKqYnXwKjpLC7D4tX5bixZC-Y9RPjL7uRnT8oo7hflIizyEu5yseLs96UxZJluqP2GG_dbysSPKAPKTvgw17TwhL3RwWrntPfUX0Nu5YxLcgNapWANedJWQysJ-MeJD73EsCycve82jZxfrzJs7h6DwMGQvbK9YC-c01uWy57KucY',
      hasPendingActions: false,
    },
  ]

  return (
    <>
      {/* Header Section */}
      <section className="ad-header-section">
        <div className="ad-header-text">
          <span className="ad-overview-label">Visão Geral</span>
          <h1 className="ad-page-title">
            Painel do <br />
            <span className="ad-title-dim">Artista</span>
          </h1>
        </div>
        <div className="ad-header-actions">
          <button className="ad-btn-primary" onClick={handleNewSession}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>add</span>
            Nova Sessão
          </button>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="ad-bento-grid">
        <div className="ad-card-highlight">
          <div className="ad-card-highlight-bg">
            <img
              alt="close up of detailed black ink tattoo art"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcwMBoogvZI_cuzbWkJsJ-H3csKEkUzGPrTnBccbSByv9y0lN_JIf4HjArRRW1PQAT-pZgiG_ER61m0fY6Wxa5ueTP2zOCTYvsvcR4gWVxWrbyWahDzJK9FDiAN-8e5xzBBbk1VvX1UL3-AEDiZSwcZLR2y08Aa-O9kpnmRfDiWYOpH0X_yLWvrt27XW52E0qko1GBvirlrW1w9e6IuOchdJQVsaG8NkpqqsAkhJxbmVGh50QOQd-aWTWQLR_AYuQFIK-bUbPFvV8"
            />
            <div className="ad-card-highlight-overlay"></div>
          </div>
          <div className="ad-card-top">
            <span className="ad-card-label">Solicitações Pendentes</span>
            <span className="material-symbols-outlined ad-card-icon">pending_actions</span>
          </div>
          <div className="ad-card-bottom">
            <h3 className="ad-card-number">14</h3>
            <p className="ad-card-subtitle">+3 desde ontem</p>
          </div>
        </div>

        <div className="ad-card-regular">
          <div className="ad-card-top">
            <span className="ad-card-label">Confirmados</span>
            <span className="material-symbols-outlined ad-card-icon-muted">event_available</span>
          </div>
          <div>
            <h3 className="ad-card-number-md">28</h3>
            <p className="ad-card-subtitle-muted">Agenda Ativa</p>
          </div>
        </div>

        <div className="ad-card-regular">
          <div className="ad-card-top">
            <span className="ad-card-label">Mensal</span>
            <span className="material-symbols-outlined ad-card-icon-muted">check_circle</span>
          </div>
          <div>
            <h3 className="ad-card-number-md">42</h3>
            <p className="ad-card-subtitle-muted">Sessões Concluídas</p>
          </div>
        </div>

        <div className="ad-card-rating">
          <div className="ad-rating-left">
            <div className="ad-rating-score">4.9</div>
            <div>
              <div className="ad-rating-stars">
                {[1,2,3,4].map(i => (
                  <span key={i} className="material-symbols-outlined icon-filled">star</span>
                ))}
                <span className="material-symbols-outlined">star_half</span>
              </div>
              <p className="ad-rating-label">Avaliação Média do Artista</p>
            </div>
          </div>
          <div className="ad-rating-divider"></div>
          <div className="ad-rating-stats">
            <div className="ad-stat-item">
              <p className="ad-stat-value">128</p>
              <p className="ad-stat-label">Total de Avaliações</p>
            </div>
            <div className="ad-stat-item">
              <p className="ad-stat-value">98%</p>
              <p className="ad-stat-label">Satisfação</p>
            </div>
            <div className="ad-stat-item">
              <p className="ad-stat-value">12</p>
              <p className="ad-stat-label">Designs Salvos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Agenda */}
      <section className="ad-section">
        <div className="ad-section-header">
          <h2 className="ad-section-title">Agenda de Hoje</h2>
          <button className="ad-link-btn" onClick={(e) => handleActionBtn(e, 'Ver Agenda Completa')}>
            Ver Agenda Completa
          </button>
        </div>
        <div className="ad-agenda-scroll no-scrollbar">
          {todayAgenda.map((item) => (
            <div
              key={item.name}
              className="ad-agenda-card"
              onClick={(e) => handleActionBtn(e, `Ver Sessão: ${item.name}`)}
            >
              <div className="ad-agenda-time">
                <p className="ad-agenda-time-value">{item.time}</p>
                <p className="ad-agenda-time-period">{item.period}</p>
              </div>
              <div className={`ad-agenda-avatar ${item.primaryBorder ? 'primary-border' : ''}`}>
                <img src={item.img} alt={item.name} />
              </div>
              <div>
                <p className="ad-agenda-name">{item.name}</p>
                <p className="ad-agenda-desc">{item.desc}</p>
                <span className="ad-badge">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Inquiries Table */}
      <section className="ad-section">
        <div className="ad-section-header">
          <h2 className="ad-section-title">Solicitações Recentes</h2>
          <div className="ad-table-actions">
            <button className="ad-filter-btn" onClick={(e) => handleActionBtn(e, 'Filtros abertos')}>Filtrar</button>
            <button className="ad-filter-btn" onClick={(e) => handleActionBtn(e, 'Exportando dados...')}>Exportar</button>
          </div>
        </div>
        <div className="ad-table-wrapper">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Sessão</th>
                <th>Estilo / Área</th>
                <th className="text-center">Status</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.name} onClick={(e) => handleTableRowClick(e, row.name)}>
                  <td>
                    <div className="ad-client-cell">
                      <div className="ad-client-avatar">
                        <img src={row.img} alt={row.name} />
                      </div>
                      <div>
                        <p className="ad-client-name">{row.name}</p>
                        <p className="ad-client-email">{row.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="ad-session-date">{row.date}</p>
                    <p className="ad-session-time">{row.time}</p>
                  </td>
                  <td>
                    <p className="ad-style-name">{row.style}</p>
                    <p className="ad-style-area">{row.area}</p>
                  </td>
                  <td className="text-center">
                    <span className={`ad-badge ${row.badgeClass}`}>{row.status}</span>
                  </td>
                  <td className="text-right">
                    {row.hasPendingActions ? (
                      <div className="ad-row-actions">
                        <button className="ad-action-accept" onClick={(e) => handleAccept(e, row.name)}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>check</span>
                        </button>
                        <button className="ad-action-decline" onClick={(e) => handleDecline(e, row.name)}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>close</span>
                        </button>
                      </div>
                    ) : (
                      <button className="ad-more-btn" onClick={(e) => handleActionBtn(e, `Mais opções: ${row.name}`)}>
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default DashboardTab
