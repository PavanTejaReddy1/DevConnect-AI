import { FiCheck, FiTrash2, FiFolder, FiUsers, FiCheckSquare, FiMessageSquare, FiZap, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const typeIcons = {
  project_invitation: FiFolder,
  team_invitation: FiUsers,
  task_assigned: FiCheckSquare,
  task_completed: FiCheck,
  comment: FiMessageSquare,
  mention: FiMessageSquare,
  chat_message: FiMessageSquare,
  system: FiAlertCircle,
  ai_report: FiZap,
};

const typeColors = {
  project_invitation: 'text-blue-500',
  team_invitation: 'text-purple-500',
  task_assigned: 'text-orange-500',
  task_completed: 'text-green-500',
  comment: 'text-gray-500',
  mention: 'text-pink-500',
  chat_message: 'text-indigo-500',
  system: 'text-gray-400',
  ai_report: 'text-primary',
};

export default function NotificationCard({ notification, onRead, onDelete }) {
  const Icon = typeIcons[notification.type] || FiBell;
  const iconColor = typeColors[notification.type] || 'text-gray-500';

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-primary/5' : ''}`}
      onClick={() => {
        if (!notification.isRead) onRead(notification._id);
        if (notification.link) window.location.href = notification.link;
      }}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${iconColor}`}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`font-medium text-text ${!notification.isRead ? 'font-semibold' : ''}`}>
              {notification.title}
            </h4>
            {!notification.isRead && (
              <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
            )}
          </div>
          <p className="text-sm text-text/60 mt-1">{notification.message}</p>
          <p className="text-xs text-text/40 mt-2">{timeAgo(notification.createdAt)}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification._id);
          }}
          className="p-1 rounded hover:bg-gray-200 text-text/40 hover:text-danger transition-colors"
        >
          <FiTrash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}
