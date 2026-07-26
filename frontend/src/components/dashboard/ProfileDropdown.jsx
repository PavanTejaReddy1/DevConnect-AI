import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi';
import useClickOutside from '../../hooks/useClickOutside.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Avatar from '../ui/Avatar.jsx';

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false), open);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg border border-transparent py-1 pl-1 pr-2 transition-colors hover:border-border dark:hover:border-white/10"
      >
        <Avatar name={user.name} size="sm" />
        <span className="hidden text-left sm:block">
          <span className="block text-xs font-semibold leading-tight text-text dark:text-white">{user.name}</span>
          <span className="block text-[11px] capitalize leading-tight text-text/45 dark:text-slate-500">{user.role}</span>
        </span>
        <FiChevronDown className={`h-3.5 w-3.5 text-text/40 transition-transform dark:text-slate-500 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-soft dark:border-white/10 dark:bg-slate-900"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3 dark:border-white/10">
              <Avatar name={user.name} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text dark:text-white">{user.name}</p>
                <p className="truncate text-xs text-text/45 dark:text-slate-500">{user.email}</p>
              </div>
            </div>
            <div className="p-1.5">
              <Link
                to="/dashboard/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text/70 hover:bg-text/5 dark:text-slate-300 dark:hover:bg-white/5"
              >
                <FiUser className="h-4 w-4" aria-hidden="true" />
                Profile
              </Link>
              <Link
                to="/dashboard/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text/70 hover:bg-text/5 dark:text-slate-300 dark:hover:bg-white/5"
              >
                <FiSettings className="h-4 w-4" aria-hidden="true" />
                Settings
              </Link>
            </div>
            <div className="border-t border-border p-1.5 dark:border-white/10">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-danger hover:bg-danger/5"
              >
                <FiLogOut className="h-4 w-4" aria-hidden="true" />
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
