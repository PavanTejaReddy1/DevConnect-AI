import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowRight, FiGithub } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Container from '../common/Container.jsx';
import Reveal from '../common/Reveal.jsx';
import AmbientBackground from '../common/AmbientBackground.jsx';

export default function CTASection() {
  const prefersReducedMotion = useReducedMotion();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <section className="py-24 sm:py-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-primary px-8 py-16 text-center sm:px-16 sm:py-20">
            <AmbientBackground variant="dark" />

            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Start Building Today</h2>
              <p className="mx-auto mt-4 max-w-lg text-base text-white/80">
                Create your profile, find your team, and ship your next project with DevConnect AI.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <motion.a
                  href={isAuthenticated ? "/dashboard" : "/signup"}
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-medium text-primary shadow-card sm:w-auto"
                >
                  Get Started
                  <FiArrowRight className="h-4 w-4" aria-hidden="true" />
                </motion.a>
                <motion.a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
                >
                  <FiGithub className="h-4 w-4" aria-hidden="true" />
                  Star on GitHub
                </motion.a>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
