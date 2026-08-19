export default function Tag({ children, variant = 'default', className = '', onRemove }) {
  const variants = {
    default: 'bg-text/5 text-text/70',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
  };

  return (
    <span
      className={`badge gap-1 ${variants[variant]} ${className}`}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 hover:bg-text/10"
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
}
