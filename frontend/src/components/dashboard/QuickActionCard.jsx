import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function QuickActionCard({ title, description, icon: Icon, to, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary hover:bg-primary/20',
    success: 'bg-success/10 text-success hover:bg-success/20',
    warning: 'bg-warning/10 text-warning hover:bg-warning/20',
    danger: 'bg-danger/10 text-danger hover:bg-danger/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={to}
        className={`block p-6 rounded-2xl border border-border/50 shadow-soft hover:shadow-glow transition-all duration-300 ${colorClasses[color]}`}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-white/50 shadow-card">
            <Icon size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-sm text-text/60">{description}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
