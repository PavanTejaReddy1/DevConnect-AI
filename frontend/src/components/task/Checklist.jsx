import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

export default function Checklist({ checklist, onToggle, onAdd, onRemove }) {
  const completedCount = checklist.filter(item => item.completed).length;
  const progress = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      {checklist.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-success rounded-full"
            />
          </div>
          <span className="text-xs text-text/40">{completedCount}/{checklist.length}</span>
        </div>
      )}

      {/* Checklist Items */}
      <div className="space-y-2">
        {checklist.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 group"
          >
            <button
              onClick={() => onToggle(item.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                item.completed
                  ? 'bg-success border-success text-white'
                  : 'border-border hover:border-primary'
              }`}
            >
              {item.completed && <FiCheck size={12} />}
            </button>
            <span
              className={`flex-1 text-sm ${
                item.completed ? 'text-text/40 line-through' : 'text-text'
              }`}
            >
              {item.text}
            </span>
            <button
              onClick={() => onRemove(item.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-danger hover:bg-danger/10 rounded transition-all"
            >
              ×
            </button>
          </motion.div>
        ))}
      </div>

      {/* Add Item */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add checklist item..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              onAdd(e.target.value.trim());
              e.target.value = '';
            }
          }}
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-card/70 backdrop-blur-glass text-text placeholder:text-text/40 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
      </div>
    </div>
  );
}
