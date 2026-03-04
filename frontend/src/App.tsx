import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Breathing from './pages/Breathing'
import InsightsOverview from './pages/InsightsOverview'
import ForestBathing from './pages/ForestBathing'
import Habits from './pages/Habits'              // ✅ Kaizen Habits page
import SleepInsights from './pages/SleepInsights' // ✅ Sleep Insights page
import { ProtectedRoute } from './components/ProtectedRoute'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/breathing"
          element={
            <ProtectedRoute>
              <Breathing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forest"
          element={
            <ProtectedRoute>
              <ForestBathing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits"
          element={
            <ProtectedRoute>
              <Habits />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sleep"
          element={
            <ProtectedRoute>
              <SleepInsights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insights/:period"
          element={
            <ProtectedRoute>
              <InsightsOverview />
            </ProtectedRoute>
          }
        />
        <Route path="/insights" element={<Navigate to="/insights/week" replace />} />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <Toaster position="top-right" theme="dark" richColors />
    </BrowserRouter>
  )
}

export default App