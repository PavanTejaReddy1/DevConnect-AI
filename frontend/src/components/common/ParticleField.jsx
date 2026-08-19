const PARTICLE_COUNT = 14;

// Deterministic pseudo-random layout so particles don't reshuffle on re-render.
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const seed = i * 137.5; // golden-angle spread for a natural, non-grid distribution
  return {
    id: i,
    top: `${(seed % 100).toFixed(1)}%`,
    left: `${((seed * 1.7) % 100).toFixed(1)}%`,
    size: 2 + (i % 3),
    duration: 5 + (i % 5),
    delay: (i % 7) * 0.4,
  };
});

/**
 * Subtle floating particles for the hero's ambient layer. CSS-only animation,
 * hidden from assistive tech, and skipped entirely under reduced motion via
 * the motion-safe: variant.
 */
export default function ParticleField() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-primary/30 motion-safe:animate-[particleFloat_ease-in-out_infinite]"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
