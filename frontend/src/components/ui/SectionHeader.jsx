export default function SectionHeader({ title, description, action, className = '' }) {
  return (
    <div className={`mb-4 flex items-center justify-between ${className}`}>
      <div>
        <h2 className="text-lg font-semibold text-text">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-text/60">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
