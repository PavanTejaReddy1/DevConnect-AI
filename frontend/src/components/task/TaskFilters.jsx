import { FiSearch, FiX } from 'react-icons/fi';

export default function TaskFilters({ filters, onFilterChange, onClear }) {
  const hasActiveFilters = Object.values(filters).some(v => v && v !== '');

  return (
    <div className="glass-card p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card/70 backdrop-blur-glass text-text placeholder:text-text/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status || ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border bg-card/70 backdrop-blur-glass text-text transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        >
          <option value="">All Status</option>
          <option value="backlog">Backlog</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority || ''}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border bg-card/70 backdrop-blur-glass text-text transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        {/* Clear Button */}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="px-4 py-2.5 rounded-xl border border-border bg-gray-100 text-text hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <FiX size={16} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
