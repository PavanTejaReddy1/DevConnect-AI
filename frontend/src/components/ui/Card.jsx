/**
 * Shared content card. `variant="glass"` matches the landing page's
 * translucent hero/stat cards; `variant="solid"` (default) is the denser
 * surface used through the dashboard where legibility matters more.
 */
export default function Card({ variant = 'solid', className = '', children, ...props }) {
  const base = variant === 'glass' ? 'glass-card' : 'surface-card';
  return (
    <div className={`${base} ${className}`} {...props}>
      {children}
    </div>
  );
}
