import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export default function Drawer({ isOpen, onClose, title, children, side = 'right' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sideClasses = {
    right: 'right-0 top-0 h-full w-full max-w-md',
    left: 'left-0 top-0 h-full w-full max-w-md',
  };

  const slideFrom = side === 'right' ? { x: '100%' } : { x: '-100%' };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={slideFrom}
            animate={{ x: 0 }}
            exit={slideFrom}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`glass-panel fixed z-50 flex flex-col shadow-glow ${sideClasses[side]}`}
          >
            {title && (
              <div className="flex items-center justify-between border-b border-border/50 p-5">
                <h2 className="text-lg font-semibold text-text">{title}</h2>
                <button onClick={onClose} className="btn-ghost p-2" aria-label="Close">
                  <FiX size={20} />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
