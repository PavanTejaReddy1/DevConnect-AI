import { motion } from 'framer-motion';

export default function AuthCard({ children, title }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-card/80 backdrop-blur-glass rounded-2xl shadow-glow border border-border/50 p-8"
    >
      {title && (
        <h1 className="text-3xl font-display font-bold text-center mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {title}
        </h1>
      )}
      {children}
    </motion.div>
  );
}
