import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clienteService } from '../services/inkflowApi'
import './Login.css'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    nome: '',
    telefone: ''
  })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Login de admin
    if (isLogin && formData.email === 'admin@inkflow.com' && formData.senha === 'admin123') {
      localStorage.setItem('user', JSON.stringify({ 
        email: formData.email, 
        nome: 'Administrador',
        isAdmin: true 
      }))
      alert('Login de administrador realizado!')
      navigate('/admin')
      return
    }
    
    // Usuário de teste local
    if (isLogin && formData.email === 'teste@teste.com' && formData.senha === '123') {
      localStorage.setItem('user', JSON.stringify({ 
        id: 999,
        email: formData.email, 
        nome: 'Usuário Teste',
        isAdmin: false 
      }))
      alert('Login de teste realizado!')
      navigate('/agendamento')
      return
    }
    
    try {
      if (isLogin) {
        const response = await clienteService.getAll()
        const cliente = response.data.find(c => 
          c.email === formData.email && c.password === formData.senha
        )
        
        if (cliente) {
          localStorage.setItem('user', JSON.stringify({
            id: cliente.id,
            email: cliente.email,
            nome: cliente.fullName || cliente.username,
            isAdmin: false
          }))
          alert('Login realizado com sucesso!')
          navigate('/agendamento')
        } else {
          alert('Email ou senha incorretos!')
        }
      } else {
        // Validação dos campos obrigatórios
        if (!formData.nome || !formData.email || !formData.senha) {
          alert('Por favor, preencha todos os campos obrigatórios.')
          return
        }
        
        const novoCliente = {
          username: formData.email.split('@')[0],
          email: formData.email,
          password: formData.senha,
          fullName: formData.nome,
          telefone: formData.telefone
        }
        
        console.log('Dados sendo enviados:', novoCliente)
        const response = await clienteService.create(novoCliente)
        console.log('Resposta da API:', response)
        
        alert('Cadastro realizado com sucesso! Faça login para continuar.')
        setIsLogin(true)
        setFormData({ email: '', senha: '', nome: '', telefone: '' })
      }
    } catch (error) {
      console.error('Erro completo:', error)
      console.error('Resposta do erro:', error.response)
      if (isLogin) {
        alert('Erro ao fazer login. Verifique suas credenciais.')
      } else {
        if (error.response?.status === 400) {
          alert('Email já cadastrado!')
        } else if (error.response?.status === 409) {
          alert('Email já existe no sistema!')
        } else {
          alert(`Erro ao processar solicitação: ${error.response?.data?.message || error.message || 'Tente novamente.'}`)
        }
      }
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="login-page">
      <div className="login-header">
        <Link to="/" className="login-logo">INK FLOW</Link>
      </div>
      <div className="login-container">
        {/* Lado Esquerdo - Formulário */}
        <div className="login-left">
          <div className="login-form-wrapper">

            
            <div className="form-section">
              <h2 className="login-title">{isLogin ? 'Iniciar sessão' : 'Criar Conta'}</h2>
              
              {isLogin && (
                <div className="signup-link">
                  <span style={{color: 'white'}}>Não tem uma conta? </span>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); }}
                    className="link-text"
                  >
                    Crie uma conta.
                  </a>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="login-form">
                {!isLogin && (
                  <div className="form-group">
                    <label htmlFor="nome">Nome Completo</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" width="16" height="16">
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                          <g id="SVGRepo_iconCarrier">
                            <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                          </g>
                        </svg>
                      </span>
                      <input
                        id="nome"
                        type="text"
                        name="nome"
                        placeholder="Digite seu nome completo"
                        value={formData.nome}
                        onChange={handleChange}
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                        <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z" stroke="currentColor" strokeWidth="1.5"></path>
                        <path d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                      </svg>
                    </span>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Digite seu email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="senha">Senha</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                        <path d="M15.6807 14.5869C19.1708 14.5869 22 11.7692 22 8.29344C22 4.81767 19.1708 2 15.6807 2C12.1907 2 9.3615 4.81767 9.3615 8.29344C9.3615 9.90338 10.0963 11.0743 10.0963 11.0743L2.45441 18.6849C2.1115 19.0264 1.63143 19.9143 2.45441 20.7339L3.33616 21.6121C3.67905 21.9048 4.54119 22.3146 5.2466 21.6121L6.27531 20.5876C7.30403 21.6121 8.4797 21.0267 8.92058 20.4412C9.65538 19.4167 8.77362 18.3922 8.77362 18.3922L9.06754 18.0995C10.4783 19.5045 11.7128 18.6849 12.1537 18.0995C12.8885 17.075 12.1537 16.0505 12.1537 16.0505C11.8598 15.465 11.272 15.465 12.0067 14.7333L12.8885 13.8551C13.5939 14.4405 15.0439 14.5869 15.6807 14.5869Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"></path>
                        <path d="M17.8853 8.29353C17.8853 9.50601 16.8984 10.4889 15.681 10.4889C14.4635 10.4889 13.4766 9.50601 13.4766 8.29353C13.4766 7.08105 14.4635 6.09814 15.681 6.09814C16.8984 6.09814 17.8853 7.08105 17.8853 8.29353Z" stroke="currentColor" strokeWidth="1.5"></path>
                      </svg>
                    </span>
                    <input
                      id="senha"
                      type="password"
                      name="senha"
                      placeholder="Digite sua senha"
                      value={formData.senha}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                {!isLogin && (
                  <div className="form-group">
                    <label htmlFor="telefone">Telefone</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" width="18" height="18">
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                          <g id="SVGRepo_iconCarrier">
                            <path opacity="0.15" d="M6 5C6 3.89543 6.89543 3 8 3H16C17.1046 3 18 3.89543 18 5V19C18 20.1046 17.1046 21 16 21H8C6.89543 21 6 20.1046 6 19V5Z" fill="#ffffff"></path>
                            <path d="M12 18.01V18M8 3H16C17.1046 3 18 3.89543 18 5V19C18 20.1046 17.1046 21 16 21H8C6.89543 21 6 20.1046 6 19V5C6 3.89543 6.89543 3 8 3Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                          </g>
                        </svg>
                      </span>
                      <input
                        id="telefone"
                        type="tel"
                        name="telefone"
                        placeholder="Digite seu telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
                
                <button type="submit" className="login-btn">
                  {isLogin ? 'Entrar' : 'Criar Conta'}
                </button>
                
              </form>
              
              {!isLogin && (
                <div className="signup-link">
                  <span style={{color: 'white'}}>Já tem conta? </span>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); }}
                    className="link-text"
                  >
                    Faça login
                  </a>
                </div>
              )}
              

              
              {isLogin && (
                <div className="login-links">
                  <a href="#" className="link-text forgot-password">
                    Esqueceu sua senha?
                  </a>
                </div>
              )}
              
              {isLogin && (
                <div className="login-footer" style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: '#888' }}>
                  <p>Copyright © 2025 Ink Flow Studio. Ink Flow® é marca registrada do Ink Flow Studio.</p>
                  <div style={{ marginTop: '0.5rem' }}>
                    <a href="#" className="link-text" style={{ fontSize: '0.8rem', marginRight: '1rem' }}>Termos de Serviço</a>
                    <a href="#" className="link-text" style={{ fontSize: '0.8rem' }}>Política de Privacidade</a>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Lado Direito - Card Informativo */}
        <div className="login-right">
          <div className="info-card">
            <div className="card-image">
              <div className="tattoo-illustration">
                <svg viewBox="0 0 1024 1024" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#ff0000" stroke="#ff0000" width="48" height="48">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M512 301.2m-10 0a10 10 0 1 0 20 0 10 10 0 1 0-20 0Z" fill="#ff0400"></path>
                    <path d="M400.3 744.5c2.1-0.7 4.1-1.4 6.2-2-2 0.6-4.1 1.3-6.2 2z m0 0c2.1-0.7 4.1-1.4 6.2-2-2 0.6-4.1 1.3-6.2 2z" fill="#ff0000"></path>
                    <path d="M511.8 256.6c24.4 0 44.2 19.8 44.2 44.2S536.2 345 511.8 345s-44.2-19.8-44.2-44.2 19.9-44.2 44.2-44.2m0-20c-35.5 0-64.2 28.7-64.2 64.2s28.7 64.2 64.2 64.2 64.2-28.7 64.2-64.2-28.7-64.2-64.2-64.2z" fill="#ff0400"></path>
                    <path d="M730.7 529.5c0.4-8.7 0.6-17.4 0.6-26.2 0-179.6-86.1-339.1-219.3-439.5-133.1 100.4-219.2 259.9-219.2 439.5 0 8.8 0.2 17.5 0.6 26.1-56 56-90.6 133.3-90.6 218.7 0 61.7 18 119.1 49.1 167.3 30.3-49.8 74.7-90.1 127.7-115.3 39-18.6 82.7-29 128.8-29 48.3 0 93.9 11.4 134.3 31.7 52.5 26.3 96.3 67.7 125.6 118.4 33.4-49.4 52.9-108.9 52.9-173.1 0-85.4-34.6-162.6-90.5-218.6zM351.1 383.4c9.2-37.9 22.9-74.7 40.6-109.5a502.1 502.1 0 0 1 63.6-95.9c17.4-20.6 36.4-39.9 56.8-57.5 20.4 17.6 39.4 36.9 56.8 57.5 24.8 29.5 46.2 61.8 63.6 95.9 17.7 34.8 31.4 71.6 40.6 109.5 8.7 35.8 13.5 72.7 14.2 109.9C637.4 459 577 438.9 512 438.9c-65 0-125.3 20.1-175.1 54.4 0.7-37.2 5.5-74.1 14.2-109.9z m-90.6 449.2c-9.1-27-13.7-55.5-13.7-84.4 0-35.8 7-70.6 20.8-103.2 8.4-19.8 19-38.4 31.9-55.5 9.7 61.5 29.5 119.7 57.8 172.6-36.4 17.8-69 41.6-96.8 70.5z m364.2-85.3c-0.7-0.3-1.5-0.5-2.2-0.8-0.4-0.2-0.9-0.3-1.3-0.5-0.6-0.2-1.3-0.5-1.9-0.7-0.8-0.3-1.5-0.5-2.3-0.8-0.8-0.3-1.5-0.5-2.3-0.7l-0.9-0.3c-1-0.3-2.1-0.7-3.1-1-1.2-0.4-2.4-0.7-3.5-1.1l-3-0.9c-0.2-0.1-0.4-0.1-0.7-0.2-1.1-0.3-2.3-0.7-3.4-1-1.2-0.3-2.4-0.6-3.5-0.9l-3.6-0.9-3.6-0.9c-1-0.3-2.1-0.5-3.1-0.7-1.2-0.3-2.4-0.5-3.6-0.8-1.3-0.3-2.5-0.6-3.8-0.8h-0.3c-0.9-0.2-1.9-0.4-2.8-0.6-0.4-0.1-0.7-0.1-1.1-0.2-1.1-0.2-2.2-0.4-3.4-0.6-1.2-0.2-2.4-0.4-3.6-0.7l-5.4-0.9c-0.9-0.1-1.9-0.3-2.8-0.4-0.8-0.1-1.6-0.3-2.5-0.4-2.6-0.4-5.1-0.7-7.7-1-1.2-0.1-2.3-0.3-3.5-0.4h-0.4c-0.9-0.1-1.8-0.2-2.8-0.3-1.1-0.1-2.1-0.2-3.2-0.3-1.7-0.2-3.4-0.3-5.1-0.4-0.8-0.1-1.5-0.1-2.3-0.2-0.9-0.1-1.9-0.1-2.8-0.2-0.4 0-0.8 0-1.2-0.1-1.1-0.1-2.1-0.1-3.2-0.2-0.5 0-1-0.1-1.5-0.1-1.3-0.1-2.6-0.1-3.9-0.1-0.8 0-1.5-0.1-2.3-0.1-1.2 0-2.4 0-3.5-0.1h-13.9c-2.3 0-4.6 0.1-6.9 0.2-0.9 0-1.9 0.1-2.8 0.1-0.8 0-1.5 0.1-2.3 0.1-1.4 0.1-2.8 0.2-4.1 0.3-1.4 0.1-2.7 0.2-4.1 0.3-1.4 0.1-2.7 0.2-4.1 0.4-0.6 0-1.2 0.1-1.8 0.2l-7.8 0.9c-1.1 0.1-2.1 0.3-3.2 0.4-1 0.1-2.1 0.3-3.1 0.4-3.2 0.5-6.4 0.9-9.5 1.5-0.7 0.1-1.4 0.2-2.1 0.4-0.9 0.1-1.7 0.3-2.6 0.5-1.1 0.2-2.3 0.4-3.4 0.6-0.9 0.2-1.7 0.3-2.6 0.5-0.4 0.1-0.8 0.1-1.1 0.2-0.7 0.1-1.4 0.3-2.1 0.4-1.2 0.3-2.4 0.5-3.6 0.8-1.2 0.3-2.4 0.5-3.6 0.8-0.2 0-0.4 0.1-0.6 0.1-0.5 0.1-1 0.2-1.5 0.4-1.1 0.3-2.3 0.6-3.5 0.9-1.3 0.3-2.5 0.6-3.8 1-0.4 0.1-0.9 0.2-1.4 0.4-1.3 0.4-2.7 0.7-4 1.1-1.5 0.4-3 0.9-4.6 1.3-1 0.3-2.1 0.6-3.1 1-2.1 0.6-4.1 1.3-6.2 2-0.7 0.2-1.4 0.5-2.1 0.7-15-27.5-27.4-56.4-37-86.2-11.7-36.1-19.2-73.6-22.5-111.6-0.6-6.7-1-13.3-1.3-20-0.1-1.2-0.1-2.4-0.1-3.6-0.1-1.2-0.1-2.4-0.1-3.6 0-1.2-0.1-2.4-0.1-3.6 0-1.2-0.1-2.4-0.1-3.7 18.8-14 39.2-25.8 61-35 36.1-15.3 74.5-23 114.1-23 39.6 0 78 7.8 114.1 23 21.8 9.2 42.2 20.9 61 35v0.1c0 1 0 1.9-0.1 2.9 0 1.4-0.1 2.8-0.1 4.3 0 0.7 0 1.3-0.1 2-0.1 1.8-0.1 3.5-0.2 5.3-0.3 6.7-0.8 13.3-1.3 20-3.3 38.5-11 76.5-23 113-9.7 30.3-22.3 59.4-37.6 87.1z m136.8 90.9a342.27 342.27 0 0 0-96.3-73.2c29.1-53.7 49.5-112.8 59.4-175.5 12.8 17.1 23.4 35.6 31.8 55.5 13.8 32.7 20.8 67.4 20.8 103.2 0 31-5.3 61.3-15.7 90z" fill="#ff0000"></path>
                    <path d="M512 819.3c8.7 0 24.7 22.9 24.7 60.4s-16 60.4-24.7 60.4-24.7-22.9-24.7-60.4 16-60.4 24.7-60.4m0-20c-24.7 0-44.7 36-44.7 80.4 0 44.4 20 80.4 44.7 80.4s44.7-36 44.7-80.4c0-44.4-20-80.4-44.7-80.4z" fill="#ff0400"></path>
                  </g>
                </svg>
              </div>
            </div>
            <div className="card-content">
              <h3>Bem-vindo ao Ink Flow</h3>
              <p>Transforme sua paixão por tatuagem em arte. Nosso estúdio oferece um ambiente profissional e criativo, com artistas experientes especializados em diversos estilos. Desde tatuagens realistas até designs minimalistas, criamos obras únicas que contam sua história. Agende seu horário e explore nossos serviços exclusivos de tatuagem, piercing e arte corporal.</p>
              <div className="info-links">
                <Link to="/portfolio" className="info-link">Ver Portfólio</Link>
                <Link to="/services" className="info-link">Nossos Serviços</Link>
                <Link to="/about" className="info-link">Sobre o Estúdio</Link>
                <Link to="/contact" className="info-link">Contato</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login