import { useState } from 'react'

const RequestsTab = ({ showToast }) => {
  const [filter, setFilter] = useState('all')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerClient, setDrawerClient] = useState(null)

  const rows = [
    {
      id: 1, name: 'Mariana Silva', handle: '@mari_art', status: 'pendente',
      date: '24 Out, 2023', time: '14:30', style: 'Blackwork Geometric', area: 'Antebraço Direito',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZmY1JVWwwDdgPXWpV4BYCumkOL5NaNb4TWuYe5ERwtpHvZaIlMsK30oRFLWRcmGa415b-YS31r0BkutvAUs0ZVjevXtFQfoK4Yrw9cFmW6WslS1MNDuF5NEfOSFFFYq67-Q02LGP4UapkjoA1KdH4mfXAiBlPSEfhD0XPNzyzfrtOBf-DjFgpn2QAvvXFcyWZxM8Qw1Kl_fb24b5RegjeQqkwpIOIGGMfbNWhJnWyzhwqfExYQGj04VUzHRDy1j4SWFx3aFOHhbo',
      drawerImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALjP5C_VoOFNDzZZ5U1gZXVpT4VmTFvdCTd_x7EHP0bI2bivR1qhNsXTqERWrRuz9B6w0XDGNb6kGafNLtGH_Z088wofDyCauei2MCuRFd1vb66NzKHJS6rWol3jbIcbwVuzqHy46mj5U-VPrXn6EAnJmkTe2k6UK5uaaGRZJAjhS4BXE0YBGbDddOKmXb6rjeozj3-NMvO86MgY5DdQ3Wmnl9dQbiZFrM9Z4gQsP8_OzbUnlX7oRyQJPM95GOw5zrl22Uo-VD0O8',
      refImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGylAVG9dB3gVfnI_Du5xI_UbukzL5e3APUjuEHq4nMm7L1Je5uL6Qq_fFMYlSnO4dbhUxYeurVmydQ07r7yL7R59qPllkT50ojSN2mrAjzQl1H1l-D2nTnhSynhmVJAjI2TrcMWJcdASDfD-qBslhLmFDU42406qd2S3RrRHtJp9IXtWWFT3rkir-BZLE9KS5CTihO4Xq1NY4d6UwH1qWqrUtKzBphNIB2nKfmMx2wq5DkZ2QNOK3FcNzwZXrjYvojM48Zkhchck',
      description: '"Gostaria de uma mariposa em estilo Fine Line com elementos geométricos (círculos e linhas finas) ao redor. O local seria o antebraço direito, cobrindo uma pequena cicatriz."',
      size: '15x10cm', region: 'Antebraço',
      fullDate: '24 de Outubro, 2023', weekday: 'Terça-feira',
      tags: [{ label: 'First-timer', color: 'primary' }, { label: 'Colorwork', color: 'purple' }],
    },
    {
      id: 2, name: 'Ricardo Mendes', handle: '@rick_tattoo', status: 'confirmado',
      date: '25 Out, 2023', time: '10:00', style: 'Realismo', area: 'Costas',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBpiQdOdevxRaj1fzoEHKXv5de-nvDd3sQIvzY4euKSfEXCwrAHGtQv2n-dm_zp8_0GbsQGfRWepYRMPpWHluvsql9r1eEvl-uuSC2SGpXKBjcjMhdic3xoh4WHN31Gbvdm27BxGMu1UGE3UdA3JGYe03zsKk9MbkPgszwFBl9AobPF1vDTkrVtquGKTB1ymWXkJZ7MZoQeth7cVM6jz-rlI92AMWVrLw5Z7VSizzs9d0gMwfvth1wqDtJDwLIP8B48CqQuGoG6Ok',
      drawerImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALjP5C_VoOFNDzZZ5U1gZXVpT4VmTFvdCTd_x7EHP0bI2bivR1qhNsXTqERWrRuz9B6w0XDGNb6kGafNLtGH_Z088wofDyCauei2MCuRFd1vb66NzKHJS6rWol3jbIcbwVuzqHy46mj5U-VPrXn6EAnJmkTe2k6UK5uaaGRZJAjhS4BXE0YBGbDddOKmXb6rjeozj3-NMvO86MgY5DdQ3Wmnl9dQbiZFrM9Z4gQsP8_OzbUnlX7oRyQJPM95GOw5zrl22Uo-VD0O8',
      refImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGylAVG9dB3gVfnI_Du5xI_UbukzL5e3APUjuEHq4nMm7L1Je5uL6Qq_fFMYlSnO4dbhUxYeurVmydQ07r7yL7R59qPllkT50ojSN2mrAjzQl1H1l-D2nTnhSynhmVJAjI2TrcMWJcdASDfD-qBslhLmFDU42406qd2S3RrRHtJp9IXtWWFT3rkir-BZLE9KS5CTihO4Xq1NY4d6UwH1qWqrUtKzBphNIB2nKfmMx2wq5DkZ2QNOK3FcNzwZXrjYvojM48Zkhchck',
      description: '"Retrato realista do meu pet em preto e cinza, com sombreamento suave. Tenho fotos em alta resolução."',
      size: '25x20cm', region: 'Costas',
      fullDate: '25 de Outubro, 2023', weekday: 'Quarta-feira',
      tags: [{ label: 'Retorno', color: 'primary' }],
    },
    {
      id: 3, name: 'Fernanda Costa', handle: '@nanda_c', status: 'cancelado',
      date: '26 Out, 2023', time: '18:00', style: 'Fine Line', area: 'Costelas',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2EWVgd1KciAtFFSRES0ekHmpRspk8pac-H4LQ9oVeCqsA1-hdqI7vSu3-SYsVHpT1Ux_01dzmLo5iSRKQYEqJMqYJNvWETZq8rMi6IGCfjFwLSubav9p0hy5j_9mlK5wVJe_7hT7IeZQr68tNNIBqUAhWuwxzpPcwVagbZIeuxrlaWZkkhNIwOX8CAImGjGDRH54axZwwidDJYccBRnqj6LaM9Se9i0fiIam0oh53VTmZtPAZAma8AFBdbbuaIbdWDApHW-CiWEY',
      drawerImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALjP5C_VoOFNDzZZ5U1gZXVpT4VmTFvdCTd_x7EHP0bI2bivR1qhNsXTqERWrRuz9B6w0XDGNb6kGafNLtGH_Z088wofDyCauei2MCuRFd1vb66NzKHJS6rWol3jbIcbwVuzqHy46mj5U-VPrXn6EAnJmkTe2k6UK5uaaGRZJAjhS4BXE0YBGbDddOKmXb6rjeozj3-NMvO86MgY5DdQ3Wmnl9dQbiZFrM9Z4gQsP8_OzbUnlX7oRyQJPM95GOw5zrl22Uo-VD0O8',
      refImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGylAVG9dB3gVfnI_Du5xI_UbukzL5e3APUjuEHq4nMm7L1Je5uL6Qq_fFMYlSnO4dbhUxYeurVmydQ07r7yL7R59qPllkT50ojSN2mrAjzQl1H1l-D2nTnhSynhmVJAjI2TrcMWJcdASDfD-qBslhLmFDU42406qd2S3RrRHtJp9IXtWWFT3rkir-BZLE9KS5CTihO4Xq1NY4d6UwH1qWqrUtKzBphNIB2nKfmMx2wq5DkZ2QNOK3FcNzwZXrjYvojM48Zkhchck',
      description: '"Quero uma frase em letra cursiva fina na costela. Algo minimalista e delicado."',
      size: '12x3cm', region: 'Costelas',
      fullDate: '26 de Outubro, 2023', weekday: 'Quinta-feira',
      tags: [{ label: 'First-timer', color: 'primary' }],
    },
  ]

  const statusConfig = {
    pendente: { label: 'PENDENTE', badgeClass: 'ad-badge-yellow' },
    confirmado: { label: 'CONFIRMADO', badgeClass: 'ad-badge-green' },
    cancelado: { label: 'CANCELADO', badgeClass: 'ad-badge-red' },
  }

  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'pendente', label: 'Pendente' },
    { key: 'confirmado', label: 'Confirmado' },
    { key: 'cancelado', label: 'Cancelado' },
  ]

  const filteredRows = filter === 'all' ? rows : rows.filter(r => r.status === filter)

  const handleAccept = (e, row) => {
    e.stopPropagation()
    showToast(`Solicitação de ${row.name} confirmada!`)
  }

  const handleDecline = (e, row) => {
    e.stopPropagation()
    showToast(`Solicitação de ${row.name} recusada.`, true)
  }

  const handleOptions = (e, row) => {
    e.stopPropagation()
    showToast(`Abrindo opções para ${row.name}`)
  }

  const handleRowClick = (e, row) => {
    if (e.target.closest('button')) return
    setDrawerClient(row)
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => setDrawerClient(null), 300)
  }

  const handleDrawerAccept = () => {
    showToast(`Solicitação de ${drawerClient.name} Aceita!`)
    closeDrawer()
  }

  const handleDrawerDecline = () => {
    showToast(`Solicitação de ${drawerClient.name} Recusada.`, true)
    closeDrawer()
  }

  return (
    <>
      {/* Page Header & Filters */}
      <div className="ad-req-page-header">
        <h1 className="ad-req-title">Solicitações</h1>
        <div className="ad-req-filters">
          {filters.map(f => (
            <button
              key={f.key}
              className={`ad-req-filter-btn ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="ad-req-table-container">
        <table className="ad-req-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Data e Hora</th>
              <th>Tipo de Tattoo</th>
              <th>Região</th>
              <th>Status</th>
              <th className="ad-req-th-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map(row => (
              <tr
                key={row.id}
                className="ad-req-row"
                onClick={(e) => handleRowClick(e, row)}
              >
                <td>
                  <div className="ad-req-client-cell">
                    <div className="ad-req-client-img">
                      <img src={row.img} alt={row.name} />
                    </div>
                    <div>
                      <p className="ad-req-client-name">{row.name}</p>
                      <p className="ad-req-client-handle">{row.handle}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p className="ad-req-date">{row.date}</p>
                  <p className="ad-req-time">{row.time}</p>
                </td>
                <td>
                  <span className="ad-req-style-tag">{row.style}</span>
                </td>
                <td className="ad-req-area">{row.area}</td>
                <td>
                  <span className={`ad-badge ${statusConfig[row.status].badgeClass}`}>
                    {statusConfig[row.status].label}
                  </span>
                </td>
                <td className="ad-req-td-right">
                  <div className="ad-req-actions">
                    {row.status === 'pendente' ? (
                      <>
                        <button className="ad-req-action-accept" onClick={(e) => handleAccept(e, row)}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>check</span>
                        </button>
                        <button className="ad-req-action-decline" onClick={(e) => handleDecline(e, row)}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>close</span>
                        </button>
                      </>
                    ) : (
                      <button className="ad-req-action-options" onClick={(e) => handleOptions(e, row)}>
                        <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>more_vert</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Drawer */}
      {drawerOpen && drawerClient && (
        <>
          <div className="ad-req-drawer-backdrop" onClick={closeDrawer}></div>
          <aside className="ad-req-drawer">
            <div className="ad-req-drawer-body no-scrollbar">
              {/* Drawer Header */}
              <div className="ad-req-drawer-header">
                <div className="ad-req-drawer-client">
                  <div className="ad-req-drawer-avatar">
                    <img src={drawerClient.drawerImg} alt={drawerClient.name} />
                  </div>
                  <div>
                    <h3 className="ad-req-drawer-name">{drawerClient.name}</h3>
                    <div className="ad-req-drawer-tags">
                      {drawerClient.tags.map((tag, i) => (
                        <span
                          key={i}
                          className={`ad-req-drawer-tag ${tag.color === 'purple' ? 'purple' : ''}`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="ad-req-drawer-close" onClick={closeDrawer}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Tattoo Details */}
              <div className="ad-req-drawer-content">
                <section>
                  <h4 className="ad-req-drawer-section-title">Referência e Descrição</h4>
                  <div className="ad-req-drawer-ref-img">
                    <img src={drawerClient.refImg} alt="Referência" />
                  </div>
                  <p className="ad-req-drawer-description">{drawerClient.description}</p>
                </section>

                <div className="ad-req-drawer-specs">
                  <div className="ad-req-drawer-spec">
                    <h5 className="ad-req-drawer-spec-label">Tamanho</h5>
                    <p className="ad-req-drawer-spec-value">{drawerClient.size}</p>
                  </div>
                  <div className="ad-req-drawer-spec">
                    <h5 className="ad-req-drawer-spec-label">Região</h5>
                    <p className="ad-req-drawer-spec-value">{drawerClient.region}</p>
                  </div>
                </div>

                <section>
                  <h4 className="ad-req-drawer-section-title">Informações do Agendamento</h4>
                  <div className="ad-req-drawer-schedule">
                    <div className="ad-req-drawer-schedule-left">
                      <span className="material-symbols-outlined" style={{ color: 'var(--ad-primary)' }}>calendar_today</span>
                      <div>
                        <p className="ad-req-drawer-schedule-date">{drawerClient.fullDate}</p>
                        <p className="ad-req-drawer-schedule-weekday">{drawerClient.weekday}</p>
                      </div>
                    </div>
                    <div className="ad-req-drawer-schedule-right">
                      <p className="ad-req-drawer-schedule-date">{drawerClient.time}</p>
                      <p className="ad-req-drawer-schedule-weekday">Horário</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="ad-req-drawer-footer">
              <button className="ad-req-drawer-btn-decline" onClick={handleDrawerDecline}>
                Recusar
              </button>
              <button className="ad-req-drawer-btn-accept" onClick={handleDrawerAccept}>
                Aceitar &amp; Cotar
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  )
}

export default RequestsTab
