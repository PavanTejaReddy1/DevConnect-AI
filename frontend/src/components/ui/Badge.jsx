const TONE_CLASS = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/15 text-secondary dark:text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  neutral: 'bg-text/5 text-text/60 dark:bg-white/10 dark:text-slate-300',
};

export default function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${TONE_CLASS[tone]} ${className}`}>
      {children}
    </span>
  );
}
