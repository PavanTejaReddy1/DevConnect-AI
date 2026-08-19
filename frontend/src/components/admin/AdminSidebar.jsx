import { Link, useLocation } from 'react-router-dom';
import { FiLayout, FiUsers, FiFolder, FiUsers as FiTeam, FiCheckSquare, FiSettings, FiShield } from 'react-icons/fi';

export default function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: FiLayout, label: 'Dashboard' },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/projects', icon: FiFolder, label: 'Projects' },
    { path: '/admin/teams', icon: FiTeam, label: 'Teams' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <aside className="glass-panel fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r lg:flex">
      <div className="border-b border-border/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-card">
            <FiShield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-text">Admin Panel</h1>
            <p className="text-xs text-text/40">DevConnect AI</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}
            >
              <item.icon size={20} className={isActive ? 'text-primary' : ''} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/50 p-4">
        <Link to="/dashboard" className="nav-link nav-link-inactive">
          <FiLayout size={20} />
          <span className="font-medium">Back to Dashboard</span>
        </Link>
      </div>
    </aside>
  );
}
