import { forwardRef } from 'react';
import { FiLoader } from 'react-icons/fi';

const VARIANT_CLASS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger:
    'inline-flex items-center justify-center rounded-xl bg-danger px-5 py-2.5 font-medium text-white ' +
    'shadow-card transition-all duration-200 hover:bg-danger/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
};

const SIZE_CLASS = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

/**
 * Shared button used across auth forms and the dashboard shell so every
 * primary/secondary/ghost/danger action looks and behaves identically to
 * the landing page's CTAs. Renders a spinner and disables interaction while
 * `loading` is true, without shifting layout width.
 */
const Button = forwardRef(
  ({ as: Component = 'button', variant = 'primary', size = 'md', loading = false, className = '', children, disabled, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        disabled={disabled || loading}
        className={`gap-2 ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <FiLoader className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';
export default Button;
