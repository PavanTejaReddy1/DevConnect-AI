import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin gradient bar pinned to the top of the viewport that fills as the user
 * scrolls through the page. Uses Framer Motion's scroll progress + a spring
 * for a smooth (not jittery) fill.
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-primary via-secondary to-accent"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
