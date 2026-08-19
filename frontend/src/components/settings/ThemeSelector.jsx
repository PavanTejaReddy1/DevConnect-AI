import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

export default function ThemeSelector({ theme, onChange }) {
  const themes = [
    { value: 'light', icon: FiSun, label: 'Light' },
    { value: 'dark', icon: FiMoon, label: 'Dark' },
    { value: 'system', icon: FiMonitor, label: 'System' },
  ];

  return (
    <div className="flex gap-2">
      {themes.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
              theme === t.value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/50 text-text/60'
            }`}
          >
            <Icon size={18} />
            <span className="text-sm font-medium">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
