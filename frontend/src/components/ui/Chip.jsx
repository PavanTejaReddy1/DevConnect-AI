export default function Chip({ children, active = false, onClick, className = '' }) {
  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`chip transition-all duration-200 ${
        active
          ? 'border-primary/30 bg-primary/10 text-primary shadow-soft'
          : 'hover:border-primary/20 hover:text-text'
      } ${className}`}
    >
      {children}
    </Component>
  );
}
