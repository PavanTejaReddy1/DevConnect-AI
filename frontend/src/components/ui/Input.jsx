import { forwardRef, useId } from 'react';

/**
 * Shared form input for every auth + dashboard form. Accepts a leading icon,
 * a label, and an error string (rendered below in the danger color) so every
 * field in the app validates and looks identical.
 */
const Input = forwardRef(({ label, error, icon: Icon, className = '', id, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text dark:text-slate-200">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text/35 dark:text-slate-500"
            aria-hidden="true"
          />
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input-field ${Icon ? 'pl-10' : ''} ${error ? '!border-danger focus:!ring-danger/20' : ''} ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
