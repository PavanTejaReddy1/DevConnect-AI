import { Link } from 'react-router-dom';
import { FiRefreshCw, FiHome } from 'react-icons/fi';

export default function ServerError() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-danger mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-text mb-2">Server Error</h2>
        <p className="text-text/60 mb-8 max-w-md mx-auto">
          Something went wrong on our end. Please try again later.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition-colors"
          >
            <FiRefreshCw size={18} />
            Retry
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 border border-border text-text rounded-xl hover:bg-gray-100 transition-colors"
          >
            <FiHome size={18} />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
