import { motion } from 'framer-motion';

export default function SkillCard({ skill }) {
  const levelColors = {
    beginner: 'bg-gray-100 text-gray-600',
    intermediate: 'bg-primary/10 text-primary',
    advanced: 'bg-accent/10 text-accent',
    expert: 'bg-secondary/10 text-secondary',
  };

  const levelWidth = {
    beginner: '25%',
    intermediate: '50%',
    advanced: '75%',
    expert: '100%',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="glass-card p-4 transition-shadow duration-300 hover:shadow-glow"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-text">{skill.name}</h3>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${levelColors[skill.level]}`}>
          {skill.level}
        </span>
      </div>
      {skill.category && (
        <p className="text-xs text-text/40 mb-2">{skill.category}</p>
      )}
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: levelWidth[skill.level] }}
          transition={{ duration: 0.5 }}
          className="h-full bg-primary rounded-full"
        />
      </div>
    </motion.div>
  );
}
