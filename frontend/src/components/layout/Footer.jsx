import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGithub, FiTwitter, FiLinkedin, FiArrowRight, FiCheck } from 'react-icons/fi';
import Container from '../common/Container.jsx';

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Projects', href: '#showcase' },
    { label: 'FAQ', href: '#faq' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'Guides', href: '#' },
    { label: 'API Reference', href: '#' },
  ],
};

const SOCIALS = [
  { icon: FiGithub, href: 'https://github.com', label: 'GitHub' },
  { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
];

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // UI-only for now — wire up to a real subscribe endpoint when the
  // backend's newsletter/notifications module is built.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/5 px-4 py-3 text-sm font-medium text-success">
        <FiCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
        You're on the list — welcome aboard.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <label htmlFor="footer-newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="footer-newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-64"
      />
      <button type="submit" className="btn-primary shrink-0 gap-1.5 text-sm">
        Subscribe
        <FiArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white/60">
      {/* Newsletter strip */}
      <div className="border-b border-border">
        <Container className="flex flex-col items-center justify-between gap-6 py-10 lg:flex-row">
          <div className="text-center lg:text-left">
            <h3 className="font-display text-lg font-semibold text-text">Get product updates</h3>
            <p className="mt-1 text-sm text-text/55">
              New features and release notes, roughly twice a month. No spam.
            </p>
          </div>
          <NewsletterForm />
        </Container>
      </div>

      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-text">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm text-white">
                DC
              </span>
              DevConnect
              <span className="text-primary">AI</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text/55">
              The platform where developers find teammates, manage projects, and ship faster with AI.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text/50 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                >
                  <social.icon className="h-4 w-4" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-text">{heading}</h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-text/55 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-text/40">
            &copy; {new Date().getFullYear()} DevConnect AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-text/40">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
