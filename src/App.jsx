import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Booking from './pages/Booking'
import AdminDashboard from './pages/AdminDashboard'
import Profile from './pages/Profile'
import ArtistDashboard from './pages/ArtistDashboard'
import Artists from './pages/Artists'
import ArtistProfile from './pages/ArtistProfile'
import ArtistLandingPage from './pages/ArtistLandingPage/ArtistLandingPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

const ProtectedRoute = ({ element, allowedTypes }) => {
  const { user, userType, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!allowedTypes.includes(userType)) return <Navigate to="/" replace />
  return element
}

// Redireciona artistas e admins logados para seus painéis em qualquer rota pública
const RoleGuard = ({ children }) => {
  const { user, userType, loading } = useAuth()
  const { pathname } = useLocation()

  if (loading) return null

  const isLoginPage = pathname === '/login'

  if (user && userType === 'artist' && pathname !== '/artist-dashboard' && !isLoginPage) {
    return <Navigate to="/artist-dashboard" replace />
  }

  if (user && userType === 'admin' && pathname !== '/admin' && !isLoginPage) {
    return <Navigate to="/admin" replace />
  }

  return children
}

function AppContent() {
  const location = useLocation()
  const isLoginPage       = location.pathname === '/login'
  const isArtistDashboard = location.pathname === '/artist-dashboard'
  const isAdminDashboard  = location.pathname === '/admin'
  const hideShell = isLoginPage || isArtistDashboard || isAdminDashboard

  return (
    <div className="App">
      <ScrollToTop />
      {!hideShell && <Header />}
      <main>
        <Routes>
          {/* Rotas públicas — protegidas pelo RoleGuard */}
          <Route path="/" element={<RoleGuard><Home /></RoleGuard>} />
          <Route path="/sobre" element={<RoleGuard><About /></RoleGuard>} />
          <Route path="/portfolio" element={<RoleGuard><Portfolio /></RoleGuard>} />
          <Route path="/servicos" element={<RoleGuard><Services /></RoleGuard>} />
          <Route path="/contato" element={<RoleGuard><Contact /></RoleGuard>} />
          <Route path="/agendamento" element={<RoleGuard><Booking /></RoleGuard>} />
          <Route path="/artistas" element={<RoleGuard><Artists /></RoleGuard>} />
          <Route path="/artista/:id" element={<RoleGuard><ArtistProfile /></RoleGuard>} />
          <Route path="/para-tatuadores" element={<RoleGuard><ArtistLandingPage /></RoleGuard>} />

          {/* Login — sem guard (artista precisa acessar para logar) */}
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas */}
          <Route path="/admin" element={
            <ProtectedRoute allowedTypes={['admin']} element={<AdminDashboard />} />
          } />
          <Route path="/artist-dashboard" element={
            <ProtectedRoute allowedTypes={['artist']} element={<ArtistDashboard />} />
          } />
          <Route path="/perfil" element={
            <ProtectedRoute allowedTypes={['client']} element={<Profile />} />
          } />

          {/* Catch-all: redireciona URLs inválidas para Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideShell && <Footer />}
      {!hideShell && <Chatbot />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  )
}

export default App
