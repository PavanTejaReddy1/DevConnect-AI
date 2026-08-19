import { motion } from 'framer-motion';

export default function PageHeader({ title, description, action, badge, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div>
        {badge && <div className="mb-2">{badge}</div>}
        <h1 className="text-2xl font-bold text-text sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-text/60">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-3">{action}</div>}
    </motion.div>
  );
}
