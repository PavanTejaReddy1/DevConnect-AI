import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import useCountUp from '../../hooks/useCountUp.js';

// Tailwind's JIT scanner needs full, static class strings — `bg-${tone}/10`
// would never be generated. Map each tone to its complete class set instead.
const TONE_CLASS = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary dark:text-accent',
  accent: 'bg-accent/15 text-secondary dark:text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
};

export default function StatCard({ icon: Icon, label, value, suffix = '', trend, tone = 'primary' }) {
  const [ref, count] = useCountUp(value);

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${TONE_CLASS[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        {trend && <Badge tone={trend.startsWith('-') ? 'danger' : 'success'}>{trend}</Badge>}
      </div>
      <p ref={ref} className="mt-4 font-display text-2xl font-bold text-text dark:text-white">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-1 text-xs font-medium text-text/50 dark:text-slate-400">{label}</p>
    </Card>
  );
}
