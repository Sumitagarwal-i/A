import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { FeedbackProvider } from './contexts/FeedbackContext'
import { AuthGuard } from './components/AuthGuard'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { App as AppPage } from './pages/App'
import { BriefDetail } from './pages/BriefDetail'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'
import { Contact } from './pages/Contact'
import { Help } from './pages/Help'
import { Pricing } from './pages/Pricing'
import { Docs } from './pages/Docs'
import Updates from './pages/Updates'
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <FeedbackProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/app" element={<AppPage />} />
              <Route path="/brief/:id" element={
                <AuthGuard>
                  <BriefDetail />
                </AuthGuard>
              } />
              <Route path="/analytics" element={
                <AuthGuard>
                  <Analytics />
                </AuthGuard>
              } />
              <Route path="/settings" element={
                <AuthGuard>
                  <Settings />
                </AuthGuard>
              } />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/updates" element={<Updates />} />
            </Routes>
          </Router>
        </FeedbackProvider>
      </ThemeProvider>
      <VercelAnalytics/>
      <SpeedInsights/>
    </AuthProvider>
  )
}

export default App