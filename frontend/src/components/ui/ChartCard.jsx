import { motion } from 'framer-motion';

export default function ChartCard({ title, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className={`glass-card p-6 transition-shadow duration-300 hover:shadow-glow ${className}`}
    >
      {title && <h3 className="mb-4 text-lg font-semibold text-text">{title}</h3>}
      <div className="min-h-[200px]">{children}</div>
    </motion.div>
  );
}
