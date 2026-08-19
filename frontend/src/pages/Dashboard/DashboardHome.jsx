import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import ChartCard from '../../components/dashboard/ChartCard.jsx';
import ProjectCard from '../../components/dashboard/ProjectCard.jsx';
import ProfileCard from '../../components/dashboard/ProfileCard.jsx';
import QuickActionCard from '../../components/dashboard/QuickActionCard.jsx';
import {
  FiFolder,
  FiUsers,
  FiCheckSquare,
  FiTrendingUp,
  FiPlus,
  FiUserPlus,
  FiMessageSquare,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - will be replaced with API calls
  const stats = [
    { title: 'Active Projects', value: '12', change: 8, icon: FiFolder, color: 'primary' },
    { title: 'Teams Joined', value: '5', change: 12, icon: FiUsers, color: 'success' },
    { title: 'Pending Tasks', value: '24', change: -5, icon: FiCheckSquare, color: 'warning' },
    { title: 'Completed Tasks', value: '156', change: 23, icon: FiTrendingUp, color: 'success' },
  ];

  const projects = [
    {
      id: 1,
      name: 'E-commerce Platform',
      description: 'Building a modern e-commerce platform with React and Node.js',
      status: 'active',
      progress: 75,
      team: ['John', 'Sarah', 'Mike'],
      deadline: 'Dec 15, 2024',
    },
    {
      id: 2,
      name: 'Mobile App Redesign',
      description: 'Redesigning the mobile app with new UI/UX guidelines',
      status: 'active',
      progress: 45,
      team: ['Emma', 'David'],
      deadline: 'Jan 20, 2025',
    },
    {
      id: 3,
      name: 'API Integration',
      description: 'Integrating third-party APIs for payment and analytics',
      status: 'onHold',
      progress: 30,
      team: ['Alex'],
      deadline: 'Feb 10, 2025',
    },
  ];

  const weeklyActivityData = [
    { day: 'Mon', commits: 12, tasks: 8 },
    { day: 'Tue', commits: 19, tasks: 15 },
    { day: 'Wed', commits: 15, tasks: 12 },
    { day: 'Thu', commits: 25, tasks: 20 },
    { day: 'Fri', commits: 22, tasks: 18 },
    { day: 'Sat', commits: 8, tasks: 5 },
    { day: 'Sun', commits: 5, tasks: 3 },
  ];

  const projectProgressData = [
    { name: 'E-commerce', progress: 75 },
    { name: 'Mobile App', progress: 45 },
    { name: 'API Integration', progress: 30 },
    { name: 'Dashboard', progress: 90 },
    { name: 'Documentation', progress: 60 },
  ];

  const taskStatusData = [
    { name: 'Completed', value: 156, color: '#22C55E' },
    { name: 'In Progress', value: 45, color: '#2563EB' },
    { name: 'Pending', value: 24, color: '#F59E0B' },
    { name: 'Overdue', value: 8, color: '#EF4444' },
  ];

  const quickActions = [
    { title: 'Create Project', description: 'Start a new project', icon: FiPlus, to: '/projects/new', color: 'primary' },
    { title: 'Join Team', description: 'Find and join teams', icon: FiUserPlus, to: '/teams', color: 'success' },
    { title: 'View Messages', description: 'Check your messages', icon: FiMessageSquare, to: '/messages', color: 'warning' },
  ];

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-8"
      >
        <h1 className="text-3xl font-bold text-text mb-2">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-text/60">Here's what's happening with your projects today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Activity Chart */}
          <ChartCard title="Weekly Activity">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                  }}
                />
                <Legend />
                <Bar dataKey="commits" fill="#2563EB" radius={[4, 4, 0, 0]} name="Commits" />
                <Bar dataKey="tasks" fill="#22C55E" radius={[4, 4, 0, 0]} name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Recent Projects */}
          <div>
            <h2 className="text-xl font-semibold text-text mb-4">Recent Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>

          {/* Task Status Chart */}
          <ChartCard title="Task Status Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Right Column - Profile, Notifications, Quick Actions */}
        <div className="space-y-6">
          {/* Profile Card */}
          <ProfileCard user={user} onEdit={handleEditProfile} />

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-text mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <QuickActionCard key={index} {...action} />
              ))}
            </div>
          </div>

          {/* Project Progress */}
          <ChartCard title="Project Progress" className="!p-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={projectProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ fill: '#2563EB' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
