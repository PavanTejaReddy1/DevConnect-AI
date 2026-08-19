import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RouteLoader from './components/common/RouteLoader.jsx';

import LandingPage from './pages/Landing/LandingPage.jsx';
import LoginPage from './pages/Auth/LoginPage.jsx';
import SignupPage from './pages/Auth/SignupPage.jsx';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const DashboardLayout = lazy(() => import('./layouts/DashboardLayout.jsx'));

const DashboardHome = lazy(() => import('./pages/Dashboard/DashboardHome.jsx'));
const ProfilePage = lazy(() => import('./pages/Dashboard/ProfilePage.jsx'));
const ProjectsPage = lazy(() => import('./pages/Dashboard/ProjectsPage.jsx'));
const ProjectDetailPage = lazy(() => import('./pages/Dashboard/ProjectDetailPage.jsx'));
const TeamsPage = lazy(() => import('./pages/Dashboard/TeamsPage.jsx'));
const TeamDetailPage = lazy(() => import('./pages/Dashboard/TeamDetailPage.jsx'));
const MessagesPage = lazy(() => import('./pages/Dashboard/MessagesPage.jsx'));
const TasksPage = lazy(() => import('./pages/Dashboard/TasksPage.jsx'));
const NotificationsPage = lazy(() => import('./pages/Dashboard/NotificationsPage.jsx'));
const SettingsPage = lazy(() => import('./pages/Dashboard/SettingsPage.jsx'));

export default function App() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Authenticated (any role) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route path="/dashboard/projects" element={<ProjectsPage />} />
            <Route path="/dashboard/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/dashboard/teams" element={<TeamsPage />} />
            <Route path="/dashboard/teams/:id" element={<TeamDetailPage />} />
            <Route path="/dashboard/messages" element={<MessagesPage />} />
            <Route path="/dashboard/tasks" element={<TasksPage />} />
            <Route path="/dashboard/notifications" element={<NotificationsPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* 404 — must be last */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
