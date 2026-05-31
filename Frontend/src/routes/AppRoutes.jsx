import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { BudgetProvider } from '../context/BudgetContext.jsx'
import { AuthProvider } from '../context/AuthContext.jsx'
import { NotificationProvider } from '../context/NotificationContext.jsx'
import MainLayout from '../layouts/MainLayout.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import LandingPage from '../pages/LandingPage.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Analytics from '../pages/Analytics.jsx'
import Projects from '../pages/Projects.jsx'
import ProjectDetails from '../pages/ProjectDetails.jsx'
import MapViewPage from '../pages/MapViewPage.jsx'
import ReportPage from '../pages/ReportPage.jsx'
import ChatbotPage from '../pages/ChatbotPage.jsx'
import AdminDashboard from '../pages/AdminDashboard.jsx'
import NotificationsPage from '../pages/NotificationsPage.jsx'
import SettingsPage from '../pages/SettingsPage.jsx'
import PrivateRoute from '../components/PrivateRoute.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import RegisterPage from '../pages/auth/RegisterPage.jsx'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <BudgetProvider>
            <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="map" element={<MapViewPage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="chat" element={<ChatbotPage />} />
          <Route
            path="admin"
            element={
              <PrivateRoute allowedRoles={[ 'Admin' ]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="notifications"
            element={
              <PrivateRoute allowedRoles={[ 'Admin' ]}>
                <NotificationsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="settings"
            element={
              <PrivateRoute allowedRoles={[ 'Admin' ]}>
                <SettingsPage />
              </PrivateRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BudgetProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default AppRoutes
