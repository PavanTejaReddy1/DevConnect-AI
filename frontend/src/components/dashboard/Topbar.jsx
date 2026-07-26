import { FiMenu, FiSearch } from 'react-icons/fi';
import ThemeToggle from '../common/ThemeToggle.jsx';
import NotificationsDropdown from './NotificationsDropdown.jsx';
import ProfileDropdown from './ProfileDropdown.jsx';

export default function Topbar({ onOpenMobileSidebar }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-white/80 px-4 backdrop-blur-xl backdrop-saturate-150 sm:px-6 dark:border-white/10 dark:bg-slate-900/80">
      <button
        type="button"
        onClick={onOpenMobileSidebar}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-text/60 hover:bg-text/5 lg:hidden dark:text-slate-300 dark:hover:bg-white/5"
      >
        <FiMenu className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text/35 dark:text-slate-500" aria-hidden="true" />
        <label htmlFor="dashboard-search" className="sr-only">
          Search developers, projects, or skills
        </label>
        <input
          id="dashboard-search"
          type="search"
          placeholder="Search developers, projects, skills…"
          className="input-field pl-10 text-sm"
        />
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <ThemeToggle />
        <NotificationsDropdown />
        <div className="mx-1 hidden h-6 w-px bg-border sm:block dark:bg-white/10" aria-hidden="true" />
        <ProfileDropdown />
      </div>
    </header>
  );
}
