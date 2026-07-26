import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import useActiveSection from '../../hooks/useActiveSection.js';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV_LINKS = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'Features', href: '#features', id: 'features' },
  { label: 'Projects', href: '#showcase', id: 'showcase' },
  { label: 'Pricing', href: '#pricing', id: 'pricing' },
  { label: 'FAQ', href: '#faq', id: 'faq' },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.id);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-border/80 bg-white/80 shadow-card backdrop-blur-xl backdrop-saturate-150'
          : 'border-b border-transparent bg-white/0'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8" aria-label="Primary">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-text">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm text-white shadow-card">
            DC
          </span>
          DevConnect
          <span className="text-primary">AI</span>
        </Link>

        {/* Desktop links with a sliding active-section indicator */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;
            return (
              <li key={link.href} className="relative">
                <a
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-text/70 hover:text-primary'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-indicator"
                      className="absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <NavLink to="/dashboard" className="btn-primary text-sm">
                Dashboard
              </NavLink>
            </motion.div>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm font-medium text-text/80 transition-colors hover:text-primary"
              >
                Login
              </NavLink>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <NavLink to="/signup" className="btn-primary text-sm">
                  Get Started
                </NavLink>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-text transition-colors hover:bg-text/5 md:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mobileOpen ? 'close' : 'open'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex"
            >
              {mobileOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden border-t border-border bg-white/95 backdrop-blur-xl md:hidden"
          >
            <motion.ul
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
                closed: {},
              }}
              className="flex flex-col gap-1 px-6 py-4"
            >
              {NAV_LINKS.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -12 },
                  }}
                >
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                      activeId === link.id ? 'bg-primary/5 text-primary' : 'text-text/80 hover:bg-primary/5 hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -12 } }}
                className="mt-2 flex gap-3 px-3"
              >
                {user ? (
                  <NavLink
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary flex-1 text-sm"
                  >
                    Dashboard
                  </NavLink>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="btn-secondary flex-1 text-sm"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="btn-primary flex-1 text-sm"
                    >
                      Get Started
                    </NavLink>
                  </>
                )}
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
