import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ currentPage, totalPages, onPageChange, className = '' }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-ghost p-2 disabled:opacity-40"
        aria-label="Previous page"
      >
        <FiChevronLeft size={18} />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`h-9 w-9 rounded-xl text-sm font-medium transition-all duration-200 ${
            page === currentPage
              ? 'bg-primary text-white shadow-card'
              : 'text-text/60 hover-surface'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-ghost p-2 disabled:opacity-40"
        aria-label="Next page"
      >
        <FiChevronRight size={18} />
      </button>
    </div>
  );
}
