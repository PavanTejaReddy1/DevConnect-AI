import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';

export default function Button({ children, isLoading, variant = 'primary', type = 'button', ...props }) {
  const baseStyles = 'w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-lg hover:shadow-xl',
    secondary: 'bg-secondary text-white hover:bg-primary-dark shadow-lg hover:shadow-xl',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  };

  return (
    <motion.button
      type={type}
      disabled={isLoading}
      className={`${baseStyles} ${variants[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
      whileHover={{ scale: isLoading ? 1 : 1.02 }}
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
      {...props}
    >
      {isLoading ? <FiLoader className="animate-spin" size={20} /> : children}
    </motion.button>
  );
}
