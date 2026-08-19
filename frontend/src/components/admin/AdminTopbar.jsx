import { FiBell, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';
import Avatar from '../ui/Avatar.jsx';
import Button from '../ui/Button.jsx';

export default function AdminTopbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="glass-panel fixed left-0 right-0 top-0 z-30 h-16 border-b lg:left-64">
      <div className="flex h-full items-center justify-between px-6">
        <div>
          <h2 className="text-lg font-semibold text-text">Admin Dashboard</h2>
          <p className="text-sm text-text/40">Welcome back, {user?.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost p-2" aria-label="Notifications">
            <FiBell size={20} />
          </button>
          <div className="hidden items-center gap-3 border-l border-border/50 pl-4 md:flex">
            <Avatar name={user?.name} size="sm" />
            <div>
              <p className="font-medium text-text">{user?.name}</p>
              <p className="text-xs capitalize text-text/40">{user?.role}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="p-2" aria-label="Logout">
            <FiLogOut size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
}
