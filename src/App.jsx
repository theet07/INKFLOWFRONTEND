import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'

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

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function AppContent() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  const isArtistDashboard = location.pathname === '/artist-dashboard'
  const hideShell = isLoginPage || isArtistDashboard

  return (
    <div className="App">
      <ScrollToTop />
      {!hideShell && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/servicos" element={<Services />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/agendamento" element={<Booking />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/artist-dashboard" element={<ArtistDashboard />} />
          <Route path="/artistas" element={<Artists />} />
          <Route path="/artista/:id" element={<ArtistProfile />} />
          <Route path="/para-tatuadores" element={<ArtistLandingPage />} />
        </Routes>
      </main>
      {!hideShell && <Footer />}
      {!hideShell && <Chatbot />}

    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App