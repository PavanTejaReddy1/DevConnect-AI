import { FiLoader } from 'react-icons/fi';

export default function LoadingSpinner({ size = 20, className = '' }) {
  return (
    <FiLoader
      size={size}
      className={`animate-spin text-primary ${className}`}
      aria-label="Loading"
    />
  );
}
