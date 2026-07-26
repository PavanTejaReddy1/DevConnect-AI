import { FiMoon, FiSun } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account preferences." />
      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {isDark ? <FiMoon className="h-5 w-5" /> : <FiSun className="h-5 w-5" />}
            </span>
            <div>
              <p className="text-sm font-semibold text-text dark:text-white">Appearance</p>
              <p className="text-xs text-text/50 dark:text-slate-400">
                Currently using {isDark ? 'dark' : 'light'} mode.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle dark mode"
            className={`relative h-7 w-12 rounded-full transition-colors ${isDark ? 'bg-primary' : 'bg-text/15'}`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-card transition-transform ${
                isDark ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </Card>
    </div>
  );
}
