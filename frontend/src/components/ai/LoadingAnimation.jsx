import { motion } from 'framer-motion';

export default function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center gap-2 py-8">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -12, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          className="w-3 h-3 bg-primary rounded-full"
        />
      ))}
    </div>
  );
}
