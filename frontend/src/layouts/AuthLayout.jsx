import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCheckBadge } from 'react-icons/hi2';
import AmbientBackground from '../components/common/AmbientBackground.jsx';

const HIGHLIGHTS = [
  'AI-matched teammates for every project',
  'Kanban tasks, real-time chat, and GitHub in one place',
  'Free forever for individual developers',
];

/**
 * Two-column shell: form content on the left (children), and on the right —
 * hidden below lg — the same gradient/blob/grid backdrop used in the Hero,
 * so authentication doesn't feel like a different product.
 */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2 dark:bg-slate-950">
      {/* Form column */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <Link to="/" className="mb-10 flex items-center gap-2 font-display text-lg font-bold text-text dark:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm text-white shadow-card">
            DC
          </span>
          DevConnect
          <span className="text-primary">AI</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold text-text sm:text-3xl dark:text-white">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-text/55 dark:text-slate-400">{subtitle}</p>}

          <div className="mt-8">{children}</div>
        </motion.div>
      </div>

      {/* Ambient decorative column — same visual language as the Hero */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary lg:flex lg:flex-col lg:justify-center lg:px-16">
        <AmbientBackground variant="dark" />
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative max-w-md"
        >
          <p className="font-display text-3xl font-bold leading-tight text-white">
            Build Amazing Projects Together.
          </p>
          <p className="mt-4 text-white/75">
            Find teammates. Build projects. Collaborate with AI.
          </p>

          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-white/85">
                <HiCheckBadge className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex -space-x-2.5" aria-hidden="true">
            {['SR', 'DK', 'AO', 'JL'].map((initials) => (
              <span
                key={initials}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-xs font-semibold text-white backdrop-blur-glass"
              >
                {initials}
              </span>
            ))}
            <span className="ml-3 self-center text-xs font-medium text-white/70">
              Joined by 18,000+ developers
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
