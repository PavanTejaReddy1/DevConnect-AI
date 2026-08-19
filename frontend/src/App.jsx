import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import GuestRoute from './routes/GuestRoute.jsx';
import DashboardLayout from './components/dashboard/DashboardLayout.jsx';
import NotFound from './pages/Error/NotFound.jsx';
import ServerError from './pages/Error/ServerError.jsx';

// Landing
import LandingPage from './pages/Landing/LandingPage.jsx';

// Auth
import LoginPage from './pages/Auth/LoginPage.jsx';
import SignupPage from './pages/Auth/SignupPage.jsx';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage.jsx';

// Dashboard
import DashboardHome from './pages/Dashboard/DashboardHome.jsx';

// Projects
import ProjectsPage from './pages/Projects/ProjectsPage.jsx';

// Profile
import ProfileOverview from './pages/Profile/ProfileOverview.jsx';
import EditProfile from './pages/Profile/EditProfile.jsx';
import PublicProfile from './pages/Profile/PublicProfile.jsx';

// Teams
import TeamsList from './pages/Team/TeamsList.jsx';
import CreateTeam from './pages/Team/CreateTeam.jsx';
import TeamDetail from './pages/Team/TeamDetail.jsx';

// Kanban
import KanbanBoardPage from './pages/Kanban/KanbanBoard.jsx';

// Chat
import ChatPage from './pages/Chat/Chat.jsx';

// Admin
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import AdminUsers from './pages/Admin/AdminUsers.jsx';
import AdminProjects from './pages/Admin/AdminProjects.jsx';
import AdminTeams from './pages/Admin/AdminTeams.jsx';
import AdminSettings from './pages/Admin/AdminSettings.jsx';

// Notifications
import NotificationsPage from './pages/Notifications/Notifications.jsx';

// Settings
import SettingsLayout from './components/settings/SettingsLayout.jsx';
import AccountSettings from './pages/Settings/Account.jsx';
import SecuritySettings from './pages/Settings/Security.jsx';
import AppearanceSettings from './pages/Settings/Appearance.jsx';
import NotificationSettings from './pages/Settings/Notifications.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />

      {/* Guest only (auth pages) */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      {/* Authenticated (any role) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/profile" element={<ProfileOverview />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/teams" element={<TeamsList />} />
          <Route path="/teams/create" element={<CreateTeam />} />
          <Route path="/teams/:id" element={<TeamDetail />} />
          <Route path="/kanban" element={<KanbanBoardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/messages" element={<ChatPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      {/* Public Profile */}
      <Route path="/u/:username" element={<PublicProfile />} />

      {/* Admin only */}
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/teams" element={<AdminTeams />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* Settings */}
      <Route element={<ProtectedRoute />}>
        <Route element={<SettingsLayout />}>
          <Route path="/settings" element={<AccountSettings />} />
          <Route path="/settings/account" element={<AccountSettings />} />
          <Route path="/settings/security" element={<SecuritySettings />} />
          <Route path="/settings/appearance" element={<AppearanceSettings />} />
          <Route path="/settings/notifications" element={<NotificationSettings />} />
        </Route>
      </Route>

      {/* Error Pages */}
      <Route path="/404" element={<NotFound />} />
      <Route path="/500" element={<ServerError />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
