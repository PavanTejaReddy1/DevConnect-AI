import { Link } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-card">
        <span className="font-display text-3xl font-bold text-white">404</span>
      </div>

      <h1 className="text-3xl font-bold text-text sm:text-4xl">Page not found</h1>
      <p className="mt-4 max-w-md text-base text-text/55">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white shadow-card transition-opacity hover:opacity-90"
        >
          <FiHome className="h-4 w-4" aria-hidden="true" />
          Go Home
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-sm font-medium text-text transition-colors hover:border-primary/40 hover:text-primary"
        >
          <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
          Go Back
        </button>
      </div>
    </div>
  );
}
