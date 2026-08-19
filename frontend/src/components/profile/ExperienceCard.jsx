import { motion } from 'framer-motion';
import { FiBriefcase, FiCalendar } from 'react-icons/fi';

export default function ExperienceCard({ experience }) {
  const formatDate = (date) => {
    if (!date) return 'Present';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="glass-card p-6 transition-shadow duration-300 hover:shadow-glow"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <FiBriefcase size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-text">{experience.role}</h3>
          <p className="text-text/60">{experience.company}</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-text/40">
            <FiCalendar size={14} />
            <span>
              {formatDate(experience.startDate)} - {experience.currentlyWorking ? 'Present' : formatDate(experience.endDate)}
            </span>
          </div>
          {experience.description && (
            <p className="mt-3 text-sm text-text/60 line-clamp-2">{experience.description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
