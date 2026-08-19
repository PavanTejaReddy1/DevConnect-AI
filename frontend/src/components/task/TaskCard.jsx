import { motion } from 'framer-motion';
import { FiCalendar, FiPaperclip, FiMessageSquare } from 'react-icons/fi';
import Avatar from '../ui/Avatar.jsx';
import PriorityBadge from './PriorityBadge.jsx';
import StatusBadge from './StatusBadge.jsx';

export default function TaskCard({ task, onClick, onDragStart }) {
  const completedCount = task.checklist?.filter(item => item.completed).length || 0;
  const totalCount = task.checklist?.length || 0;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, task)}
      onClick={onClick}
      className="glass-card p-4 cursor-pointer transition-shadow duration-300 hover:shadow-glow group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <PriorityBadge priority={task.priority} />
        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.slice(0, 2).map((label, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
              >
                {label}
              </span>
            ))}
            {task.labels.length > 2 && (
              <span className="px-2 py-0.5 bg-gray-100 text-text/60 text-xs rounded-full">
                +{task.labels.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="font-medium text-text mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {task.title}
      </h3>

      {/* Description Preview */}
      {task.description && (
        <p className="text-sm text-text/50 line-clamp-2 mb-3">{task.description}</p>
      )}

      {/* Checklist Progress */}
      {totalCount > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
            <span className="text-xs text-text/40">{completedCount}/{totalCount}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        {/* Assignee */}
        {task.assignee ? (
          <Avatar
            name={task.assignee.name}
            src={task.assignee.avatarUrl}
            size="sm"
            className="w-6 h-6"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-100" />
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-text/40">
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-danger' : ''}`}>
              <FiCalendar size={14} />
              <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
          {task.attachments && task.attachments.length > 0 && (
            <div className="flex items-center gap-1">
              <FiPaperclip size={14} />
              <span>{task.attachments.length}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
