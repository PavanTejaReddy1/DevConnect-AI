export default function StatusBadge({ status }) {
  const statusStyles = {
    backlog: 'bg-gray-100 text-text/60',
    todo: 'bg-primary/10 text-primary',
    'in-progress': 'bg-accent/10 text-accent',
    review: 'bg-warning/10 text-warning',
    done: 'bg-success/10 text-success',
  };

  const statusLabels = {
    backlog: 'Backlog',
    todo: 'To Do',
    'in-progress': 'In Progress',
    review: 'Review',
    done: 'Done',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyles[status] || statusStyles.backlog}`}>
      {statusLabels[status] || status}
    </span>
  );
}
