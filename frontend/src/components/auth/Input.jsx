import { forwardRef } from 'react';

const Input = forwardRef(({ label, type = 'text', placeholder, error, ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-text">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border bg-card text-text placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
          error ? 'border-danger' : 'border-border'
        }`}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
