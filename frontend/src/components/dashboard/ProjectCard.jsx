import { motion } from 'framer-motion';
import { FiUsers, FiCalendar, FiMoreVertical } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const statusColors = {
    active: 'bg-success/10 text-success',
    completed: 'bg-primary/10 text-primary',
    onHold: 'bg-warning/10 text-warning',
    delayed: 'bg-danger/10 text-danger',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="glass-card p-6 transition-shadow duration-300 hover:shadow-glow group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link to={`/projects/${project.id}`} className="hover:text-primary transition-colors">
            <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors">
              {project.name}
            </h3>
          </Link>
          <p className="text-sm text-text/50 mt-1 line-clamp-2">{project.description}</p>
        </div>
        <button className="text-text/40 hover:text-text transition-colors">
          <FiMoreVertical size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[project.status]}`}>
          {project.status}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-text/60">Progress</span>
          <span className="font-medium text-text">{project.progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-primary rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-text/60">
          <FiUsers size={16} />
          <span>{project.team.length} members</span>
        </div>
        <div className="flex items-center gap-2 text-text/60">
          <FiCalendar size={16} />
          <span>{project.deadline}</span>
        </div>
      </div>
    </motion.div>
  );
}
