import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowRight, FiCompass, FiGithub, FiCheckCircle, FiStar } from 'react-icons/fi';
import { HiCheckBadge } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Container from '../common/Container.jsx';
import AmbientBackground from '../common/AmbientBackground.jsx';
import ParticleField from '../common/ParticleField.jsx';
import useMouseParallax from '../../hooks/useMouseParallax.js';

const FLOATING_CARDS = [
  { id: 'dev-1', name: 'Priya N.', role: 'Frontend', tone: 'from-primary to-accent', top: '6%', left: '2%', delay: 0, depth: 18 },
  { id: 'dev-2', name: 'Marcus T.', role: 'Backend', tone: 'from-accent to-primary', top: '54%', left: '-4%', delay: 0.6, depth: 28 },
  { id: 'dev-3', name: 'Amara O.', role: 'AI/ML', tone: 'from-secondary to-primary', top: '30%', left: '58%', delay: 1.1, depth: 12 },
];

// Avatar initials shown in the "trust" strip beneath the CTAs.
const TRUST_AVATARS = [
  { initials: 'SR', tone: 'from-primary to-accent' },
  { initials: 'DK', tone: 'from-secondary to-primary' },
  { initials: 'AO', tone: 'from-accent to-secondary' },
  { initials: 'JL', tone: 'from-primary to-secondary' },
];

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const { ref: parallaxRef, x, y } = useMouseParallax();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <section id="home" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
      <AmbientBackground />
      <ParticleField />

      <Container className="grid items-center gap-16 pb-20 lg:grid-cols-2 lg:gap-12 lg:pb-32">
        {/* Left: copy */}
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-1.5 text-xs font-semibold text-text/70 shadow-card backdrop-blur-glass"
          >
            <HiCheckBadge className="h-4 w-4 text-primary" aria-hidden="true" />
            Now matching teams with AI
          </motion.div>

          <motion.h1
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-4xl font-bold leading-[1.1] text-text sm:text-5xl lg:text-6xl"
          >
            Build Amazing
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-[length:200%_auto] bg-clip-text text-transparent motion-safe:animate-[drift_8s_linear_infinite]">
              Projects Together.
            </span>
          </motion.h1>

          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-6 text-lg leading-relaxed text-text/60"
          >
            Find teammates. Build projects. Collaborate with AI.
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
          >
            <motion.div
              whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
              className="w-full sm:w-auto"
            >
              <Link
                to={isAuthenticated ? "/dashboard" : "/signup"}
                className="btn-primary group relative flex w-full items-center justify-center gap-2 overflow-hidden px-6 py-3 text-base sm:w-auto"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
                {/* Sheen sweep on hover */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden="true" />
              </Link>
            </motion.div>
            {isAuthenticated ? (
              <motion.div
                whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/dashboard/projects"
                  className="btn-secondary flex w-full items-center justify-center gap-2 px-6 py-3 text-base sm:w-auto"
                >
                  <FiCompass className="h-4 w-4" aria-hidden="true" />
                  Explore Projects
                </Link>
              </motion.div>
            ) : (
              <motion.a
                href="#showcase"
                whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                className="btn-secondary w-full gap-2 px-6 py-3 text-base sm:w-auto"
              >
                <FiCompass className="h-4 w-4" aria-hidden="true" />
                Explore Projects
              </motion.a>
            )}
          </motion.div>

          {/* Trust + GitHub + no-credit-card badges */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap lg:justify-start"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5" aria-hidden="true">
                {TRUST_AVATARS.map((a) => (
                  <span
                    key={a.initials}
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br ${a.tone} text-[10px] font-semibold text-white`}
                  >
                    {a.initials}
                  </span>
                ))}
              </div>
              <span className="text-xs font-medium text-text/50">Joined by 18,000+ developers</span>
            </div>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-semibold text-text/70 backdrop-blur-glass transition-colors hover:border-primary/40 hover:text-primary"
            >
              <FiGithub className="h-3.5 w-3.5" aria-hidden="true" />
              <FiStar className="h-3 w-3 fill-warning text-warning" aria-hidden="true" />
              4.2k stars
            </a>

            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text/45">
              <FiCheckCircle className="h-3.5 w-3.5 text-success" aria-hidden="true" />
              No credit card required
            </span>
          </motion.div>
        </div>

        {/* Right: signature illustration — a live "team match" in progress, with mouse parallax */}
        <div
          ref={parallaxRef}
          className="relative mx-auto h-[420px] w-full max-w-md lg:h-[480px] lg:max-w-none"
          aria-hidden="true"
        >
          {/* Central "project" card */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={
              prefersReducedMotion
                ? undefined
                : { transform: `translate(calc(-50% + ${x * 8}px), calc(-50% + ${y * 8}px))` }
            }
            className="glass-card absolute left-1/2 top-1/2 w-64 -translate-x-1/2 -translate-y-1/2 p-5 transition-transform duration-200 ease-out"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                Open
              </span>
              <span className="text-[11px] text-text/40">3 spots left</span>
            </div>
            <p className="font-display text-sm font-semibold text-text">AI Recipe Planner</p>
            <p className="mt-1 text-xs text-text/50">React · Node.js · Gemini API</p>
            <div className="mt-4 flex -space-x-2">
              {['bg-primary', 'bg-accent', 'bg-secondary'].map((c, i) => (
                <span key={i} className={`h-7 w-7 rounded-full border-2 border-white ${c}`} />
              ))}
            </div>
          </motion.div>

          {/* Connecting lines from developer cards to the central project card */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 480" fill="none">
            <line x1="60" y1="90" x2="200" y2="230" stroke="#2563EB" strokeOpacity="0.25" strokeDasharray="4 5" />
            <line x1="60" y1="300" x2="200" y2="250" stroke="#38BDF8" strokeOpacity="0.3" strokeDasharray="4 5" />
            <line x1="320" y1="180" x2="220" y2="230" stroke="#1E40AF" strokeOpacity="0.25" strokeDasharray="4 5" />
          </svg>

          {FLOATING_CARDS.map((card) => (
            <motion.div
              key={card.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: [0, -10, 0] }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0.5, delay: card.delay }
                  : { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: card.delay }
              }
              style={
                prefersReducedMotion
                  ? { top: card.top, left: card.left }
                  : {
                      top: card.top,
                      left: card.left,
                      transform: `translate(${x * card.depth}px, ${y * card.depth}px)`,
                    }
              }
              className="glass-card absolute w-40 p-3 transition-transform duration-300 ease-out"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${card.tone} text-[11px] font-semibold text-white`}
                >
                  {card.name.split(' ').map((n) => n[0]).join('')}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-text">{card.name}</p>
                  <p className="truncate text-[11px] text-text/50">{card.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
