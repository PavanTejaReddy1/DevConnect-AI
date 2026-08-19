import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';
import NotificationBell from '../notifications/NotificationBell.jsx';
import NotificationPanel from '../notifications/NotificationPanel.jsx';

export default function Topbar({ onMobileMenuToggle, isMobileMenuOpen }) {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-white/70 backdrop-blur-glass border-b border-white/40 z-30">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Left: Mobile menu & Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 text-gray-600 hover:text-text transition-colors"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5 w-64">
            <FiSearch size={18} className="text-text/40" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-full text-text placeholder:text-text/40"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-text/60 hover:text-text transition-colors rounded-lg hover:bg-gray-100"
          >
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {/* Notifications */}
          <NotificationBell onOpen={() => setShowNotifications(true)} />
          <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold shadow-card">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden md:block text-sm font-medium text-text">{user?.name}</span>
            </button>

            <AnimatePresence>
              {showProfileDropdown && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowProfileDropdown(false)}
                    className="fixed inset-0 z-40"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 w-56 bg-white/70 backdrop-blur-glass rounded-2xl border border-white/40 shadow-card z-50"
                  >
                    <div className="p-4 border-b border-border/50">
                      <p className="font-medium text-text">{user?.name}</p>
                      <p className="text-xs text-text/50">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <button className="w-full text-left px-3 py-2 text-sm text-text hover:bg-gray-100 rounded-lg transition-colors">
                        View Profile
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-text hover:bg-gray-100 rounded-lg transition-colors" onClick={() => window.location.href = '/settings/account'}>
                        Settings
                      </button>
                      <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors">
                        Logout
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
