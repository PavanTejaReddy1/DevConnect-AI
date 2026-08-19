export default function Select({ label, error, options = [], className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-text">
          {label}
        </label>
      )}
      <select
        className={`input-glass cursor-pointer ${error ? 'border-danger' : ''} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
