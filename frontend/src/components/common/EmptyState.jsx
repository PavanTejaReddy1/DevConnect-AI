import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ title, description, action, icon: Icon = FiInbox }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full surface-muted">
        <Icon size={32} className="text-text/40" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-text">{title}</h3>
      <p className="mb-6 max-w-sm text-text/60">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
