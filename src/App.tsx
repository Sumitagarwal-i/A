
import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { FeedbackProvider } from './contexts/FeedbackContext'
import { AuthGuard } from './components/AuthGuard'
import { LoadingSpinner } from './components/LoadingSpinner'
// Lazy load route-level components using default export
const Landing = React.lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })))
const Login = React.lazy(() => import('./pages/Login').then(m => ({ default: m.Login })))
const AppPage = React.lazy(() => import('./pages/App').then(m => ({ default: m.App })))
const BriefDetail = React.lazy(() => import('./pages/BriefDetail').then(m => ({ default: m.BriefDetail })))
const Analytics = React.lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })))
const Outreach = React.lazy(() => import('./pages/Outreach').then(m => ({ default: m.Outreach })))
const Settings = React.lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })))
const Contact = React.lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })))
const Help = React.lazy(() => import('./pages/Help').then(m => ({ default: m.Help })))
const Pricing = React.lazy(() => import('./pages/Pricing').then(m => ({ default: m.Pricing })))
const Docs = React.lazy(() => import('./pages/Docs').then(m => ({ default: m.Docs })))
const Updates = React.lazy(() => import('./pages/Updates'));
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <FeedbackProvider>
          <Router>
            <Suspense fallback={<LoadingSpinner />}>
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
              <Route path="/outreach" element={
                <AuthGuard>
                  <Outreach />
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
            </Suspense>
          </Router>
        </FeedbackProvider>
      </ThemeProvider>
      <VercelAnalytics/>
      <SpeedInsights/>
    </AuthProvider>
  )
}

export default App
