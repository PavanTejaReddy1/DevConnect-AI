import { motion } from 'framer-motion';

export default function StatCard({ title, value, change, icon: Icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    danger: 'text-danger bg-danger/10',
  };

  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="glass-card p-6 transition-shadow duration-300 hover:shadow-glow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-text/60 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-text mb-2">{value}</h3>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              <span className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
                {isPositive ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-text/40">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]} shadow-card`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
}
