import { FiLoader } from 'react-icons/fi';

export default function LoadingSpinner({ size = 'md' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return <FiLoader className={`animate-spin ${sizes[size]}`} />;
}
