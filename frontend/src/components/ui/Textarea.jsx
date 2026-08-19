export default function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-text">
          {label}
        </label>
      )}
      <textarea
        className={`input-glass min-h-[100px] resize-y ${error ? 'border-danger' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
