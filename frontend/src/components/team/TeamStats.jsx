import { motion } from 'framer-motion';
import { FiUsers, FiFolder, FiCheckSquare, FiMessageSquare } from 'react-icons/fi';

export default function TeamStats({ team }) {
  const stats = [
    { icon: FiUsers, label: 'Members', value: team.members?.length || 0, color: 'primary' },
    { icon: FiFolder, label: 'Projects', value: team.projects?.length || 0, color: 'success' },
    { icon: FiCheckSquare, label: 'Tasks', value: 0, color: 'warning' }, // Will be updated with actual data
    { icon: FiMessageSquare, label: 'Messages', value: 0, color: 'accent' }, // Will be updated with actual data
  ];

  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    accent: 'text-accent bg-accent/10',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="glass-card p-4 text-center transition-shadow duration-300 hover:shadow-glow"
          >
            <div className={`inline-flex p-3 rounded-xl ${colorClasses[stat.color]} mb-3`}>
              <Icon size={24} />
            </div>
            <p className="text-2xl font-bold text-text">{stat.value}</p>
            <p className="text-sm text-text/60">{stat.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
