export function Table({ children, className = '' }) {
  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="table-glass">{children}</table>
      </div>
    </div>
  );
}

export function TableHead({ children }) {
  return <thead>{children}</thead>;
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children, className = '' }) {
  return <tr className={className}>{children}</tr>;
}

export function TableHeader({ children, className = '' }) {
  return <th className={`font-semibold ${className}`}>{children}</th>;
}

export function TableCell({ children, className = '' }) {
  return <td className={className}>{children}</td>;
}
