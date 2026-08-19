import { FiUsers, FiFolder, FiUsers as FiTeam, FiCheckSquare, FiTrendingUp } from 'react-icons/fi';

export default function AnalyticsCards({ stats }) {
  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: FiUsers,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers || 0,
      icon: FiTrendingUp,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects || 0,
      icon: FiFolder,
      color: 'bg-purple-500',
      change: '+15%',
    },
    {
      title: 'Active Teams',
      value: stats.activeTeams || 0,
      icon: FiTeam,
      color: 'bg-orange-500',
      change: '+5%',
    },
    {
      title: 'Tasks Completed',
      value: stats.tasksCompleted || 0,
      icon: FiCheckSquare,
      color: 'bg-pink-500',
      change: '+20%',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
              <card.icon size={24} className="text-white" />
            </div>
            <span className="text-sm text-success font-medium">{card.change}</span>
          </div>
          <h3 className="text-2xl font-bold text-text">{card.value}</h3>
          <p className="text-sm text-text/60">{card.title}</p>
        </div>
      ))}
    </div>
  );
}
