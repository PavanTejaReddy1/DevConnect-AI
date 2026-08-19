import { motion } from 'framer-motion';
import { FiClock, FiFolder, FiCheckSquare, FiUsers } from 'react-icons/fi';

export default function ActivityCard({ activity }) {
  const typeIcons = {
    project: { icon: FiFolder, color: 'text-primary bg-primary/10' },
    task: { icon: FiCheckSquare, color: 'text-success bg-success/10' },
    team: { icon: FiUsers, color: 'text-accent bg-accent/10' },
  };

  const { icon: Icon, color } = typeIcons[activity.type] || typeIcons.project;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-4 transition-shadow duration-300 hover:shadow-glow"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text">{activity.title}</p>
          <p className="text-xs text-text/50 mt-1">{activity.description}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-text/40">
            <FiClock size={12} />
            <span>{activity.time}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
