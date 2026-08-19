import { motion } from 'framer-motion';
import { FiBook } from 'react-icons/fi';

export default function EducationCard({ education }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="glass-card p-6 transition-shadow duration-300 hover:shadow-glow"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-accent/10 text-accent">
          <FiBook size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-text">{education.degree}</h3>
          <p className="text-text/60">{education.college}</p>
          {education.branch && (
            <p className="text-sm text-text/40 mt-1">{education.branch}</p>
          )}
          {education.year && (
            <p className="text-sm text-text/40 mt-1">Class of {education.year}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
