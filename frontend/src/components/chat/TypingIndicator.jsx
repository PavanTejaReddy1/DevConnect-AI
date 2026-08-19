import { motion } from 'framer-motion';

export default function TypingIndicator({ users }) {
  if (!users || users.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex items-center gap-2 text-sm text-text/40"
    >
      <div className="flex gap-1">
        <motion.span
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="w-2 h-2 bg-primary rounded-full"
        />
        <motion.span
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          className="w-2 h-2 bg-primary rounded-full"
        />
        <motion.span
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          className="w-2 h-2 bg-primary rounded-full"
        />
      </div>
      <span>
        {users.length === 1
          ? `${users[0]?.name || 'Someone'} is typing...`
          : `${users.length} people are typing...`}
      </span>
    </motion.div>
  );
}
