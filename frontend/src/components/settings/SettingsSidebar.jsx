import { Link, useLocation } from 'react-router-dom';
import { FiUser, FiLock, FiMonitor, FiGrid, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';

export default function SettingsSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/settings/account', icon: FiUser, label: 'Account' },
    { path: '/settings/security', icon: FiLock, label: 'Security' },
    { path: '/settings/appearance', icon: FiMonitor, label: 'Appearance' },
    { path: '/settings/notifications', icon: FiGrid, label: 'Notifications' },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-text">Settings</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text/60 hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-primary' : ''} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-text/60 hover:bg-gray-100 transition-all duration-200 w-full"
        >
          <FiLogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
