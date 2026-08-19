export default function Tooltip({ children, content, className = '' }) {
  return (
    <span className={`group relative inline-flex ${className}`}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-text px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-card transition-opacity duration-200 group-hover:opacity-100"
      >
        {content}
      </span>
    </span>
  );
}
