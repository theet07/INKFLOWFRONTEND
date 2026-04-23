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

// Redireciona artistas logados para o dashboard em qualquer rota pública
const ArtistGuard = ({ children }) => {
  const { user, userType, loading } = useAuth()
  const { pathname } = useLocation()

  if (loading) return null

  const isArtistArea = pathname === '/artist-dashboard'
  const isLoginPage  = pathname === '/login'

  if (user && userType === 'artist' && !isArtistArea && !isLoginPage) {
    return <Navigate to="/artist-dashboard" replace />
  }

  return children
}

function AppContent() {
  const location = useLocation()
  const isLoginPage       = location.pathname === '/login'
  const isArtistDashboard = location.pathname === '/artist-dashboard'
  const hideShell = isLoginPage || isArtistDashboard

  return (
    <div className="App">
      <ScrollToTop />
      {!hideShell && <Header />}
      <main>
        <Routes>
          {/* Rotas públicas — protegidas pelo ArtistGuard */}
          <Route path="/" element={<ArtistGuard><Home /></ArtistGuard>} />
          <Route path="/sobre" element={<ArtistGuard><About /></ArtistGuard>} />
          <Route path="/portfolio" element={<ArtistGuard><Portfolio /></ArtistGuard>} />
          <Route path="/servicos" element={<ArtistGuard><Services /></ArtistGuard>} />
          <Route path="/contato" element={<ArtistGuard><Contact /></ArtistGuard>} />
          <Route path="/agendamento" element={<ArtistGuard><Booking /></ArtistGuard>} />
          <Route path="/artistas" element={<ArtistGuard><Artists /></ArtistGuard>} />
          <Route path="/artista/:id" element={<ArtistGuard><ArtistProfile /></ArtistGuard>} />
          <Route path="/para-tatuadores" element={<ArtistGuard><ArtistLandingPage /></ArtistGuard>} />

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
