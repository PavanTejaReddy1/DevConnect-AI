import { useState, useEffect } from 'react';
import { FiWifiOff, FiRefreshCw } from 'react-icons/fi';

export default function NetworkError({ onRetry }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiWifiOff size={32} className="text-danger" />
        </div>
        <h2 className="text-xl font-semibold text-text mb-2">No Internet Connection</h2>
        <p className="text-text/60 mb-6">
          Please check your internet connection and try again.
        </p>
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition-colors"
        >
          <FiRefreshCw size={18} />
          Retry
        </button>
      </div>
    </div>
  );
}
