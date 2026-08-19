export default function Switch({ checked, onChange, label, id, className = '' }) {
  const switchId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <label htmlFor={switchId} className={`flex cursor-pointer items-center justify-between gap-3 ${className}`}>
      {label && <span className="text-sm font-medium text-text">{label}</span>}
      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? 'bg-primary' : 'surface-muted'
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-card transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}
