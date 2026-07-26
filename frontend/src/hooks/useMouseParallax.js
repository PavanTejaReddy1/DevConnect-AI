import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Tracks pointer position relative to the given element, normalized to -1..1
 * on both axes. Used to drive subtle parallax on hero visuals.
 * Returns { ref, x, y } — attach `ref` to the container to track within.
 * Disabled entirely when the user prefers reduced motion, or on touch-only
 * devices (no fine pointer), returning a static { x: 0, y: 0 }.
 */
export default function useMouseParallax() {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return undefined;

    const node = ref.current;
    if (!node) return undefined;

    let frame = null;

    const handleMove = (event) => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        setPos({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
      });
    };

    const handleLeave = () => setPos({ x: 0, y: 0 });

    node.addEventListener('mousemove', handleMove);
    node.addEventListener('mouseleave', handleLeave);
    return () => {
      node.removeEventListener('mousemove', handleMove);
      node.removeEventListener('mouseleave', handleLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  return { ref, x: pos.x, y: pos.y };
}
