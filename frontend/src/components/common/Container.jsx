/**
 * Centralized max-width + horizontal padding wrapper used by every section
 * so spacing stays consistent across the whole landing page.
 */
export default function Container({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-7xl px-6 lg:px-8 ${className}`}>{children}</div>;
}
