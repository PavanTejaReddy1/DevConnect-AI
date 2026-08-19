export default function PriorityBadge({ priority }) {
  const priorityStyles = {
    low: 'bg-success/10 text-success',
    medium: 'bg-warning/10 text-warning',
    high: 'bg-danger/10 text-danger',
    critical: 'bg-gradient-to-r from-danger to-red-600 text-white',
  };

  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityStyles[priority] || priorityStyles.medium}`}>
      {priorityLabels[priority] || priority}
    </span>
  );
}
