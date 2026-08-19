import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = false, padding = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hover ? { y: -4 } : undefined}
      className={`glass-card ${padding ? 'p-6' : ''} transition-shadow duration-300 ${hover ? 'hover:shadow-glow' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
