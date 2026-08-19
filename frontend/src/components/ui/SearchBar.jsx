import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ placeholder = 'Search...', className = '', ...props }) {
  return (
    <div className={`search-bar ${className}`}>
      <FiSearch size={18} className="shrink-0 text-text/40" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-sm text-text outline-none placeholder:text-text/40"
        {...props}
      />
    </div>
  );
}
