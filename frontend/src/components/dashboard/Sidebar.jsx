import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiHome,
  FiFolder,
  FiUsers,
  FiMessageSquare,
  FiCheckSquare,
  FiBell,
  FiSettings,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';

const DEFAULT_NAV_ITEMS = [
  { label: 'Home', to: '/dashboard', icon: FiHome, end: true },
  { label: 'Projects', to: '/dashboard/projects', icon: FiFolder },
  { label: 'Teams', to: '/dashboard/teams', icon: FiUsers },
  { label: 'Messages', to: '/dashboard/messages', icon: FiMessageSquare },
  { label: 'Tasks', to: '/dashboard/tasks', icon: FiCheckSquare },
  { label: 'Notifications', to: '/dashboard/notifications', icon: FiBell },
];

const DEFAULT_FOOTER_ITEMS = [
  { label: 'Profile', to: '/dashboard/profile', icon: FiUser },
  { label: 'Settings', to: '/dashboard/settings', icon: FiSettings },
];

function NavItem({ item, onNavigate }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-primary/10 text-primary dark:bg-primary/15'
            : 'text-text/60 hover:bg-text/5 hover:text-text dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          {item.label}
          {isActive && (
            <motion.span
              layoutId="sidebar-active-indicator"
              className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary"
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}

function SidebarContent({ navItems, footerItems, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2 px-2 font-display text-lg font-bold text-text dark:text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm text-white shadow-card">
          DC
        </span>
        DevConnect
        <span className="text-primary">AI</span>
      </Link>

      <nav className="mt-8 flex-1 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.to} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="space-y-1 border-t border-border pt-4 dark:border-white/10">
        {footerItems.map((item) => (
          <NavItem key={item.to} item={item} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

/**
 * Shared sidebar shell for the developer dashboard.
 */
export default function Sidebar({
  mobileOpen,
  onCloseMobile,
  navItems = DEFAULT_NAV_ITEMS,
  footerItems = DEFAULT_FOOTER_ITEMS,
}) {
  return (
    <>
      {/* Desktop: fixed column */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card px-4 py-6 lg:flex dark:border-white/10 dark:bg-slate-900">
        <SidebarContent navItems={navItems} footerItems={footerItems} />
      </aside>

      {/* Mobile: slide-over drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-40 bg-text/40 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-card px-4 py-6 shadow-2xl lg:hidden dark:border-white/10 dark:bg-slate-900"
            >
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close menu"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-text/50 hover:bg-text/5 dark:text-slate-400"
              >
                <FiX className="h-5 w-5" aria-hidden="true" />
              </button>
              <SidebarContent navItems={navItems} footerItems={footerItems} onNavigate={onCloseMobile} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
