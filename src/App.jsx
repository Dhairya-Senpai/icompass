import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from '@/store'
import { RolePicker } from '@/components/RolePicker'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { InterviewsPage } from '@/components/interviews/InterviewsPage'
import { CoursesPage } from '@/components/courses/CoursesPage'
import { HypothesisPage } from '@/components/ai/HypothesisPage'
import { AnalysisPage } from '@/components/ai/AnalysisPage'
import { TeamsPage } from '@/components/teams/TeamsPage'
import { SettingsPage } from '@/components/admin/SettingsPage'

export default function App() {
  const role = useStore(s => s.role)

  return (
    <Routes>
      {/* Public — role picker */}
      <Route
        path="/"
        element={role ? <Navigate to="/dashboard" replace /> : <RolePicker />}
      />

      {/* Protected — all app routes inside AppShell */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard"     element={<Dashboard />} />
        <Route path="/interviews"    element={<InterviewsPage />} />
        <Route path="/courses"       element={<CoursesPage />} />
        <Route path="/ai/hypothesis" element={<HypothesisPage />} />
        <Route path="/ai/analysis"   element={<AnalysisPage />} />
        <Route path="/teams"         element={<TeamsPage />} />
        <Route path="/settings"      element={<SettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
