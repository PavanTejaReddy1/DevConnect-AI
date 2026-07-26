import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiBell, FiUserPlus, FiFolder, FiCheckSquare, FiMessageSquare } from 'react-icons/fi';
import useClickOutside from '../../hooks/useClickOutside.js';

const NOTIFICATIONS = [
  { id: 1, icon: FiUserPlus, tone: 'text-primary bg-primary/10', title: 'Marcus accepted your team invite', time: '5m ago', unread: true },
  { id: 2, icon: FiFolder, tone: 'text-secondary bg-secondary/10', title: 'New project invite: OSS Analytics Hub', time: '1h ago', unread: true },
  { id: 3, icon: FiCheckSquare, tone: 'text-success bg-success/10', title: 'Task "Auth API endpoints" assigned to you', time: '3h ago', unread: false },
  { id: 4, icon: FiMessageSquare, tone: 'text-accent bg-accent/10', title: 'New message from Priya in AI Recipe Planner', time: '1d ago', unread: false },
];

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false), open);

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text/60 transition-colors hover:border-primary hover:text-primary dark:border-white/10 dark:text-slate-300 dark:hover:border-accent dark:hover:text-accent"
      >
        <FiBell className="h-4 w-4" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-soft dark:border-white/10 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3 dark:border-white/10">
              <p className="text-sm font-semibold text-text dark:text-white">Notifications</p>
              <span className="text-xs text-text/40 dark:text-slate-500">{unreadCount} unread</span>
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {NOTIFICATIONS.map((n) => (
                <li key={n.id} className="flex gap-3 border-b border-border px-4 py-3 last:border-none hover:bg-text/5 dark:border-white/5 dark:hover:bg-white/5">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${n.tone}`}>
                    <n.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs leading-snug ${n.unread ? 'font-semibold text-text dark:text-white' : 'text-text/60 dark:text-slate-400'}`}>
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-text/35 dark:text-slate-500">{n.time}</p>
                  </div>
                  {n.unread && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />}
                </li>
              ))}
            </ul>
            <div className="px-4 py-2.5 text-center">
              <button type="button" className="text-xs font-semibold text-primary hover:underline">
                Mark all as read
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
