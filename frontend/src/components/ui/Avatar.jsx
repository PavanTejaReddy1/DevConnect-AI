const SIZE_CLASS = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-11 w-11 text-sm',
  xl: 'h-20 w-20 text-2xl',
};

const TONES = [
  'from-primary to-accent',
  'from-secondary to-primary',
  'from-accent to-secondary',
  'from-primary to-secondary',
];

// Deterministically pick a gradient tone from a name so the same person
// always renders with the same color, without needing to store it.
function toneFromName(name = '') {
  const sum = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return TONES[sum % TONES.length];
}

function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function Avatar({ name, size = 'md', online, tone, className = '' }) {
  const resolvedTone = tone || toneFromName(name);
  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      <span
        className={`flex items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white ${resolvedTone} ${SIZE_CLASS[size]}`}
      >
        {getInitials(name) || '?'}
      </span>
      {online !== undefined && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card dark:border-slate-900 ${
            online ? 'bg-success' : 'bg-text/25 dark:bg-slate-600'
          }`}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
